import React, { useState } from "react";
import styles from "./CandidateSettings.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
const CandidateSettings = ({ user, favorites = [], applications = [] }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));

  const [DataToChange, setDataToChange] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
    coverLetter: "",
    cv: null,
    avatar: null,
    repo: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const [cvName, setCvName] = useState("");
  const [coverName, setCoverName] = useState("");
  const [info, setInfo] = useState("");
  const [error, setErorr] = useState("");

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    setInfo("");
    setErorr("");

    if (!DataToChange.name?.trim()) {
      return setErorr("Imię jest wymagane.");
    }

    if (!DataToChange.surname?.trim()) {
      return setErorr("Nazwisko jest wymagane.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!DataToChange.email?.trim()) {
      return setErorr("Email jest wymagany.");
    } else if (!emailRegex.test(DataToChange.email)) {
      return setErorr("Podaj poprawny email.");
    }
    if (DataToChange.newPassword) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/;
      if (!passwordRegex.test(DataToChange.newPassword)) {
        return setErorr(
          "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny."
        );
      }

      if (DataToChange.newPassword !== DataToChange.repeatPassword) {
        return setErorr("Hasła są różne.");
      }
    }

    try {
      let res = await axios.post("http://localhost:5000/user/edit-profile", {
        ...DataToChange,
        id: userData.id,
      });

      if (res.data.info) {
        setInfo(res.data.info + "" + ". Trwa odświeżanie strony...");
        sessionStorage.setItem("user-data", JSON.stringify(res.data.userData));
        document.querySelector(`.${styles.content}`).scroll(0, 0);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      if (res.data.error) {
        document.querySelector(`.${styles.content}`).scroll(0, 0);
        setErorr(res.data.error);
      }
    } catch (err) {}
  };

  const handleSaveCandiateProfile = (e) => {};

  return (
    <div className={styles.container1} id="settings">
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <button
            className={activeTab === "profile" ? styles.active : ""}
            onClick={() => setActiveTab("profile")}
          >
            Ustawienia konta
          </button>
          <button
            className={activeTab === "candidate-profile" ? styles.active : ""}
            onClick={() => setActiveTab("candidate-profile")}
          >
            Moje profil kandydata
          </button>
          <button
            className={activeTab === "applications" ? styles.active : ""}
            onClick={() => setActiveTab("applications")}
          >
            Złożone CV
          </button>
          <button
            className={activeTab === "favorites" ? styles.active : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Ulubione oferty
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.error}>{error}</p>
          <p className={styles.info}>{info}</p>
          <div className={styles.rightActions}>
            <button style={{ all: "unset", cursor: "pointer" }}>
              <IoMdClose
                onClick={() => {
                  document.querySelector("#settings").style.display = "none";
                  document.querySelector("#root").style.overflow = "auto";
                }}
              />
            </button>
          </div>
          {activeTab === "profile" && (
            <form onSubmit={handleSubmitUserInfo} className={styles.form}>
              <h2>Ustawienia konta</h2>
              <label>Imię</label>
              <input
                type="text"
                placeholder="Jan"
                value={DataToChange.name}
                onChange={(e) =>
                  setDataToChange({ ...DataToChange, name: e.target.value })
                }
              />

              <label>Nazwisko</label>
              <input
                type="text"
                placeholder="Kowalski"
                value={DataToChange.surname}
                onChange={(e) =>
                  setDataToChange({
                    ...DataToChange,
                    surname: e.target.value,
                  })
                }
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="jan@firma.pl"
                value={DataToChange.email}
                onChange={(e) =>
                  setDataToChange({
                    ...DataToChange,
                    email: e.target.value,
                  })
                }
              />

              <label>Nowe hasło</label>
              <input
                type="password"
                placeholder="********"
                value={DataToChange.newPassword}
                onChange={(e) =>
                  setDataToChange({
                    ...DataToChange,
                    newPassword: e.target.value,
                  })
                }
              />

              <label>Powtórz hasło</label>
              <input
                type="password"
                placeholder="********"
                value={DataToChange.repeatPassword}
                onChange={(e) =>
                  setDataToChange({
                    ...DataToChange,
                    repeatPassword: e.target.value,
                  })
                }
              />

              <button type="submit" className={styles.saveBtn}>
                Zapisz zmiany
              </button>
            </form>
          )}

          {activeTab === "candidate-profile" && (
            <form className={styles.form} onSubmit={handleSaveCandiateProfile}>
              <h2>Ustawienia profilu kandydata</h2>

              {/* CV */}
              <label>CV</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setDataToChange({ ...DataToChange, cv: file });
                  setCvName(file?.name || "");
                }}
              />
              {cvName && <p className={styles.cvInfo}>📄 {cvName}</p>}

              {/* List motywacyjny */}
              <label>List motywacyjny</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setDataToChange({ ...DataToChange, coverLetter: file });
                  setCoverName(file?.name || "");
                }}
              />

              {/* Link do repozytrium */}
              <label>Link do repozytrium</label>
              <input
                type="link"
                value={DataToChange.link}
                onChange={(e) =>
                  setDataToChange({ ...DataToChange, repo: e.target.value })
                }
              />

              <button type="submit" className={styles.saveBtn}>
                Zapisz zmiany
              </button>
            </form>
          )}

          {activeTab === "applications" && (
            <div className={styles.tableContainer}>
              <h2>Moje kandydatury</h2>
              {applications.length === 0 ? (
                <p>Nie masz jeszcze żadnych aplikacji.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Stanowisko</th>
                      <th>Firma</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.job_title}</td>
                        <td>{app.company_name}</td>
                        <td>{app.status}</td>
                        <td>{new Date(app.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className={styles.favorites}>
              <h2>Ulubione oferty</h2>
              {favorites.length === 0 ? (
                <p>Brak zapisanych ofert.</p>
              ) : (
                favorites.map((offer) => (
                  <div key={offer.id} className={styles.offerCard}>
                    <img src={offer.img} alt={offer.title} />
                    <div>
                      <h4>{offer.title}</h4>
                      <p>{offer.company_name}</p>
                      <span>{offer.locations}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateSettings;
