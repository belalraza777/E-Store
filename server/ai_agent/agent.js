import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tools } from "./tools.js";
import redisClient from "../config/redis.js";
import SYSTEM_PROMPT from "./systemPrompt.js";

// Groq LLM for agent
const model = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.3,
});

// Redis session config (1 hour TTL)
const CHAT_PREFIX = "agent:chat:";
const CHAT_TTL = 60 * 60;

// Load chat history from Redis
const loadHistory = async (userId) => {
    const data = await redisClient.get(`${CHAT_PREFIX}${userId}`);
    return data ? JSON.parse(data) : [];
};

// Save chat history, trimmed to last 20 messages to reduce token overhead
const saveHistory = async (userId, messages) => {
    const trimmed = messages.slice(-20); // Keep last 20 messages for context
    await redisClient.setex(`${CHAT_PREFIX}${userId}`, CHAT_TTL, JSON.stringify(trimmed));
};

// Shared ReAct agent — tools resolve userId from config at runtime
const agent = createReactAgent({
    llm: model,
    tools,
    stateModifier: SYSTEM_PROMPT,
});

// Process user message: load history → invoke agent → save history → return reply
export const handleUserMessage = async (userId, message) => {
    try {
        const history = await loadHistory(userId);
        history.push({ role: "user", content: message });

        const result = await agent.invoke(
            { messages: history },
            { configurable: { userId } }
        );

        // Keep only user & assistant messages for clean history
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
        throw error;
    }
};

// Clear user's chat session from Redis
export const clearUserSession = async (userId) => {
    await redisClient.del(`${CHAT_PREFIX}${userId}`);
};
