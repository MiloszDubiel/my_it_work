import { useState, useEffect } from "react";
import styles from "./EmployerSettings.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import AddJobOffer from "../AddOffert/AddJobOffert";
import UpdateJobOffer from "../AddOffert/UpdateJobOffer";
import CandidateInfo from "../Candidate/CandidateInfo";
import ConfirmModal from "../PromptModals/ConfirmModal";

const EmployerSettings = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [userData] = useState(
    JSON.parse(sessionStorage.getItem("user-data")) ||
      JSON.parse(localStorage.getItem("user-data")),
  );
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [company, setCompany] = useState({});
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState([]);
  const [dataToChange, setDataToChange] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
  });
  const [applications, setApplications] = useState([]);
  const [showDeleteOfferModal, setShowDeleteOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    axios
      .post(
        `http://localhost:5000/api/employers/get-company-info`,
        {
          id: userData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setCompany(res.data.companyInfo[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchOffers = () => {
    axios
      .post(
        "http://localhost:5000/api/employers/get-my-offers",
        {
          owner_id: userData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => setOffers(res.data.offers))
      .catch((err) => console.error(err));
  };

  const fetchApplications = async () => {
    axios
      .post(
        "http://localhost:5000/api/employers/get-my-applications",
        {
          employer_id: userData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
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
  }, []);
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

    const formData = new FormData();

    formData.append("owner_id", userData.id);
    formData.append("company_id", company.id);
    formData.append("description", company.description || "");
    formData.append("link", company.link || "");
    formData.append("phone_number", company.phone_number || "");
    formData.append("email", company.email);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    let res = await axios.post(
      "http://localhost:5000/api/employers/set-company-info",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      },
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
          "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny.",
        );
      }

      if (dataToChange.newPassword !== dataToChange.repeatPassword) {
        return setError("Hasła są różne.");
      }
    }

    try {
      let res = await axios.post(
        "http://localhost:5000/user/edit-profile",
        {
          ...dataToChange,
          id: userData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.info) {
        setInfo(res.data.info + "" + ". Trwa odświeżanie strony...");
        sessionStorage.setItem("user-data", JSON.stringify(res.data.userData));
        localStorage.setItem("user-data", JSON.stringify(res.data.userData));
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
      console.error(err);
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
      setError("Nip musi mieć 10 znaków i to muszą być cyfry.");
      return false;
    }

    try {
      let res = await axios.post(
        "http://localhost:5000/api/employers/request-company-change",
        {
          owner_id: userData.id,
          companyName: company.companyName,
          nip: company.nip,
          company_id: company.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status == 200) {
        return setInfo("Wysłano prośbę do administratora");
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const cancelApplication = async () => {
    setInfo("");
    if (!selectedApp.length) return;

    const res = await axios.put(
      `http://localhost:5000/api/employers/revoke-application/${selectedApp[0]}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      },
    );

    if (res.status == 200) {
      setInfo("Odrzucono aplikacje");
      fetchApplications();
    }

    try {
      const user = userData;

      const res = await axios.post("http://localhost:5001/chat/create", {
        employer_id: user.id,
        candidate_id: selectedApp[1],
      });

      const conversationId = res.data.id;

      document.querySelector("#chatContainer").style.display = "flex";

      document.querySelector("#root").style.overflow = "hidden";
      window.dispatchEvent(
        new CustomEvent("openConversation", {
          detail: {
            conversationId,
            message: "Witam, niestety Twoja aplikacja została odrzucona.",
          },
        }),
      );
    } catch (err) {
      console.error("Błąd uruchamiania wiadomości:", err);
    }

    setShowCancelModal(false);
  };
  const acceptApplication = async () => {
    setInfo("");
    if (!selectedApp.length) return;

    const res = await axios.put(
      `http://localhost:5000/api/employers/accept-application/${selectedApp[0]}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      },
    );

    if (res.status == 200) {
      setInfo("Przyjęto aplikacje");
      fetchApplications();
    }

    try {
      const user = userData;

      const res = await axios.post("http://localhost:5001/chat/create", {
        employer_id: user.id,
        candidate_id: selectedApp[1],
      });

      const conversationId = res.data.id;

      document.querySelector("#chatContainer").style.display = "flex";

      document.querySelector("#root").style.overflow = "hidden";
      window.dispatchEvent(
        new CustomEvent("openConversation", {
          detail: {
            conversationId,
            message:
              "Witam, jestem zainteresowany Twoją aplikacją. Proszę o kontakt.",
          },
        }),
      );
    } catch (err) {
      console.error("Błąd uruchamiania wiadomości:", err);
    }

    setShowAcceptModal(false);
  };

  const deleteOffer = async () => {
    if (!selectedOffer) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/job-offerts/delete/${selectedOffer}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        setInfo("Oferta pracy została usunięta");
        fetchOffers();
      }
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd podczas usuwania oferty");
    }

    setShowDeleteOfferModal(false);
  };
  return (
    <div className={styles.container1} id="settings">
      {showCancelModal && (
        <ConfirmModal
          message="Czy na pewno chcesz odrzucić tę aplikację?"
          onConfirm={() => cancelApplication()}
          onCancel={() => setShowCancelModal(false)}
        />
      )}

      {showAcceptModal && (
        <ConfirmModal
          message="Czy na pewno chcesz zaakceptować i wysłać odpowiedź na tę aplikację?"
          onConfirm={() => acceptApplication()}
          onCancel={() => setShowAcceptModal(false)}
        />
      )}
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
              onClick={() => {
                setActiveTab("company");
                setError("");
                setInfo("");
              }}
            >
              Informacje o firmie
            </button>
            <button
              className={activeTab === "offers" ? styles.active : ""}
              onClick={() => {
                setActiveTab("offers");
                setError("");
                setInfo("");
              }}
            >
              Oferty pracy
            </button>
            <button
              className={activeTab === "applications" ? styles.active : ""}
              onClick={() => {
                setActiveTab("applications");
                setError("");
                setInfo("");
              }}
            >
              Aplikacje na moje oferty pracy
            </button>
            <button
              className={activeTab === "settings" ? styles.active : ""}
              onClick={() => {
                setActiveTab("settings");
                setError("");
                setInfo("");
              }}
            >
              Ustawienia konta
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
                    maxLength={10}
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
                  <label>Logo firmy</label>

                  <div className={styles.logoPreview}>
                    <img
                      src={logoPreviewUrl || company?.img}
                      alt="Logo firmy"
                      className={styles.logo}
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
                              className={styles.acceptBtn}
                              onClick={() => {
                                document.querySelector(
                                  `.update-job-offer${offer.id}`,
                                ).style.display = "flex";
                              }}
                            >
                              Edytuj
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => {
                                setSelectedOffer(offer.id);
                                setShowDeleteOfferModal(true);
                              }}
                            >
                              Usuń
                            </button>
                          </span>
                        </div>
                        {showDeleteOfferModal && (
                          <ConfirmModal
                            message="Czy na pewno chcesz usunąć tę ofertę pracy?"
                            onConfirm={deleteOffer}
                            onCancel={() => setShowDeleteOfferModal(false)}
                          />
                        )}
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
                    <span>Stanowisko </span>
                    <span>Data aplikacji </span>
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
                          <CandidateInfo candidate={app} />

                          {app.cv && (
                            <button
                              onClick={() => window.open(app.cv, "_blank")}
                              className={styles.smallBtn}
                            >
                              CV
                            </button>
                          )}

                          <button
                            className={styles.smallBtnOutline}
                            onClick={() => {
                              document.querySelector(
                                `.candidate-details-container${app.user_id}`,
                              ).style.display = "flex";
                              document.querySelector("#root").style.overflow =
                                "hidden";
                            }}
                          >
                            Profil
                          </button>

                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              setSelectedApp([app.app_id, app.user_id]);
                              setShowCancelModal(true);
                            }}
                          >
                            Odrzuć
                          </button>

                          <button
                            className={styles.acceptBtn}
                            onClick={() => {
                              setSelectedApp([app.app_id, app.user_id]);
                              setShowAcceptModal(true);
                            }}
                          >
                            Akceptuj
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
