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
      .get("http://localhost:5000/admin/scrape-date", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLastScrap(res.data.date);
      });
  }, []);

  const changePassword = () => {
    setMessage("");

    if (
      newPassword.length < 8 ||
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/.test(
        newPassword,
      )
    ) {
      return setMessage(
        "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny",
      );
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
        },
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

  const runScraper = async () => {
    setMessage("Scrapowanie uruchomione…");

    try {
      await axios.get(
        `http://localhost:5000/admin/scrap/${new Date().toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          timeout: 5000,
        },
      );

      setMessage("Scraper działa w tle 🚀");
      setLastScrap(new Date().toISOString());
    } catch {
      setMessage("Nie udało się uruchomić scrapera");
    }
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
           Uruchom scrapowanie teraz
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
