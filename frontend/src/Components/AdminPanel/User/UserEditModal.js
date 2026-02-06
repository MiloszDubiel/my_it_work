import { useState, useEffect } from "react";
import styles from "./UserEditModal.module.css";
import axios from "axios";

const UserEditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    is_active: "",
  });

  const [errors, setErrors] = useState("");
  const [info, setInfo] = useState("");
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        surname: user.surname,
        email: user.email,
        is_active: user.is_active,
      });
    }
  }, [user]);

  const validate = () => {
    if (user.role != "employer" && (!form.name || form.name.length < 2)) {
      setErrors("Imię musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (user.role != "employer" && (!form.surname || form.surname.length < 2)) {
      setErrors("Nazwisko musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (!form.email) {
      setErrors("Email jest wymagany.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors("Niepoprawny format email.");
      return false;
    }

    if (form.is_active !== "1" && form.is_active !== "0") {
      setErrors("Wybierz poprawną opcję.");
      return false;
    }
    return true;
  };
  console.log(form);

  const handleChange = (e) => {
    setErrors("");
    setInfo("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = (e) => {
    if (!validate()) return;

    setErrors("");
    setInfo("");

    axios
      .put(`http://localhost:5000/admin/users/${user.id}`, form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setInfo(res.data.info);
        e.target.parentElement.parentElement.scrollTo(0,0)
        setTimeout(() => {
          onSave();
          onClose();
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  if (!user) return null;

  return (
<div className={styles.modalBackground}>
  <div className={styles.modal}>
    <h2>Szczegóły użytkownika</h2>

    {errors && <p className={styles.error}>{errors}</p>}
    {info && <p className={styles.info}>{info}</p>}

    <div className={styles.readOnlySection}>
      <p><span>ID:</span> {user.id}</p>
      <p><span>Rola:</span> {user.role == 'employer' ? "Pracodawca" : "Kandydat"}</p>
      <p><span>Imię:</span> {user.name || "Brak"}</p>
      <p><span>Nazwisko:</span> {user.surname || "Brak"}</p>
          <p><span>Telefon:</span> {user.phone_number || "Brak"}</p>
          {user.companyName && <p><span>Firma:</span> {user.companyName}</p>}

      {user.avatar && (
        <div className={styles.avatarWrapper}>
          <label>Avatar</label>
          <img src={user.avatar} alt="Avatar użytkownika" />
        </div>
      )}
    </div>


    <label>Email</label>
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
    />

    <label>Aktywny</label>
    <select
      name="is_active"
      value={form.is_active}
      onChange={handleChange}
    >
      <option value="1">Tak</option>
      <option value="0">Nie</option>
    </select>

    <div className={styles.buttons}>
      <button className={styles.cancelBtn} onClick={onClose}>
        Zamknij
      </button>
      <button
        className={styles.saveBtn}
        onClick={save}
        disabled={errors?.length > 0}
      >
        Zapisz
      </button>
    </div>
  </div>
</div>)
};

export default UserEditModal;
