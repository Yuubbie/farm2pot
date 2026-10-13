"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  X,
  MessageCircle,
  ArrowRight,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { menu as staticMenu, MenuCategory, MenuItem } from "../data/menu";
import { getMenu } from "../lib/getMenu";
import { getPricing } from "../lib/pricing";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
}

interface Line {
  id: string; // same id scheme as the dish modal, so cart lines merge
  name: string;
  price: number;
  qty: number;
}

interface Pick {
  cat: MenuCategory;
  item: MenuItem;
}

interface Option {
  id: string;
  name: string;
  label: string; // "" for a plain per-plate item
  price: number;
}

type Step =
  | "idle"
  | "pick_item"
  | "pick_option"
  | "offer_add"
  | "fulfil"
  | "address"
  | "name"
  | "phone"
  | "confirm";

interface Pending {
  qty: number;
  hint?: string;
  candidates?: Pick[];
  pick?: Pick;
  options?: Option[];
}

interface Session {
  step: Step;
  basket: Line[];
  pending?: Pending;
  queue: string[]; // order segments still to process
  carry: string[]; // "Added ..." lines waiting to be spoken
  ordering: boolean;
  fulfilment?: "pickup" | "delivery";
  address?: string;
  name?: string;
  phone?: string;
  editing?: boolean; // true when changing one detail from the confirm step
}

/* ------------------------------------------------------------------ */
/*  Business facts (all taken from the site's own pages)               */
/* ------------------------------------------------------------------ */

const ADDRESS = "Kit Court Street, Harris Drive, Ajah, Lagos";
const ORDER_LINES = "0816 247 0726 or 0817 655 4823";
const PRIMARY_LINE = "0816 247 0726";
const COMPLAINT_LINE = "0818 630 4735";
const MAX_QTY = 20;

const PREFILL_KEY = "farm2pot_voice_prefill";

/* ------------------------------------------------------------------ */
/*  Text helpers                                                       */
/* ------------------------------------------------------------------ */

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, twenty: 20,
};

const DIGIT_WORDS: Record<string, string> = {
  zero: "0", oh: "0", o: "0", one: "1", two: "2", three: "3", four: "4",
  five: "5", six: "6", seven: "7", eight: "8", nine: "9",
};

const STOP = new Set([
  "i", "want", "wants", "would", "like", "to", "order", "add", "get", "me",
  "please", "pls", "abeg", "a", "an", "the", "some", "of", "with", "plate",
  "portion", "give", "can", "could", "you", "have", "my", "for", "need",
  "wan", "na", "let", "lets", "also", "too", "another", "more", "do", "does",
  "what", "whats", "which", "is", "are", "there", "any", "and", "or", "in",
  "on", "your", "show", "tell", "about", "how", "much", "price", "cost",
  "hear", "menu", "list", "available", "buy", "take", "ill", "id", "it",
  "that", "this", "just", "only", "we", "us", "sell", "got", "serve", "want",
  "im", "ive", "pcs", "pc", "piece", "pieces", "pack", "packs", "bottle", "bottles", "cup", "cups",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/₦/g, " ")
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(t: string): string {
  return t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t;
}

function tokens(s: string): string[] {
  return normalize(s).split(" ").filter(Boolean).map(stem);
}

function editDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function tokenMatch(q: string, t: string): number {
  if (q === t) return 1;
  if (q.length >= 4 && t.length >= 4 && (t.startsWith(q) || q.startsWith(t))) return 0.85;
  if (q.length >= 5) {
    const d = editDistance(q, t);
    if (d <= 1) return 0.8;
    if (q.length >= 8 && d <= 2) return 0.7;
  }
  return 0;
}

// Make text safe and natural for the speech engine.
function speakable(text: string): string {
  return text
    .replace(/₦\s?([\d,]+)/g, "$1 naira")
    .replace(/[•·→]/g, ", ")
    .replace(/\(([^)]*)\)/g, ", $1,")
    .replace(/\s+/g, " ")
    .trim();
}

const yes = (s: string) =>
  /\b(yes|yeah|yep|yup|sure|ok|okay|correct|confirm|confirmed|go ahead|proceed|right|please do|do it|add it|true)\b/.test(normalize(s));
const no = (s: string) =>
  /\b(no|nope|nah|cancel|stop|dont|wrong|change)\b/.test(normalize(s));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VoiceAssistant() {
  const { addItem, items: cartItems } = useCart();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const [menuData, setMenuData] = useState<MenuCategory[]>(staticMenu);
  const [, setTick] = useState(0);

  const S = useRef<Session>({ step: "idle", basket: [], queue: [], carry: [], ordering: false });
  const menuRef = useRef<MenuCategory[]>(staticMenu);
  const cartCountRef = useRef(0);
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const voiceModeRef = useRef(false);
  const mutedRef = useRef(false);
  const openRef = useRef(false);
  const msgId = useRef(0);
  const speakId = useRef(0);
  const retriedLang = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<(t: string) => void>(() => {});

  const bump = () => setTick((t) => t + 1);

  cartCountRef.current = cartItems.reduce((n, i) => n + i.quantity, 0);
  mutedRef.current = muted;
  openRef.current = isOpen;
  menuRef.current = menuData;

  /* ---------- setup ---------- */

  useEffect(() => {
    const w = window as any;
    setMicSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    // Use the live menu (Supabase) so names and prices match the website.
    getMenu()
      .then((m) => m && m.length && setMenuData(m))
      .catch(() => {});
    return () => {
      try { recognitionRef.current?.abort(); } catch {}
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chips]);

  /* ---------- speech out / in ---------- */

  const startListening = useCallback(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR || listeningRef.current) return;

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    const rec = new SR();
    rec.lang = retriedLang.current ? "en-US" : "en-NG";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      listeningRef.current = true;
      setIsListening(true);
    };
    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) {
        voiceModeRef.current = true;
        handleRef.current(t);
      }
    };
    rec.onerror = (e: any) => {
      listeningRef.current = false;
      setIsListening(false);
      if (e.error === "language-not-supported" && !retriedLang.current) {
        retriedLang.current = true;
        setTimeout(startListening, 100);
        return;
      }
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        voiceModeRef.current = false;
        pushMessage("assistant", "I can't use the microphone. Please allow mic access in your browser, or type your answer instead.");
      } else if (e.error === "no-speech") {
        voiceModeRef.current = false;
        pushMessage("assistant", "I didn't hear anything. Tap the mic to try again, or type your answer.");
      }
    };
    rec.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      listeningRef.current = false;
      setIsListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopListening = useCallback(() => {
    voiceModeRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    listeningRef.current = false;
    setIsListening(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const pushMessage = (sender: "user" | "assistant", text: string) => {
    msgId.current += 1;
    const id = msgId.current;
    setMessages((prev) => [...prev, { id, text, sender }]);
  };

  const speak = (text: string, then?: () => void) => {
    if (mutedRef.current || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++speakId.current;
    const u = new SpeechSynthesisUtterance(speakable(text));
    u.lang = "en-NG";
    u.rate = 0.95;
    const voices = synth.getVoices();
    const v =
      voices.find((x) => x.lang === "en-NG") ||
      voices.find((x) => x.lang === "en-GB") ||
      voices.find((x) => x.lang.startsWith("en"));
    if (v) u.voice = v;
    u.onend = () => {
      if (id === speakId.current && then) then();
    };
    synth.speak(u);
  };

  // Assistant reply: show it, speak it, set quick-reply chips, and (if the
  // customer is talking to us) start listening again for their answer.
  const reply = (text: string, quick: string[] = [], listenAfter = true) => {
    pushMessage("assistant", text);
    setChips(quick);
    const expectsAnswer = S.current.step !== "idle" || S.current.ordering;
    speak(
      text,
      listenAfter && voiceModeRef.current && expectsAnswer && openRef.current
        ? () => setTimeout(() => !listeningRef.current && startListening(), 250)
        : undefined
    );
    bump();
  };

  /* ---------- menu search ---------- */

  const allPicks = (): Pick[] => {
    const out: Pick[] = [];
    for (const cat of menuRef.current) for (const item of cat.items) out.push({ cat, item });
    return out;
  };

  const scorePick = (qTokens: string[], p: Pick): number => {
    const itemTokens = tokens(p.item.name);
    const catTokens = tokens(p.cat.name);
    if (qTokens.join(" ") === itemTokens.join(" ")) return 2;
    let sum = 0;
    for (const q of qTokens) {
      let best = 0;
      for (const t of itemTokens) best = Math.max(best, tokenMatch(q, t));
      if (best === 0) {
        for (const t of catTokens) best = Math.max(best, tokenMatch(q, t) * 0.6);
      }
      if (best === 0) return 0; // every word the customer said must match something
      sum += best;
    }
    const coverage = sum / qTokens.length;
    const matchedItemTokens = itemTokens.filter((t) =>
      qTokens.some((q) => tokenMatch(q, t) >= 0.7)
    ).length;
    return 0.65 * coverage + 0.35 * (matchedItemTokens / itemTokens.length);
  };

  const findCandidates = (text: string, pool?: Pick[]): { pick: Pick; score: number }[] => {
    const qTokens = tokens(text).filter((t) => !STOP.has(t));
    if (!qTokens.length) return [];
    return (pool ?? allPicks())
      .map((pick) => ({ pick, score: scorePick(qTokens, pick) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  // Decide between "clearly this one" and "which one did you mean?"
  const chooseFrom = (cands: { pick: Pick; score: number }[]): { chosen?: Pick; ambiguous?: Pick[] } => {
    if (!cands.length) return {};
    const [top, second] = cands;
    if (top.score >= 2 || !second || (top.score >= 0.8 && top.score - second.score >= 0.2)) {
      return { chosen: top.pick };
    }
    const near = cands.filter((c) => c.score >= top.score - 0.35).slice(0, 5);
    return near.length === 1 ? { chosen: near[0].pick } : { ambiguous: near.map((c) => c.pick) };
  };

  const optionsFor = (p: Pick): Option[] => {
    const pr = getPricing(p.item, p.cat);
    const base = `${p.cat.id}-${p.item.name}`;
    switch (pr.type) {
      case "single":
        return [{ id: base, name: p.item.name, label: "", price: pr.price }];
      case "bigsmall":
        return [
          { id: `${base}-big`, name: `${p.item.name} (Big)`, label: "Big", price: pr.big },
          { id: `${base}-small`, name: `${p.item.name} (Small)`, label: "Small", price: pr.small },
        ];
      case "tiers":
        return pr.tiers.map((t) => ({
          id: `${base}-${t.label}`,
          name: `${p.item.name} (${t.label})`,
          label: t.label,
          price: t.price,
        }));
      case "single_plus_tiers":
        return [
          { id: base, name: p.item.name, label: "Per plate", price: pr.single },
          ...pr.tiers.map((t) => ({
            id: `${base}-${t.label}`,
            name: `${p.item.name} (${t.label})`,
            label: t.label,
            price: t.price,
          })),
        ];
      default:
        return [];
    }
  };

  /* ---------- text parsing ---------- */

  const extractHint = (t: string): { text: string; hint?: string } => {
    const lit = t.match(/\b(\d+|one|two|three|four|five)\s*(l|litre|litres|liter|liters)\b/);
    if (lit) {
      const n = /^\d+$/.test(lit[1]) ? lit[1] : String(NUM_WORDS[lit[1]]);
      return { text: t.replace(lit[0], " "), hint: `${n}L` };
    }
    for (const [re, h] of [
      [/\bbulk\b/, "bulk"],
      [/\bbig\b/, "big"],
      [/\bsmall\b/, "small"],
      [/\b(regular|single|per plate)\b/, "plate"],
    ] as [RegExp, string][]) {
      if (re.test(t)) return { text: t.replace(re, " "), hint: h };
    }
    return { text: t };
  };

  const extractQty = (t: string): { text: string; qty: number } => {
    const d = t.match(/\b(\d{1,4})\b/);
    if (d) return { text: t.replace(d[0], " "), qty: parseInt(d[1], 10) };
    const w = t.match(new RegExp(`\\b(${Object.keys(NUM_WORDS).join("|")})\\b`));
    if (w) return { text: t.replace(w[0], " "), qty: NUM_WORDS[w[1]] };
    return { text: t, qty: 1 };
  };

  // Different ways to read a number in a phrase, most likely first:
  // "two 33 export" -> 2 x "33 export", "5 pepper soup" -> 5 x "pepper soup",
  // and finally "33 export" -> 1 x "33 export" (the number is part of the name).
  const qtyReadings = (t: string): { text: string; qty: number }[] => {
    const out: { text: string; qty: number }[] = [];
    const words = Object.keys(NUM_WORDS).join("|");
    const lead = t.match(new RegExp(`^(\\d{1,4}|${words})\\b\\s*(?:x\\s*)?(.*)$`));
    if (lead) {
      const q = /^\d+$/.test(lead[1]) ? parseInt(lead[1], 10) : NUM_WORDS[lead[1]];
      out.push({ text: lead[2], qty: q });
    }
    const any = extractQty(t);
    if (any.qty !== 1 && !out.some((o) => o.text === any.text)) out.push(any);
    out.push({ text: t, qty: 1 });
    return out;
  };

  // Split "two jollof rice and a chicken" into separate order segments,
  // without breaking dish names that contain "and" (e.g. "Akara and Pap").
  const splitSegments = (raw: string): string[] => {
    let t = normalize(raw);
    for (const p of allPicks()) {
      const n = normalize(p.item.name);
      if (n.includes(" and ") && t.includes(n)) t = t.split(n).join(n.replace(/ and /g, " _and_ "));
    }
    return t
      .split(/\band\b|,|\bplus\b|\bthen\b/)
      .map((s) => s.replace(/_and_/g, "and").trim())
      .filter(Boolean);
  };

  // Only treat a reply as "option number N" when that is the WHOLE reply
  // ("2", "second", "number two"), never when a digit appears inside a longer
  // sentence like an address.
  const asIndex = (text: string): number | undefined => {
    const m = normalize(text).match(/^(?:the |number |option |no )?(1|one|first|2|two|second|3|three|third|4|four|fourth|5|five|fifth)$/);
    if (!m) return undefined;
    const map: Record<string, number> = { 1: 0, one: 0, first: 0, 2: 1, two: 1, second: 1, 3: 2, three: 2, third: 2, 4: 3, four: 3, fourth: 3, 5: 4, five: 4, fifth: 4 };
    return map[m[1]];
  };

  const matchOption = (text: string, options: Option[]): Option | undefined => {
    const { hint } = extractHint(normalize(text));
    if (hint) {
      const found = options.find((o) => {
        const l = o.label.toLowerCase();
        if (hint === "plate") return l === "regular" || l === "per plate";
        return l === hint.toLowerCase() || l.includes(hint.toLowerCase());
      });
      if (found) return found;
    }
    const qT = tokens(text).filter((t) => !STOP.has(t));
    if (qT.length) {
      const found = options.find((o) => {
        const lt = tokens(o.label);
        return lt.length > 0 && lt.every((t) => qT.includes(t));
      });
      if (found) return found;
    }
    const idx = asIndex(text);
    return idx !== undefined ? options[idx] : undefined;
  };

  /* ---------- basket ---------- */

  const basketTotal = () => S.current.basket.reduce((s, l) => s + l.price * l.qty, 0);
  const basketCount = () => S.current.basket.reduce((s, l) => s + l.qty, 0);

  const addLine = (o: Option, qty: number): string => {
    const b = S.current.basket;
    const ex = b.find((l) => l.id === o.id);
    if (ex) ex.qty += qty;
    else b.push({ id: o.id, name: o.name, price: o.price, qty });
    S.current.ordering = true;
    return `Added ${qty} x ${o.name} at ${fmt(o.price)} each.`;
  };

  const basketSummary = () =>
    S.current.basket.map((l) => `${l.qty} x ${l.name} (${fmt(l.price * l.qty)})`).join(", ");

  const priceLine = (p: Pick): string => {
    const opts = optionsFor(p);
    if (!opts.length) return `${p.item.name} doesn't have a fixed price yet. Please message us on WhatsApp on ${PRIMARY_LINE} to confirm.`;
    return `${p.item.name}: ${opts.map((o) => `${o.label ? o.label + " " : ""}${fmt(o.price)}`).join(", ")}.`;
  };

  /* ---------- order building ---------- */

  // Add one picked dish (asking about size only when it really matters).
  // Returns text to say, or null if a question was asked instead.
  const beginPick = (pick: Pick, qty: number, hint?: string): { text?: string; ask?: { text: string; chips: string[] } } => {
    if (qty > MAX_QTY) {
      return { text: `For ${qty} portions of ${pick.item.name}, please message us on WhatsApp on ${PRIMARY_LINE} so the kitchen can plan it properly.` };
    }
    const opts = optionsFor(pick);
    if (!opts.length) {
      return { text: `${pick.item.name} doesn't have a fixed price yet, so I can't add it. Please message us on WhatsApp on ${PRIMARY_LINE} to confirm the price.` };
    }
    if (opts.length === 1) return { text: addLine(opts[0], qty) };

    if (hint) {
      const m = matchOption(hint === "plate" ? "regular" : hint, opts);
      if (m) return { text: addLine(m, qty) };
    }
    const dflt = opts.find((o) => /^(regular|per plate)$/i.test(o.label));
    if (dflt && !hint) {
      return { text: addLine(dflt, qty) };
    }
    S.current.pending = { qty, hint, pick, options: opts };
    S.current.step = "pick_option";
    return {
      ask: {
        text: `Which one for ${pick.item.name}? ${opts.map((o) => `${o.label || "Per plate"} at ${fmt(o.price)}`).join(", ")}.`,
        chips: opts.map((o) => o.label || "Per plate"),
      },
    };
  };

  const finishRun = (notFound: string[]) => {
    const s = S.current;
    s.step = "idle";
    s.pending = undefined;
    const carry = s.carry;
    s.carry = [];
    s.queue = [];
    const parts: string[] = [];
    if (carry.length) parts.push(carry.join(" "));
    if (notFound.length) {
      parts.push(`I couldn't find "${notFound.join('", "')}" on the menu.`);
    }
    if (basketCount() > 0 && carry.length) {
      parts.push(`Your total so far is ${fmt(basketTotal())}. Anything else? Say "done" when you're ready to check out.`);
      reply(parts.join(" "), ["Done", "Show my order"]);
    } else {
      parts.push(
        s.ordering
          ? 'Try a dish name like "jollof rice" or "pepper soup", or say "menu" to hear the categories.'
          : 'Try a dish name like "jollof rice", or say "menu" to hear what we have.'
      );
      reply(parts.join(" "), basketCount() ? ["Done", "Show my order", "Menu"] : ["Menu", "Soups", "Rice", "Grills"]);
    }
  };

  const runSegments = (segs: string[]) => {
    const s = S.current;
    const notFound: string[] = [];
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      const h = extractHint(seg);
      let cands: { pick: Pick; score: number }[] = [];
      let qty = 1;
      for (const r of qtyReadings(h.text)) {
        cands = findCandidates(r.text);
        qty = r.qty;
        if (cands.length) break;
      }
      if (!cands.length) {
        notFound.push(seg);
        continue;
      }
      const { chosen, ambiguous } = chooseFrom(cands);
      if (ambiguous) {
        s.pending = { qty, hint: h.hint, candidates: ambiguous };
        s.step = "pick_item";
        s.queue = segs.slice(i + 1);
        const names = ambiguous.map((p) => p.item.name);
        reply(
          `${s.carry.length ? s.carry.join(" ") + " " : ""}Which one did you mean: ${names.join(", ")}?`,
          names
        );
        return;
      }
      const r = beginPick(chosen!, qty, h.hint);
      if (r.ask) {
        s.queue = segs.slice(i + 1);
        reply(`${s.carry.length ? s.carry.join(" ") + " " : ""}${r.ask.text}`, r.ask.chips);
        return;
      }
      if (r.text) s.carry.push(r.text);
    }
    finishRun(notFound);
  };

  /* ---------- category / FAQ answers ---------- */

  const listCategory = (cat: MenuCategory) => {
    const picks = cat.items.map((item) => ({ cat, item }));
    const lines = picks.map((p) => {
      const o = optionsFor(p);
      return o.length ? `${p.item.name} (from ${fmt(Math.min(...o.map((x) => x.price)))})` : `${p.item.name} (ask staff for price)`;
    });
    S.current.pending = { qty: 1, candidates: picks };
    S.current.step = "pick_item";
    reply(
      `Our ${cat.name}: ${lines.join(", ")}. Which would you like?`,
      cat.items.slice(0, 6).map((i) => i.name)
    );
  };

  const matchCategory = (text: string): MenuCategory | undefined => {
    const q = tokens(text).filter((t) => !STOP.has(t));
    if (!q.length) return undefined;
    const cats = menuRef.current;
    const exact = cats.find((c) => {
      const ct = tokens(c.name);
      return ct.length === q.length && ct.every((t) => q.includes(t));
    });
    if (exact) return exact;
    return cats.find((c) => {
      const ct = tokens(c.name);
      return q.every((t) => ct.includes(t)) && ct.length <= q.length + 1 && q.length > 0 && !allSpecific(q, c);
    });
  };

  // true if the words name a specific dish, not just a category
  const allSpecific = (q: string[], c: MenuCategory) =>
    c.items.some((i) => {
      const it = tokens(i.name);
      return it.length === q.length && it.every((t) => q.includes(t));
    });

  const faq = (raw: string): string | null => {
    const t = normalize(raw);
    const has = (re: RegExp) => re.test(t);

    if (has(/\b(complain|complaint|wrong order|missing|spoil|spoilt|damaged|refund|replace|replacement)\b/))
      return `I'm sorry about that. Please message our complaints line on WhatsApp, ${COMPLAINT_LINE}, within 48 hours of delivery, with a short photo or video of the issue. We don't offer refunds, but if a meal goes bad in transit a replacement may be offered once the affected meal has been picked up and checked.`;
    if (has(/\b(allerg|allergy|allergies|allergic)\b/))
      return "Please tell us about any allergies or special requests before you place your order, by WhatsApp or when we confirm it.";
    if (has(/\b(track|status)\b|where is my (order|food)|has my order|when will (it|my)|how long|arrive|eta|late\b/))
      return `Once you send your order on WhatsApp and share your transfer proof, we confirm payment and start preparing it. Delivery goes by Bolt or InDrive and times can vary. If you're signed in, you can check your order status under My Orders, or message ${PRIMARY_LINE} on WhatsApp.`;
    if (has(/\b(freez|freezer|frozen)\b/))
      return "Frozen orders need 4 to 5 days to freeze properly, there's a ₦10,000 fee per meal for freezing and travel packaging, and we don't take urgent freezing orders. Meals are frozen only after payment is confirmed. The full details are on our ordering terms page.";
    if (has(/\b(bulk|litre|litres|liter|liters)\b/))
      return "Soups, stews, rice and similar dishes come in bulk sizes, like 2L, 3L and 5L, as well as single plates. Tell me the dish, for example 'egusi soup 3 litres', and I'll add it.";
    if (has(/\b(deliver|delivery|bolt|indrive|dispatch)\b/))
      return `Delivery is arranged through Bolt or InDrive at their standard rate, and fees vary by location. You can also pick up at ${ADDRESS}. Say "order" to get started.`;
    if (has(/\b(pickup|pick up|collect)\b/))
      return `You can pick up at ${ADDRESS}. We're open 24 hours, every day.`;
    if (has(/\b(pay|payment|paying|transfer|bank|account|moniepoint|card|cash|pos)\b/))
      return "Payment is by bank transfer: Moniepoint, account number 8246098181, account name Farm2Pot Kitchen. Orders are confirmed once payment is received, so send your proof of payment on WhatsApp.";
    if (has(/\b(address|location|located|directions|find you|where are you|where is the)\b/))
      return `We're at ${ADDRESS}.`;
    if (has(/\b(open|opening|close|closing|hours)\b|what time/))
      return "We're open 24 hours a day, 7 days a week.";
    if (has(/\b(phone|number|contact|call|whatsapp|reach)\b/))
      return `You can reach us on ${ORDER_LINES}. For complaints, use ${COMPLAINT_LINE}. We're also on WhatsApp.`;
    if (has(/\b(book|booking|reserve|reservation|table|event|events|party|cater|catering|wedding)\b/))
      return `For table bookings, events and catering, please call or WhatsApp ${PRIMARY_LINE} so the team can confirm availability and pricing.`;
    if (has(/\b(price|prices|cost|how much)\b/))
      return 'Prices are on the menu page. Ask me about a specific dish, like "how much is jollof rice?", and I\'ll tell you.';
    if (has(/\b(email|mail)\b/)) return "Our email is farmtopotfood@gmail.com.";
    if (has(/\b(instagram|tiktok|facebook|social)\b/))
      return "Find us on Instagram @Farm_2pot, TikTok @Farm2pot and Facebook Farm2pot.";
    return null;
  };

  /* ---------- checkout ---------- */

  const finalize = () => {
    const s = S.current;
    for (const l of s.basket) {
      for (let i = 0; i < l.qty; i++) addItem({ id: l.id, name: l.name, price: l.price });
    }
    try {
      localStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({
          name: s.name,
          phone: s.phone,
          deliveryType: s.fulfilment,
          address: s.address,
          ts: Date.now(),
        })
      );
    } catch {}
    const total = basketTotal();
    const extra = cartCountRef.current > 0 ? ` Your cart also had ${cartCountRef.current} item${cartCountRef.current === 1 ? "" : "s"} already.` : "";
    s.basket = [];
    s.step = "idle";
    s.pending = undefined;
    s.ordering = false;
    s.queue = [];
    s.carry = [];
    voiceModeRef.current = false;
    reply(
      `Done! I've put your order in the cart (${fmt(total)}).${extra} I'm taking you to checkout. Please check your details and tap Send Order. You'll then pay by bank transfer and send proof on WhatsApp.`,
      ["Go to checkout"],
      false
    );
    setTimeout(() => router.push("/checkout"), 2500);
  };

  const confirmText = () => {
    const s = S.current;
    return `Please check your order: ${basketSummary()}. Total ${fmt(basketTotal())}. ${
      s.fulfilment === "delivery" ? `Delivery to ${s.address}.` : "Pickup at Kit Court Street, Harris Drive, Ajah."
    } Name: ${s.name}. Phone: ${s.phone}. Shall I send this to checkout?`;
  };

  const goToConfirm = () => {
    S.current.step = "confirm";
    S.current.editing = false;
    reply(confirmText(), ["Yes, confirm", "Change address", "Change name", "Change phone", "Add more items"]);
  };

  const parsePhone = (raw: string): string | null => {
    const spoken = normalize(raw)
      .split(" ")
      .map((w) => DIGIT_WORDS[w] ?? w)
      .join("");
    let d = spoken.replace(/\D/g, "");
    if (d.startsWith("234") && d.length === 13) d = "0" + d.slice(3);
    if (d.length === 10 && /^[789]/.test(d)) d = "0" + d;
    return /^0[789]\d{9}$/.test(d) ? d : null;
  };

  const startCheckout = () => {
    const s = S.current;
    if (!s.basket.length) {
      if (cartCountRef.current > 0) {
        reply("Your order is empty here, but you have items in your cart already. Want me to take you to checkout?", ["Go to checkout", "Menu"]);
        s.step = "idle";
      } else {
        reply("Your order is empty. What would you like? You can say a dish name like 'jollof rice'.", ["Menu", "Soups", "Rice", "Grills"]);
      }
      return;
    }
    s.step = "fulfil";
    reply(
      `Your total is ${fmt(basketTotal())}. Is this for pickup or delivery?`,
      ["Pickup", "Delivery"]
    );
  };

  /* ---------- the main conversation handler ---------- */

  const handle = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    pushMessage("user", text);
    const s = S.current;
    const n = normalize(text);

    // Hard resets that work at any point
    if (/\b(start over|clear (my |the )?(order|basket|cart)|cancel (my |the )?order|empty (my |the )?(order|basket))\b/.test(n)) {
      s.basket = []; s.step = "idle"; s.pending = undefined; s.queue = []; s.carry = []; s.ordering = false;
      reply("Okay, I've cleared your order. What would you like?", ["Menu", "Soups", "Rice", "Grills"]);
      return;
    }

    // A reply that is really a NEW request (a dish, "done", "show my order",
    // a price question...) must not get stuck inside the current question.
    const isNewRequest = () =>
      /\b(done|checkout|check out|show my order|my order|my basket|my cart|menu|go to checkout|remove|delete|how much|price|cost|do you have)\b/.test(n) ||
      qtyReadings(extractHint(n).text).some((r) => findCandidates(r.text).length > 0) ||
      !!matchCategory(n);
    const dropPending = () => {
      s.pending = undefined;
      s.queue = [];
      s.step = "idle";
    };

    // If something else is happening, answer it, then go back to the question.
    const withReask = (answer: string, question: string, quick: string[]) =>
      reply(`${answer} ${question}`, quick);

    switch (s.step) {
      case "pick_item": {
        const p = s.pending!;
        if (/\b(cancel|never ?mind|forget it|skip)\b/.test(n)) {
          s.step = "idle"; s.pending = undefined; s.queue = [];
          reply("No problem. What else would you like?", ["Menu", "Done"]);
          return;
        }
        const pool = p.candidates ?? [];
        const byIndex = asIndex(text);
        let chosen: Pick | undefined = byIndex !== undefined ? pool[byIndex] : undefined;
        let qty = p.qty;
        let hint = p.hint;
        if (!chosen) {
          const h = extractHint(n);
          for (const r of qtyReadings(h.text)) {
            const c = chooseFrom(findCandidates(r.text, pool));
            if (c.chosen) {
              chosen = c.chosen;
              if (r.qty > 1) qty = r.qty;
              hint = h.hint ?? hint;
              break;
            }
          }
        }
        if (chosen) {
          s.pending = undefined;
          const r = beginPick(chosen, qty, hint);
          if (r.ask) { reply(r.ask.text, r.ask.chips); return; }
          if (r.text) s.carry.push(r.text);
          s.step = "idle";
          runSegments(s.queue);
          return;
        }
        if (isNewRequest()) { dropPending(); break; }
        const ans = faq(text);
        const names = pool.map((x) => x.item.name);
        if (ans) { withReask(ans, `Back to your order: which one would you like? ${names.slice(0, 6).join(", ")}.`, names.slice(0, 6)); return; }
        reply(`I didn't catch which one. Please say or tap one: ${names.slice(0, 6).join(", ")}. Or say "cancel".`, names.slice(0, 6));
        return;
      }

      case "pick_option": {
        const p = s.pending!;
        const opts = p.options ?? [];
        if (/\b(cancel|never ?mind|forget it|skip)\b/.test(n)) {
          s.step = "idle"; s.pending = undefined; s.queue = [];
          reply("No problem. What else would you like?", ["Menu", "Done"]);
          return;
        }
        const m = matchOption(text, opts);
        if (m) {
          s.pending = undefined;
          s.carry.push(addLine(m, p.qty));
          s.step = "idle";
          runSegments(s.queue);
          return;
        }
        if (isNewRequest()) { dropPending(); break; }
        const ans = faq(text);
        const q = `Which one for ${p.pick!.item.name}? ${opts.map((o) => `${o.label || "Per plate"} at ${fmt(o.price)}`).join(", ")}.`;
        if (ans) { withReask(ans, q, opts.map((o) => o.label || "Per plate")); return; }
        reply(`I didn't catch that. ${q}`, opts.map((o) => o.label || "Per plate"));
        return;
      }

      case "offer_add": {
        const p = s.pending!;
        if (yes(text) && !no(text)) {
          s.pending = undefined;
          s.step = "idle";
          const r = beginPick(p.pick!, 1);
          if (r.ask) { reply(r.ask.text, r.ask.chips); return; }
          s.carry.push(r.text ?? "");
          finishRun([]);
          return;
        }
        s.pending = undefined;
        s.step = "idle";
        if (no(text)) { reply("Okay. Anything else I can help with?", ["Menu", "Order food"]); return; }
        break; // treat as a fresh request below
      }

      case "fulfil": {
        if (/\b(deliver|delivery|bring|send|dispatch)\b/.test(n)) {
          s.fulfilment = "delivery";
          s.step = "address";
          reply("Delivery it is. It's arranged through Bolt or InDrive at their standard rate, and fees vary by location. What's your delivery address? Include the street, area and a landmark.");
          return;
        }
        if (/\b(pickup|pick up|collect|come|take away|takeaway)\b/.test(n)) {
          s.fulfilment = "pickup";
          s.address = undefined;
          if (s.editing) { goToConfirm(); return; }
          s.step = "name";
          reply(`Pickup at ${ADDRESS}. What name should I put the order under?`);
          return;
        }
        const ans = faq(text);
        if (ans) { withReask(ans, "Is this for pickup or delivery?", ["Pickup", "Delivery"]); return; }
        if (/\b(add|more|another|back)\b/.test(n)) { s.step = "idle"; reply("Sure, what else would you like to add?", ["Menu"]); return; }
        reply("Is this for pickup or delivery?", ["Pickup", "Delivery"]);
        return;
      }

      case "address": {
        const words = n.split(" ").filter(Boolean);
        if (n.length >= 8 && words.length >= 2) {
          s.address = text.replace(/^(my address is|it'?s|deliver to|address is)\s+/i, "");
          if (s.editing) { goToConfirm(); return; }
          s.step = "name";
          reply(`Got it, delivery to ${s.address}. What name should I put the order under?`);
          return;
        }
        const ans = faq(text);
        if (ans) { withReask(ans, "What's your delivery address?", []); return; }
        reply("I need a fuller address, with the street, area and a landmark. You can type it if that's easier.");
        return;
      }

      case "name": {
        const cleaned = text
          .replace(/^(my name is|my name's|i am|i'm|im|this is|it is|it's|call me|name is)\s+/i, "")
          .replace(/[^a-zA-Z\s'.-]/g, "")
          .trim();
        const looksLikeName =
          cleaned.length >= 2 &&
          cleaned.length <= 40 &&
          cleaned.split(/\s+/).length <= 4 &&
          !/\?/.test(text) &&
          !/^(yes|no|ok|okay|yeah|yep|nope|nah|cancel|skip|stop|menu|done|help|back|hello|hi)$/i.test(cleaned) &&
          !faq(text);
        if (looksLikeName) {
          s.name = cleaned.replace(/\b[a-z]/g, (c) => c.toUpperCase());
          if (s.editing) { goToConfirm(); return; }
          s.step = "phone";
          reply(`Thanks, ${s.name}. What's your phone number? We'll use it on WhatsApp for your order.`);
          return;
        }
        const ans = faq(text);
        if (ans) { withReask(ans, "What name should I put the order under?", []); return; }
        reply("Sorry, I didn't get your name. What name should I put the order under?");
        return;
      }

      case "phone": {
        const ph = parsePhone(text);
        if (ph) {
          s.phone = ph;
          goToConfirm();
          return;
        }
        const ans = faq(text);
        if (ans) { withReask(ans, "What's your phone number?", []); return; }
        reply("I couldn't read that as an 11-digit Nigerian number, like 0803 123 4567. Please say it digit by digit, or type it.");
        return;
      }

      case "confirm": {
        if (/\b(address)\b/.test(n)) {
          s.editing = true;
          s.fulfilment = "delivery";
          s.step = "address";
          reply("Okay, what's the delivery address?");
          return;
        }
        if (/\b(name)\b/.test(n)) { s.editing = true; s.step = "name"; reply("Okay, what name should I use?"); return; }
        if (/\b(phone|number)\b/.test(n)) { s.editing = true; s.step = "phone"; reply("Okay, what's the right phone number?"); return; }
        if (/\b(pickup|pick up)\b/.test(n)) { s.fulfilment = "pickup"; s.address = undefined; goToConfirm(); return; }
        if (/\b(delivery|deliver)\b/.test(n)) {
          s.editing = true; s.fulfilment = "delivery"; s.step = "address";
          reply("Okay, what's the delivery address?");
          return;
        }
        if (/\b(add|more|another|items?)\b/.test(n) && !yes(text)) {
          s.step = "idle";
          reply("Sure, what else would you like to add?", ["Menu"]);
          return;
        }
        if (yes(text) && !no(text)) { finalize(); return; }
        if (no(text)) {
          reply("Okay. What would you like to change: the address, name, phone, or the items? Or say 'start over'.", ["Change address", "Change name", "Change phone", "Add more items"]);
          return;
        }
        const ans = faq(text);
        if (ans) { withReask(ans, "Shall I send this to checkout?", ["Yes, confirm", "Change address"]); return; }
        reply("Shall I send this to checkout? Say yes to confirm, or tell me what to change.", ["Yes, confirm", "Change address", "Change name", "Change phone"]);
        return;
      }

      default:
        break;
    }

    /* ----- idle: general conversation and ordering ----- */

    if (/^(hi|hello|hey|good (morning|afternoon|evening)|howdy)\b/.test(n) && n.split(" ").length <= 4) {
      reply("Hello! Welcome to Farm2Pot And Grill. What would you like to order today?", ["Order food", "Menu", "Hours", "Location"]);
      return;
    }
    if (/\b(thanks|thank you|thank)\b/.test(n)) {
      reply("You're welcome! Anything else I can help with?", s.basket.length ? ["Done", "Show my order"] : ["Order food", "Menu"]);
      return;
    }
    if (/^(bye|goodbye|good bye|see you)\b/.test(n)) {
      voiceModeRef.current = false;
      reply("Goodbye! Thanks for choosing Farm2Pot And Grill.", [], false);
      return;
    }
    if (/\b(help|what can you do)\b/.test(n)) {
      reply("I can take your order from our menu, collect your delivery or pickup details, and answer questions about our location, hours, payment, delivery and complaints. Try 'two jollof rice and a chicken', or 'what soups do you have?'.", ["Order food", "Menu", "Payment", "Delivery"]);
      return;
    }

    // Checkout / finish
    if (/\b(done|checkout|check out|finish|finished|thats all|that is all|nothing else|no more|place (the |my )?order|proceed|im done|ready)\b/.test(n) || n === "go to checkout") {
      if (n === "go to checkout" && !s.basket.length && cartCountRef.current > 0) {
        router.push("/checkout");
        reply("Taking you to checkout.", [], false);
        return;
      }
      startCheckout();
      return;
    }

    // Read back the order
    if (/\b(show my order|my order|my basket|my cart|read back|summary|whats in)\b/.test(n) && !/\b(track|status|where)\b/.test(n)) {
      if (!s.basket.length) {
        reply(
          cartCountRef.current > 0
            ? `Your order here is empty, but your cart has ${cartCountRef.current} item${cartCountRef.current === 1 ? "" : "s"} already. Say "go to checkout" to review them.`
            : "Your order is empty. What would you like?",
          cartCountRef.current > 0 ? ["Go to checkout", "Menu"] : ["Menu", "Soups", "Rice", "Grills"]
        );
      } else {
        reply(`You have ${basketSummary()}. Total ${fmt(basketTotal())}. Anything else, or say "done" to check out.`, ["Done", "Menu"]);
      }
      return;
    }

    // Remove an item
    const rm = n.match(/^(?:please )?(?:remove|delete|take out|take off|cancel)\s+(.+)$/);
    if (rm && s.basket.length) {
      const q = tokens(rm[1]).filter((t) => !STOP.has(t));
      const idx = s.basket.findIndex((l) => q.length > 0 && q.every((t) => tokens(l.name).some((x) => tokenMatch(t, x) >= 0.7)));
      if (idx >= 0) {
        const [gone] = s.basket.splice(idx, 1);
        reply(`Removed ${gone.name}.${s.basket.length ? ` Your total is now ${fmt(basketTotal())}.` : " Your order is empty now."}`, s.basket.length ? ["Done", "Show my order"] : ["Menu"]);
      } else {
        reply(`I couldn't find that in your order. You have ${basketSummary()}.`, ["Show my order"]);
      }
      return;
    }

    // Start ordering
    if (/^(order|order food|i want to order|i would like to order|i wan order|place an order|i am hungry|im hungry|food|hungry|start|start order)$/.test(n)) {
      s.ordering = true;
      reply(
        cartCountRef.current > 0
          ? `Sure! You already have ${cartCountRef.current} item${cartCountRef.current === 1 ? "" : "s"} in your cart, and I'll add to it. What would you like? You can say things like "two jollof rice and chicken".`
          : 'Sure! What would you like? You can say things like "two jollof rice and chicken", or ask "what soups do you have?".',
        ["Soups", "Rice", "Grills", "Drinks", "Menu"]
      );
      return;
    }

    // Menu overview
    if (/^(menu|the menu|categories|what do you have|what do you sell|what is on the menu|whats on the menu|what can i order)$/.test(n) || /\b(show|see|hear) (the |your )?menu\b/.test(n)) {
      const food = menuRef.current.filter((c) => c.group === "Food").map((c) => c.name);
      const drinks = menuRef.current.filter((c) => c.group === "Drinks").map((c) => c.name);
      reply(
        `Food: ${food.join(", ")}. Drinks: ${drinks.join(", ")}. Ask about any category, like "what soups do you have?", or just tell me what you'd like.`,
        ["Soups", "Rice", "Grills", "Cocktails", "Done"].filter((x, i) => i < 4 || basketCount() > 0)
      );
      return;
    }
    if (/^(drinks|drink|beverages)$/.test(n) || /\bwhat drinks\b/.test(n)) {
      const drinks = menuRef.current.filter((c) => c.group === "Drinks").map((c) => c.name);
      reply(`Our drinks: ${drinks.join(", ")}. Which category?`, drinks.slice(0, 5));
      return;
    }

    // Price / availability question about a specific dish
    if (/\b(how much|price|cost|do you have|is there|do you sell|do you serve)\b/.test(n)) {
      const h = extractHint(n);
      const cat = matchCategory(h.text);
      const c = chooseFrom(findCandidates(h.text));
      if (c.chosen) {
        s.pending = { qty: 1, pick: c.chosen };
        s.step = "offer_add";
        const opts = optionsFor(c.chosen);
        reply(`${priceLine(c.chosen)}${opts.length ? " Would you like me to add it?" : ""}`, opts.length ? ["Yes, add it", "No"] : []);
        return;
      }
      if (cat) { listCategory(cat); return; }
      if (c.ambiguous) {
        reply(c.ambiguous.map((p) => priceLine(p)).join(" "), ["Order food"]);
        return;
      }
    }

    // Category listing ("what soups do you have", "grills")
    {
      const cat = matchCategory(n);
      if (cat) { listCategory(cat); return; }
    }

    // Try to treat it as an order
    const segs = splitSegments(text);
    const anyMatch = segs.some((sg) => {
      const h = extractHint(sg);
      return qtyReadings(h.text).some((r) => findCandidates(r.text).length > 0);
    });
    if (anyMatch) { runSegments(segs); return; }

    // Questions about the business
    const ans = faq(text);
    if (ans) {
      reply(ans, s.basket.length ? ["Done", "Show my order"] : ["Order food", "Menu"]);
      return;
    }

    // Fallback
    reply(
      "Sorry, I didn't catch that. You can order by saying a dish, like 'jollof rice', or ask about our menu, location, hours, payment or delivery.",
      s.basket.length ? ["Done", "Show my order", "Menu"] : ["Order food", "Menu", "Hours", "Location"]
    );
  };

  handleRef.current = handle;

  /* ---------- UI handlers ---------- */

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    voiceModeRef.current = false;
    handle(inputText);
    setInputText("");
  };

  const tapChip = (c: string) => {
    voiceModeRef.current = false;
    if (c === "Go to checkout" && !S.current.basket.length) {
      pushMessage("user", c);
      router.push("/checkout");
      setChips([]);
      return;
    }
    handle(c);
  };

  const removeLine = (i: number) => {
    S.current.basket.splice(i, 1);
    bump();
  };

  const resetAll = () => {
    const s = S.current;
    s.basket = []; s.step = "idle"; s.pending = undefined; s.queue = []; s.carry = []; s.ordering = false;
    s.fulfilment = undefined; s.address = undefined; s.name = undefined; s.phone = undefined;
    voiceModeRef.current = false;
    reply("Order cleared. What would you like?", ["Menu", "Soups", "Rice", "Grills"], false);
  };

  const toggleOpen = () => {
    if (isOpen) {
      stopListening();
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        reply(
          "Hi! I'm Farm2Pot's assistant. I can take your order from start to checkout, and answer questions about our menu, location, hours, payment and delivery. What would you like to do?",
          ["Order food", "Menu", "Hours", "Location"],
          false
        );
      }, 250);
    }
  };

  const stepLabel: Record<Step, string> = {
    idle: S.current.ordering ? "ORDERING" : "",
    pick_item: "ORDERING",
    pick_option: "ORDERING",
    offer_add: "ORDERING",
    fulfil: "DETAILS",
    address: "DETAILS",
    name: "DETAILS",
    phone: "DETAILS",
    confirm: "CONFIRM",
  };
  const label = stepLabel[S.current.step];

  /* ---------- render ---------- */

  const basket = S.current.basket;

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream shadow-elevation-3 transition-all hover:bg-ember hover:scale-105"
        whileTap={{ scale: 0.95 }}
        aria-label="Order assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 left-6 z-[80] w-[calc(100vw-3rem)] max-w-sm rounded-2xl bg-cream border border-charcoal/10 shadow-elevation-4 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-charcoal">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-terracotta" />
                <span className="font-display text-sm font-semibold text-cream">Order Assistant</span>
                {label && (
                  <span className="ml-2 rounded-full bg-terracotta/20 px-2 py-0.5 text-[10px] font-medium text-terracotta">
                    {label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (!muted && "speechSynthesis" in window) window.speechSynthesis.cancel();
                    setMuted((m) => !m);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-cream/10 hover:text-cream transition-colors"
                  aria-label={muted ? "Turn voice on" : "Mute voice"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={toggleOpen}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-cream/10 hover:text-cream transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Order summary */}
            {basket.length > 0 && (
              <div className="px-4 py-2 bg-terracotta/5 border-b border-charcoal/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-charcoal/70 mb-1">
                    Current Order ({basketCount()} item{basketCount() !== 1 ? "s" : ""})
                  </p>
                  <button onClick={resetAll} className="text-[10px] text-charcoal/50 hover:text-red-600">
                    Clear
                  </button>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {basket.map((l, i) => (
                    <div key={l.id} className="flex items-center justify-between text-xs">
                      <span className="text-charcoal">
                        {l.qty} x {l.name} — {fmt(l.price * l.qty)}
                      </span>
                      <button onClick={() => removeLine(i)} className="text-red-500 hover:text-red-700" aria-label={`Remove ${l.name}`}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-1 pt-1 border-t border-charcoal/10">
                  <p className="text-xs font-bold text-terracotta">Total: {fmt(basketTotal())}</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === "user"
                        ? "bg-terracotta text-cream rounded-br-md"
                        : "bg-charcoal/5 text-charcoal rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isListening && (
                <div className="flex justify-start">
                  <div className="bg-charcoal/5 rounded-2xl rounded-bl-md px-4 py-2 text-sm text-charcoal/60">
                    <span className="animate-pulse">Listening...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            {chips.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => tapChip(c)}
                    className="inline-flex items-center rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/80 hover:bg-terracotta hover:text-cream transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={submitText} className="flex items-center gap-2 p-3 border-t border-charcoal/10">
              {micSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : () => { voiceModeRef.current = true; startListening(); }}
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                    isListening ? "bg-red-500 text-cream animate-pulse" : "bg-terracotta text-cream hover:bg-ember"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={S.current.step === "idle" ? (micSupported ? "Type or tap the mic..." : "Type here...") : "Your answer..."}
                className="flex-1 min-w-0 rounded-full border border-charcoal/20 bg-cream px-4 py-2 text-sm text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
              />
              <button
                type="submit"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-terracotta text-cream hover:bg-ember transition-colors"
                aria-label="Send"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
