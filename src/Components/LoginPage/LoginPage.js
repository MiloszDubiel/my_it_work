import React, { useState } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) return "Podaj adres e-mail.";
    // prosty regex na e-mail
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Nieprawidłowy adres e-mail.";
    if (!password || password.length < 6)
      return "Hasło musi mieć co najmniej 6 znaków.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ email, password, remember });
      } else {
        // PRZYKŁADOWE WYWOŁANIE: odkomentuj i zaktualizuj endpoint jeśli chcesz
        /*
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, remember }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Błąd logowania");
        */
        await new Promise((r) => setTimeout(r, 800)); // demo
      }
    } catch (err) {
      setError(err?.message || "Błąd połączenia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.container1}
        role="region"
        aria-label="Formularz logowania"
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>Zaloguj się</h2>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              autoComplete="email"
              required
              aria-required="true"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Hasło</span>
            <div className={styles.pwdWrapper}>
              <input
                className={styles.input}
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Twoje hasło"
                autoComplete="current-password"
                required
                aria-required="true"
              />
              <button
                type="button"
                className={styles.togglePwd}
                onClick={() => setShowPwd((s) => !s)}
                aria-pressed={showPwd}
                aria-label={showPwd ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPwd ? "Ukryj" : "Pokaż"}
              </button>
            </div>
          </label>

          <div className={styles.row}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Pamiętaj mnie</span>
            </label>

            <a className={styles.forgot} href="/forgot">
              Zapomniałeś hasła?
            </a>
          </div>

          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : "Zaloguj"}
          </button>

          <div className={styles.footer}>
            <span>Nie masz konta?</span>{" "}
            <Link to="/register" className={styles.link}>
              Zarejestruj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
