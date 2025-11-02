import React, { useState, useEffect, useRef } from "react";
import styles from "./CandidateSettings.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
const CandidateSettings = ({ user, favorites = [], applications = [] }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));
  const [profile, setProfile] = useState([]);
  const [info, setInfo] = useState("");
  const [error, setErorr] = useState("");

  const [DataToChange, setDataToChange] = useState({
    ...userData,
    newPassword: "",
    repeatPassword: "",
    coverLetter: "",
    cv: null,
    avatar: null,
    repo: "",
  });

  const [candidateProfile, setCandidateProfile] = useState({
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
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [message, setMessage] = useState("");

  const cvInputRef = useRef();
  const coverInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateProfile({ ...candidateProfile, [name]: value });
  };

  useEffect(() => {
    axios.post("http://localhost:5000/user/get-candiate-info", {
      id: userData.id,
    });

    axios
      .post("http://localhost:5000/user/has-candiate-profile", {
        id: userData.id,
      })
      .then((res) => setProfile(res.data.info));
  }, []);

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

  const handleSavecandidateProfile = (e) => {};

  const addSkillorLanguage = (e, type) => {
    if (type === "skill") {
      setCandidateProfile({
        ...candidateProfile,
        skills: [...new Set([...candidateProfile.skills, e.target.value])],
      });
    } else {
      setCandidateProfile({
        ...candidateProfile,
        languages: [
          ...new Set([...candidateProfile.languages, e.target.value]),
        ],
      });
    }
  };

  const deleteSkillorLanguage = (e, type) => {
    if (type === "skill") {
      const skills = new Set([...candidateProfile.skills]);
      skills.delete(e.target.textContent);

      setCandidateProfile({
        ...candidateProfile,
        skills: [...skills],
      });
    } else if (type === "lang") {
      const languages = new Set([...candidateProfile.languages]);
      languages.delete(e.target.textContent);

      setCandidateProfile({
        ...candidateProfile,
        languages: [...languages],
      });
    } else {
      const education = new Set([...candidateProfile.education]);
      education.delete(e.target.textContent);

      setCandidateProfile({
        ...candidateProfile,
        education: [...education],
      });
    }
  };

  const addSkillLanguageorSchoolFromInput = (e, type) => {
    if (type === "skill") {
      let input = e.target.parentElement.querySelector("input");
      if (input.value.length === 0) return;

      setCandidateProfile({
        ...candidateProfile,
        skills: [...new Set([...candidateProfile.skills, input.value])],
      });
    } else if (type === "lang") {
      let input = e.target.parentElement.querySelector("input");
      if (input.value.length === 0) return;
      setCandidateProfile({
        ...candidateProfile,
        languages: [...new Set([...candidateProfile.languages, input.value])],
      });
    } else {
      let input = e.target.parentElement.querySelector("input");
      if (input.value.length === 0) return;
      setCandidateProfile({
        ...candidateProfile,
        education: [...new Set([...candidateProfile.education, input.value])],
      });
    }
  };

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
            <form className={styles.form} onSubmit={handleSavecandidateProfile}>
              <h2>Ustawienia profilu kandydata</h2>
              {/* {candidateProfile.length === 0 && (
                <p>Brak profilu kandydata...</p>
              )} */}
              {candidateProfile.length ? (
                <button className={styles.saveBtn}>Utwórz profil</button>
              ) : (
                <>
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
                    name="experience_years"
                    value={candidateProfile.career_level}
                    onChange={handleChange}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>

                  <label>
                    Umiejętności{" "}
                    <span className={styles.span}>
                      Kliknij podwójnie aby usunąć
                    </span>{" "}
                  </label>
                  <div className={styles.skill}>
                    <div className={styles.skillsList}>
                      {candidateProfile.skills?.map((el) => {
                        return (
                          <span
                            style={{ cursor: "pointer" }}
                            onDoubleClick={(e) =>
                              deleteSkillorLanguage(e, "skill")
                            }
                          >
                            {el}
                          </span>
                        );
                      })}
                    </div>

                    <select
                      name="skills"
                      onChange={(e) => addSkillorLanguage(e, "skill")}
                    >
                      <option>JavaScript</option>
                      <option>TypeScript</option>
                      <option>Java</option>
                      <option>C</option>
                      <option>C++</option>
                      <option>C#</option>
                      <option>Python</option>
                      <option>Kotlin</option>
                      <option>Rust</option>
                      <option>Node.js</option>
                      <option>React.js</option>
                      <option>Angular.js</option>
                      <option>Vue.js</option>
                      <option>Inna...</option>
                    </select>
                    <input
                      type="text"
                      name="add_skill"
                      placeholder="Inna umiejętność..."
                    />
                    <button
                      type="button"
                      onClick={(e) =>
                        addSkillLanguageorSchoolFromInput(e, "skill")
                      }
                      className={styles.saveBtn}
                    >
                      Dodaj
                    </button>
                  </div>

                  <label>
                    Języki
                    <span className={styles.span}>
                      Kliknij podwójnie aby usunąć
                    </span>
                  </label>
                  <div className={styles.skill}>
                    <div className={styles.skillsList}>
                      {candidateProfile.languages?.map((el) => {
                        return (
                          <span
                            style={{ cursor: "pointer" }}
                            onDoubleClick={(e) =>
                              deleteSkillorLanguage(e, "lang")
                            }
                          >
                            {el}
                          </span>
                        );
                      })}
                    </div>

                    <select
                      name="languages"
                      onChange={(e) => addSkillorLanguage(e, "lang")}
                    >
                      <option>Angielski podstawowy</option>
                      <option>Angielski sredniozaawansowany</option>
                      <option>Angielski zaawansowany</option>
                      <option>Niemieck podstawowy</option>
                      <option>Niemiecki średniozaawansowany</option>
                      <option>Niemiecki zaawansowany</option>
                      <option>Inny</option>
                    </select>
                    <input
                      type="text"
                      name="add_language"
                      placeholder="Inny język..."
                    />

                    <button
                      type="button"
                      onClick={(e) =>
                        addSkillLanguageorSchoolFromInput(e, "lang")
                      }
                      className={styles.saveBtn}
                    >
                      Dodaj
                    </button>
                  </div>

                  <label>
                    Edukacja
                    <span className={styles.span}>
                      Kliknij podwójnie aby usunąć
                    </span>{" "}
                  </label>
                  <div className={styles.skill}>
                    <div className={styles.skillsList}>
                      {candidateProfile.education?.map((el) => {
                        return (
                          <span
                            style={{ cursor: "pointer" }}
                            onDoubleClick={(e) =>
                              deleteSkillorLanguage(e, "sch")
                            }
                          >
                            {el}
                          </span>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      name="add_language"
                      placeholder="Szkoła..."
                    />

                    <button
                      type="button"
                      onClick={(e) =>
                        addSkillLanguageorSchoolFromInput(e, "sch")
                      }
                      className={styles.saveBtn}
                    >
                      Dodaj
                    </button>
                  </div>

                  <label>📎 CV</label>
                  <input
                    type="file"
                    ref={cvInputRef}
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files[0])}
                  />

                  <label>List motywacyjny</label>
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept=".pdf"
                    onChange={(e) => setCoverLetterFile(e.target.files[0])}
                  />

                  <label>GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={candidateProfile.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />

                  <label>Dostępność</label>
                  <select name="access">
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
