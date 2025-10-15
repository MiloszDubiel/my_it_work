import React, { useState } from "react";
import axios from "axios";
import styles from "./AddJobOffer.module.css"; // możesz użyć tego samego pliku CSS co wcześniej
import { IoMdClose } from "react-icons/io";

const AddJobOffer = ({
  currentUserId /* opcjonalnie jeśli nie masz auth */,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    contract_type: "B2B",
    experience_level: "Junior",
    technologies: "",
    description: "",
    salary_min: "",
    salary_max: "",
  });
  const [serverResp, setServerResp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [existingOffer, setExistingOffer] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setServerResp(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/employers/add-offer",
        {
          ...formData,
          userId: currentUserId, // jeżeli nie masz auth middleware - inaczej backend użyje req.user
        }
      );

      if (res.data.alreadyExists) {
        setExistingOffer(res.data.existing);
        setModalOpen(true);
      } else if (res.data.inserted) {
        setMessage("Oferta dodana pomyślnie.");
        setFormData({
          title: "",
          company_name: "",
          location: "",
          contract_type: "B2B",
          experience_level: "Junior",
          technologies: "",
          description: "",
          salary_min: "",
          salary_max: "",
          external_link: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Błąd serwera");
    }
  };

  const handleClaim = async () => {
    if (!existingOffer) return;
    try {
      const res = await axios.post("http://localhost:5000/job/claim", {
        offerId: existingOffer.id,
        userId: currentUserId, // jeśli brak auth - inaczej backend powinien korzystać z req.user
      });
      if (res.data.ok) {
        setMessage("Oferta przypisana do Twojego konta.");
        setModalOpen(false);
      } else {
        setMessage("Nie udało się przypisać oferty.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Błąd serwera podczas przypisywania.");
    }
  };

  return (
    <div className={styles.container1} id="add-offer">
      <div className={styles.container}>
        <div className={styles.rightActions}>
          <button style={{ all: "unset", cursor: "pointer" }}>
            <IoMdClose
              onClick={() => {
                document.querySelector("#add-offer").style.display = "none";
                document.querySelector("#root").style.overflow = "auto";
              }}
            />
          </button>
        </div>
        <h2>Dodaj ofertę pracy</h2>
        {message && <div className={styles.info}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Stanowisko*
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Firma*
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Lokalizacja
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </label>
          <label>
            Typ umowy
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
            >
              <option value="B2B">B2B</option>
              <option value="Umowa o pracę">Umowa o pracę</option>
            </select>
          </label>
          <label>
            Doświadczenie
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
            >
              <option>Intern</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </label>
          <label>
            Technologie (oddziel przecinkami)
            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
            />
          </label>
          <label>
            Opis*
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <div className={styles.salary}>
            <input
              type="number"
              name="salary_min"
              placeholder="Min"
              value={formData.salary_min}
              onChange={handleChange}
            />
            <input
              type="number"
              name="salary_max"
              placeholder="Max"
              value={formData.salary_max}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Wyślij
          </button>
        </form>

        {/* Modal potwierdzenia */}
        {modalOpen && existingOffer && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Oferta podobna / istniejąca</h3>
              <p>
                Wygląda na to, że podobna oferta już istnieje w naszej bazie:
              </p>
              <div className={styles.existing}>
                <h4>{existingOffer.title}</h4>
                <p>
                  <strong>Firma:</strong> {existingOffer.company_name}
                </p>
                <p>
                  <strong>Lokalizacja:</strong> {existingOffer.location}
                </p>
                <p>
                  <strong>Źródło:</strong> {existingOffer.source || "scraped"}
                </p>
                <p style={{ fontSize: 12, color: "#666" }}>
                  Kliknij "Przypisz", aby przypisać ofertę do Twojego konta i
                  przejąć nad nią kontrolę (edycja / publikacja).
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setModalOpen(false)}
                  className={styles.btnGray}
                >
                  Anuluj
                </button>
                <button onClick={handleClaim} className={styles.btnPrimary}>
                  Przypisz ofertę
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddJobOffer;
