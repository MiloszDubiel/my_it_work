import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import styles from "./ChatPage.module.css";
import { IoMdClose } from "react-icons/io";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user-data"));

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

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const handleOpen = async (e) => {
      const convId = e.detail.conversationId;

      setMessage(e.detail.message);

      if (!conversations.find((c) => c.id == convId)) {
        await fetchConversations();
      }

      const updated = conversations.find((c) => c.id == convId);
      if (updated) setSelectedConversation(updated);
    };

    window.addEventListener("openConversation", handleOpen);
    return () => window.removeEventListener("openConversation", handleOpen);
  }, [conversations]);

  return (
    <div
      className={styles.container}
      id="chatContainer"
      style={{ display: "none" }}
    >
      <main className={styles.wrapper}>
        {/* ACTION BAR */}
        <div className={styles.actionsBar}>
          <div className={styles.rightActions}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                document.querySelector(`#chatContainer`).style.display = "none";
                document.querySelector("#root").style.overflow = "auto";
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <section className={styles.contentGrid}>
          <article className={styles.leftCol}>
            <div className={styles.inbox}>
              <h2>Twoje rozmowy</h2>

              {conversations.length === 0 && (
                <p className={styles.empty}>Brak konwersacji</p>
              )}

              {conversations.map((conv) => {
                const isEmployer = conv.employer_id === user.id;
                const chatPartner = isEmployer
                  ? `${conv.candidate_name} ${conv.candidate_surname}`
                  : `${conv.employer_name} ${conv.employer_surname}`;

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
                      <h4>
                        {conv.companyName && (
                          <span className={styles.companyName}>
                            {conv.companyName + ", "}
                          </span>
                        )}
                        <span className={styles.name}>{chatPartner}</span>
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <aside className={styles.rightCol}>
            <div className={styles.chatArea}>
              {selectedConversation ? (
                <Chat
                  conversationId={selectedConversation.id}
                  userId={user.id}
                  key={selectedConversation.id}
                  message={message}
                />
              ) : (
                <div className={styles.placeholder}>
                  <p>Wybierz rozmowę z listy, aby rozpocząć czat</p>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
