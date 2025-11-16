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
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName,
        description: company.description || "",
        email: company.email || "",
        phone_number: company.phone_number || "",
        link: company.link || "",
      });

      if (company.img) {
        setLogoPreview(company.img);
      }
    }
  }, [company]);

  const validate = () => {
    const e = {};

    if (!form.companyName || form.companyName.length < 2) {
      e.companyName = "Nazwa firmy musi mieć co najmniej 2 znaki.";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Niepoprawny format email.";
    }

    if (form.phone_number && !/^[0-9+\-\s]{5,20}$/.test(form.phone_number)) {
      e.phone_number = "Niepoprawny numer telefonu.";
    }

    if (form.link && !/^https?:\/\/.+/.test(form.link)) {
      e.link = "Podaj poprawny adres URL (https://...)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const save = () => {
    if (!validate()) return;

    const fd = new FormData();
    fd.append("owner_id", company.owner_id);
    fd.append("companyName", form.companyName);
    fd.append("description", form.description);
    fd.append("email", form.email);
    fd.append("phone_number", form.phone_number);
    fd.append("link", form.link);

    if (logoFile) {
      fd.append("logo", logoFile);
    }

    axios
      .post("http://localhost:5000/api/employers/set-company-info", fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
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

        <label>Nazwa firmy</label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          type="text"
        />
        {errors.companyName && (
          <p className={styles.error}>{errors.companyName}</p>
        )}

        <label>Opis</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Email kontaktowy</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label>Numer telefonu</label>
        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          type="text"
        />
        {errors.phone_number && (
          <p className={styles.error}>{errors.phone_number}</p>
        )}

        <label>Link (strona, LinkedIn, itp.)</label>
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          type="text"
        />
        {errors.link && <p className={styles.error}>{errors.link}</p>}

        <label>Logo firmy</label>

        <input type="file" accept="image/*" onChange={handleLogoChange} />

        {logoPreview && (
          <img src={logoPreview} alt="preview" className={styles.preview} />
        )}

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Anuluj
          </button>

          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={Object.keys(errors).length > 0}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditModal;
