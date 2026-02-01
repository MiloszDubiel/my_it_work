import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployerSettings from "../SettingsPage/EmployerSettings";
import CandidateSettings from "../SettingsPage/CandidateSettings";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import ChatPage from "../Chat/ChatPage";

const Navbar = ({ employersPage }) => {
  const account = useRef(null);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user-data"));
  });

  useEffect(() => {
    const handler = () => {
      setUserData(JSON.parse(sessionStorage.getItem("user-data")));
    };

    window.addEventListener("storage-changed", handler);
    return () => window.removeEventListener("storage-changed", handler);
  }, []);
  return (
    <>
      {userData?.role == "employer" ? (
        <>
          <EmployerSettings />
          <ChatPage />
        </>
      ) : userData?.role === "candidate" ? (
        <>
          <CandidateSettings />
          <ChatPage />
        </>
      ) : (
        ""
      )}

      <header className={styles.headerElement}>
        <nav className={styles.navBar}>
          <div className={styles.header}>
            <h3
              onClick={() => {
                navigate("/");
              }}
              style={{ cursor: "pointer" }}
            >
              MyITWork
            </h3>
          </div>
          <div className={styles.list}>
            {userData?.role !== "admin" && (
              <ul>
                <li>
                  {" "}
                  <Link
                    to="/job-offers"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Oferty pracy
                  </Link>
                </li>
                <li>
                  {" "}
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
                {userData?.role != "admin" && (
                  <span className={styles.name}>
                    {userData.name || "Użytkownik" || userData.surname || ""}
                  </span>
                )}
                {userData?.role == "admin" && (
                  <span className={styles.name}>Administrator</span>
                )}
                <button
                  onClick={() => {
                    account.current.classList.toggle(styles.accountDivHide);
                  }}
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
                  <>
                    <button
                      onClick={() => {
                        let dis =
                          document.querySelector("#chatContainer").style
                            .display;
                        if (dis === "none")
                          document.querySelector(
                            "#chatContainer",
                          ).style.display = "flex";
                        else
                          document.querySelector(
                            "#chatContainer",
                          ).style.display = "none";
                      }}
                    >
                      <FiMessageSquare className={styles.icon} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  account.current.classList.toggle(styles.accountDivHide);
                }}
              >
                <IoPersonOutline className={styles.icon} />
              </button>
            )}
            <div
              className={styles.accountDiv + " " + styles.accountDivHide}
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
                      {employersPage ? <Link>Dodaj swoją firmę</Link> : ""}

                      <Link
                        onClick={() => {
                          document.querySelector("#settings").style.display =
                            "flex";
                          sessionStorage.setItem("tab", "offers");
                          window.dispatchEvent(new Event("setting-changed"));
                        }}
                      >
                        Zarządzaj ogłoszeniemi o pracę
                      </Link>
                    </>
                  )}

                  {userData?.role === "Candidate" && (
                    <>
                      <Link to="/user/add-candidate">
                        Dodaj swoją kandydaturę
                      </Link>
                    </>
                  )}

                  {userData?.role == "admin" && (
                    <Link to="/admin">Panel administratora</Link>
                  )}

                  <button
                    className={styles.logOut}
                    onClick={() => {
                      sessionStorage.clear();
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
                  {""}
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
