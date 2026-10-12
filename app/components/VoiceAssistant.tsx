"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, MessageCircle, ShoppingBag, HelpCircle, MapPin, Clock, Phone, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { menu } from "../data/menu";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface OrderItem {
  name: string;
  price: number;
  category: string;
}

interface OrderState {
  step: "idle" | "ordering" | "address" | "delivery_type" | "confirm";
  items: OrderItem[];
  address?: string;
  deliveryType?: "pickup" | "delivery";
}

const FAQ: Record<string, string> = {
  address: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  location: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  where: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  hours: "We are open 24 hours, 7 days a week.",
  open: "We are open 24 hours, 7 days a week.",
  time: "We are open 24 hours, 7 days a week.",
  phone: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  contact: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  call: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  whatsapp: "Message us on WhatsApp at 0816 247 0726.",
  delivery: "We deliver within Lagos only. Outside Lagos, you can pick up your order from our kitchen in Ajah.",
  deliver: "We deliver within Lagos only. Outside Lagos, you can pick up your order from our kitchen in Ajah.",
  pickup: "You can pick up your order at Kit Court Street, Harris Drive, Ajah, Lagos. Pickup is available from anywhere.",
  pick: "You can pick up your order at Kit Court Street, Harris Drive, Ajah, Lagos.",
  payment: "We accept bank transfer via Moniepoint, or cash on pickup.",
  pay: "We accept bank transfer via Moniepoint, or cash on pickup.",
  bank: "We use Moniepoint. Account: 8246098181, Name: Farm2Pot Kitchen.",
  book: "To book a table or reserve, please call us on 0816 247 0726 or message us on WhatsApp.",
  reserve: "To book a table or reserve, please call us on 0816 247 0726 or message us on WhatsApp.",
  booking: "To book a table or reserve, please call us on 0816 247 0726 or message us on WhatsApp.",
  table: "To book a table, please call us on 0816 247 0726 or message us on WhatsApp.",
  menu: "We have soups, rice, grills, pepper soups, shawarma, fresh juices, cocktails, milkshakes, beers, soft drinks, and more. What would you like to know about?",
  soup: "We have Egusi, Ogbono, Okro, Oha, Efo, Edikang Ikong, Afang, and Fisherman soup.",
  rice: "We have Jollof Rice, Fried Rice, Coconut Rice, Native Rice, and White Rice with Stew.",
  grill: "We have Grilled Chicken, Grilled Turkey, Grilled Croaker, Grilled Catfish, Suya, Tozo, and Shaki.",
  drink: "We have fresh juices, cocktails, milkshakes, beers, and soft drinks.",
  juice: "We have Fresh Orange, Pineapple and Ginger, Watermelon, Zobo, and Tigernut Drink.",
  cocktail: "We have Mojito, Long Island, Sex on the Beach, Pina Colada, Margarita, and Chapman.",
  milkshake: "We have Vanilla, Chocolate, Strawberry, Oreo, Lotus Biscoff, Caramel, Banana, Nutella, and Peanut Butter.",
  beer: "We have Heineken, Trophy, Star, Gulder, Life, 33 Export, and Budweiser.",
  soft: "We have Coca-Cola, Fanta, Sprite, Malt, and Schweppes.",
  price: "Prices vary by item. You can check our menu page for full pricing, or ask me about a specific item.",
  cost: "Prices vary by item. You can check our menu page for full pricing, or ask me about a specific item.",
  how: "You can order online through our website, or call us on 0816 247 0726.",
  order: "You can order online through our website, or call us on 0816 247 0726.",
  complaint: "For complaints, please call 0818 630 4735 or message us on WhatsApp.",
  complain: "For complaints, please call 0818 630 4735 or message us on WhatsApp.",
  refund: "We do not offer refunds. Please check our ordering terms for more info.",
  refunds: "We do not offer refunds. Please check our ordering terms for more info.",
  allergy: "Please inform us of any allergies before placing your order.",
  allergen: "Please inform us of any allergies before placing your order.",
  parking: "Yes, we have parking available at our location.",
  park: "Yes, we have parking available at our location.",
  wifi: "Yes, we have free WiFi for customers.",
  card: "We currently accept bank transfer and cash on pickup. Card payment is coming soon.",
  cards: "We currently accept bank transfer and cash on pickup. Card payment is coming soon.",
  vegan: "We have some vegetarian options. Please ask about specific items.",
  vegetarian: "We have some vegetarian options. Please ask about specific items.",
  spicy: "Some of our dishes are spicy. We can adjust the spice level on request.",
  halal: "Yes, all our meat is halal.",
  fresh: "All our ingredients are fresh and sourced daily.",
  quality: "We maintain high quality standards. All complaints are handled within 48 hours.",
  bulk: "Yes, we offer bulk and freezer orders. Please call 0816 247 0726 for bulk pricing.",
  freezer: "Yes, we offer freezer orders. Meals require 4-5 days to freeze properly.",
  freeze: "Yes, we offer freezer orders. Meals require 4-5 days to freeze properly.",
  event: "Yes, we cater for events. Please call 0816 247 0726 for event bookings.",
  cater: "Yes, we cater for events. Please call 0816 247 0726 for event bookings.",
  party: "Yes, we cater for parties and events. Please call 0816 247 0726.",
  wedding: "Yes, we cater for weddings. Please call 0816 247 0726 for wedding packages.",
};

function searchMenu(query: string): OrderItem[] {
  const results: OrderItem[] = [];
  const q = query.toLowerCase();

  for (const category of menu) {
    for (const item of category.items) {
      if (item.name.toLowerCase().includes(q)) {
        // Get price from various sources
        let price: number | undefined;

        if (item.tiers && item.tiers.length > 0) {
          price = item.tiers[0].price;
        } else if (item.price) {
          price = item.price;
        } else if (category.flatPrice) {
          price = category.flatPrice;
        } else if (category.bigPrice && category.smallPrice) {
          price = category.bigPrice;
        }

        if (price) {
          results.push({
            name: item.name,
            price,
            category: category.name,
          });
        }
      }
    }
  }

  return results.slice(0, 5);
}

function getCategoryItems(categoryName: string): string[] {
  const category = menu.find(
    (c) => c.name.toLowerCase().includes(categoryName.toLowerCase())
  );
  if (!category) return [];

  return category.items.map((item) => {
    let price = "";
    if (item.tiers && item.tiers.length > 0) {
      price = ` (from ₦${item.tiers[0].price.toLocaleString()})`;
    } else if (item.price) {
      price = ` (₦${item.price.toLocaleString()})`;
    } else if (category.flatPrice) {
      price = ` (₦${category.flatPrice.toLocaleString()})`;
    }
    return `${item.name}${price}`;
  });
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [orderState, setOrderState] = useState<OrderState>({ step: "idle", items: [] });
  const { addItem, items, clearCart } = useCart();
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const calculateTotal = useCallback(() => {
    return orderState.items.reduce((sum, item) => sum + item.price, 0);
  }, [orderState.items]);

  const resetOrder = useCallback(() => {
    setOrderState({ step: "idle", items: [] });
  }, []);

  const addToOrder = useCallback((item: OrderItem) => {
    setOrderState((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  const removeFromOrder = useCallback((index: number) => {
    setOrderState((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const confirmOrder = useCallback(() => {
    for (const item of orderState.items) {
      addItem({
        id: `voice-${Date.now()}-${Math.random()}`,
        name: item.name,
        price: item.price,
      });
    }

    const total = calculateTotal();
    const summary = `Order added to cart! ${orderState.items.map((i) => i.name).join(", ")}. Total: ₦${total.toLocaleString()}. Taking you to checkout.`;
    addMessage(summary, "assistant");
    speak(summary);

    setTimeout(() => {
      router.push("/checkout");
      resetOrder();
    }, 2000);
  }, [orderState.items, addItem, addMessage, router, resetOrder, speak, calculateTotal]);

  const processCommand = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    addMessage(transcript, "user");

    // ===== ORDER FLOW =====
    if (orderState.step === "ordering") {
      // Check for more items
      const moreItems = searchMenu(lower);
      if (moreItems.length > 0 && !lower.includes("done") && !lower.includes("that's all") && !lower.includes("checkout")) {
        const item = moreItems[0];
        addToOrder(item);
        const msg = `Added ${item.name} (₦${item.price.toLocaleString()}) to your order. Anything else? Say "done" or "checkout" when finished.`;
        addMessage(msg, "assistant");
        speak(msg);
        return;
      }

      if (lower.includes("done") || lower.includes("that's all") || lower.includes("checkout") || lower.includes("no more")) {
        if (orderState.items.length === 0) {
          const msg = "Your order is empty. What would you like to order? You can say things like 'order jollof rice', 'pepper soup', 'grilled chicken', or 'cocktail'.";
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          setOrderState((prev) => ({ ...prev, step: "delivery_type" }));
          const total = calculateTotal();
          const msg = `Great! Your order total is ₦${total.toLocaleString()}. Is this for pickup or delivery? Remember: delivery is only within Lagos. Outside Lagos? Pickup from anywhere.`;
          addMessage(msg, "assistant");
          speak(msg);
        }
        return;
      }

      // Try to find items anyway
      const items = searchMenu(lower);
      if (items.length > 0) {
        const item = items[0];
        addToOrder(item);
        const msg = `Added ${item.name} (₦${item.price.toLocaleString()}) to your order. Anything else? Say "done" when finished.`;
        addMessage(msg, "assistant");
        speak(msg);
      } else {
        const msg = "I couldn't find that on the menu. Try saying something like 'jollof rice', 'pepper soup', 'grilled chicken', 'suya', 'mojito', or 'chapman'. Or say 'menu' to hear categories.";
        addMessage(msg, "assistant");
        speak(msg);
      }
      return;
    }

    if (orderState.step === "delivery_type") {
      if (lower.includes("pickup") || lower.includes("pick up")) {
        setOrderState((prev) => ({ ...prev, step: "confirm", deliveryType: "pickup" }));
        const msg = "Got it! Pickup from Kit Court Street, Harris Drive, Ajah, Lagos. Shall I add this to your cart?";
        addMessage(msg, "assistant");
        speak(msg);
      } else if (lower.includes("delivery") || lower.includes("deliver")) {
        setOrderState((prev) => ({ ...prev, step: "address", deliveryType: "delivery" }));
        const msg = "Delivery it is! We deliver within Lagos. What is your delivery address?";
        addMessage(msg, "assistant");
        speak(msg);
      } else {
        const msg = "Is this for pickup or delivery? Delivery is only within Lagos. If you're outside Lagos, pickup is available from anywhere.";
        addMessage(msg, "assistant");
        speak(msg);
      }
      return;
    }

    if (orderState.step === "address") {
      if (lower.length > 10) {
        setOrderState((prev) => ({ ...prev, step: "confirm", address: transcript }));
        const msg = `Got it! Delivery to: ${transcript}. Shall I add this to your cart?`;
        addMessage(msg, "assistant");
        speak(msg);
      } else {
        const msg = "Please provide a more complete delivery address.";
        addMessage(msg, "assistant");
        speak(msg);
      }
      return;
    }

    if (orderState.step === "confirm") {
      if (lower.includes("yes") || lower.includes("yeah") || lower.includes("sure") || lower.includes("ok") || lower.includes("add")) {
        confirmOrder();
      } else if (lower.includes("no") || lower.includes("cancel") || lower.includes("stop")) {
        const msg = "No problem. Your order has been cancelled. Would you like to start over?";
        addMessage(msg, "assistant");
        speak(msg);
        resetOrder();
      } else {
        const msg = "Shall I add this to your cart? Say yes to confirm or no to cancel.";
        addMessage(msg, "assistant");
        speak(msg);
      }
      return;
    }

    // ===== GENERAL COMMANDS =====

    // Start ordering
    if (lower.includes("order") || lower.includes("buy") || lower.includes("food") || lower.includes("hungry") || lower.includes("eat") || lower.includes("hungry")) {
      setOrderState({ step: "ordering", items: [] });
      const msg = "Let's build your order! You can say things like 'jollof rice', 'pepper soup', 'grilled chicken', 'suya', 'mojito', 'chapman', or 'water'. What would you like first?";
      addMessage(msg, "assistant");
      speak(msg);
      return;
    }

    // Checkout
    if (lower.includes("checkout") || lower.includes("pay") || lower.includes("done") || lower.includes("that's all")) {
      if (items.length === 0) {
        speak("Your cart is empty. Would you like to place an order?");
        addMessage("Your cart is empty. Would you like to place an order?", "assistant");
      } else {
        speak("Taking you to checkout.");
        addMessage("Taking you to checkout.", "assistant");
        setTimeout(() => router.push("/checkout"), 1500);
      }
      return;
    }

    // Cart
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

    // Menu categories
    if (lower.includes("menu") || lower.includes("what do you have") || lower.includes("what do you sell")) {
      const categories = menu.map((c) => c.name).join(", ");
      const msg = `We have: ${categories}. You can ask about any category, like "what soups do you have?" or "show me drinks". Or just say what you'd like to order.`;
      addMessage(msg, "assistant");
      speak(msg);
      return;
    }

    // Category-specific queries
    for (const category of menu) {
      if (lower.includes(category.name.toLowerCase())) {
        const items = getCategoryItems(category.name);
        const msg = `Here's our ${category.name}: ${items.join(", ")}. Would you like to order any of these?`;
        addMessage(msg, "assistant");
        speak(msg);
        return;
      }
    }

    // FAQ
    for (const [keyword, answer] of Object.entries(FAQ)) {
      if (lower.includes(keyword)) {
        speak(answer);
        addMessage(answer, "assistant");
        return;
      }
    }

    // Try to find a menu item
    const foundItems = searchMenu(lower);
    if (foundItems.length > 0) {
      const item = foundItems[0];
      addToOrder(item);
      setOrderState((prev) => ({ ...prev, step: "ordering" }));
      const msg = `Added ${item.name} (₦${item.price.toLocaleString()}) to your order. Anything else? Say "done" or "checkout" when finished.`;
      addMessage(msg, "assistant");
      speak(msg);
      return;
    }

    // Help
    if (lower.includes("help") || lower.includes("what can you do")) {
      const msg = "I can take orders from our full menu — soups, rice, grills, drinks, and more. I can answer questions about our location, hours, delivery, payment, and booking. Try saying 'order food', 'what soups do you have?', 'where are you located?', or 'help'.";
      addMessage(msg, "assistant");
      speak(msg);
      return;
    }

    // Fallback
    const fallback = "I can take orders from our full menu, or answer questions about our location, hours, delivery, and booking. Try saying 'order food' to start, or 'menu' to hear our categories.";
    speak(fallback);
    addMessage(fallback, "assistant");
  }, [orderState, addItem, addMessage, items, router, speak, searchMenu, getCategoryItems, addToOrder, calculateTotal, confirmOrder, resetOrder]);

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

    recognitionRef.current = recognition;
    recognition.start();
  }, [processCommand]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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
      setIsOpen(false);
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        setTimeout(() => {
          const msg = "Hi! I'm Farm2Pot's voice assistant. I can take orders from our full menu, answer questions about location, hours, delivery, and help with booking. What would you like to do?";
          speak(msg);
          addMessage(msg, "assistant");
        }, 300);
      }
    }
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
                {orderState.step !== "idle" && (
                  <span className="ml-2 rounded-full bg-terracotta/20 px-2 py-0.5 text-[10px] font-medium text-terracotta">
                    {orderState.step === "ordering" ? "ORDERING" : orderState.step === "confirm" ? "CONFIRM" : "DETAILS"}
                  </span>
                )}
              </div>
              <button
                onClick={toggleOpen}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:bg-cream/10 hover:text-cream transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Order Summary */}
            {orderState.items.length > 0 && (
              <div className="px-4 py-2 bg-terracotta/5 border-b border-charcoal/10">
                <p className="text-xs font-semibold text-charcoal/70 mb-1">
                  Current Order ({orderState.items.length} item{orderState.items.length !== 1 ? "s" : ""}):
                </p>
                <div className="space-y-1">
                  {orderState.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-charcoal">
                        {item.name} - ₦{item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromOrder(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-1 pt-1 border-t border-charcoal/10">
                  <p className="text-xs font-bold text-terracotta">
                    Total: ₦{calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            )}

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
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {orderState.step === "idle" ? (
                <>
                  <button
                    onClick={() => processCommand("order food")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-cream hover:bg-ember transition-colors"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Order Food
                  </button>
                  <button
                    onClick={() => processCommand("menu")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-colors"
                  >
                    <BookOpen className="h-3 w-3" />
                    Menu
                  </button>
                  <button
                    onClick={() => processCommand("what are your hours")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-colors"
                  >
                    <Clock className="h-3 w-3" />
                    Hours
                  </button>
                  <button
                    onClick={() => processCommand("where are you located")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-colors"
                  >
                    <MapPin className="h-3 w-3" />
                    Location
                  </button>
                  <button
                    onClick={() => processCommand("help")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-colors"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Help
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => processCommand("done")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-cream hover:bg-ember transition-colors"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      resetOrder();
                      speak("Order cancelled. What else can I help you with?");
                      addMessage("Order cancelled. What else can I help you with?", "assistant");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Cancel
                  </button>
                </>
              )}
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
                placeholder={orderState.step === "idle" ? "Type or tap mic..." : "Answer the question..."}
                className="flex-1 rounded-full border border-charcoal/20 bg-cream px-4 py-2 text-sm text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
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