import { useEffect, useState } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem("user-data");
    const token = localStorage.getItem("token");
    if (rememberedUser && token) {
      sessionStorage.setItem("user-data", rememberedUser);
      sessionStorage.setItem("token", token);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) return setError("Puste pola");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const user = res.data.user;
      const token = res.data.token;


      if (remember) {
        localStorage.setItem("user-data", JSON.stringify(user));
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("storage-changed"));
      } else {
        sessionStorage.setItem("user-data", JSON.stringify(user));
        sessionStorage.setItem("token", token);
        window.dispatchEvent(new Event("storage-changed"));
      }

      setInfo(res.data.info);

      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err) {
      setError(err?.response?.data?.error || "Błąd logowania");
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

          <label className={styles.field} htmlFor="email">
            <span className={styles.label}>E-mail</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              aria-label="Email"
              id="email"
            />
          </label>

          <label className={styles.field} htmlFor="password">
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
                aria-label="Pole hasło"
                id="password"
              />
              <button
                type="button"
                className={styles.togglePwd}
                onClick={() => setShowPwd((s) => !s)}
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
