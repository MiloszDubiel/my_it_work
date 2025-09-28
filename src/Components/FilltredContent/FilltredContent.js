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
import Employer from "../Employer/Employer";

const fetchData = async (offertPage, employersPage, candidatePage, state) => {
  if (offertPage) {
    try {
      const request = await axios.post(
        `http://localhost:5000/api/job-offerts/filltred`,
        {
          state,
        }
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }
  if (employersPage) {
    try {
      const request = await axios.post(
        `http://localhost:5000/api/employers/filltred`,
        {
          state,
        }
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }
  if (candidatePage) {
    try {
      const request = await axios.post(
        `http://localhost:5000/api/candidate/filltred`,
        {
          state,
        }
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }
};

const Items = ({ currentItems, offertPage, employersPage, candidatePage }) => {
  if (currentItems === "Error") {
    return <div className={styles.error}>Nie znaleziono ofert</div>;
  }

  return (
    <>
      {currentItems &&
        (offertPage
          ? currentItems.map((el, index) => (
              <Offert offert={el} index={index} />
            ))
          : employersPage
          ? currentItems.map((el, index) => {
              return <Employer offert={el} index={index} />;
            })
          : " ")}
    </>
  );
};

const PaginatedItems = ({
  itemsPerPage,
  offertPage,
  employersPage,
  candidatePage,
  state,
}) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [offerts, setOfferts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData(offertPage, employersPage, candidatePage, state).then((res) => {
      if (res.length < 1) {
        setCurrentItems("Error");
        return;
      }
      localStorage.setItem("fillteredOfferts", JSON.stringify({ res }));
      setOfferts(res);
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(res.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(res.length / itemsPerPage));
      setIsLoading(false);
    });
  }, [
    itemOffset,
    itemsPerPage,
    offertPage,
    employersPage,
    candidatePage,
    state,
  ]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % offerts.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <Items
        currentItems={currentItems}
        offertPage={offertPage}
        employersPage={employersPage}
        candidatePage={candidatePage}
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

  console.log(state);

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
            className={styles.filter}
          >
            Filtruj
          </button>
        </h1>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <PaginatedItems
              itemsPerPage={9}
              state={state}
              candidatePage={candidatePage}
              offertPage={offertPage}
              employersPage={employersPage}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FilltredContent;
