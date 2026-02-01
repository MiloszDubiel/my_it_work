import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", { transports: ["websocket"] });

export default function Chat({ conversationId, userId, message }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (message) {
      setNewMessage(message);
    }
  }, [message]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/chat/messages/${conversationId}`,
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Błąd pobierania wiadomości:", err);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (message.conversation_id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender_id === userId ? styles.sent : styles.received
            }`}
          >
            <p className={styles.text}>{msg.content}</p>
            <span className={styles.time}>
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Napisz wiadomość..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Wyślij</button>
      </form>
    </div>
  );
}
