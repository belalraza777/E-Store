import React, { useState, useRef, useEffect } from 'react';
import { getAgentResponse, clearAgentSession } from '../../api/agentApi';
import { toast } from 'sonner';
import ReactMarkdown from "react-markdown";
import { BsRobot, BsTrash3, BsSend } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import "./Agent.css";

const SUGGESTIONS = [
    "Raise a Complaint",
    "What's in my cart?",
    "Show my recent orders",
    "Browse categories",
    "Recommend me a product from electronics",
];

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Agent() {
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Scroll to bottom on new message or loading state change
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
    }, [chatHistory, isLoading]);

    useEffect(() => {
        return () => { clearAgentSession(); };
    }, []);
    // handle sending message to agent and receiving response
    const sendMessage = async (text) => {
        const msg = text ?? inputMessage;
        if (!msg.trim()) return;

        setChatHistory((prev) => [...prev, { role: "user", content: msg.trim(), time: new Date() }]);
        setInputMessage("");
        setIsLoading(true);

        const response = await getAgentResponse(msg.trim());

        if (response.success) {
            setChatHistory((prev) => [
                ...prev,
                { role: "assistant", content: response.data?.reply, time: new Date() },
            ]);
        } else {
            toast.error(response.message || "Failed to get response. Please try again.");
        }
        setIsLoading(false);
        inputRef.current?.focus();
    };
    // Handle Enter key for sending message (Shift+Enter for newline)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    // Clear chat history and session
    const handleClearChat = () => {
        setChatHistory([]);
        clearAgentSession();
        toast.success("Chat cleared");
    };

    return (
        <div className="agent">
            {/* ── Messages ───────────────────────────── */}
            <div className="agent__messages" ref={messagesContainerRef}>
                {chatHistory.length === 0 && !isLoading ? (
                    <div className="agent__welcome">
                        <div className="agent__welcome-icon"><BsRobot size={36} /></div>
                        <h2 className="agent__welcome-title">Hi there! How can I help?</h2>
                        <p className="agent__welcome-subtitle">
                            I can help you find products, check your cart, track orders, raise a complaint, and more. Try one of these:
                        </p>
                        <div className="agent__suggestions">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    className="agent__suggestion"
                                    onClick={() => sendMessage(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    chatHistory.map((msg, idx) => (
                        <div key={idx} className={`agent__message agent__message--${msg.role}`}>
                            <div className="agent__message-avatar">
                                {msg.role === "user" ? <FiUser size={16} /> : <BsRobot size={16} />}
                            </div>
                            <div>
                                <div className="agent__bubble">
                                    <div className="agent__bubble-content">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="agent__time">{formatTime(msg.time)}</div>
                            </div>
                        </div>
                    ))
                )}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="agent__typing">
                        <div className="agent__message-avatar" style={{
                            background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.12), rgba(var(--color-primary-rgb), 0.04))',
                            color: 'var(--color-primary)'
                        }}><BsRobot size={16} /></div>
                        <div className="agent__typing-bubble">
                            <span className="agent__typing-dot" />
                            <span className="agent__typing-dot" />
                            <span className="agent__typing-dot" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ──────────────────────────── */}
            <div className="agent__input-bar">
                {chatHistory.length > 0 && (
                    <button className="agent__clear-btn" onClick={handleClearChat} aria-label="Clear chat">
                        <BsTrash3 size={15} />
                    </button>
                )}
                <div className="agent__input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="agent__input"
                        rows={1}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about products, orders, or recommendations..."
                        disabled={isLoading}
                    />
                </div>
                <button
                    className="agent__send-btn"
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    aria-label="Send message"
                >
                    <BsSend size={18} />
                </button>
            </div>
            <div className="agent__disclaimer">AI may make mistakes. Verify important info.</div>
        </div>
    );
}
