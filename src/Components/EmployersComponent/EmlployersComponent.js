import { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import styles from "./employers.module.css";
import axios from "axios";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ReactPaginate from "react-paginate";
import Footer from "../Footer/Fotter";
import Filter from "../FilterComponent/Filter";
import Employer from "../Employer/Employer";
import SortButton, { Sort } from "../SortButton/SortButton";

const fetchData = async () => {
  const request = await axios.get(`http://localhost:3001/api/employers`);
  return request.data;
};

const Items = ({ currentItems }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((el, index) => {
          return <Employer offert={el} index={index} />;
        })}
    </>
  );
};

const PaginatedItems = ({ itemsPerPage }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [offerts, setOfferts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    if (offerts.length === 0) {
      fetchData()
        .then((res) => {
          setOfferts(res);
          sessionStorage.setItem("offerts", JSON.stringify({ res }));
          const endOffset = itemOffset + itemsPerPage;
          setCurrentItems(res.slice(itemOffset, endOffset));
          setPageCount(Math.ceil(res.length / itemsPerPage));
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(true);
        });
      return;
    }
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(offerts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(offerts.length / itemsPerPage));
    setIsLoading(false);
  }, [itemOffset, itemsPerPage]);

  useEffect(() => {
    window.addEventListener("changed-sort-option", () => {
      let option = sessionStorage.getItem("sort-option");
      let copyOfferts = [...offerts];

      const endOffset = itemOffset + itemsPerPage;
      setOfferts(Sort(copyOfferts, option));
      setCurrentItems(copyOfferts.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(copyOfferts.length / itemsPerPage));
      setOfferts(Sort(copyOfferts, option));
      setItemOffset(0);
    });
  });

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % offerts.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <Items currentItems={currentItems} />
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

const EmployersComponent = () => {
  return (
    <>
      <Navbar employersPage={true} />
      <Filter employersPage={true} />
      <div className={styles.page}>
        <h1 className={styles.header}>
          Pracodawcy w IT{" "}
          <button
            className={styles.filter}
            onClick={() => {
              document.querySelector("#filter").style.display = "flex";
            }}
          >
            Filtruj
          </button>
        </h1>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <SortButton employersPage={true} />
            <PaginatedItems itemsPerPage={9} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default EmployersComponent;
