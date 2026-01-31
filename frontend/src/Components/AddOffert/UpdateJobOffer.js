import { useState } from "react";
import axios from "axios";
import styles from "./AddJobOffer.module.css";
import { IoMdClose } from "react-icons/io";

const UpdateJobOffer = ({ offer }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  console.log(offer);

  const safeArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  console.log(offer);

  const getSalaryRange = (salary) => {
    if (!salary) return null;

    const nums = salary.match(/\d+/g)?.map(Number);

    if (!nums || nums.length < 2) return null;

    return {
      salaryMin: nums[0],
      salaryMax: nums[1],
    };
  };

  const salary = getSalaryRange(offer.salary);

  const [updateOffer, setUpdateOffer] = useState({
    title: offer.title,
    company: offer.companyName,
    location: safeArray(offer.workingMode),
    experience: safeArray(offer.experience),
    technologies: safeArray(offer.technologies),
    contract_type: safeArray(offer.contractType),
    description: offer.description,
    requirements: offer.requirements,
    responsibilities: offer.responsibilities,
    benefits: offer.benefits,
    offer_id: offer.id,
    date: offer.active_to,
    salary_min: salary?.salaryMin ?? "",
    salary_max: salary?.salaryMax ?? "",
  });

  const validate = () => {
    if (!updateOffer.title?.trim()) return "Tytuł oferty jest wymagany";
    if (!updateOffer.location) return "Lokalizacja jest wymagana";
    if (!updateOffer.description?.trim())
      return "Opis oferty nie może być pusty";
    if (
      updateOffer.salary_min &&
      updateOffer.salary_max &&
      +updateOffer.salary_min > +offer.salary_max
    )
      return "Minimalne wynagrodzenie nie może być większe niż maksymalne";

    if (!updateOffer.date) {
      return "Data wazności oferty jest wymagany";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(updateOffer.date);

    if (selected < today) {
      return "Data nie może być wcześniejsza niż dzisiaj";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      e.target.parentElement.parentElement.scrollTo(0, 0);
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/job-offerts/update",
        updateOffer,
      );
      if (res.status === 200) {
        e.target.parentElement.parentElement.scrollTo(0, 0);
        setMessage(
          "Oferta została przesłana do weryfikacji przez administratora",
        );
        window.dispatchEvent(new Event("updated-offer"));
      }
    } catch (err) {
      console.error(err);
      e.target.parentElement.parentElement.scrollTo(0, 0);
      setError("Błąd podczas dodawania oferty. Spróbuj ponownie później.");
    }
  };
  const addSkillLanguageorSchoolFromInput = (e) => {
    let input = e.target.parentElement.querySelector("input");
    if (input.value.length === 0) return;

    setUpdateOffer({
      ...updateOffer,
      technologies: [...new Set([...updateOffer.technologies, input.value])],
    });
  };

  const addSkillorLanguage = (e) => {
    setUpdateOffer({
      ...updateOffer,
      technologies: [...new Set([...updateOffer.technologies, e.target.value])],
    });
  };

  const deleteSkillorLanguage = (e) => {
    const skills = updateOffer.technologies.filter(
      (skill) => skill !== e.target.textContent,
    );

    setUpdateOffer({
      ...updateOffer,
      technologies: skills,
    });
  };
  return (
    <div
      className={styles.container1 + " " + `update-job-offer${offer.id}`}
      id="update-job-offer"
    >
      <div className={styles.container}>
        <div className={styles.actionsBar}>
          <button
            className={styles.closeBtn}
            onClick={() => {
              document.querySelector(
                `.update-job-offer${offer.id}`,
              ).style.display = "none";
              document.querySelector("#root").style.overflow = "auto";
              setError("");
              setMessage("");
            }}
          >
            <IoMdClose />
          </button>
        </div>

        <div className={styles.content}>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.info}>{message}</p>}

          <form className={styles.form}>
            <h2>Edytuj ofertę pracy</h2>
            <p style={{ fontSize: "12px" }}>* - pola wymagane</p>
            <label>Tytuł oferty*</label>
            <input
              type="text"
              value={updateOffer.title}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, title: e.target.value })
              }
              placeholder="Np. Frontend Developer"
            />

            <label>Lokalizacja*</label>
            <input
              type="text"
              value={updateOffer.location}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, location: e.target.value })
              }
              placeholder="Np. Warszawa / Zdalnie"
            />
            <label>Ważne do*</label>
            <input
              type="date"
              value={updateOffer.date}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, date: e.target.value })
              }
            />

            <label>Rodzaj umowy</label>
            <select
              value={updateOffer.contract_type}
              onChange={(e) =>
                setUpdateOffer({
                  ...updateOffer,
                  contract_type: e.target.value,
                })
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
                  value={updateOffer.salary_min}
                  onChange={(e) =>
                    setUpdateOffer({
                      ...updateOffer,
                      salary_min: e.target.value,
                    })
                  }
                  placeholder="np. 8000"
                />
              </div>

              <div>
                <label>Wynagrodzenie max.</label>
                <input
                  type="number"
                  value={updateOffer.salary_max}
                  onChange={(e) =>
                    setUpdateOffer({
                      ...updateOffer,
                      salary_max: e.target.value,
                    })
                  }
                  placeholder="np. 15000"
                />
              </div>
            </div>

            <label>Doświadczenie</label>

            <select
              name="career_level"
              value={updateOffer.experience}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, experience: e.target.value })
              }
            >
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid / Regular</option>
              <option value="Senior">Senior</option>
              <option value="Lead / Principal">Lead / Principa</option>
            </select>

            <label>
              Technologie{" "}
              <span className={styles.span}>
                Kliknij podwójnie aby usunąć
              </span>{" "}
            </label>
            <div className={styles.skill}>
              <div className={styles.skillsList}>
                {Array.isArray(updateOffer.technologies) &&
                  updateOffer.technologies.map((el, i) => (
                    <span
                      key={i}
                      style={{ cursor: "pointer" }}
                      onDoubleClick={deleteSkillorLanguage}
                    >
                      {el}
                    </span>
                  ))}
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
                <option disabled>Inna...</option>
              </select>
              <input
                type="text"
                name="add_skill"
                placeholder="Inna technologia niż podane..."
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
              value={updateOffer.description}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, description: e.target.value })
              }
              placeholder="Wprowadź pełny opis stanowiska..."
            />

            <label>Wymagania</label>
            <textarea
              value={updateOffer.requirements}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, requirements: e.target.value })
              }
              placeholder="Wymagania dla kandydata..."
            />

            <label>Zakres obowiązków</label>
            <textarea
              value={updateOffer.responsibilities}
              onChange={(e) =>
                setUpdateOffer({
                  ...updateOffer,
                  responsibilities: e.target.value,
                })
              }
              placeholder="Czym będziesz się zajmować..."
            />

            <label>Benefity</label>
            <textarea
              value={updateOffer.benefits}
              onChange={(e) =>
                setUpdateOffer({ ...updateOffer, benefits: e.target.value })
              }
              placeholder="Co oferuje firma..."
            />

            <button
              type="submit"
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Dodaj ofertę
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateJobOffer;
