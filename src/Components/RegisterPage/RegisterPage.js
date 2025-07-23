import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.css";

const RegisterPage = () => {
  //Tworzy referencje do obiektu null
  let email = useRef(null);
  let passowrd = useRef(null);
  let repeatPassword = useRef(null);
  let emailError = useRef(null);
  let passwordError = useRef(null);
  let infoDiv = useRef(null);

  //RegEx do hasła 8 znaków, min 1 cyfra, 1 liczba, 1 znak specjalny
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|;:'",.<>?]).{8,}$/;

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
        <form action="#" className={styles.form}>
          <h3 style={{ marginBottom: 10 + "px" }}>Zarejestruj</h3>
          <p className={styles.separator}></p>
          <div className={styles.input_box}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Wpisz email..."
              required
              ref={
                /*Przypisuje referencje tego inputa do useRef w email*/ email
              }
            />
          </div>
          <div className={styles.input_box}>
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              placeholder="Wpisz hasło..."
              required
              ref={passowrd}
            />
          </div>
          <div className={styles.input_box}>
            <label htmlFor="repeat-passowrd">Powtórz hasło</label>
            <input
              type="password"
              id="repeat-passowrd"
              placeholder="Powtórz hasło..."
              required
              ref={repeatPassword}
            />
          </div>
          <button type="button">Zarejestruj się</button>
          <p className={styles.sign_up}>
            Masz już konto?
            <Link to="/login">
              <b> Zaloguj się</b>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
