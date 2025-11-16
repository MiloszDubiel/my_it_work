import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";
import UserEditModal from "./UserEditModal";
import CompanyEditModal from "./CompanyEditModal";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingComapny, setIsEditingCompany] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "companies") loadCompanies();
    if (activeTab === "offers") loadOffers();
  }, [activeTab, isEditing, isEditingComapny, page, search]);

  const loadUsers = () => {
    axios
      .get(
        `http://localhost:5000/admin/get-users?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const loadCompanies = () => {
    axios
      .get(
        `http://localhost:5000/admin/get-companies?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setCompanies(res.data.companies);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const loadOffers = () => {
    axios
      .get(
        `http://localhost:5000/api/admin/get-offers?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setOffers(res.data.offers);
        setTotalPages(res.data.totalPages);
      })
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
  console.log(companies);
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
        {activeTab === "users" && (
          <section className={styles.section}>
            {isEditing && (
              <UserEditModal
                user={selectedUser}
                onClose={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}
              />
            )}
            <input
              type="text"
              placeholder="Szukaj po email / imieniu"
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

            <h3>Lista użytkowników</h3>
            <div className={styles.table}>
              <div className={styles.headerRow}>
                <span>Email</span>
                <span>Imię</span>
                <span>Typ</span>
                <span>Aktywny</span>
                <span>Akcje</span>
              </div>

              {users.map((u) => (
                <div className={styles.row} key={u.id}>
                  <span>{u.email}</span>
                  <span>
                    {u.name} {u.surname}
                  </span>
                  <span>{u.role}</span>
                  <span>{u.is_active === "1" ? "Tak" : "Nie"}</span>
                  <span style={{ display: " flex", gap: "10px" }}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedUser(u);
                        setIsEditing(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteUser(u.id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
              <div className={styles.pagination}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ◀ Poprzednia
                </button>

                <span>
                  Strona {page} z {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna ▶
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- FIRMY --- */}
        {activeTab === "companies" && (
          <section className={styles.section}>
            <h3>Firmy</h3>
            {isEditingComapny && (
              <CompanyEditModal
                company={selectedCompany}
                onClose={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}
              />
            )}
            <input
              type="text"
              placeholder="Szukaj po nazwie firmy"
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

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
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedCompany(c);
                        setIsEditingCompany(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteCompany(c.id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
              <div className={styles.pagination}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ◀ Poprzednia
                </button>

                <span>
                  Strona {page} z {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna ▶
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- OFERTY PRACY --- */}
        {activeTab === "offers" && (
          <section className={styles.section}>
            <h3>Oferty pracy</h3>
            <input
              type="text"
              placeholder="Szukaj po stanowisku"
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

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
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ◀ Poprzednia
              </button>

              <span>
                Strona {page} z {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Następna ▶
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
