import { useState, useEffect } from "react";
import styles from "./CompanyEditModal.module.css";
import axios from "axios";

const CompanyEditModal = ({ company, onClose, onSave }) => {
  const [form, setForm] = useState({
    companyName: "",
    nip: "",
    id: "",
  });

  const [errors, setError] = useState("");
  const [info, setInfo] = useState("");
  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName,
        nip: company.nip,
        id: company.id,
      });
    }
  }, [company]);

  const validate = () => {
    if (!form.companyName || form.companyName.length < 2) {
      setError("Nazwa firmy musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (!/^\d{10}$/.test(form.nip)) {
      setError("Nip musi mieć 10 znaków.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setError("");
    setInfo("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    if (!validate()) return;

    setError("");
    setInfo("");

    axios
      .put("http://localhost:5000/admin/edit-company", form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setInfo(res.data.info);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1000);
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
        <label>NIP</label>
        <input
          name="nip"
          value={form.nip}
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
