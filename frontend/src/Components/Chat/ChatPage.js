import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import styles from "./ChatPage.module.css";
import { IoMdClose } from "react-icons/io";
import { socket } from "../../socket"; 

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(
    sessionStorage.getItem("user-data") ||
      localStorage.getItem("user-data")
  );

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

 
  const openConversation = async (conv) => {
    setSelectedConversation(conv);

    // oznacz jako przeczytane
    if (conv.unreadCount > 0) {
      await axios.put(
        `http://localhost:5001/chat/read/${conv.id}`,
        { userId: user.id }
      );
      fetchConversations();
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const handleNewMessage = ({ conversationId, senderId }) => {
      if (senderId === user.id) return; 

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                unreadCount:
                  selectedConversation?.id === conversationId
                    ? 0
                    : (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );
    };

    socket.on("new_message_notification", handleNewMessage);

    return () => {
      socket.off("new_message_notification", handleNewMessage);
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    const handleOpen = async (e) => {
      const convId = e.detail.conversationId;
      setMessage(e.detail.message);

      let conv = conversations.find((c) => c.id == convId);

      if (!conv) {
        await fetchConversations();
        conv = conversations.find((c) => c.id == convId);
      }

      if (conv) openConversation(conv);
    };

    window.addEventListener("openConversation", handleOpen);
    return () =>
      window.removeEventListener("openConversation", handleOpen);
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
                document.querySelector("#chatContainer").style.display =
                  "none";
                document.querySelector("#root").style.overflow = "auto";
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </div>

        {/* CONTENT */}
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
                    className={`${styles.conversation}
                      ${
                        selectedConversation?.id === conv.id
                          ? styles.active
                          : ""
                      }
                      ${conv.unreadCount > 0 ? styles.unread : ""}
                    `}
                    onClick={() => openConversation(conv)}
                  >
                    <div className={styles.avatarPlaceholder}>
                      {chatPartner?.[0]?.toUpperCase()}

                      {conv.unreadCount > 0 && (
                        <span className={styles.unreadDot}></span>
                      )}
                    </div>

                    <div>
                      <h4>
                        {conv.companyName && !isEmployer && (
                          <span className={styles.companyName}>
                            {conv.companyName},{" "}
                          </span>
                        )}

                        {conv.email && isEmployer && (
                          <span className={styles.companyName}>
                            {conv.email},{" "}
                          </span>
                        )}

                        <span className={styles.name}>{chatPartner}</span>
                      </h4>

                      {conv.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                          {conv.unreadCount}
                        </span>
                      )}
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
                  <p>Wybierz rozmowę z listy</p>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}