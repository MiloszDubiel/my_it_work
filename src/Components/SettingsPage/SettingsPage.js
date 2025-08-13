import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

const SettingPage = () => {
  const [name, setFirstName] = useState("");
  const [surname, setSurnName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  useEffect(() => {
    setFirstName(userData?.name);
    setSurnName(userData?.surname);
    setEmail(userData?.email);
    setPhone(userData?.phone_number);
  }, []);

  const validate = () => {
    if (!name?.trim() || !surname?.trim()) return "Podaj imię i nazwisko.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Nieprawidłowy adres e-mail.";
    if (phone && !/^[+\d][\d\s\-()]{4,}$/.test(phone))
      return "Nieprawidłowy numer telefonu.";
    if (password || confirmPassword) {
      if (password.length < 6) return "Hasło musi mieć min. 6 znaków.";
      if (password !== confirmPassword) return "Hasła nie są identyczne.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setLoading(true);
    try {
      let id = userData.id;

      let res = await axios.post("http://192.168.100.2:3001/user/settings", {
        id,
        email,
        password,
        confirmPassword,
      });

      setSuccessMsg(res.data.info);
    } catch (err) {
      setErrorMsg(err?.message || "Błąd zapisu ustawień.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} id="userSettings">
      <div
        className={styles.container1}
        role="region"
        aria-label="Ustawienia użytkownika"
      >
        <div className={styles.closeWindow}>
          <IoCloseOutline
            onClick={() => {
              document.querySelector("#userSettings").style.display = "none";
            }}
          />
        </div>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>Ustawienia konta</h2>

          {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}
          {successMsg && (
            <div className={styles.alertSuccess}>{successMsg}</div>
          )}

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Imię</span>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Imię"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Nazwisko</span>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setSurnName(e.target.value)}
                placeholder="Nazwisko"
                required
              />
            </label>
          </div>

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
            <span className={styles.label}>Telefon (opcjonalnie)</span>
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48 600 000 000"
            />
          </label>

          <div className={styles.sectionDivider}>
            Zmiana hasła (opcjonalnie)
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Nowe hasło</span>
            <div className={styles.pwdWrap}>
              <input
                className={styles.input}
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nowe hasło"
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPwd((s) => !s)}
                aria-pressed={showPwd}
              >
                {showPwd ? "Ukryj" : "Pokaż"}
              </button>
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Potwierdź hasło</span>
            <input
              className={styles.input}
              type={showPwd ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Powtórz nowe hasło"
            />
          </label>

          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              type="submit"
              disabled={loading}
            >
              {loading ? "Zapisuję..." : "Zapisz zmiany"}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setFirstName("");
                setSurnName("");
                setEmail("");
                setPhone("");
                setPassword("");
                setConfirmPassword("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPage;
