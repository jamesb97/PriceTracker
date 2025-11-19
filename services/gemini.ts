import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Product, DealStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the generated product data
const productSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Short, concise product title (max 50 chars).",
    },
    category: {
      type: Type.STRING,
      description: "Product category e.g. Electronics, Home.",
    },
    currentPrice: {
      type: Type.NUMBER,
      description: "Current simulated price.",
    },
    originalPrice: {
      type: Type.NUMBER,
      description: "MSRP or typical list price.",
    },
    currency: { type: Type.STRING, description: "Currency symbol e.g. $." },
    image: { type: Type.STRING, description: "URL of the main product image." },
    description: {
      type: Type.STRING,
      description: "A 2-sentence description.",
    },
    rating: { type: Type.NUMBER, description: "Rating out of 5." },
    reviewCount: { type: Type.INTEGER, description: "Number of reviews." },
    dealStatus: { type: Type.STRING, enum: ["Great", "Good", "Fair", "Bad"] },
    advice: {
      type: Type.STRING,
      description: "Advice on whether to buy now or wait.",
    },
    history: {
      type: Type.ARRAY,
      description: "Price history for the last 30 days.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "Date in YYYY-MM-DD format.",
          },
          price: { type: Type.NUMBER, description: "Price on that date." },
        },
        required: ["date", "price"],
      },
    },
  },
  required: [
    "title",
    "currentPrice",
    "history",
    "dealStatus",
    "advice",
    "image",
  ],
};

export const analyzeProduct = async (
  query: string
): Promise<Omit<Product, "id" | "addedAt">> => {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `
    You are an advanced Amazon price tracking simulator.
    The user has provided the following input (URL or product name): "${query}".
    
    1. If the input is a URL, scrape it for product details. Find the main product image URL.
    2. If the input is a product name, hallucinate a realistic product and find a representative image URL.
    3. Generate realistic price data.
    4. Generate a realistic 30-day price history ending on ${today}. The prices should fluctuate realistically.
    5. Analyze if the current price is a "Great", "Good", "Fair", or "Bad" deal based on the history.
    6. Provide specific buying advice.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: productSchema,
      temperature: 0.4, // Slightly creative but structured
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  const data = JSON.parse(response.text);

  // Map string enum from JSON to TypeScript Enum
  let status = DealStatus.FAIR;
  switch (data.dealStatus) {
    case "Great":
      status = DealStatus.GREAT;
      break;
    case "Good":
      status = DealStatus.GOOD;
      break;
    case "Fair":
      status = DealStatus.FAIR;
      break;
    case "Bad":
      status = DealStatus.BAD;
      break;
  }

  return {
    ...data,
    dealStatus: status,
  };
};
