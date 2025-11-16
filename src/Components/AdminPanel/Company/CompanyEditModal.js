import { useState, useEffect } from "react";
import styles from "./CompanyEditModal.module.css";
import axios from "axios";

const CompanyEditModal = ({ company, onClose, onSave }) => {
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    email: "",
    phone_number: "",
    link: "",
    id: company.id,
  });

  const [errors, setErrors] = useState("");
  const [info, setInfo] = useState("");
  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName,
        description: company.description || "",
        email: company.email || "",
        phone_number: company.phone_number || "",
        link: company.link || "",
        id: company.id,
      });
    }
  }, [company]);

  const validate = () => {
    if (!form.companyName || form.companyName.length < 2) {
      setErrors("Nazwa firmy musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setErrors("Niepoprawny format email.");
      return false;
    }

    if (form.phone_number && !/^[0-9+\-\s]{5,20}$/.test(form.phone_number)) {
      setErrors("Niepoprawny numer telefonu.");
      return false;
    }

    if (form.link && !/^https?:\/\/.+/.test(form.link)) {
      setErrors("Podaj poprawny adres URL (https://...)");
      return false;
    }

    if (form.phone_number && !/^[0-9]{9}$/.test(form.phone_number)) {
      setErrors("Numer telefonu musi mieć dokładnie 9 cyfr.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setErrors("");
    setInfo("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    if (!validate()) return;

    setErrors("");
    setInfo("");

    axios
      .put("http://localhost:5000/admin/edit-company", form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setInfo(res.data.info);
        onSave();
        onClose();
      })
      .catch((err) => console.log(err));
  };

  if (!company) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <h2>Edytuj firmę</h2>
        <p className={styles.error}>{errors}</p>
        <p className={styles.info}>{info}</p>
        <label>Nazwa firmy</label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          type="text"
        />

        <label>Opis</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Email kontaktowy do firmy </label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />

        <label>Numer telefonu</label>
        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          type="text"
        />

        <label>Link (strona, LinkedIn, itp.)</label>
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          type="text"
        />

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Anuluj
          </button>

          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={errors.length > 0 ? true : false}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditModal;
