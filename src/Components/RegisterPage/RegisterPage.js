import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.css";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const validate = () => {
    if (!email) return "Podaj adres e-mail.";
    if (!password || password.length < 6)
      return "Hasło musi mieć co najmniej 8 znaków.";
    if (password !== repeatPassword) return "Hasła są różne";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      if (role.length === 0) {
        setError("Nie wybrano roli");
        return;
      }
      let res = await axios.post("http://192.168.100.2:3001/auth/registre", {
        email,
        password,
        repeatPassword,
        role,
      });
      setInfo(res.data.info);
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
          <h2 className={styles.title}>Zarejestruj się </h2>

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
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              autoComplete="current-password"
              required
              aria-required="true"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Powtórz hasło</span>
            <input
              className={styles.input}
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Powtórz hasło"
              autoComplete="current-password"
              required
              aria-required="true"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Utwórz konto jako:</span>
            <select
              className={styles.input}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option disabled selected value>
                {" "}
                -- Wybierz --{" "}
              </option>
              <option value="Candidate">Kandydat</option>
              <option value="Employer">Pracodawca</option>
            </select>
          </label>
          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : "Zarejestruj"}
          </button>
          <div className={styles.footer}>
            <span>Masz już konto?</span>{" "}
            <Link to="/login" className={styles.link}>
              Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
