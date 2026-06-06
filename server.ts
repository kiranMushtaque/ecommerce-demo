import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Product list catalog to inject into Gemini support system guidelines
const initialStoreProducts = [
  { id: 1, name: "Ultra-Light Carbon Cycle", price: 899, category: "Sports", stock: 8 },
  { id: 2, name: "Pro ANC Wireless Headphones", price: 199, category: "Electronics", stock: 15 },
  { id: 3, name: "Minimalist Leather Backpack", price: 120, category: "Fashion", stock: 5 },
  { id: 4, name: "Ceramic Drip Coffee Flask", price: 45, category: "Home & Living", stock: 24 },
  { id: 5, name: "Pro Mechanical Keyboard RGB", price: 89, category: "Electronics", stock: 12 },
  { id: 6, name: "Ergonomic Memory Mesh Chair", price: 299, category: "Home & Living", stock: 4 },
];

const customerSupportSystemInstruction = `
You are the dedicated AI customer service assistant for "Bazaar Plaza" (or "E-Commerce Suite"), an award-winning premium e-commerce site. 
Your goal is to provide helpful, incredibly polite, and expert support in **English, Urdu, or Roman Urdu** (conversational Urdu written with English letters) depending on how the customer addresses you.

### STRICT RULES:
1. Be friendly, humble, and professional. Avoid lengthy standard preambles unless asked.
2. If the user greets you in Roman Urdu (e.g., "Hi, kaisay ho?", "payment gateway kaam nahi kr rha"), respond in Roman Urdu so they feel extremely comfortable.
3. If the user speaks in Urdu script (e.g., "سلام، کیسا ہے یہ؟"), respond beautifully in proper Urdu.
4. If the user writes in English, reply in English.
5. Here is the list of current premium products in our store:
${JSON.stringify(initialStoreProducts, null, 2)}
6. Here are our high-value discount coupons that customers can use during checkout:
   - **WELCOME50**: Gives 50% discount on any purchase! (Incredible welcome offer!)
   - **Bazaar20**: Gives 20% discount on entire cart.
   - **SAVE10**: Gives 10% discount.
7. Store Policies:
   - **Shipping**: Free home delivery across the country on orders over $100. Delivered in 2 to 3 business days.
   - **Secret security feature**: Fully integrated PCI-compliant Secure Credit Card Checkout flow with two-factor OTP authentication.
   - **Returns**: Easy 30-day money-back guarantee, no questions asked.
   - **Offline Mode**: Our site is fully Offline-Ready! If the internet disconnects, the user can still view products, manage items, and perform secure backups of their app data (purchases, wishlists, admin actions) to restore anytime!
8. If asked about order problems or tracking, reassure them and guide them to use our live interactive "Order Tracker" in the app!
`;

// Helper endpoint to check if Gemini AI key is provisioned
app.get("/api/ai-status", (req, res) => {
  res.json({
    active: !!ai,
    message: ai ? "AI Copilot is fully online and ready!" : "AI is in fallback demo mode. Please set GEMINI_API_KEY in Secrets to activate.",
  });
});

// Gemini powered Chatbot Customer Support endpoint
app.post("/api/chat-support", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      // Return a highly refined mock assistant response if GEMINI_API_KEY is not set so the app never crashes
      let mockReply = "Hello! I am Bazaar Plaza's AI Assistant. We are running in offline/demo mode. ";
      const cleanMessage = message.toLowerCase();
      if (cleanMessage.includes("urdu")) {
        mockReply += "Main Urdu aur Roman Urdu dono mein baat kar sakta hoon! Aap hamare automatic system, discount coupons (WELCOME50, Bazaar20) aur multi-language updates ka lutf uthayein.";
      } else if (cleanMessage.includes("coupon") || cleanMessage.includes("discount")) {
        mockReply += "Aap checkout pe standard coupon like 'WELCOME50' (50% Off) ya 'Bazaar20' use kar sakte hain taake bhari bachat ho ske!";
      } else if (cleanMessage.includes("shipping") || cleanMessage.includes("deliver")) {
        mockReply += "Hamari delivery 2-3 business days mein bilkul safe and sound aap tak pohnchegi!";
      } else {
        mockReply += "Aap discount codes, product management, and real-time interactive dashboards checkout kar sakte hain! Yeh live preview secure checkout and offline access ko follow karta hai.";
      }
      return res.json({ text: mockReply });
    }

    // Convert string array histories if passed to a suitable structured content message for chats
    // Prepare contents containing user's current query and context
    const chatSessionContents = [
      {
        role: "user",
        parts: [{ text: `${customerSupportSystemInstruction}\n\nUser Question: ${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatSessionContents,
    });

    const replyText = response.text || "I apologize, I received an empty response. How else may I assist you?";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini support API error:", error);
    res.status(500).json({
      error: "Error responding from AI support backend",
      details: error.message,
    });
  }
});

// Start the server utilizing Vite in dev and static files in build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://localhost:${PORT}`);
  });
}

startServer();
