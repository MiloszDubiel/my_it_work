import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [offers, setOffers] = useState([]);

  // Pobierz dane po zmianie zakładki
  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "companies") loadCompanies();
    if (activeTab === "offers") loadOffers();
  }, [activeTab]);

  const loadUsers = () => {
    axios
      .get("http://localhost:5000/api/admin/get-users")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(err));
  };

  const loadCompanies = () => {
    axios
      .get("http://localhost:5000/api/admin/get-companies")
      .then((res) => setCompanies(res.data.companies))
      .catch((err) => console.error(err));
  };

  const loadOffers = () => {
    axios
      .get("http://localhost:5000/api/admin/get-offers")
      .then((res) => setOffers(res.data.offers))
      .catch((err) => console.error(err));
  };

  const deleteUser = (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć użytkownika?")) return;

    axios
      .post("http://localhost:5000/api/admin/delete-user", { id })
      .then(() => loadUsers())
      .catch((err) => console.error(err));
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Usunąć firmę?")) return;

    axios
      .post("http://localhost:5000/api/admin/delete-company", { id })
      .then(() => loadCompanies())
      .catch((err) => console.error(err));
  };

  const deleteOffer = (id) => {
    if (!window.confirm("Usunąć ofertę pracy?")) return;

    axios
      .post("http://localhost:5000/api/admin/delete-offer", { id })
      .then(() => loadOffers())
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>Panel Administratora</h2>
        <ul>
          <li
            className={activeTab === "users" ? styles.active : ""}
            onClick={() => setActiveTab("users")}
          >
            👤 Użytkownicy
          </li>
          <li
            className={activeTab === "companies" ? styles.active : ""}
            onClick={() => setActiveTab("companies")}
          >
            🏢 Firmy
          </li>
          <li
            className={activeTab === "offers" ? styles.active : ""}
            onClick={() => setActiveTab("offers")}
          >
            💼 Oferty pracy
          </li>
        </ul>
      </aside>

      <main className={styles.content}>
        {/* --- UŻYTKOWNICY --- */}
        {activeTab === "users" && (
          <section className={styles.section}>
            <h3>Lista użytkowników</h3>
            <div className={styles.table}>
              <div className={styles.headerRow}>
                <span>ID</span>
                <span>Email</span>
                <span>Imię</span>
                <span>Typ</span>
                <span>Akcje</span>
              </div>

              {users.map((u) => (
                <div className={styles.row} key={u.id}>
                  <span>{u.id}</span>
                  <span>{u.email}</span>
                  <span>
                    {u.name} {u.surname}
                  </span>
                  <span>{u.role}</span>
                  <span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteUser(u.id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- FIRMY --- */}
        {activeTab === "companies" && (
          <section className={styles.section}>
            <h3>Firmy</h3>

            <div className={styles.table}>
              <div className={styles.headerRow}>
                <span>ID</span>
                <span>Nazwa</span>
                <span>Email</span>
                <span>Telefon</span>
                <span>Akcje</span>
              </div>

              {companies.map((c) => (
                <div className={styles.row} key={c.id}>
                  <span>{c.id}</span>
                  <span>{c.companyName}</span>
                  <span>{c.email}</span>
                  <span>{c.phone_number}</span>
                  <span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteCompany(c.id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- OFERTY PRACY --- */}
        {activeTab === "offers" && (
          <section className={styles.section}>
            <h3>Oferty pracy</h3>

            <div className={styles.table}>
              <div className={styles.headerRow}>
                <span>ID</span>
                <span>Stanowisko</span>
                <span>Firma</span>
                <span>Data</span>
                <span>Akcje</span>
              </div>

              {offers.map((o) => (
                <div className={styles.row} key={o.id}>
                  <span>{o.id}</span>
                  <span>{o.title}</span>
                  <span>{o.companyName}</span>
                  <span>{o.created_at}</span>
                  <span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteOffer(o.id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
