import styles from "./job.module.css";
import Navbar from "../NavBar/NavBar";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import Offert from "../OffertComponent/Offert";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Filter from "../FilterComponent/Filter";
import Footer from "../Footer/Fotter";
import SortButton, { Sort } from "../SortButton/SortButton";

const fetchData = async () => {
  const request = await axios.get(`http://localhost:3001/api/job-offerts`);
  return request.data;
};

const Items = ({ currentItems }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((el, index) => <Offert offert={el} index={index} />)}
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
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      )}
    </>
  );
};

const JobOffertsPage = () => {
  return (
    <>
      <div className={styles.page}>
        <Navbar offertPage={true} />
        <Filter offertPage={true} />
        <h1 className={styles.header}>
          Przeglądaj oferty pracy{" "}
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
            <SortButton offertPage={true} />
            <PaginatedItems itemsPerPage={9} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default JobOffertsPage;
