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
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (offer) {
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        is_active: offer.is_active,
      });
    }
  }, [offer]);

  const validate = () => {
    if (form.title.length < 3) {
      setErrors("Tytuł musi mieć co najmniej 3 znaki.");
      return false;
    }
    if (!form.description?.length) {
      setErrors("Brak opisu oferty");
      return false;
    }
    if (form.is_active != "1" && form.is_active != "0") {
      setErrors("Wybierz poprawną opcję.");
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
      .then((res) => {
        setInfo(res.data.info);
        console.log(res);

        setTimeout(() => {
          onSave();
          onClose();
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  if (!offer) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <h2>Edytuj ofertę</h2>
        <p className={styles.error}>{errors}</p>
        <p className={styles.info}>{info}</p>

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

        <label>Aktywny</label>
        <select name="is_active" value={form.is_active} onChange={handleChange}>
          <option value="1">Tak</option>
          <option value="0">Nie</option>
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
