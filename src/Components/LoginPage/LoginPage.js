import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  let email = useRef(null);
  let passoword = useRef(null);
  let emailError = useRef(null);
  let passwordError = useRef(null);
  let infoDiv = useRef(null);
  let checkbox = useRef(null);
  const naviagate = useNavigate();
  const [userData, setUserData] = useState(null);

  return (
    <div className={styles.container}>
      <div
        className={styles.info}
        ref={infoDiv}
        onClick={() => {
          infoDiv.current.style.display = "none";
        }}
      ></div>
      <div className={styles.login_form}>
        <form className={styles.form}>
          <h3 style={{ marginBottom: 10 + "px" }}>Zaloguj się</h3>
          <p className={styles.separator}></p>
          <div className={styles.input_box}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Wpisz email..."
              required
              ref={email}
            />
            <p className="error" id="email-error" ref={emailError}></p>
          </div>
          <div className={styles.input_box}>
            <div className={styles.password_title}>
              <label htmlFor="password">Wpisz hasło</label>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Wpisz hasło..."
              required
              ref={passoword}
            />
            <p className={styles.error} ref={passwordError}></p>
          </div>
          <div className={styles.checkbox_box}>
            <input type="checkbox" id="remember-me" ref={checkbox} />
            <label htmlFor="remember-me">Zapamietaj mnie</label>
          </div>
          <button type="button">Zaloguj się</button>
          <p className={styles.sign_up}>
            Nie masz konta?
            <Link to="/register">
              <b> Zarejestruj się</b>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
