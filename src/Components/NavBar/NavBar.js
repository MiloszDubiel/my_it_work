import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployerSettings from "../SettingsPage/EmployerSettings";
import CandidateSettings from "../SettingsPage/CandidateSettings";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import ChatPage from "../Chat/ChatPage";

const Navbar = ({ offertPage, candidatePage, employersPage }) => {
  let account = useRef(null);

  //Dane użytkownika po zalogowaniu
  let userData = JSON.parse(sessionStorage.getItem("user-data"));
  let navigate = useNavigate();

  const [avatar, setAvatar] = useState(sessionStorage.getItem("user-avatar"));

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
              <li>
                <Link
                  to="/candidates"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Kandydaci IT
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.account}>
            {userData?.email ? (
              <>
                Witaj, {userData.name || "Użytkowniku"} {userData.surname || ""}
                <button
                  onClick={() => {
                    account.current.classList.toggle(styles.accountDivHide);
                  }}
                  style={{
                    background: `url(${avatar})`,
                    backgroundSize: "cover",
                  }}
                >
                  <IoPersonOutline className={styles.icon} />
                </button>
                <button
                  onClick={() => {
                    let dis =
                      document.querySelector("#chatContainer").style.display;

                    if (dis === "none")
                      document.querySelector("#chatContainer").style.display =
                        "flex";
                    else
                      document.querySelector("#chatContainer").style.display =
                        "none";
                  }}
                >
                  <FiMessageSquare className={styles.icon} />
                </button>
                <button>
                  <IoIosNotificationsOutline className={styles.icon} />
                </button>
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
          </div>
          <div
            className={styles.accountDiv + " " + styles.accountDivHide}
            ref={account}
            id="accountDiv"
          >
            {userData?.email ? (
              <>
                <Link
                  onClick={() => {
                    document.querySelector("#settings").style.display = "flex";
                    document.querySelector("#root").style.overflow = "hidden";

                    sessionStorage.setItem("tab", "company");
                    window.dispatchEvent(new Event("setting-changed"));
                  }}
                >
                  Ustawienia
                </Link>
                {userData.role === "employer" ? (
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
                ) : (
                  ""
                )}
                {userData.role === "Candidate" ? (
                  <>
                    <Link to="/user/add-candidate">
                      Dodaj swoją kandydaturę
                    </Link>
                  </>
                ) : (
                  ""
                )}

                <Link
                  onClick={() => {
                    sessionStorage.setItem(
                      "user-data",
                      JSON.stringify({ info: "Wylogowano" })
                    );
                    account.current.classList.toggle(styles.accountDivHide);
                    navigate("/");
                  }}
                >
                  Wyloguj
                </Link>
              </>
            ) : (
              <>
                {""}
                <Link to="/login">Zaloguj się</Link>
                <Link to="/register">Zarejestruj się</Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};
export default Navbar;
