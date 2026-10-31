import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/ai/recipe-to-cart", async (req, res) => {
  try {
    const { recipeQuery } = req.body;
    if (!recipeQuery) {
      return res.status(400).json({ error: "Recipe query is required" });
    }

    const prompt = `Create a detailed recipe and list the required grocery items for: "${recipeQuery}". 
    Return a JSON object with:
    - recipeName (string)
    - description (string)
    - prepTime (string)
    - servings (number)
    - ingredients: array of objects with { name, category (Produce, Dairy, Meat, Pantry, Bakery, Beverages), estimatedPrice (number), quantity (string) }
    - instructions: array of strings`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            servings: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  quantity: { type: Type.STRING }
                },
                required: ["name", "category", "estimatedPrice", "quantity"]
              }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["recipeName", "description", "prepTime", "servings", "ingredients", "instructions"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Recipe generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recipe" });
  }
});

app.post("/api/ai/smart-assistant", async (req, res) => {
  try {
    const { message, cartItems, history } = req.body;
    
    const systemInstruction = `You are FreshBot, an expert AI grocery shopping assistant and culinary chef for FreshMart Supermarket. 
    You help customers find products, suggest healthy meal plans, offer budget-saving tips, and dietary advice (vegan, gluten-free, keto, organic, etc.). 
    Current customer cart items: ${JSON.stringify(cartItems || [])}. 
    Be friendly, concise, and helpful.`;

    const chatHistory = (history || []).map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction,
      },
      history: chatHistory.length > 0 ? chatHistory : undefined
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Smart assistant error:", error);
    res.status(500).json({ error: error.message || "Failed to get response from assistant" });
  }
});

app.post("/api/ai/substitute", async (req, res) => {
  try {
    const { itemName, dietaryPreference } = req.body;
    if (!itemName) {
      return res.status(400).json({ error: "Item name is required" });
    }

    const prompt = `Suggest 3 smart, healthy product substitutions for "${itemName}" ${dietaryPreference ? `considering dietary preference: ${dietaryPreference}` : ""}. 
    Return a JSON array of objects with:
    - name (string)
    - reason (string)
    - priceDelta (string, e.g. "+$0.50" or "Same price")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              priceDelta: { type: Type.STRING }
            },
            required: ["name", "reason", "priceDelta"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    res.json(data);
  } catch (error: any) {
    console.error("Substitution error:", error);
    res.status(500).json({ error: error.message || "Failed to generate substitutions" });
  }
});

app.post("/api/ai/nutrition-analysis", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    const prompt = `Analyze the following grocery cart items for nutritional balance and health score:
    ${JSON.stringify(items)}
    
    Return a JSON object with:
    - healthScore (number from 0 to 100)
    - summary (string overview of nutritional quality)
    - strengths (array of strings, e.g. "High fresh produce", "Good protein sources")
    - suggestedSwaps (array of strings recommending healthier alternatives for processed items)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedSwaps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["healthScore", "summary", "strengths", "suggestedSwaps"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Nutrition analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze nutrition" });
  }
});

// Setup Vite middleware in development or serve static in production
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FreshMart server running on http://localhost:${PORT}`);
});
