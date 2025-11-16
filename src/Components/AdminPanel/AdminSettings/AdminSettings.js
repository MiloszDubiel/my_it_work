import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminSettings.module.css";

const AdminSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [lastScrap, setLastScrap] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/scrap-info", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => setLastScrap(res.data.lastScrap))
      .catch((err) => console.log(err));
  }, []);

  const changePassword = () => {
    setMessage("");

    if (newPassword.length < 6) {
      return setMessage("Nowe hasło musi mieć co najmniej 6 znaków");
    }

    axios
      .put(
        "http://localhost:5000/admin/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setMessage("Poprawnie zmieniono hasło");
        }
      })
      .catch((err) => {
        setMessage("Złe stare hasło");
      });
  };

  const runScraper = () => {
    setMessage("Scrapowanie uruchomione…");

    axios
      .post(
        "http://localhost:5000/admin/run-scraper",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setMessage("Scrapowanie zakończone ✔");
        setLastScrap(new Date().toISOString());
      })
      .catch(() => setMessage("Błąd scrapowania ❌"));
  };

  return (
    <div className={styles.container}>
      <h2>Ustawienia administratora</h2>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.block}>
        <h3>Zmiana hasła</h3>

        <label>Stare hasło</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>Nowe hasło</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={changePassword} className={styles.saveBtn}>
          Zmień hasło
        </button>
      </div>

      <div className={styles.block}>
        <h3>Scrapowanie ofert</h3>

        <p>
          Ostatnie scrapowanie:{" "}
          <strong>
            {lastScrap
              ? new Date(lastScrap).toLocaleString("pl-PL")
              : "Brak danych"}
          </strong>
        </p>

        <button onClick={runScraper} className={styles.scrapBtn}>
          🔄 Uruchom scrapowanie teraz
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
