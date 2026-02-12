import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminSettings.module.css";
import { socket } from "../../../socket";


const AdminSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [lastScrap, setLastScrap] = useState(null);
  const [message, setMessage] = useState("");
  const [scraperStatus, setScraperStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/scrape-date", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLastScrap(res.data.date);
      });
  }, []);
useEffect(() => {
  socket.on("scraper_status", (data) => {
    setScraperStatus(data.message);
  });

  return () => {
    socket.off("scraper_status");
  };
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
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
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
    try {
      await axios.get(
        `http://localhost:5000/admin/scrap/${new Date().toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
          timeout: 5000,
        },
      );
      setLastScrap(new Date().toISOString());
    } catch (err) {
      console.log(err)
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
        <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={runScraper} className={styles.scrapBtn}>
          Uruchom scrapowanie teraz
        </button>
        <button
          onClick={() => {
            axios.post("http://localhost:5000/admin/scrap/stop", {}, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
              },
            })
  }}
  className={styles.cancelScrapBtn}
>
  Zatrzymaj scrapowanie
          </button>
            </div>
       {scraperStatus && (
  <div style={{
    marginTop: "20px",
    padding: "12px",
    color: "rgba(0, 0, 0, 1)",
    borderRadius: "6px"
            }}>
    {scraperStatus}
            </div>
            
          )}
          </div>
      </div>
  
  );
};

export default AdminSettings;
