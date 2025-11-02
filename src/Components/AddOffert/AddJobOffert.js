import React, { useState } from "react";
import axios from "axios";
import styles from "./AddJobOffer.module.css";
import { IoMdClose } from "react-icons/io";

const AddJobOffer = () => {
  const [offer, setOffer] = useState({
    title: "",
    company_name: "",
    location: "",
    salary_min: "",
    salary_max: "",
    experience: "",
    technologies: [],
    contract_type: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    link: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!offer.title?.trim()) return "Tytuł oferty jest wymagany";
    if (!offer.location?.trim()) return "Lokalizacja jest wymagana";
    if (!offer.company_name?.trim()) return "Nazwa firmy jest wymagana";
    if (!offer.description?.trim()) return "Opis oferty nie może być pusty";
    if (
      offer.salary_min &&
      offer.salary_max &&
      +offer.salary_min > +offer.salary_max
    )
      return "Minimalne wynagrodzenie nie może być większe niż maksymalne";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/offers/add",
        offer
      );
      if (res.status === 200) {
        setMessage("Oferta została pomyślnie dodana!");
        setOffer({
          title: "",
          company_name: "",
          location: "",
          salary_min: "",
          salary_max: "",
          experience: "",
          technologies: [],
          contract_type: "",
          description: "",
          requirements: "",
          responsibilities: "",
          benefits: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Błąd podczas dodawania oferty. Spróbuj ponownie później.");
    }
  };
  const addSkillLanguageorSchoolFromInput = (e) => {
    let input = e.target.parentElement.querySelector("input");
    if (input.value.length === 0) return;

    setOffer({
      ...offer,
      technologies: [...new Set([...offer.technologies, input.value])],
    });
  };

  const addSkillorLanguage = (e) => {
    setOffer({
      ...offer,
      technologies: [...new Set([...offer.technologies, e.target.value])],
    });
  };

  const deleteSkillorLanguage = (e) => {
    const skills = new Set([...offer.technologies]);
    skills.delete(e.target.textContent);

    setOffer({
      ...offer,
      technologies: [...skills],
    });
  };
  return (
    <div className={styles.container1} id="add-job-offer">
      <div className={styles.container}>
        <IoMdClose
          style={{ cursor: "pointer" }}
          onClick={() => {
            document.querySelector("#add-job-offer").style.display = "none";
            document.querySelector("#root").style.overflow = "auto";
          }}
        />
        <h2>Dodaj nową ofertę pracy</h2>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Tytuł oferty*</label>
          <input
            type="text"
            value={offer.title}
            onChange={(e) => setOffer({ ...offer, title: e.target.value })}
            placeholder="Np. Frontend Developer"
          />

          <label>Lokalizacja*</label>
          <input
            type="text"
            value={offer.location}
            onChange={(e) => setOffer({ ...offer, location: e.target.value })}
            placeholder="Np. Warszawa / Zdalnie"
          />

          <label>Rodzaj umowy</label>
          <select
            value={offer.contract_type}
            onChange={(e) =>
              setOffer({ ...offer, contract_type: e.target.value })
            }
          >
            <option value="">Wybierz...</option>
            <option value="Umowa o pracę">Umowa o pracę</option>
            <option value="B2B">B2B</option>
            <option value="Umowa zlecenie">Umowa zlecenie</option>
            <option value="Inne">Inne</option>
          </select>

          <div className={styles.salaryGroup}>
            <div>
              <label>Wynagrodzenie min.</label>
              <input
                type="number"
                value={offer.salary_min}
                onChange={(e) =>
                  setOffer({ ...offer, salary_min: e.target.value })
                }
                placeholder="np. 8000"
              />
            </div>

            <div>
              <label>Wynagrodzenie max.</label>
              <input
                type="number"
                value={offer.salary_max}
                onChange={(e) =>
                  setOffer({ ...offer, salary_max: e.target.value })
                }
                placeholder="np. 15000"
              />
            </div>
          </div>

          <label>Doświadczenie</label>

          <select
            name="career_level"
            value={offer.experience}
            onChange={(e) => setOffer({ ...offer, experience: e.target.value })}
          >
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid / Regular</option>
            <option value="Senior">Senior</option>
            <option value="Lead / Principal">Lead / Principa</option>
          </select>

          <label>
            Technologie{" "}
            <span className={styles.span}>Kliknij podwójnie aby usunąć</span>{" "}
          </label>
          <div className={styles.skill}>
            <div className={styles.skillsList}>
              {offer.technologies?.map((el) => {
                return (
                  <span
                    style={{ cursor: "pointer" }}
                    onDoubleClick={(e) => deleteSkillorLanguage(e, "skill")}
                  >
                    {el}
                  </span>
                );
              })}
            </div>

            <select name="skills" onChange={(e) => addSkillorLanguage(e)}>
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
              placeholder="Inna technologia..."
            />
            <button
              type="button"
              onClick={(e) => addSkillLanguageorSchoolFromInput(e)}
              className={styles.saveBtn}
            >
              Dodaj
            </button>
          </div>

          <label>Opis stanowiska*</label>
          <textarea
            value={offer.description}
            onChange={(e) =>
              setOffer({ ...offer, description: e.target.value })
            }
            placeholder="Wprowadź pełny opis stanowiska..."
          />

          <label>Wymagania</label>
          <textarea
            value={offer.requirements}
            onChange={(e) =>
              setOffer({ ...offer, requirements: e.target.value })
            }
            placeholder="Wymagania dla kandydata..."
          />

          <label>Zakres obowiązków</label>
          <textarea
            value={offer.responsibilities}
            onChange={(e) =>
              setOffer({ ...offer, responsibilities: e.target.value })
            }
            placeholder="Czym będziesz się zajmować..."
          />

          <label>Benefity</label>
          <textarea
            value={offer.benefits}
            onChange={(e) => setOffer({ ...offer, benefits: e.target.value })}
            placeholder="Co oferuje firma..."
          />

          <button type="submit" className={styles.submitBtn}>
            Dodaj ofertę
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJobOffer;
