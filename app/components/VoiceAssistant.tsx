"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, MessageCircle, ShoppingBag, HelpCircle, MapPin, Clock, Phone, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface OrderState {
  step: "idle" | "rice" | "protein" | "drink" | "address" | "delivery_type" | "confirm";
  rice?: string;
  protein?: string;
  drink?: string;
  address?: string;
  deliveryType?: "pickup" | "delivery";
}

const MENU_DATA = {
  rice: [
    { name: "Jollof Rice", price: 38000, liters: ["2L", "3L", "5L"] },
    { name: "Fried Rice", price: 45000, liters: ["2L", "3L", "5L"] },
    { name: "Coconut Rice", price: 15500 },
    { name: "Native Rice", price: 65000, liters: ["2L", "3L", "5L"] },
    { name: "White Rice and Stew", price: 15500 },
  ],
  protein: [
    { name: "Turkey", price: 8000 },
    { name: "Chicken", price: 7000 },
    { name: "Goat Meat", price: 7000 },
    { name: "Beef", price: 6000 },
    { name: "Catfish", price: 25500 },
    { name: "Croaker", price: 26500 },
    { name: "Grilled Chicken", price: 7000 },
    { name: "Grilled Turkey", price: 8000 },
  ],
  drink: [
    { name: "Water", price: 700 },
    { name: "Coca-Cola", price: 1000 },
    { name: "Fanta", price: 1000 },
    { name: "Sprite", price: 1000 },
    { name: "Malt", price: 1000 },
    { name: "Fresh Orange Juice", price: 4000 },
    { name: "Pineapple Juice", price: 4000 },
    { name: "Zobo", price: 4000 },
    { name: "Heineken", price: 2000 },
    { name: "Trophy", price: 2000 },
  ],
};

const FAQ_KEYWORDS: Record<string, string> = {
  address: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  location: "We are located at Kit Court Street, Harris Drive, Ajah, Lagos.",
  hours: "We are open 24 hours, 7 days a week.",
  open: "We are open 24 hours, 7 days a week.",
  phone: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  contact: "You can reach us on 0816 247 0726 or 0817 655 4823.",
  delivery: "We deliver within Lagos only. Outside Lagos, you can pick up your order from our kitchen in Ajah.",
  pickup: "You can pick up your order at Kit Court Street, Harris Drive, Ajah, Lagos. Pickup is available from anywhere.",
  payment: "We accept bank transfer via Moniepoint, or cash on pickup.",
  book: "To book, please call us on 0816 247 0726 or send a message on WhatsApp.",
  reserve: "To reserve, please call us on 0816 247 0726 or send a message on WhatsApp.",
  menu: "We have soups, rice, grills, pepper soups, fresh juices, cocktails, milkshakes, and more.",
  soup: "We have Egusi, Ogbono, Okro, Oha, Efo, Edikang Ikong, Afang, and Fisherman soup.",
  grill: "We have Grilled Chicken, Grilled Turkey, Grilled Croaker, Suya, and more.",
};

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [orderState, setOrderState] = useState<OrderState>({ step: "idle" });
  const [currentOrder, setCurrentOrder] = useState<{ rice?: any; protein?: any; drink?: any }>({});
  const { addItem, items, removeItem, updateQuantity } = useCart();
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
    let total = 0;
    if (currentOrder.rice) total += currentOrder.rice.price;
    if (currentOrder.protein) total += currentOrder.protein.price;
    if (currentOrder.drink) total += currentOrder.drink.price;
    return total;
  }, [currentOrder]);

  const resetOrder = useCallback(() => {
    setOrderState({ step: "idle" });
    setCurrentOrder({});
  }, []);

  const startOrderFlow = useCallback(() => {
    setOrderState({ step: "rice" });
    setCurrentOrder({});
    const msg = "Let's build your order! What rice would you like? We have Jollof Rice, Fried Rice, Coconut Rice, Native Rice, or White Rice with Stew.";
    addMessage(msg, "assistant");
    speak(msg);
  }, [addMessage, speak]);

  const processOrderFlow = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();

    switch (orderState.step) {
      case "rice": {
        const found = MENU_DATA.rice.find((r) => lower.includes(r.name.toLowerCase().split(" ")[0]));
        if (found) {
          setCurrentOrder((prev) => ({ ...prev, rice: found }));
          setOrderState({ ...orderState, step: "protein" });
          const msg = `Great choice! ${found.name} selected. Now, what protein would you like? We have Turkey, Chicken, Goat Meat, Beef, Catfish, or Grilled options.`;
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          const msg = "I didn't recognize that rice. We have Jollof Rice, Fried Rice, Coconut Rice, Native Rice, or White Rice with Stew. Which would you like?";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      case "protein": {
        const found = MENU_DATA.protein.find((p) => lower.includes(p.name.toLowerCase().split(" ")[0]));
        if (found) {
          setCurrentOrder((prev) => ({ ...prev, protein: found }));
          setOrderState({ ...orderState, step: "drink" });
          const msg = `Excellent! ${found.name} selected. Now, what drink would you like? We have Water, Coca-Cola, Fanta, Sprite, Malt, Fresh juices, Zobo, or beers like Heineken and Trophy.`;
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          const msg = "I didn't recognize that protein. We have Turkey, Chicken, Goat Meat, Beef, Catfish, or Grilled options. Which would you like?";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      case "drink": {
        const found = MENU_DATA.drink.find((d) => lower.includes(d.name.toLowerCase().split(" ")[0]));
        if (found) {
          setCurrentOrder((prev) => ({ ...prev, drink: found }));
          setOrderState({ ...orderState, step: "delivery_type" });
          const msg = `Perfect! ${found.name} selected. Now, is this for pickup or delivery? Please note: delivery is only within Lagos. If you're outside Lagos, pickup is available from anywhere.`;
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          const msg = "I didn't recognize that drink. We have Water, Coca-Cola, Fanta, Sprite, Malt, Fresh juices, Zobo, or beers. Which would you like?";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      case "delivery_type": {
        if (lower.includes("pickup") || lower.includes("pick up")) {
          setOrderState({ ...orderState, step: "confirm" });
          const msg = "Got it! Pickup it is. You can collect from our kitchen at Kit Court Street, Harris Drive, Ajah, Lagos. Shall I add this to your order?";
          addMessage(msg, "assistant");
          speak(msg);
        } else if (lower.includes("delivery") || lower.includes("deliver")) {
          setOrderState({ ...orderState, step: "address" });
          const msg = "Delivery it is! We deliver within Lagos. What is your delivery address?";
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          const msg = "Is this for pickup or delivery? Remember, delivery is only within Lagos. If you're outside Lagos, pickup is available from anywhere.";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      case "address": {
        if (lower.length > 10) {
          setOrderState({ ...orderState, step: "confirm", address: transcript });
          const msg = `Got it! Delivery to: ${transcript}. Shall I add this to your order?`;
          addMessage(msg, "assistant");
          speak(msg);
        } else {
          const msg = "Please provide a more complete delivery address.";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      case "confirm": {
        if (lower.includes("yes") || lower.includes("yeah") || lower.includes("sure") || lower.includes("ok") || lower.includes("add")) {
          // Add items to cart
          if (currentOrder.rice) {
            addItem({ id: `voice-rice-${Date.now()}`, name: currentOrder.rice.name, price: currentOrder.rice.price });
          }
          if (currentOrder.protein) {
            addItem({ id: `voice-protein-${Date.now()}`, name: currentOrder.protein.name, price: currentOrder.protein.price });
          }
          if (currentOrder.drink) {
            addItem({ id: `voice-drink-${Date.now()}`, name: currentOrder.drink.name, price: currentOrder.drink.price });
          }

          const total = calculateTotal();
          const summary = `Order added to cart! ${currentOrder.rice?.name || ""} + ${currentOrder.protein?.name || ""} + ${currentOrder.drink?.name || ""}. Total: ₦${total.toLocaleString()}. Taking you to checkout.`;
          addMessage(summary, "assistant");
          speak(summary);

          setTimeout(() => {
            router.push("/checkout");
            resetOrder();
          }, 2000);
        } else if (lower.includes("no") || lower.includes("cancel") || lower.includes("stop")) {
          const msg = "No problem. Your order has been cancelled. Would you like to start over or is there anything else?";
          addMessage(msg, "assistant");
          speak(msg);
          resetOrder();
        } else {
          const msg = "Shall I add this to your order? Say yes to confirm or no to cancel.";
          addMessage(msg, "assistant");
          speak(msg);
        }
        break;
      }

      default:
        break;
    }
  }, [orderState, currentOrder, addItem, addMessage, router, resetOrder, speak, calculateTotal]);

  const processGeneralCommand = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    addMessage(transcript, "user");

    // Start order flow
    if (lower.includes("order") || lower.includes("buy") || lower.includes("food") || lower.includes("hungry") || lower.includes("eat")) {
      startOrderFlow();
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

    // Help
    if (lower.includes("help") || lower.includes("what can you do")) {
      speak("I can take orders by asking what rice, protein, and drink you'd like. I can also tell you our location, hours, delivery info, and help with booking. Try saying 'order food' to start.");
      addMessage("I can take orders by asking what rice, protein, and drink you'd like. I can also tell you our location, hours, delivery info, and help with booking. Try saying 'order food' to start.", "assistant");
      return;
    }

    // FAQ
    for (const [keyword, answer] of Object.entries(FAQ_KEYWORDS)) {
      if (lower.includes(keyword)) {
        speak(answer);
        addMessage(answer, "assistant");
        return;
      }
    }

    // Fallback
    const fallback = "I can help you place an order, check your cart, or answer questions about our menu, location, and hours. Try saying 'order food' to start an order, or 'help' for more options.";
    speak(fallback);
    addMessage(fallback, "assistant");
  }, [addMessage, items, router, speak, startOrderFlow]);

  const processCommand = useCallback((transcript: string) => {
    if (orderState.step !== "idle") {
      processOrderFlow(transcript);
    } else {
      processGeneralCommand(transcript);
    }
  }, [orderState.step, processOrderFlow, processGeneralCommand]);

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
          const msg = "Hi! I'm Farm2Pot's voice assistant. I can take your order, answer questions, or help with booking. What would you like to do?";
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
                    ORDERING
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

            {/* Order Summary (when ordering) */}
            {orderState.step !== "idle" && (
              <div className="px-4 py-2 bg-terracotta/5 border-b border-charcoal/10">
                <p className="text-xs font-semibold text-charcoal/70 mb-1">Current Order:</p>
                <div className="flex flex-wrap gap-2">
                  {currentOrder.rice && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-xs text-charcoal">
                      {currentOrder.rice.name} - ₦{currentOrder.rice.price.toLocaleString()}
                    </span>
                  )}
                  {currentOrder.protein && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-xs text-charcoal">
                      {currentOrder.protein.name} - ₦{currentOrder.protein.price.toLocaleString()}
                    </span>
                  )}
                  {currentOrder.drink && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-xs text-charcoal">
                      {currentOrder.drink.name} - ₦{currentOrder.drink.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {orderState.step === "confirm" && (
                  <p className="mt-1 text-xs font-bold text-terracotta">
                    Total: ₦{calculateTotal().toLocaleString()}
                  </p>
                )}
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
                    onClick={() => startOrderFlow()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-cream hover:bg-ember transition-colors"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Order Food
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
                <button
                  onClick={() => {
                    resetOrder();
                    speak("Order cancelled. What else can I help you with?");
                    addMessage("Order cancelled. What else can I help you with?", "assistant");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Cancel Order
                </button>
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