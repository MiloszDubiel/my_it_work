import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import styles from "./ChatPage.module.css";
import { IoMdClose } from "react-icons/io";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user-data"))
  );
  // 📨 Pobierz listę rozmów

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/chat/conversations/${user.id}`
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Błąd pobierania rozmów:", err);
      }
    };
    fetchConversations();
  }, [user.id]);

  return (
    <div
      className={styles.container}
      id="chatContainer"
      style={{ display: "none" }}
    >
      <div className={styles.chatPage}>
        {/* Lewy panel — lista rozmów */}

        <div className={styles.inbox}>
          <h2>📥 Twoje rozmowy</h2>
          {conversations.length === 0 && (
            <p className={styles.empty}>Brak konwersacji</p>
          )}
          {conversations.map((conv) => {
            const isEmployer = conv.employer_id === user.id;
            const chatPartner = isEmployer
              ? conv.candidate_name
              : conv.employer_name;

            return (
              <div
                key={conv.id}
                className={`${styles.conversation} ${
                  selectedConversation?.id === conv.id ? styles.active : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className={styles.avatarPlaceholder}>
                  {chatPartner?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4>{chatPartner}</h4>
                  <p>Rozmowa ID: {conv.id}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prawy panel — wybrany chat */}
        <div className={styles.chatArea}>
          <div className={styles.rightActions}>
            <button style={{ all: "unset", cursor: "pointer" }}>
              <IoMdClose
                onClick={() => {
                  document.querySelector("#chatContainer").style.display =
                    "none";
                  document.querySelector("#root").style.overflow = "auto";
                }}
              />
            </button>
          </div>
          {selectedConversation ? (
            <Chat
              conversationId={selectedConversation.id}
              userId={user.id}
              key={selectedConversation.id}
            />
          ) : (
            <div className={styles.placeholder}>
              <p>Wybierz rozmowę z listy, aby rozpocząć czat 💬</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
