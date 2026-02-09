import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import axios from "axios";
import { socket } from "../../socket"; // <- ścieżka do socket.js

export default function Chat({ conversationId, userId, message }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  /* =====================
     JOIN / LEAVE ROOM
  ===================== */
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    fetchMessages();

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId]);


  useEffect(() => {
    if (message) setNewMessage(message);
  }, [message]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/chat/messages/${conversationId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Błąd pobierania wiadomości:", err);
    }
  };


  useEffect(() => {
    const handler = (msg) => {
      if (msg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [conversationId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("send_message", {
      conversation_id: conversationId,
      sender_id: userId,
      content: newMessage,
    });

    setNewMessage("");
  };

  useEffect(() => {
  if (!conversationId || !userId) return;

  const markAsRead = async () => {
    try {

      await axios.put(
        `http://localhost:5001/chat/read/${conversationId}`,
        { userId }
      );

      window.dispatchEvent(new CustomEvent("messages-read"));
    } catch (err) {
      console.error("Błąd oznaczania wiadomości jako przeczytanych:", err);
    }
  };

  markAsRead();
  }, [conversationId, userId]);
  

  
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
        <div ref={messagesEndRef} />
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