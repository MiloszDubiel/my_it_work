import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import styles from "./employers.module.css";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ReactPaginate from "react-paginate";

const fetchData = async () => {
  const request = await axios.get(
    `http://192.168.100.2:3001/api/get-job-employers`
  );
  return request.data;
};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minut

const Items = ({ currentItems }) => {
  return (
    <>
      {currentItems &&
        currentItems.map((el, index) => {
          return (
            <div
              className={styles.offerts}
              key={index}
              onLoad={() => {
                let el = document.querySelector(".pagination");

                if (el) {
                  el.style.display = "flex";
                }
              }}
            >
              <div className={styles.companyImg}>
                <img width={80} />
              </div>
              <div className={styles.info}>
                <div className={styles.info1}>
                  <span
                    style={{
                      fontWeight: "bold",
                      paddingTop: "10px",
                      gap: "20px",
                      display: "flex",
                      position: "relative",
                    }}
                  >
                    <button className={styles.apply}>Aplikuj</button>
                  </span>
                  <span style={{ fontSize: "12px", paddingTop: "2px" }}></span>
                </div>
                <div className={styles.info2}>
                  <div>
                    <span>
                      <CiLocationOn />
                    </span>
                    <span>
                      <BsFileText />
                    </span>
                    <span>
                      <MdGrading />
                    </span>
                  </div>
                  <div className={styles.box}></div>
                </div>
              </div>
              <div className={styles.addToFavorite}>
                <MdFavorite />
              </div>
            </div>
          );
        })}
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
    const cached = localStorage.getItem("employers");
    const parsed = cached ? JSON.parse(cached) : null;
    setIsLoading(true);

    if (parsed && Date.now() < parsed.expiry) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(parsed.res.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(parsed.res.length / itemsPerPage));
      setIsLoading(false);
    } else {
      fetchData().then((res) => {
        setOfferts(res);
        localStorage.setItem(
          "employers",
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
        JSON.parse(localStorage.getItem("employers")).res.length;
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
      <div className={styles.page}>
        <h1 className={styles.header}>Praca w IT</h1>
        <h2 className={styles.header} style={{ marginTop: 0 }}>
          Najnowsze oferty pracy
        </h2>
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

export default EmployersComponent;
