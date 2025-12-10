import { useState, useEffect } from "react";
import styles from "./EmployerSettings.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import AddJobOffer from "../AddOffert/AddJobOffert";
import UpdateJobOffer from "../AddOffert/UpdateJobOffer";
import CandidateInfo from "../CandidateComponent/CandidateInfo";

const EmployerSettings = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [company, setCompany] = useState({});
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [candidate, setCandidate] = useState([]);
  const [dataToChange, setDataToChange] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
  });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .post(`http://localhost:5000/api/employers/get-company-info`, {
        id: userData.id,
      })
      .then((res) => {
        setCompany(res.data.companyInfo[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchOffers = () => {
    axios
      .post("http://localhost:5000/api/employers/get-my-offers", {
        owner_id: userData.id,
      })
      .then((res) => setOffers(res.data.offers))
      .catch((err) => console.error(err));
  };

  const fetchApplications = async () => {
    axios
      .post("http://localhost:5000/api/employers/get-my-applications", {
        employer_id: userData.id,
      })
      .then((res) => {
        console.log();
        setApplications(res.data.applications);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "offers") {
      fetchOffers();
    }
    if (activeTab === "applications") fetchApplications();
  }, [activeTab, refresh]);

  useEffect(() => {
    window.addEventListener("updated-offer", () => {
      setRefresh(!refresh);
    });
  });

  const handleOfferAdded = () => {
    fetchOffers();
  };
  useEffect(() => {
    window.addEventListener("setting-changed", () => {
      setActiveTab(sessionStorage.getItem("tab"));
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector(`.${styles.content}`).scroll(0, 0);

    setError("");
    setInfo("");

    if (!company.description?.trim()) {
      return setError("Opis firmy jest wymagany.");
    }

    const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/[^\s]*)?$/i;
    if (company.link && !urlRegex.test(company.link)) {
      return setError("Podaj poprawny adres URL (np. https://firma.pl).");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!company.email?.trim()) {
      return setError("Email kontaktowy jest wymagany.");
    } else if (!emailRegex.test(company.email)) {
      return setError("Podaj poprawny adres email.");
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!company?.phone_number) {
      return setError("Numer telefonu jest wymagany.");
    } else if (!phoneRegex.test(company.phone_number)) {
      return setError("Telefon musi zawierać dokładnie 9 cyfr.");
    }

    let res = await axios.post(
      "http://localhost:5000/api/employers/set-company-info",
      {
        owner_id: userData.id,
        description: company.description,
        link: company.link || "",
        email: company.email || "",
        phone_number: company.phone_number || "",
      }
    );

    if (res.status === 200) {
      setInfo("Zapisano. Trwa odświeżanie strony...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    setInfo("");
    setError("");

    if (!dataToChange.name?.trim()) {
      return setError("Imię jest wymagane.");
    }

    if (!dataToChange.surname?.trim()) {
      return setError("Nazwisko jest wymagane.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dataToChange.email?.trim()) {
      return setError("Email jest wymagany.");
    } else if (!emailRegex.test(dataToChange.email)) {
      return setError("Podaj poprawny email.");
    }
    if (dataToChange.newPassword) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/;
      if (!passwordRegex.test(dataToChange.newPassword)) {
        return setError(
          "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny."
        );
      }

      if (dataToChange.newPassword !== dataToChange.repeatPassword) {
        return setError("Hasła są różne.");
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
        setError(res.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();

    setInfo("");
    setError("");

    if (!company.companyName?.trim()) {
      return setError("Nazwa firmy jest wymagana.");
    }

    if (!/^\d{10}$/.test(company.nip)) {
      setError("Nip musi mieć 10 znaków.");
      return false;
    }

    const formData = new FormData();
    formData.append("owner_id", userData.id);
    formData.append("companyName", company.companyName);
    formData.append("nip", company.nip);
    formData.append("company_id", company.id);

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      let res = await axios.post(
        "http://localhost:5000/api/employers/request-company-change",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status == 200) {
        return setInfo("Wysłano prośbę do administratora");
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className={styles.container1} id="settings">
      {candidate}
      <div className={styles.container}>
        <div className={styles.actionsBar}>
          <button
            className={styles.closeBtn}
            onClick={() => {
              document.querySelector("#settings").style.display = "none";
              document.querySelector("#root").style.overflow = "auto";
            }}
          >
            <IoMdClose />
          </button>
        </div>

        <div className={styles.settingsBody}>
          <aside className={styles.sidebar}>
            <h2 style={{ color: "black" }}>Panel pracodawcy</h2>

            <button
              className={activeTab === "company" ? styles.active : ""}
              onClick={() => setActiveTab("company")}
            >
              🏢 Informacje o firmie
            </button>
            <button
              className={activeTab === "offers" ? styles.active : ""}
              onClick={() => setActiveTab("offers")}
            >
              💼 Oferty pracy
            </button>
            <button
              className={activeTab === "applications" ? styles.active : ""}
              onClick={() => setActiveTab("applications")}
            >
              Aplikacje na moje oferty pracy
            </button>
            <button
              className={activeTab === "settings" ? styles.active : ""}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Ustawienia konta
            </button>
          </aside>

          <div className={styles.content}>
            <p className={styles.error}>{error}</p>
            <p className={styles.info}>{info}</p>
            {activeTab === "company" && (
              <section className={styles.section}>
                <form onSubmit={handleSubmitDetails} className={styles.form}>
                  <h3>Podstawowe informacje o firmie</h3>
                  <label>Nazwa</label>
                  <input
                    type="text"
                    placeholder="Nazwa"
                    value={company?.companyName}
                    onChange={(e) =>
                      setCompany({ ...company, companyName: e.target.value })
                    }
                  />

                  <label>NIP</label>
                  <input
                    type="text"
                    placeholder="NIP"
                    value={company?.nip}
                    onChange={(e) =>
                      setCompany({ ...company, nip: e.target.value })
                    }
                  />

                  <label>Logo firmy</label>

                  <div className={styles.logoPreview}>
                    <img
                      src={
                        logoPreviewUrl ||
                        `http://localhost:5000/api/employers/get-company-logo/${userData.id}`
                      }
                      alt="Logo firmy"
                    />
                  </div>

                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      setLogoFile(e.target.files[0]);
                      setLogoPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    }}
                  />

                  <button type="submit" className={styles.saveBtn}>
                    Zapisz
                  </button>
                </form>
                <hr style={{ margin: "15px" }} />
                <h3>Dodatkowe informacje o firmie</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
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

                  <button type="submit" className={styles.saveBtn}>
                    Zapisz
                  </button>
                </form>
              </section>
            )}
            {activeTab === "offers" && (
              <section className={styles.section}>
                <AddJobOffer onOfferAdded={handleOfferAdded} />
                <h3>Tutaj możesz zarządzać swoimi ofertami pracy</h3>
                <button
                  className={styles.addBtn}
                  onClick={() => {
                    document.querySelector("#add-job-offer").style.display =
                      "flex";
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

                  {offers.length > 0 ? (
                    offers.map((offer) => (
                      <>
                        <UpdateJobOffer offer={offer} />
                        <div key={offer.id} className={styles.row}>
                          <span>{offer.title}</span>
                          <span>
                            {offer.is_active === 0
                              ? "W trakcie weryfikacje"
                              : "Aktywna"}
                          </span>
                          <span>
                            {new Date(offer.updated_at).toLocaleDateString()}
                          </span>
                          <span className={styles.actions}>
                            <button
                              onClick={() => {
                                document.querySelector(
                                  `.update-job-offer${offer.id}`
                                ).style.display = "flex";
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    `Czy napewno chcesz usunąc oferte ${offer.title} `
                                  )
                                ) {
                                  let res = await axios.delete(
                                    `http://localhost:5000/api/job-offerts/delete/${offer.id}`
                                  );
                                  console.log(res);
                                  if (res.data.success) {
                                    setRefresh(!refresh);
                                  }
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </span>
                        </div>
                      </>
                    ))
                  ) : (
                    <div className={styles.row}>
                      <span colSpan={4}>Brak ofert pracy</span>
                    </div>
                  )}
                </div>
              </section>
            )}
            {activeTab === "applications" && (
              <section className={styles.section}>
                <h3>Aplikacje na moje oferty pracy</h3>

                <div className={styles.appTable}>
                  <div className={styles.appHeader}>
                    <span>Kandydat</span>
                    <span>Stanowisko</span>
                    <span>Data aplikacji</span>
                    <span>Akcje</span>
                  </div>

                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className={styles.appRow}>
                        <span className={styles.userInfo}>
                          <img src={app.avatar} alt="avatar" />
                          {app.name} {app.surname}
                        </span>

                        <span>{app.title}</span>
                        <span>
                          {new Date(app.created_at).toLocaleDateString("pl-PL")}
                        </span>

                        <span className={styles.appActions}>
                          <button
                            onClick={() => window.open(app.cv, "_blank")}
                            className={styles.smallBtn}
                          >
                            📄 CV
                          </button>

                          <button
                            className={styles.smallBtnOutline}
                            onClick={() => {
                              setCandidate(<CandidateInfo candidate={app} />);
                              setTimeout(() => {
                                document.querySelector(
                                  `.candidate-details-container${app.user_id}`
                                ).style.display = "flex";
                                document.querySelector("#root").style.overflow =
                                  "hidden";
                              }, 50);
                            }}
                          >
                            👤 Profil
                          </button>

                          <button
                            className={styles.deleteBtn}
                            onClick={async () => {
                              if (window.confirm("Usunąć tę aplikację?")) {
                                let res = await axios.delete(
                                  `http://localhost:5000/api/employers/delete-application/${app.id}`
                                );
                                if (res.data.success) setRefresh(!refresh);
                              }
                            }}
                          >
                            🗑
                          </button>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noApps}>Brak aplikacji</div>
                  )}
                </div>
              </section>
            )}
            {activeTab === "settings" && (
              <section className={styles.section}>
                <h3>Ustawienia konta</h3>
                <form onSubmit={handleSubmitUserInfo} className={styles.form}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSettings;
