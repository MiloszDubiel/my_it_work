import { useState, useEffect } from "react";
import styles from "./EmployerSettings.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import AddJobOffer from "../AddOffert/AddJobOffert";
const EmployerSettings = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [userData, ] = useState(
    JSON.parse(sessionStorage.getItem("user-data"))
  );
  const [company, setCompany] = useState({});
  const [info, setInfo] = useState("");
  const [error, setErorr] = useState("");
  const [dataToChange, setDataToChange] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
  });

  useEffect(() => {
    axios
      .post(`http://localhost:5000/api/employers/get-company-info`, {
        id: userData.id,
      })
      .then((res) => setCompany(res.data.companyInfo[0]))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    window.addEventListener("setting-changed", () => {
      setActiveTab(sessionStorage.getItem("tab"));
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector(`.${styles.content}`).scroll(0, 0);

    setErorr("");
    setInfo("");

    if (!company.companyName?.trim()) {
      return setErorr("Nazwa firmy jest wymagana.");
    }

    if (!company.description?.trim()) {
      return setErorr("Opis firmy jest wymagany.");
    }

    const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/[^\s]*)?$/i;
    if (company.link && !urlRegex.test(company.link)) {
      return setErorr("Podaj poprawny adres URL (np. https://firma.pl).");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!company.email?.trim()) {
      return setErorr("Email kontaktowy jest wymagany.");
    } else if (!emailRegex.test(company.email)) {
      return setErorr("Podaj poprawny adres email.");
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!company?.phone_number) {
      return setErorr("Numer telefonu jest wymagany.");
    } else if (!phoneRegex.test(company.phone_number)) {
      return setErorr("Telefon musi zawierać dokładnie 9 cyfr.");
    }

    try {
      let res = await axios.post(
        "http://localhost:5000/api/employers/set-company-info",
        {
          company: { ...company, owner_id: userData.id },
        }
      );
      setInfo(res.data.info);
    } catch (err) {
      setErorr(err);
    }
  };

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    setInfo("");
    setErorr("");

    if (!dataToChange.name?.trim()) {
      return setErorr("Imię jest wymagane.");
    }

    if (!dataToChange.surname?.trim()) {
      return setErorr("Nazwisko jest wymagane.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dataToChange.email?.trim()) {
      return setErorr("Email jest wymagany.");
    } else if (!emailRegex.test(dataToChange.email)) {
      return setErorr("Podaj poprawny email.");
    }
    if (dataToChange.newPassword) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/;
      if (!passwordRegex.test(dataToChange.newPassword)) {
        return setErorr(
          "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny."
        );
      }

      if (dataToChange.newPassword !== dataToChange.repeatPassword) {
        return setErorr("Hasła są różne.");
      }
    }

    try {
      let res = await axios.post("http://localhost:5000/user/edit-profile", {
        ...dataToChange,
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

  return (
    <div className={styles.container1} id="settings">
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2 style={{ color: "black" }}>Panel pracodawcy</h2>
          <ul>
            <li
              className={activeTab === "company" ? styles.active : ""}
              onClick={() => setActiveTab("company")}
            >
              🏢 Informacje o firmie
            </li>
            <li
              className={activeTab === "offers" ? styles.active : ""}
              onClick={() => setActiveTab("offers")}
            >
              💼 Oferty pracy
            </li>
            <li
              className={activeTab === "settings" ? styles.active : ""}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Ustawienia konta
            </li>
          </ul>
        </aside>

        <main className={styles.content}>
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
          <p className={styles.error}>{error}</p>
          <p className={styles.info}>{info}</p>
          {activeTab === "company" && (
            <section className={styles.section}>
              <h3>Informacje o firmie</h3>
              <p>{info}</p>
              <form onSubmit={handleSubmit}>
                <label>Nazwa firmy</label>
                <input
                  type="text"
                  placeholder="Wprowadź nazwę firmy"
                  value={company?.companyName}
                  onChange={(e) =>
                    setCompany({ ...company, companyName: e.target.value })
                  }
                />

                <label>Opis</label>
                <textarea
                  placeholder="Opisz swoją firmę..."
                  value={company?.description}
                  onChange={(e) =>
                    setCompany({ ...company, description: e.target.value })
                  }
                />

                <label>Strona internetowa</label>
                <input
                  type="url"
                  placeholder="https://twojafirma.pl"
                  value={company?.link}
                  onChange={(e) =>
                    setCompany({ ...company, link: e.target.value })
                  }
                />

                <label>Email kontaktowy</label>
                <input
                  type="email"
                  placeholder="kontakt@firma.pl"
                  value={company?.email}
                  onChange={(e) =>
                    setCompany({ ...company, email: e.target.value })
                  }
                />

                <label>Numer telefonu</label>
                <input
                  type="tel"
                  placeholder="123456789"
                  value={company?.phone_number}
                  maxLength={9}
                  onChange={(e) =>
                    setCompany({ ...company, phone_number: e.target.value })
                  }
                />

                <label>Logo firmy</label>
                <input type="file" accept="image/*" />

                <button type="submit" className={styles.saveBtn}>
                  Zapisz
                </button>
              </form>
            </section>
          )}
          {activeTab === "offers" && (
            <section className={styles.section}>
              <AddJobOffer />
              <h3>Oferty pracy</h3>
              <p>Tutaj możesz zarządzać swoimi ofertami pracy.</p>
              <button
                className={styles.addBtn}
                onClick={() => {
                  document.querySelector("#add-job-offer").style.display = "flex";
                }}
              >
                ➕ Dodaj nową ofertę
              </button>

              <div className={styles.table}>
                <div className={styles.rowHeader}>
                  <span>Nazwa stanowiska</span>
                  <span>Status</span>
                  <span>Data dodania</span>
                  <span>Akcje</span>
                </div>
                <div className={styles.row}>






                  
                  <span>Frontend Developer</span>
                  <span>Aktywna</span>
                  <span>12.10.2025</span>
                  <span className={styles.actions}>
                    <button>✏️</button>
                    <button>🗑️</button>
                  </span>
                </div>
              </div>
            </section>
          )}
          {activeTab === "settings" && (
            <section className={styles.section}>
              <h3>Ustawienia konta</h3>
              <form onSubmit={handleSubmitUserInfo}>
                <label>Imię</label>
                <input
                  type="text"
                  placeholder="Jan"
                  value={dataToChange.name}
                  onChange={(e) =>
                    setDataToChange({ ...dataToChange, name: e.target.value })
                  }
                />

                <label>Nazwisko</label>
                <input
                  type="text"
                  placeholder="Kowalski"
                  value={dataToChange.surname}
                  onChange={(e) =>
                    setDataToChange({
                      ...dataToChange,
                      surname: e.target.value,
                    })
                  }
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="jan@firma.pl"
                  value={dataToChange.email}
                  onChange={(e) =>
                    setDataToChange({
                      ...dataToChange,
                      email: e.target.value,
                    })
                  }
                />

                <label>Nowe hasło</label>
                <input
                  type="password"
                  placeholder="********"
                  value={dataToChange.newPassword}
                  onChange={(e) =>
                    setDataToChange({
                      ...dataToChange,
                      newPassword: e.target.value,
                    })
                  }
                />

                <label>Powtórz hasło</label>
                <input
                  type="password"
                  placeholder="********"
                  value={dataToChange.repeatPassword}
                  onChange={(e) =>
                    setDataToChange({
                      ...dataToChange,
                      repeatPassword: e.target.value,
                    })
                  }
                />

                <button type="submit" className={styles.saveBtn}>
                  Zapisz zmiany
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployerSettings;
