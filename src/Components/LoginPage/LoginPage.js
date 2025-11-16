import { useEffect, useState } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) {
      return setError("Puste pola");
    }

    setLoading(true);
    try {
      let res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      setInfo(res.data.info);
      sessionStorage.setItem("user-data", JSON.stringify(res.data.user));
      sessionStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err) {
      setError(JSON.parse(err.request.response).error);
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
          {info && (
            <div className={styles.info} role="alert">
              {info}
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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
                placeholder="Hasło"
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

export default LoginPage;
