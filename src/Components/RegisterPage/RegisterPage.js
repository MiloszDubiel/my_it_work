import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.css";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nip, setNIP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const validate = () => {
    if (!email) return "Podaj adres e-mail.";
    if (!password || password.length < 8)
      return "Hasło musi mieć co najmniej 8 znaków.";
    if (password !== repeatPassword) return "Hasła są różne";
    if (role === "employer" && !companyName) return "Podaj nazwę firmy";
    if (role === "employer" && !nip) return "Podaj NIP";
    if (role === "employer" && !/^\d{10}$/.test(nip)) {
      return "Niepoprawny NIP";
    }
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
      if (!role) {
        setError("Nie wybrano roli");
        return;
      }

      const payload = {
        email: email.trim().toLowerCase(),
        password,
        repeatPassword,
        role,
        ...(role === "employer" ? { companyName } : {}),
        ...(role === "employer" ? { nip } : {}),
      };

      const res = await axios.post(
        "http://localhost:5000/auth/registre",
        payload
      );
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
        aria-label="Formularz rejestracji"
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>Zarejestruj się</h2>

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
              required
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
              required
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
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Utwórz konto jako:</span>
            <select
              className={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option disabled value="">
                -- Wybierz --
              </option>
              <option value="candidate">Kandydat</option>
              <option value="employer">Pracodawca</option>
            </select>
          </label>

          {/* Pokazuje się tylko dla pracodawcy */}
          {role === "employer" && (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Nazwa firmy</span>
                <input
                  className={styles.input}
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nazwa firmy"
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>NIP</span>
                <input
                  className={styles.input}
                  type="text"
                  value={nip}
                  onChange={(e) => setNIP(e.target.value)}
                  placeholder="NIP"
                  required
                />
              </label>
            </>
          )}

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
