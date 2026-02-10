import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tools } from "./tools.js";
import redisClient from "../config/redis.js";
import SYSTEM_PROMPT from "./systemPrompt.js";

// Google Gemini model for generating responses
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3,
});

// Redis key prefix and session expiry (1 hour)
const CHAT_PREFIX = "agent:chat:";
const CHAT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds


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
