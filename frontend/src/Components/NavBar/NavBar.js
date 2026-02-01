import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployerSettings from "../SettingsPage/EmployerSettings";
import CandidateSettings from "../SettingsPage/CandidateSettings";
import { FiMessageSquare } from "react-icons/fi";
import ChatPage from "../Chat/ChatPage";

const Navbar = ({ employersPage }) => {
  const account = useRef(null);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    return (
      JSON.parse(sessionStorage.getItem("user-data")) ||
      JSON.parse(localStorage.getItem("user-data"))
    );
  });

  useEffect(() => {
    const handler = () => {
      setUserData(
        JSON.parse(sessionStorage.getItem("user-data")) ||
          JSON.parse(localStorage.getItem("user-data")),
      );
    };

    window.addEventListener("storage-changed", handler);
    return () => window.removeEventListener("storage-changed", handler);
  }, []);

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
          <div className={styles.header}>
            <h3 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              MyITWork
            </h3>
          </div>

          <div className={styles.list}>
            {userData?.role !== "admin" && (
              <ul>
                <li>
                  <Link
                    to="/job-offers"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Oferty pracy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employers"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Pracodawcy IT
                  </Link>
                </li>
                {userData?.role === "employer" && (
                  <li>
                    <Link
                      to="/candidates"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      Kandydaci IT
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className={styles.account}>
            {userData?.email ? (
              <>
                <span className={styles.userName}>
                  <span className={styles.firstName}>
                    {userData?.role === "admin"
                      ? "Administrator"
                      : userData?.name || ""}
                  </span>
                  {userData?.role !== "admin" && userData?.surname && (
                    <span className={styles.lastName}>{userData.surname}</span>
                  )}
                </span>

                <button
                  onClick={() =>
                    account.current.classList.toggle(styles.accountDivHide)
                  }
                  style={{
                    background: `url(${userData?.avatar})`,
                    backgroundSize: "cover",
                  }}
                >
                  {!userData?.avatar && (
                    <IoPersonOutline className={styles.icon} />
                  )}
                </button>

                {userData.role !== "admin" && (
                  <button
                    onClick={() => {
                      const chat = document.querySelector("#chatContainer");
                      chat.style.display =
                        chat.style.display === "none" ? "flex" : "none";
                    }}
                  >
                    <FiMessageSquare className={styles.icon} />
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

            <div
              className={`${styles.accountDiv} ${styles.accountDivHide}`}
              ref={account}
              id="accountDiv"
            >
              {userData?.email ? (
                <>
                  {userData?.role !== "admin" && (
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

                  {userData?.role === "employer" && (
                    <>
                      {employersPage ? <Link>Dodaj swoją firmę</Link> : null}
                      <Link
                        onClick={() => {
                          document.querySelector("#settings").style.display =
                            "flex";
                          sessionStorage.setItem("tab", "offers");
                          window.dispatchEvent(new Event("setting-changed"));
                        }}
                      >
                        Zarządzaj ogłoszeniami o pracę
                      </Link>
                    </>
                  )}

                  {userData?.role === "admin" && (
                    <Link to="/admin">Panel administratora</Link>
                  )}

                  <button
                    className={styles.logOut}
                    onClick={() => {
                      // Usuń dane z obu storage
                      sessionStorage.clear();
                      localStorage.clear();
                      setUserData(null);
                      window.dispatchEvent(new Event("storage-changed"));
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
