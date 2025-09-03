import { useState } from "react";
import styles from "./addJobOffert.module.css";
import { IoMdClose } from "react-icons/io";

const AddJobOffert = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [cities, setCities] = useState(new Set());
  const [technologie, setTechnologie] = useState(new Set());

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    contractType: "B2B",
    experience: "Intern",
    technologies: [],
  });

  const deleteElement = (e, type) => {
    if (type === "city") {
      cities.forEach((el) => {
        if (el === e.target.textContent) {
          let location = String(e.target.textContent);
          e.target.remove();
        }
      });
    } else {
      setTechnologie(technologie.delete(e.currentTarget.textContent));
    }
  };

  const EXPERIENCES = ["Intern", "Junior", "Mid/Regular", "Senior"];
  const CONTRACTS = ["B2B", "Umowa o pracę"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechToggle = (tech) => {
    setForm((prev) => {
      if (prev.technologies.includes(tech)) {
        return {
          ...prev,
          technologies: prev.technologies.filter((t) => t !== tech),
        };
      } else {
        return { ...prev, technologies: [...prev.technologies, tech] };
      }
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location) return;

    setForm({
      title: "",
      company: "",
      location: "",
      contractType: "B2B",
      experience: "Intern",
      technologies: [],
    });
  };

  return (
    <div className={styles.container} id="jobOffertContainer">
      <div className={styles.addLocations} style={{ display: "none" }}>
        <label>Lokalizacja</label>
        <input
          type="text"
          name="location"
          placeholder="np. Rzeszów"
          required
          id="location"
        />
        <input
          type="button"
          name="add-location"
          value="Dodaj"
          className={styles.citiesButton}
          onClick={() => {
            let location = document.querySelector("#location").value.trim();
            if (location.length === 0) {
              return alert("Niepoprawna wartosc w polu Lokalizacja");
            }
            setCities(new Set([...cities, <span>{location}</span>]));

            document.querySelector(`.${styles.addLocations}`).style.display =
              "none";
          }}
        />
      </div>
      <div className={styles.addTechnologie} style={{ display: "none" }}>
        <label>Technologia:</label>
        <input
          type="text"
          name="technologie"
          placeholder="np. TypeScript"
          required
          id="technologie"
        />
        <input
          type="button"
          name="add-technologie"
          value="Dodaj"
          className={styles.citiesButton}
          onClick={() => {
            let technologie = document
              .querySelector("#technologie")
              .value.trim();

            if (technologie.length === 0) {
              return alert("Niepoprawna wartosc w polu Technologia");
            }
            setTechnologie(new Set([...cities, technologie]));

            document.querySelector(`.${styles.addTechnologie}`).style.display =
              "none";
          }}
        />
      </div>
      <div className={styles.wrap}>
        <div className={styles.close}>
          <IoMdClose
            onClick={() => {
              document.querySelector("#jobOffertContainer").style.display =
                "none";
            }}
          />
        </div>
        <h2>Dodaj ofertę pracy</h2>
        <form className={styles.form} onSubmit={submitForm}>
          <div className={styles.row}>
            <label>Nazwa stanowiska</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="np. Frontend Developer"
              required
            />
          </div>

          <div className={styles.row}>
            <label>Firma</label>
            <select
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            >
              <option value="">-- wybierz firmę --</option>
              {/* {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))} */}
            </select>
          </div>

          <div className={styles.row}>
            <label>Lokalizacja:</label>
            <div className={styles.rowDiv}>
              <div className={styles.cities}>{cities}</div>
              <input
                type="button"
                name="Remote"
                value="Remote"
                className={styles.citiesButton}
              />
              <input
                type="button"
                name="add-location"
                value="+ Dodaj"
                className={styles.citiesButton}
                onClick={() => {
                  document.querySelector(
                    `.${styles.addLocations}`
                  ).style.display = "flex";
                }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <label>Typ umowy</label>
            <select
              name="contractType"
              value={form.contractType}
              onChange={handleChange}
            >
              {CONTRACTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label>Doświadczenie</label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
            >
              {EXPERIENCES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label>Technologie</label>
            <div className={styles.rowDiv}>
              <div className={styles.cities}>
                {[...technologie].map((el) => (
                  <span>{el}</span>
                ))}
              </div>
              <input
                type="button"
                name="Remote"
                value="Remote"
                className={styles.citiesButton}
              />
              <input
                type="button"
                name="add-location"
                value="+ Dodaj"
                className={styles.citiesButton}
                onClick={() => {
                  document.querySelector(
                    `.${styles.addTechnologie}`
                  ).style.display = "flex";
                }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primary}>
              Dodaj ofertę
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddJobOffert;
