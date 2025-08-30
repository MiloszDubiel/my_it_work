import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { TbArrowNarrowDownDashed } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useRef, useEffect, useState, use } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SettingPage from "../SettingsPage/SettingsPage";

const Navbar = ({ offertPage, candidatePage, employersPage }) => {
  let searchDiv = useRef(null);
  let account = useRef(null);

  //Dane użytkownika po zalogowaniu
  let userData = JSON.parse(localStorage.getItem("userData"));
  let navigate = useNavigate();

  return (
    <>
      <SettingPage />
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
              ""
            ) : (
              <div className={styles.addOffert}>
                <p>Dodaj ogłoszenie</p>
              </div>
            )}

            {userData?.email ? (
              <>
                Witaj, {userData.name || "Użytkowniku"} {userData.surname || ""}
                <button
                  onClick={() => {
                    account.current.classList.toggle(styles.accountDivHide);
                  }}
                >
                  <IoPersonOutline className={styles.icon} />
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
                {" "}
                <Link
                  onClick={() => {
                    document.querySelector("#userSettings").style.display =
                      "flex";
                  }}
                >
                  Ustawienia
                </Link>
                <Link to="/user/add-ad">Dodaj ogłoszenie</Link>
                <Link to="/user/my-ad">Moje ogłoszenia</Link>
                <Link
                  onClick={() => {
                    localStorage.setItem(
                      "userData",
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
      </header>
    </>
  );
};
export default Navbar;
