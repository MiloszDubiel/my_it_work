import React, { useState, useEffect, useRef } from "react";
import styles from "./CandidateSettings.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import ConfirmModal from "../PromptModals/ConfirmModal";
import OfferInfo from "../OffertComponent/OfferInfo";
import CandidateInfo from "../CandidateComponent/CandidateInfo";

const CandidateSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));
  const [info, setInfo] = useState("");
  const [error, setErorr] = useState("");
  const [applications, setApplications] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [ProfielData, setProfielData] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
    repo: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [candidateProfile, setCandidateProfile] = useState({
    description: "",
    location: "",
    phone_number: "",
    current_position: "",
    desired_position: "",
    career_level: "Junior",
    years_of_experience: "",
    skills: [],
    languages: [],
    education: [],
    cv_link: "",
    portfolio_link: "",
    linkedin: "",
    github: "",
    availability: "",
    remote_preference: "Remote",
  });
  const [cvFile, setCvFile] = useState(null);
  const [isCreated, setIsCreate] = useState(false);
  const [cvPreviewUrl, setCvPreviewUrl] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState(null);
  const referenceInputRef = useRef();
  const cvInputRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(ProfielData.avatar);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateProfile({ ...candidateProfile, [name]: value });
  };

  useEffect(() => {
    axios
      .post("http://localhost:5000/user/has-candiate-profile", {
        id: userData.id,
      })
      .then((res) => {
        return res.data.info?.length > 0 ? setIsCreate(true) : "";
      });
    axios
      .post("http://localhost:5000/user/get-candiate-info", {
        id: userData.id,
      })
      .then((res) => {
        if (res.data.candiate) {
          setCandidateProfile({
            ...candidateProfile,
            description: res.data.candiate[0]?.description,
            career_level: res.data.candiate[0]?.exp,
            languages: JSON.parse(res.data.candiate[0]?.lang),
            education: JSON.parse(res.data.candiate[0]?.edu),
            location: res.data.candiate[0]?.locations,
            desired_position: res.data.candiate[0]?.target_job,
            current_position: res.data.candiate[0]?.present_job,
            phone_number: res.data.candiate[0].phone_number,
            availability: res.data.candiate[0].access,
            remote_preference: res.data.candiate[0].working_mode,
            skills: JSON.parse(res.data.candiate[0]?.skills),
            github: res.data.candiate[0].link_git,
          });
          setCvPreviewUrl(res.data.candiate[0].cv);
          setReferencePreviewUrl(res.data.candiate[0]?.references);
        }
      });

    getMyApplayings();
  }, []);
  useEffect(() => {
    window.addEventListener("setIsFavorite", () => {
      axios
        .get(`http://localhost:5000/user/favorites/${userData.id}}`)
        .then((res) => {
          setFavorites(res.data);
        });
    });
  });
  useEffect(() => {
    window.addEventListener("applied", () => {
      getMyApplayings();
    });
  });

  const getMyApplayings = async () => {
    const res = await axios.post(
      `http://localhost:5000/user/get-user-applications`,
      {
        user_id: userData.id,
      }
    );

    if (res.status == 200) {
      setApplications(res.data);
    }
  };

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    setInfo("");
    setErorr("");

    if (!ProfielData.name?.trim()) {
      return setErorr("Imię jest wymagane.");
    }

    if (!ProfielData.surname?.trim()) {
      return setErorr("Nazwisko jest wymagane.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!ProfielData.email?.trim()) {
      return setErorr("Email jest wymagany.");
    } else if (!emailRegex.test(ProfielData.email)) {
      return setErorr("Podaj poprawny email.");
    }
    if (ProfielData.newPassword) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/;
      if (!passwordRegex.test(ProfielData.newPassword)) {
        return setErorr(
          "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny."
        );
      }

      if (ProfielData.newPassword !== ProfielData.repeatPassword) {
        return setErorr("Hasła są różne.");
      }
    }

    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("name", ProfielData.name);
    formData.append("surname", ProfielData.surname);
    formData.append("email", ProfielData.email);
    formData.append("newPassword", ProfielData.newPassword);
    formData.append("repeatPassword", ProfielData.repeatPassword);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      let res = await axios.post(
        "http://localhost:5000/user/edit-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        setInfo("Profil zaktualizowany");
        sessionStorage.setItem("user-data", JSON.stringify(res.data.userData));
        document.querySelector(`.${styles.content}`).scroll(0, 0);

        //fetchUserData();
      }

      // if (res.data.error) {
      //   document.querySelector(`.${styles.content}`).scroll(0, 0);
      //   setErorr(res.data.error);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSavecandidateProfile = async (e) => {
    e.preventDefault();

    setInfo("");
    setErorr("");
    if (!candidateProfile.location.trim()) {
      setErorr("Lokalizacja nie może być pusta.");
      return;
    }
    if (!candidateProfile.description.trim()) {
      setErorr("Opis nie może byc pusty.");
      return;
    }
    if (!candidateProfile.current_position.trim()) {
      setErorr("Aktualne stanowisko nie może być puste.");
    }
    if (!candidateProfile.desired_position.trim()) {
      setErorr("Stanowisko docelowe nie może być puste.");
      return;
    }
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(candidateProfile.phone_number)) {
      setErorr("Numer telefonu musi składać się z 9 cyfr.");
      return;
    }

    const formData = new FormData();
    formData.append("description", candidateProfile.description);
    formData.append("locations", candidateProfile.location || "");
    formData.append("skills", JSON.stringify(candidateProfile.skills || []));
    formData.append("lang", JSON.stringify(candidateProfile.languages || []));
    formData.append("edu", JSON.stringify(candidateProfile.education || []));
    formData.append("link_git", candidateProfile.github || "");
    formData.append("working_mode", candidateProfile.remote_preference || "");
    formData.append("present_job", candidateProfile.current_position || "");
    formData.append("target_job", candidateProfile.desired_position || "");
    formData.append("phone_number", candidateProfile.phone_number || "");
    formData.append("user_id", userData.id);
    formData.append("exp", candidateProfile.career_level);
    formData.append("access", candidateProfile.availability);
    formData.append("career_level", candidateProfile.career_level);

    if (referenceFile) formData.append("references", referenceFile);
    if (cvFile) formData.append("cv", cvFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/user/set-candidate-info",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      e.target.parentElement.scrollTo(0, 0);

      setInfo("Profil kandydata zapisany pomyślnie!");
    } catch (err) {
      console.error(err);
      e.target.parentElement.scrollTo(0, 0);
      setErorr("Bład podczas zapisywania!");
    }
  };

  const cancelApplication = async () => {
    setInfo("");
    if (!selectedApp) return;

    const res = await axios.delete(
      `http://localhost:5000/user/cancel-application/${selectedApp}`
    );

    if (res.status == 200) {
      setInfo("Usunięto aplikacje");
      window.dispatchEvent(new Event("deleted-application"));
      getMyApplayings();
    }

    setShowCancelModal(false);
  };

  const addSkillWithLevel = (e) => {
    const name = e.target.value;
    if (!name || name === "Inna..." || name === "Inny") return;

    setCandidateProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name, level: "Brak" }],
    }));
  };

  const addLanguageWithLevel = (e) => {
    const name = e.target.value;
    if (!name) return;

    setCandidateProfile((prev) => ({
      ...prev,
      languages: [...prev.languages, { name, level: "Brak" }],
    }));
  };

  const updateLevel = (index, type, level) => {
    setCandidateProfile((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, level } : item
      ),
    }));

    const deleteItem = (index, type) => {
      setCandidateProfile((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    };
  };

  const addEducation = (e) => {
    const name = e.target.previousSibling.value;

    if (!name.trim()) return;

    setCandidateProfile((prev) => ({
      ...prev,
      education: [...prev.education, { name, level: "Brak" }],
    }));

    e.target.previousSibling.value = "";
  };

  const updateEducationLevel = (index, level) => {
    setCandidateProfile((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, level } : item
      ),
    }));
  };
  const deleteEducation = (index) => {
    setCandidateProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const deleteItem = (index, type) => {
    setCandidateProfile((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container1} id="settings">
      {showCancelModal && (
        <ConfirmModal
          message="Czy na pewno chcesz anulować tę aplikację?"
          onConfirm={() => cancelApplication()}
          onCancel={() => setShowCancelModal(false)}
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
          <div className={styles.sidebar}>
            <button
              className={activeTab === "profile" ? styles.active : ""}
              onClick={() => {
                setInfo("");
                setErorr("");
                setActiveTab("profile");
              }}
            >
              Ustawienia konta
            </button>
            <button
              className={activeTab === "candidate-profile" ? styles.active : ""}
              onClick={() => {
                setInfo("");
                setErorr("");
                setActiveTab("candidate-profile");
              }}
            >
              Moje profil kandydata
            </button>
            <button
              className={activeTab === "applications" ? styles.active : ""}
              onClick={() => {
                setInfo("");
                setErorr("");
                setActiveTab("applications");
              }}
            >
              Złożone aplikacje
            </button>
            <button
              className={activeTab === "favorites" ? styles.active : ""}
              onClick={() => {
                setInfo("");
                setErorr("");
                setActiveTab("favorites");
              }}
            >
              Ulubione oferty
            </button>
          </div>

          <div className={styles.content}>
            <p className={styles.error}>{error}</p>
            <p className={styles.info}>{info}</p>
            {activeTab === "profile" && (
              <form onSubmit={handleSubmitUserInfo} className={styles.form}>
                <h2>Ustawienia konta</h2>
                <label>Imię</label>
                <input
                  type="text"
                  placeholder="Jan"
                  value={ProfielData.name}
                  onChange={(e) =>
                    setProfielData({ ...ProfielData, name: e.target.value })
                  }
                />

                <label>Nazwisko</label>
                <input
                  type="text"
                  placeholder="Kowalski"
                  value={ProfielData.surname}
                  onChange={(e) =>
                    setProfielData({
                      ...ProfielData,
                      surname: e.target.value,
                    })
                  }
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="jan@firma.pl"
                  value={ProfielData.email}
                  onChange={(e) =>
                    setProfielData({
                      ...ProfielData,
                      email: e.target.value,
                    })
                  }
                />

                <label>Nowe hasło</label>
                <input
                  type="password"
                  placeholder="********"
                  value={ProfielData.newPassword}
                  onChange={(e) =>
                    setProfielData({
                      ...ProfielData,
                      newPassword: e.target.value,
                    })
                  }
                />

                <label>Powtórz hasło</label>
                <input
                  type="password"
                  placeholder="********"
                  value={ProfielData.repeatPassword}
                  onChange={(e) =>
                    setProfielData({
                      ...ProfielData,
                      repeatPassword: e.target.value,
                    })
                  }
                />

                <label>Zdjęcie profilowe</label>

                {avatarPreview ? (
                  <div className={styles.avatarPreview}>
                    <img src={avatarPreview} alt="avatar" />
                  </div>
                ) : (
                  <p>Brak zdjęcia profilowego</p>
                )}

                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatarFile(file);
                    if (file) {
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <button type="submit" className={styles.saveBtn}>
                  Zapisz zmiany
                </button>
              </form>
            )}

            {activeTab === "candidate-profile" && (
              <form
                className={styles.form}
                onSubmit={handleSavecandidateProfile}
              >
                <h2>Ustawienia profilu kandydata</h2>
                {!isCreated ? (
                  <>
                    <p>Brak profilu kandydata</p>
                    <button
                      className={styles.saveBtn}
                      onClick={() => {
                        setIsCreate(true);
                      }}
                    >
                      Utwórz profil
                    </button>
                  </>
                ) : (
                  <>
                    <label>Infofmacje o kandydacie</label>
                    <textarea
                      name="description"
                      value={candidateProfile.description}
                      onChange={handleChange}
                      placeholder="Powiedz coś o sobie"
                      required
                    />

                    <label>Lokalizacja</label>
                    <input
                      type="text"
                      name="location"
                      value={candidateProfile.location}
                      onChange={handleChange}
                      placeholder="np. Warszawa"
                      required
                    />

                    <label>Numer telefonu</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={candidateProfile.phone_number}
                      onChange={handleChange}
                      placeholder="123456789"
                      max={9}
                      pattern="[0-9]{9}"
                      required
                    />

                    <label>Aktualne stanowisko</label>
                    <input
                      type="text"
                      name="current_position"
                      value={candidateProfile.current_position}
                      onChange={handleChange}
                      placeholder="Frontend Developer"
                    />
                    <label>Stanowisko docelowe</label>
                    <input
                      type="text"
                      name="desired_position"
                      value={candidateProfile.desired_position}
                      onChange={handleChange}
                      placeholder="Senior Frontend Developer"
                    />

                    <label>Poziom doświadczenia</label>
                    <select
                      name="career_level"
                      value={candidateProfile.career_level}
                      onChange={handleChange}
                    >
                      <option>Intern</option>
                      <option>Junior</option>
                      <option>Mid / Regular</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>

                    <label>Lata doświadczenia</label>
                    <select
                      name="career_level"
                      value={candidateProfile.career_level}
                      onChange={handleChange}
                    >
                      <option>Brak doświadczenia</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>

                    <label>Umiejętności</label>

                    <div className={styles.skill}>
                      <select onChange={addSkillWithLevel}>
                        <option value="" disabled selected>
                          Wybierz...
                        </option>

                        <option>HTML</option>
                        <option>CSS</option>
                        <option>JavaScript</option>
                        <option>TypeScript</option>
                        <option>React.js</option>
                        <option>Next.js</option>
                        <option>Angular</option>
                        <option>Vue.js</option>
                        <option>Svelte</option>

                        <option>Node.js</option>
                        <option>Express.js</option>
                        <option>NestJS</option>
                        <option>Python</option>
                        <option>Django</option>
                        <option>Flask</option>
                        <option>FastAPI</option>
                        <option>Java</option>
                        <option>Spring Boot</option>
                        <option>C#</option>
                        <option>.NET</option>
                        <option>PHP</option>
                        <option>Laravel</option>
                        <option>Ruby on Rails</option>
                        <option>Go</option>
                        <option>Rust</option>

                        <option>MySQL</option>
                        <option>PostgreSQL</option>
                        <option>SQLite</option>
                        <option>MongoDB</option>
                        <option>Redis</option>
                        <option>Firebase</option>

                        <option>Docker</option>
                        <option>Kubernetes</option>
                        <option>Linux</option>
                        <option>Nginx</option>
                        <option>AWS</option>
                        <option>Azure</option>
                        <option>Google Cloud</option>
                        <option>Git</option>

                        <option>React Native</option>
                        <option>Flutter</option>
                        <option>Swift</option>
                        <option>Kotlin</option>

                        <option>GraphQL</option>
                        <option>Webpack</option>
                        <option>Vite</option>
                        <option>Three.js</option>
                      </select>
                    </div>

                    <div className={styles.skillsList}>
                      {candidateProfile.skills.map((item, index) => (
                        <div className={styles.skillItem} key={index}>
                          <span
                            onDoubleClick={() => deleteItem(index, "skills")}
                            style={{ cursor: "pointer" }}
                          >
                            {item.name}
                          </span>

                          <select
                            value={item.level}
                            onChange={(e) =>
                              updateLevel(index, "skills", e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Wybierz...
                            </option>
                            <option>Brak</option>
                            <option>Podstawowy</option>
                            <option>Średni</option>
                            <option>Zaawansowany</option>
                            <option>Ekspert</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    <label>Języki</label>

                    <div className={styles.skill}>
                      <select onChange={addLanguageWithLevel}>
                        <option value="" disabled selected>
                          Wybierz...
                        </option>
                        <option>Angielski</option>
                        <option>Niemiecki</option>
                        <option>Hiszpański</option>
                      </select>
                    </div>

                    <div className={styles.skillsList}>
                      {candidateProfile.languages.map((item, index) => (
                        <div className={styles.skillItem} key={index}>
                          <span
                            onDoubleClick={() => deleteItem(index, "languages")}
                            style={{ cursor: "pointer" }}
                          >
                            {item.name}
                          </span>

                          <select
                            value={item.level}
                            onChange={(e) =>
                              updateLevel(index, "languages", e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Wybierz...
                            </option>
                            <option>Brak</option>
                            <option>A1</option>
                            <option>A2</option>
                            <option>B1</option>
                            <option>B2</option>
                            <option>C1</option>
                            <option>C2</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    <label>Edukacja</label>

                    <div className={styles.skill}>
                      <div className={styles.skillsList}>
                        {candidateProfile.education.map((item, index) => (
                          <div key={index} className={styles.skillItem}>
                            <span
                              style={{ cursor: "pointer" }}
                              onDoubleClick={() => deleteEducation(index)}
                            >
                              {item.name}
                            </span>

                            <select
                              value={item.level}
                              onChange={(e) =>
                                updateEducationLevel(index, e.target.value)
                              }
                            >
                              <option>Brak</option>
                              <option>Podstawowe</option>
                              <option>Średnie</option>
                              <option>Licencjat</option>
                              <option>Inżynier</option>
                              <option>Magister</option>
                              <option>Doktor</option>
                            </select>
                          </div>
                        ))}
                      </div>

                      <input type="text" placeholder="Szkoła..." />

                      <button
                        type="button"
                        onClick={addEducation}
                        className={styles.saveBtn}
                      >
                        Dodaj
                      </button>
                    </div>

                    <label>CV</label>
                    <div className={styles.fileInputWrapper}>
                      <input
                        type="file"
                        ref={cvInputRef}
                        accept=".pdf"
                        onChange={(e) => setCvFile(e.target.files[0])}
                      />
                      {cvPreviewUrl && (
                        <a
                          href={cvPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          Zobacz aktualne CV
                        </a>
                      )}
                    </div>

                    <label>Referencje</label>
                    <div className={styles.fileInputWrapper}>
                      <input
                        type="file"
                        ref={referenceInputRef}
                        accept=".pdf"
                        onChange={(e) => setReferenceFile(e.target.files[0])}
                      />
                      {referencePreviewUrl && (
                        <a
                          href={referencePreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          Zobacz aktualne referencje
                        </a>
                      )}
                    </div>

                    <label>GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={candidateProfile.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />

                    <label>Dostępność</label>
                    <select
                      name="availability"
                      value={candidateProfile.availability}
                      onChange={handleChange}
                    >
                      <option>Od zaraz</option>
                      <option>Za tydzień</option>
                      <option>W przyszłym miesiącu</option>
                    </select>

                    <label>Tryb pracy</label>
                    <select
                      name="remote_preference"
                      value={candidateProfile.remote_preference}
                      onChange={handleChange}
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>

                    <button type="submit" className={styles.saveBtn}>
                      Zapisz zmiany
                    </button>
                  </>
                )}
              </form>
            )}

            {activeTab === "applications" && (
              <div className={styles.tableContainer}>
                <h2>Złożone aplikacje</h2>

                {applications.length > 0 && (
                  <button
                    className={styles.clearHistoryBtn}
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Czy na pewno chcesz wyczyścić całą historię aplikacji?"
                        )
                      ) {
                        try {
                          // Wywołanie endpointu API do usunięcia wszystkich aplikacji
                          await axios.delete(
                            `http://localhost:5000/api/applications/clear-history/${userData.id}`
                          );
                          // Lokalnie czyścimy listę
                          setApplications([]);
                        } catch (err) {
                          console.error(err);
                          alert("Wystąpił błąd przy czyszczeniu historii.");
                        }
                      }
                    }}
                  >
                    Czyść historię
                  </button>
                )}

                {applications.length === 0 ? (
                  <p>Nie masz jeszcze żadnych aplikacji.</p>
                ) : (
                  <table className={styles.appTable}>
                    <thead>
                      <tr>
                        <th>Stanowisko</th>
                        <th>Firma</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Akcja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.title}</td>
                          <td>{app.companyName}</td>
                          <td className={styles[`status_${app.status}`]}>
                            {app.status}
                          </td>
                          <td>
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {app.status !== "anulowana" &&
                            app.status !== "odrzucono" ? (
                              <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                  setSelectedApp(app.id);
                                  setShowCancelModal(true);
                                }}
                              >
                                Anuluj
                              </button>
                            ) : (
                              ""
                            )}
                          </td>
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
                    <>
                      <OfferInfo
                        offer={offer}
                        id={offer.id}
                        is_favorite={true}
                      />
                      <div
                        key={offer.id}
                        className={styles.offerCard}
                        onClick={() => {
                          document.querySelector(
                            `.favorite${offer.id}`
                          ).style.display = "flex";
                        }}
                      >
                        <img src={offer.img} alt={offer.title} />
                        <div>
                          <h4>{offer.title}</h4>
                          <p>{offer.company_name}</p>
                          <span>{offer.locations}</span>
                        </div>
                      </div>
                    </>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSettings;
