import { useEffect, useState } from "react";
import styles from "./addJobOffert.module.css";
import { IoMdClose } from "react-icons/io";

const AddJobOffert = () => {
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

  const removeElement = (e, type) => {
    if (type === "city") {
      cities.forEach((el) => {
        if (el === e.target.textContent) {
          cities.delete(el);
        }
      });
      setCities(new Set([...cities]));
    } else {
      technologie.forEach((el) => {
        if (el === e.target.textContent) {
          technologie.delete(el);
        }
      });
      setTechnologie(new Set([...technologie]));
    }
  };

  return (
    <div
      className={styles.container}
      id="jobOffertContainer"
      style={{ display: "none" }}
    >
      <div className={styles.addLocations} style={{ display: "none" }}>
        <div className={styles.close}>
          <IoMdClose
            onClick={() => {
              document.querySelector(`.${styles.addLocations}`).style.display =
                "none";
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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

              document.querySelector(`.${styles.addLocations}`).style.display =
                "none";

              setCities(new Set([...cities, location]));
            }}
          />
        </div>
      </div>
      <div className={styles.addTechnologie} style={{ display: "none" }}>
        <div className={styles.close}>
          <IoMdClose
            onClick={() => {
              document.querySelector(
                `.${styles.addTechnologie}`
              ).style.display = "none";
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
              let tech = document.querySelector("#technologie").value.trim();

              if (tech.length === 0) {
                return alert("Niepoprawna wartosc w polu Technologia");
              }

              setTechnologie(new Set([...technologie, tech]));

              document.querySelector(
                `.${styles.addTechnologie}`
              ).style.display = "none";
            }}
          />
        </div>
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
              <option value="" disabled>
                -- wybierz firmę --
              </option>
              <option>Brak firmy</option>
            </select>
          </div>

          <div className={styles.row}>
            <label>
              Lokalizacja:{" "}
              <span style={{ fontSize: "10px" }}>
                (kliknij podwójnie, aby usunąć)
              </span>
            </label>
            <div className={styles.rowDiv}>
              <div className={styles.cities}>
                {[...cities].map((el) => {
                  return (
                    <span
                      onDoubleClick={(e) => {
                        removeElement(e, "city");
                      }}
                    >
                      {el}
                    </span>
                  );
                })}
              </div>
              <input
                type="button"
                name="Remote"
                value="Remote"
                className={styles.citiesButton}
                onClick={() => {
                  setCities(new Set([...cities, "Remote"]));
                }}
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
              <option value="Kontrakt B2B">Kontrakt B2B</option>
              <option value="Umowa o pracę">Umowa o pracę</option>
            </select>
          </div>

          <div className={styles.row}>
            <label>Doświadczenie</label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
            >
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Mid/Regular">Mid/Regular</option>
              <option value="Senior">Senior</option>
              <option value="Lead/Principal">Lead/Principal</option>
            </select>
          </div>

          <div className={styles.row}>
            <label>
              Technologie:
              <span style={{ fontSize: "10px" }}>
                (kliknij podwójnie, aby usunąć)
              </span>
            </label>
            <div className={styles.rowDiv}>
              <div className={styles.cities}>
                {[...technologie].map((el) => {
                  return (
                    <span
                      onDoubleClick={(e) => {
                        removeElement(e, "technology");
                      }}
                    >
                      {el}
                    </span>
                  );
                })}
              </div>
              <input
                type="button"
                name="Remote"
                value="Remote"
                className={styles.citiesButton}
                disabled
                style={{ visibility: "hidden" }}
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
