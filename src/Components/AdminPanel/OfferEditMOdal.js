import { useEffect, useState } from "react";
import styles from "./OfferEditModal.module.css";
import axios from "axios";

const OfferEditModal = ({ offer, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    work_type: "stacjonarna",
  });

  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (offer) {
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        requirements: offer.requirements || "",
        salary: offer.salary || "",
        location: offer.location || "",
        work_type: offer.work_type || "stacjonarna",
      });
    }
  }, [offer]);

  const validate = () => {
    if (form.title.length < 3) {
      setErrors("Tytuł musi mieć co najmniej 3 znaki.");
      return false;
    }
    if (form.description.length < 10) {
      setErrors("Opis musi mieć co najmniej 10 znaków.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setErrors("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    if (!validate()) return;

    axios
      .put(
        "http://localhost:5000/admin/update-offer",
        {
          id: offer.id,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        onSave();
        onClose();
      })
      .catch((err) => console.log(err));
  };

  if (!offer) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <h2>Edytuj ofertę</h2>
        <p className={styles.error}>{errors}</p>

        <label>Tytuł</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          type="text"
        />

        <label>Opis</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Wymagania</label>
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
        ></textarea>

        <label>Wynagrodzenie</label>
        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          type="text"
        />

        <label>Lokalizacja</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          type="text"
        />

        <label>Tryb pracy</label>
        <select name="work_type" value={form.work_type} onChange={handleChange}>
          <option value="stacjonarna">Stacjonarna</option>
          <option value="zdalna">Zdalna</option>
          <option value="hybrydowa">Hybrydowa</option>
        </select>

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Anuluj
          </button>

          <button className={styles.saveBtn} onClick={save}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferEditModal;
