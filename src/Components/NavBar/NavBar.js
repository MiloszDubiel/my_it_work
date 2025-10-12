import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddOffert from "../AddOffert/AddJobOffert";
import MoreSettings from "../SettingsPage/MoreSettings";

const Navbar = ({ offertPage, candidatePage, employersPage }) => {
  let searchDiv = useRef(null);
  let account = useRef(null);

  //Dane użytkownika po zalogowaniu
  let userData = JSON.parse(sessionStorage.getItem("user-data"));
  let navigate = useNavigate();

  const [avatar, setAvatar] = useState(sessionStorage.getItem("user-avatar"));

  return (
    <>
      <AddOffert
        offertPage={offertPage}
        candidatePage={candidatePage}
        employersPage={employersPage}
      />
      <MoreSettings
        offertPage={offertPage}
        candidatePage={candidatePage}
        employersPage={employersPage}
      />

      <header className={styles.headerElement}>
        <nav className={styles.navBar}>
          <div className={styles.header}>
            <h3>MyITWork</h3>
          </div>
          <div className={styles.list}>
            <ul>
              <li>
                {" "}
                <Link
                  to="/job-offerts"
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
                  {!avatar ? <IoPersonOutline className={styles.icon} /> : ""}
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
          >
            {userData?.email ? (
              <>
                <Link
                  onClick={() => {
                    document.querySelector("#settings").style.display = "flex";
                    document.querySelector("#root").style.overflow = "hidden";
                  }}
                >
                  Ustawienia
                </Link>
                {userData.role === "Employer" ? (
                  <>
                    {employersPage ? <Link>Dodaj swoją firmę</Link> : ""}

                    {offertPage ? (
                      <Link
                        onClick={() => {
                          document.querySelector(
                            "#jobOffertContainer"
                          ).style.display = "flex";
                        }}
                      >
                        Dodaj ogłoszenie o pracę
                      </Link>
                    ) : (
                      ""
                    )}
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
        <div
          className={
            styles.searchDiv +
            " " +
            (employersPage
              ? styles.darkSearchDiv
              : candidatePage
              ? styles.blueSearchDiv
              : styles.orangeSearchDiv)
          }
          ref={searchDiv}
        >
          <h1>
            {offertPage
              ? "Rekrutacja IT, bez zbędnego kodu."
              : employersPage
              ? "Firmy IT"
              : "Kandydaci IT"}
          </h1>
        </div>

        <div className={styles.hiddenMenu}>
          <button
            onClick={() => {
              document.querySelector("#filter").style.display = "flex";
            }}
          >
            Filtruj
          </button>
        </div>
      </header>
    </>
  );
};
export default Navbar;
