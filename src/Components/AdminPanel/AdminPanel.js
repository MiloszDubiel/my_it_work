import { useEffect, useState, useReducer } from "react";
import styles from "./AdminPanel.module.css";
import axios from "axios";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ReactPaginate from "react-paginate";
import UserItem from "./UserAdmin/UserItem";
const fetchUsers = async () => {
  try {
    let response = await axios.get("http://localhost:3001/admin/get-users");

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const fetchOfferts = async () => {
  try {
    const request = await axios.get(
      `http://localhost:5000/api/job-offerts`
    );
    return request.data;
  } catch (e) {
    console.log(e);
  }
};

const Items = ({ currentItems, users, offerts, forceUpdate }) => {
  let content = null;

  if (currentItems && users) {
    content = <UserItem listOfUsers={currentItems} forceUpdate={forceUpdate} />;
  }
  return <>{content}</>;
};

const PaginatedItems = ({
  itemsPerPage,
  users,
  offerts,
  forceUpdate,
  forceUpdateItem,
}) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (users) {
      fetchUsers().then((res) => {
        setItems(res);
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(res.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(res.length / itemsPerPage));
        setIsLoading(false);
      });
    } else if (offerts) {
    }

    console.log("RERENDER");
  }, [itemOffset, itemsPerPage, forceUpdateItem]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items
        currentItems={currentItems}
        users={users}
        offerts={offerts}
        forceUpdate={forceUpdate}
        forceUpdateItem={forceUpdateItem}
      />
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <ReactPaginate
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          pageClassName="page-item-for-employers"
          pageLinkClassName="page-link-for-employers"
          previousClassName="page-item-for-employers"
          previousLinkClassName="page-link-for-employers"
          nextClassName="page-item-for-employers"
          nextLinkClassName="page-link-for-employers"
          breakLabel="..."
          breakClassName="page-item-for-employers"
          breakLinkClassName="page-link-for-employers"
          containerClassName="pagination-for-employers"
          activeClassName="active-for-employers"
          renderOnZeroPageCount={null}
        />
      )}
    </>
  );
};

const AdminPanel = ({ users, jobOffers, companies }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [forceUpdateItem, forceUpdate] = useReducer((x) => x + 1, 0);
  return (
    <div className={styles.panel}>
      <h2>Panel administratora</h2>

      {/* Zakładki */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          Użytkownicy
        </button>
        <button
          className={activeTab === "jobOffers" ? styles.active : ""}
          onClick={() => setActiveTab("jobOffers")}
        >
          Oferty pracy
        </button>
        <button
          className={activeTab === "companies" ? styles.active : ""}
          onClick={() => setActiveTab("companies")}
        >
          Firmy
        </button>
      </div>

      {/* Sekcje */}
      <div className={styles.content}>
        {activeTab === "users" && (
          <div>
            <h3>Lista użytkowników</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Rola</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <PaginatedItems
                itemsPerPage={9}
                users={true}
                forceUpdate={forceUpdate}
                forceUpdateItem={forceUpdateItem}
              />
              <tbody></tbody>
            </table>
          </div>
        )}

        {activeTab === "jobOffers" && (
          <div>
            <h3>Oferty pracy</h3>

            <h4>Oczekujące na akceptację</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stanowisko</th>
                  <th>Firma</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers
                  ?.filter((o) => o.status === "pending")
                  .map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.title}</td>
                      <td>{o.company}</td>
                      <td>{o.location}</td>
                      <td>
                        <button className={styles.primary}>Akceptuj</button>
                        <button className={styles.danger}>Odrzuć</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <h4>Dostępne</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stanowisko</th>
                  <th>Firma</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers
                  ?.filter((o) => o.status === "active")
                  .map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.title}</td>
                      <td>{o.company}</td>
                      <td>{o.location}</td>
                      <td>
                        <button className={styles.danger}>Usuń</button>
                        <button className={styles.primary}>Edytuj</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "companies" && (
          <div>
            <h3>Firmy</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nazwa</th>
                  <th>Technologie</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {companies?.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.technologies?.join(", ")}</td>
                    <td>{c.location}</td>
                    <td>
                      <button className={styles.danger}>Usuń</button>
                      <button className={styles.primary}>Edytuj</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
