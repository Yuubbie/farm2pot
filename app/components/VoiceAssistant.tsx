"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, MessageCircle, ShoppingBag, HelpCircle, MapPin, Clock, Phone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const FAQ_KEYWORDS: Record<string, string> = {
  address: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  location: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  hours: "We are open 24 hours, 7 days a week.",
  open: "We are open 24 hours, 7 days a week.",
  phone: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  contact: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  delivery: "We offer both pickup and delivery. Delivery is via Bolt or InDrive.",
  pickup: "You can pick up your order at Kit Court Street, Harris Drive, Ajah, Lagos.",
  payment: "We accept bank transfer via Moniepoint, or cash on pickup.",
  book: "To book, please call us on 0816 247 0726 or send a message on WhatsApp.",
  reserve: "To reserve, please call us on 0816 247 0726 or send a message on WhatsApp.",
  menu: "We have soups, rice, grills, pepper soups, fresh juices, cocktails, milkshakes, and more.",
  soup: "We have Egusi, Ogbono, Okro, Oha, Efo, Edikang Ikong, Afang, and Fisherman soup.",
  rice: "We have Jollof Rice, Fried Rice, Coconut Rice, Native Rice, and more.",
  grill: "We have Grilled Chicken, Grilled Turkey, Grilled Croaker, Suya, and more.",
  drink: "We have fresh juices, cocktails, milkshakes, beers, and soft drinks.",
  juice: "We have Fresh Orange, Pineapple and Ginger, Watermelon, Zobo, and more.",
  cocktail: "We have Mojito, Long Island, Sex on the Beach, Pina Colada, and more.",
  milkshake: "We have Vanilla, Chocolate, Strawberry, Oreo, Lotus Biscoff, and more.",
};

const MENU_ITEMS = [
  "egusi", "ogbono", "okro", "oha", "efo", "edikang", "afang", "fisherman",
  "jollof", "fried rice", "coconut rice", "native rice", "white rice",
  "pepper soup", "goat meat pepper", "beef pepper", "chicken pepper", "turkey pepper", "catfish pepper",
  "grilled chicken", "grilled turkey", "grilled croaker", "grilled catfish", "suya", "tozo", "shaki",
  "shawarma", "beef shawarma", "chicken shawarma", "suya shawarma",
  "mojito", "long island", "sex on the beach", "pina colada", "margarita", "chapman",
  "vanilla", "chocolate", "strawberry", "oreo", "lotus", "caramel", "banana", "nutella", "peanut butter",
  "orange juice", "pineapple", "watermelon", "zobo", "tigernut",
  "heineken", "trophy", "star", "gulder", "life", "budweiser",
  "coca-cola", "fanta", "sprite", "malt", "schweppes",
  "eba", "semovita", "wheat", "poondo yam",
  "parfait", "spaghetti", "burger", "egg roll",
];

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const { addItem, items } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-NG";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const addMessage = useCallback((text: string, sender: "user" | "assistant") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender, timestamp: new Date() },
    ]);
  }, []);

  const processCommand = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    addMessage(transcript, "user");

    // Check for checkout
    if (lower.includes("checkout") || lower.includes("pay") || lower.includes("done") || lower.includes("that's all") || lower.includes("thats all")) {
      speak("Great! Taking you to checkout.");
      addMessage("Great! Taking you to checkout.", "assistant");
      setTimeout(() => router.push("/checkout"), 1500);
      return;
    }

    // Check for cart
    if (lower.includes("cart") || lower.includes("what did i order") || lower.includes("my order")) {
      if (items.length === 0) {
        speak("Your cart is empty. What would you like to order?");
        addMessage("Your cart is empty. What would you like to order?", "assistant");
      } else {
        const itemNames = items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
        speak(`You have ${itemNames} in your cart.`);
        addMessage(`You have ${itemNames} in your cart.`, "assistant");
      }
      return;
    }

    // Check for help
    if (lower.includes("help") || lower.includes("what can you do")) {
      speak("I can take orders, answer questions about our menu, location, hours, and help with booking. Try saying 'order jollof rice' or 'what are your hours?'");
      addMessage("I can take orders, answer questions about our menu, location, hours, and help with booking. Try saying 'order jollof rice' or 'what are your hours?'", "assistant");
      return;
    }

    // Check for FAQ
    for (const [keyword, answer] of Object.entries(FAQ_KEYWORDS)) {
      if (lower.includes(keyword)) {
        speak(answer);
        addMessage(answer, "assistant");
        return;
      }
    }

    // Check for menu items
    const foundItems: string[] = [];
    for (const item of MENU_ITEMS) {
      if (lower.includes(item)) {
        foundItems.push(item);
      }
    }

    if (foundItems.length > 0) {
      const addedNames: string[] = [];
      for (const item of foundItems) {
        const price = getItemPrice(item);
        if (price) {
          addItem({ id: `voice-${item}`, name: capitalize(item), price });
          addedNames.push(capitalize(item));
        }
      }
      if (addedNames.length > 0) {
        const response = `Added ${addedNames.join(", ")} to your cart. Anything else?`;
        speak(response);
        addMessage(response, "assistant");
        return;
      }
    }

    // Fallback
    const fallback = "I didn't understand that. You can say 'order jollof rice', 'what are your hours', 'where are you located', or 'help'.";
    speak(fallback);
    addMessage(fallback, "assistant");
  }, [addItem, addMessage, items, router, speak]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-NG";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [processCommand]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processCommand(inputText);
    setInputText("");
  };

  const toggleOpen = () => {
    if (isOpen) {
      stopListening();
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        setTimeout(() => {
          speak("Hi! I'm Farm2Pot's voice assistant. How can I help you today?");
          addMessage("Hi! I'm Farm2Pot's voice assistant. How can I help you today?", "assistant");
        }, 300);
      }
    }
    setIsOpen(!isOpen);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream shadow-elevation-3 transition-all hover:bg-ember hover:scale-105"
        whileTap={{ scale: 0.95 }}
        aria-label="Voice Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </motion.button>

      {/* Chat Panel */}
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
                <span className="font-display text-sm font-semibold text-cream">Voice Assistant</span>
              </div>
              <button
                onClick={toggleOpen}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-cream/10 hover:text-cream transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
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
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {[
                { label: "Order Jollof", icon: ShoppingBag, cmd: "order jollof rice" },
                { label: "Hours", icon: Clock, cmd: "what are your hours" },
                { label: "Location", icon: MapPin, cmd: "where are you located" },
                { label: "Help", icon: HelpCircle, cmd: "help" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => processCommand(action.cmd)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-colors"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2 p-3 border-t border-charcoal/10">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                  isListening
                    ? "bg-red-500 text-cream animate-pulse"
                    : "bg-terracotta text-cream hover:bg-ember"
                }`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or tap mic to speak..."
                className="flex-1 rounded-full border border-charcoal/20 bg-cream px-4 py-2 text-sm text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
              />
              <button
                type="submit"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-terracotta text-cream hover:bg-ember transition-colors"
                aria-label="Send"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function capitalize(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function getItemPrice(item: string): number | null {
  const prices: Record<string, number> = {
    egusi: 45000,
    ogbono: 45000,
    okro: 55000,
    oha: 45000,
    efo: 55000,
    edikang: 45000,
    afang: 45000,
    fisherman: 65000,
    jollof: 38000,
    "fried rice": 45000,
    "coconut rice": 15500,
    "native rice": 65000,
    "white rice": 15500,
    "pepper soup": 11500,
    "goat meat pepper": 45000,
    "beef pepper": 11500,
    "chicken pepper": 11500,
    "turkey pepper": 55000,
    "catfish pepper": 20000,
    "grilled chicken": 7000,
    "grilled turkey": 8000,
    "grilled croaker": 26500,
    "grilled catfish": 25000,
    suya: 2000,
    tozo: 2000,
    shaki: 1500,
    shawarma: 5000,
    "beef shawarma": 5000,
    "chicken shawarma": 5000,
    "suya shawarma": 8000,
    mojito: 8000,
    "long island": 12000,
    "sex on the beach": 10000,
    "pina colada": 10000,
    margarita: 10000,
    chapman: 7000,
    vanilla: 9000,
    chocolate: 9000,
    strawberry: 9000,
    oreo: 10000,
    lotus: 11000,
    caramel: 10000,
    banana: 9000,
    nutella: 10000,
    "peanut butter": 11500,
    "orange juice": 4000,
    pineapple: 4000,
    watermelon: 4000,
    zobo: 4000,
    tigernut: 4000,
    heineken: 2000,
    trophy: 2000,
    star: 2000,
    gulder: 2000,
    life: 2000,
    budweiser: 2000,
    "coca-cola": 1000,
    fanta: 1000,
    sprite: 1000,
    malt: 1000,
    schweppes: 1000,
    eba: 2500,
    semovita: 2500,
    wheat: 2500,
    "poondo yam": 2500,
    parfait: 9000,
    spaghetti: 5000,
    burger: 3000,
    "egg roll": 2000,
  };
  return prices[item] || null;
}