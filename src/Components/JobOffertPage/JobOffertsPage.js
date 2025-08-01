import styles from "./job.module.css";
import JobOfferttDetailsComponent from "../JobOffertDetails/JobOfertsDetailsComponent";
import Navbar from "../NavBar/NavBar";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import Offert from "../OffertComponent/Offert";

const fetchData = async () => {
  const request = await axios.get(
    `http://192.168.100.2:3001/api/get-job-offerts?pages=3&perPage=50`
  );
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

  useEffect(() => {
    const cached = localStorage.getItem("offerts");
    const parsed = cached ? JSON.parse(cached) : null;

    if (parsed && Date.now() < parsed.expiry) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(parsed.res.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(parsed.res.length / itemsPerPage));
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
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={9}
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
    </>
  );
};

const JobOffertsPage = () => {
  return (
    <>
      <JobOfferttDetailsComponent />
      <div className={styles.page}>
        <Navbar hideHeadder={true} />
        <h1 className={styles.header}>Przeglądaj oferty pracy</h1>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <PaginatedItems itemsPerPage={9} />
          </div>
        </div>
        <div className={styles.showMoreOfferts}></div>
        <footer className={styles.footer}>
          <p>Tu coś kiedy bedzie</p>
        </footer>
      </div>
    </>
  );
};

export default JobOffertsPage;
