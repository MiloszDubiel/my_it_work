import { useLocation } from "react-router-dom";
import styles from "./filltred.module.css";
import Navbar from "../NavBar/NavBar";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import Offert from "../OffertComponent/Offert";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Filter from "../FilterComponent/Filter";
import Footer from "../Footer/Fotter";

const fetchData = async () => {
  const request = await axios.get(`http://192.168.100.2:3001/api/job-offerts`);
  return request.data;
};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minut

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
  const [offerts, setOfferts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("offerts");
    const parsed = cached ? JSON.parse(cached) : null;
    setIsLoading(true);

    window.scrollTo(0, 0);

    if (parsed && Date.now() < parsed.expiry) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(parsed.res.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(parsed.res.length / itemsPerPage));
      setIsLoading(false);
    } else {
      fetchData().then((res) => {
        setOfferts(res);
        localStorage.setItem(
          "offerts",
          JSON.stringify({ res, expiry: Date.now() + CACHE_DURATION_MS })
        );
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(res.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(res.length / itemsPerPage));
        setIsLoading(false);
      });
    }
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    if (offerts) {
      const newOffset = (event.selected * itemsPerPage) % offerts.length;
      setItemOffset(newOffset);
    } else {
      const newOffset =
        (event.selected * itemsPerPage) %
        JSON.parse(localStorage.getItem("offerts")).res.length;
      setItemOffset(newOffset);
    }
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

const FilltredContent = ({ offertPage, candidatePage, employersPage }) => {
  const location = useLocation();
  const { state } = location;

  return (
    <>
      <div className={styles.page}>
        <Navbar
          offertPage={offertPage}
          candidatePage={candidatePage}
          employersPage={employersPage}
        />
        <Filter
          offertPage={offertPage}
          candidatePage={candidatePage}
          employersPage={employersPage}
        />
        <h1 className={styles.header}>
          {offertPage
            ? "Znalezione oferty pracy"
            : employersPage
            ? "Znalezieni pracodawcy"
            : "Znalezieni kandydaci"}
          <button
            onClick={() => {
              document.querySelector("#filter").style.display = "flex";
            }}
          >
            Filtruj
          </button>
        </h1>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <PaginatedItems itemsPerPage={9} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FilltredContent;
