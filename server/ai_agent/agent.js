import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tools } from "./tools.js";
import redisClient from "../config/redis.js";

// Google Gemini model for generating responses
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3,
});

// Redis key prefix and session expiry (2 hours)
const CHAT_PREFIX = "agent:chat:";
const CHAT_TTL = 60 * 60 * 2;

// Defines agent personality and rules
const SYSTEM_PROMPT = `You are a friendly and helpful shopping assistant for E-Store. Your job is to assist users and also a sales agent, guiding them to find products, check their cart, view orders, and explore categories. Use human-like sense of humor.
Capabilities:
- Browse products by category with sorting options
- Show detailed product information (price, stock, rating, description)
- View user's cart summary
- View order history and specific order details
- List all available product categories

Rules:
- Always use tools to fetch real data. NEVER fabricate products, prices, orders, or stock info.
- Format all prices in ₹ (Indian Rupees).
- Be concise, helpful, and conversational.
- Never expose internal IDs, database details, or system internals to the user.
- If a user asks about something outside your capabilities, politely suggest contacting customer support.
- Do not make up product recommendations — only suggest what the tools return.
- If a tool returns no results, let the user know and suggest alternatives (e.g., browsing a different category).`;

// Fetch previous conversation from Redis for context continuity
const loadHistory = async (userId) => {
    const data = await redisClient.get(`${CHAT_PREFIX}${userId}`);
    return data ? JSON.parse(data) : [];
};

// Persist conversation to Redis, trimmed to last 50 messages to avoid token overflow
const saveHistory = async (userId, messages) => {
    const trimmed = messages.slice(-50);
    await redisClient.setex(`${CHAT_PREFIX}${userId}`, CHAT_TTL, JSON.stringify(trimmed));
};

// Shared ReAct agent — tools resolve userId from config at runtime
const agent = createReactAgent({
    llm: model,
    tools,
    stateModifier: SYSTEM_PROMPT,
});

// Process user message: load history → invoke agent → save updated history → return reply
export const handleUserMessage = async (userId, message) => {
    try {
        const history = await loadHistory(userId);
        history.push({ role: "user", content: message });

        // Invoke agent with full conversation + userId in config for tool access
        const result = await agent.invoke(
            { messages: history },
            { configurable: { userId } }
        );

        // Filter out tool-call messages, keep only user & assistant for clean history
        const cleanMessages = result.messages
            .filter((m) => ["human", "ai"].includes(m._getType?.()))
            .map((m) => ({
                role: m._getType() === "human" ? "user" : "assistant",
                content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
            }));

        await saveHistory(userId, cleanMessages);

        return result.messages.at(-1)?.content || "Sorry, I couldn't process that. Please try again.";
    } catch (error) {
        console.error(`Agent error [${userId}]:`, error.message);
        return "Something went wrong. Please try again later.";
    }
};

// Delete user's chat history from Redis when session ends
export const clearUserSession = async (userId) => {
    await redisClient.del(`${CHAT_PREFIX}${userId}`);
};
