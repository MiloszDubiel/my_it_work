import { useState, useEffect, useRef } from "react";
import Navbar from "../NavBar/NavBar";
import styles from "./employers.module.css";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ReactPaginate from "react-paginate";
import Footer from "../Footer/Fotter";
import Filter from "../FilterComponent/Filter";

const fetchData = async () => {
  const request = await axios.get(`http://192.168.100.2:3001/api/employers`);
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
                <img width={80} src={el.img} />
              </div>
              <div className={styles.info}>
                <div className={styles.info1}>
                  <span
                    style={{
                      fontWeight: "bold",
                      paddingTop: "10px",
                      gap: "20px",
                      display: "flex",
                    }}
                  >
                    {el.companyName}
                  </span>
                  <span style={{ fontSize: "12px", paddingTop: "2px" }}></span>
                </div>
                <div className={styles.info2}>
                  <div>
                    <span>
                      <CiLocationOn />
                      <button
                        onClick={(e) => {
                          if (JSON.parse(el.locations)[1][0].length !== 0) {
                            e.target.parentElement.parentElement
                              .querySelector(`.${styles.cities}`)
                              .classList.toggle(styles.showCities);
                          }
                        }}
                        style={{ all: "unset" }}
                      >
                        {JSON.parse(el.locations)[0]}
                      </button>
                      <div className={styles.cities}>
                        {JSON.parse(el.locations)[1][0].length !== 0
                          ? JSON.parse(el.locations)[1][0].map((tag) => {
                              return <span>{tag}</span>;
                            })
                          : ""}
                      </div>
                    </span>
                  </div>
                  <div className={styles.box}>
                    {JSON.parse(el.technologies)[0].map((el) => {
                      return (
                        <>
                          <span className={styles.ellipsis} data-text={el}>
                            {el}
                          </span>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.addToFavorite}>
                <button className={styles.apply}>Pokaż oferty pracy</button>
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
      <Filter employersPage={true} />
      <div className={styles.page}>
        <h1 className={styles.header}>
          Pracodawcy w IT{" "}
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

export default EmployersComponent;
