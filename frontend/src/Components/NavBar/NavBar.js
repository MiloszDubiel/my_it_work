import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployerSettings from "../SettingsPage/EmployerSettings";
import CandidateSettings from "../SettingsPage/CandidateSettings";
import { FiMessageSquare } from "react-icons/fi";
import ChatPage from "../Chat/ChatPage";
import { socket } from "../../socket";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = ({ employersPage }) => {
  const account = useRef(null);
  const navigate = useNavigate();

  const [hasUnread, setHasUnread] = useState(false);
  const [userData, setUserData] = useState(() => {
    return (
      JSON.parse(sessionStorage.getItem("user-data")) ||
      JSON.parse(localStorage.getItem("user-data"))
    );
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
  const handleMessagesRead = () => setHasUnread(false);

  window.addEventListener("messages-read", handleMessagesRead);

  return () => {
    window.removeEventListener("messages-read", handleMessagesRead);
  };
}, []);
useEffect(() => {
  if (!userData?.id) return;

  socket.emit("join_user_room", userData.id);

  const handleNotification = ({ receiverId }) => {
    if (receiverId === userData.id) {
      setHasUnread(true);
    }
  };

  socket.on("new_message_notification", handleNotification);

  return () => {
    socket.off("new_message_notification", handleNotification);
  };
}, [userData]);
  
  
useEffect(() => {
  if (!userData?.id) return;

  const checkUnread = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/chat/has-unread/${userData.id}`
      );
      const data = await res.json();
      setHasUnread(data.hasUnread);
    } catch (err) {
      console.error("Błąd sprawdzania unread:", err);
    }
  };

  checkUnread();
}, [userData]);
  
  
  return (
    <>
      {userData?.role === "employer" && (
        <>
          <EmployerSettings />
          <ChatPage />
        </>
      )}
      {userData?.role === "candidate" && (
        <>
          <CandidateSettings />
          <ChatPage />
        </>
      )}

      <header className={styles.headerElement}>
        <nav className={styles.navBar}>
          {/* LOGO */}
          <div className={styles.header}>
            <h3 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              MyITWork
            </h3>
          </div>

          {/* MENU */}
          <div className={styles.list}>
            {userData?.role !== "admin" && (
              <ul>
                <li>
                  <Link to="/job-offers">Oferty pracy</Link>
                </li>
                <li>
                  <Link to="/employers">Pracodawcy IT</Link>
                </li>
                {userData?.role === "employer" && (
                  <li>
                    <Link to="/candidates">Kandydaci IT</Link>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* HAMBURGER MENU */}
          <div className={styles.hamburgerWrapper}>
            <button
              className={styles.hamburger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <RxHamburgerMenu className={styles.icon} />
              <span className={styles.hamburgerText}>Dostępne strony</span>
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {userData?.role !== "admin" && (
                  <>
                    <Link to="/job-offers">Oferty pracy</Link>
                    <Link to="/employers">Pracodawcy IT</Link>
                    {userData?.role === "employer" && (
                      <Link to="/candidates">Kandydaci IT</Link>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ACCOUNT */}
          <div className={styles.account}>
            {userData?.email ? (
              <>
                <span className={styles.userName}>
                  <span className={styles.firstName}>
                    {userData.role === "admin"
                      ? "Administrator"
                      : userData.name}
                  </span>
                  {userData?.surname && (
                    <span className={styles.lastName}>{userData.surname}</span>
                  )}
                </span>

                {/* AVATAR */}
                <button
                  onClick={() =>
                    account.current.classList.toggle(styles.accountDivHide)
                  }
                  style={{
                    background: userData.avatar
                      ? `url(${userData.avatar})`
                      : "none",
                    backgroundSize: "cover",
                  }}
                >
                  {!userData.avatar && (
                    <IoPersonOutline className={styles.icon} />
                  )}
                </button>

                {/* CHAT BUTTON */}
                {userData.role !== "admin" && (
                  <button
                    onClick={() => {
                      setHasUnread(false);
                      const chat = document.querySelector("#chatContainer");
                      chat.style.display =
                        chat.style.display === "none" ? "flex" : "none";
                    }}
                  >
                    <div className={styles.chatIconWrapper}>
                      <FiMessageSquare className={styles.icon} />
                      {hasUnread && <span className={styles.unreadDot} />}
                    </div>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() =>
                  account.current.classList.toggle(styles.accountDivHide)
                }
              >
                <IoPersonOutline className={styles.icon} />
              </button>
            )}

            {/* ACCOUNT DROPDOWN */}
            <div
              className={`${styles.accountDiv} ${styles.accountDivHide}`}
              ref={account}
            >
              {userData?.email ? (
                <>
                  {userData.role !== "admin" && (
                    <Link
                      onClick={() => {
                        document.querySelector("#settings").style.display =
                          "flex";
                        document.querySelector("#root").style.overflow =
                          "hidden";
                        sessionStorage.setItem("tab", "company");
                        window.dispatchEvent(new Event("setting-changed"));
                      }}
                    >
                      Ustawienia
                    </Link>
                  )}

                  {userData.role === "employer" && (
                    <>
                      {employersPage && <Link>Dodaj swoją firmę</Link>}
                      <Link
                        onClick={() => {
                          document.querySelector("#settings").style.display =
                            "flex";
                          sessionStorage.setItem("tab", "offers");
                          window.dispatchEvent(new Event("setting-changed"));
                        }}
                      >
                        Zarządzaj ofertami
                      </Link>
                    </>
                  )}

                  {userData.role === "admin" && (
                    <Link to="/admin">Panel administratora</Link>
                  )}

                  <button
                    className={styles.logOut}
                    onClick={() => {
                      sessionStorage.clear();
                      localStorage.clear();
                      setUserData(null);
                      account.current.classList.add(styles.accountDivHide);
                      navigate("/");
                    }}
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Zaloguj się</Link>
                  <Link to="/register">Zarejestruj się</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;