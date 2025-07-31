import styles from "./job.module.css";
import JobOfferttDetailsComponent from "../JobOffertDetails/JobOfertsDetailsComponent";
import Navbar from "../NavBar/NavBar";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import jobOfertsStyle from "../JobOffertDetails/jobDetails.module.css";

const fetchData = async () => {
  const request = await axios.get(
    `http://192.168.100.2:3001/api/get-job-offerts?pages=3&perPage=50`
  );
  return request.data;
};

const items = [...Array(33).keys()];

function Items({ currentItems, ofertDetailsStyle }) {
  console.log(document.querySelector("#showOfert"));
  return (
    <>
      {currentItems &&
        currentItems.map((el, index) => (
          <div
            className={styles.offerts}
            key={index}
            onClick={() => {
              document
                .querySelector("#showOfert")
                .classList.add(ofertDetailsStyle.showOfert);
              localStorage.setItem("currentOfert", JSON.stringify(el));
              window.dispatchEvent(new Event("ofert-selected"));
            }}
          >
            <div className={styles.companyImg}>
              <img src={el.img} width={80} />
            </div>
            <div className={styles.info}>
              <div className={styles.info1}>
                <span style={{ fontWeight: "bold", paddingTop: "10px" }}>
                  {el.title}
                </span>
                <span style={{ fontSize: "12px", paddingTop: "2px" }}>
                  {el.companyName}
                </span>
              </div>
              <div className={styles.info2}>
                <div>
                  <span>
                    {" "}
                    <CiLocationOn />
                    {el.workingMode}
                  </span>
                  <span>
                    <BsFileText />
                    {el.contractType}
                  </span>
                  <span>
                    <MdGrading />
                    {el.experience}
                  </span>
                </div>
                <div className={styles.box}>
                  {el.technologies.map((ele) => {
                    return (
                      <>
                        <span className={styles.ellipsis} data-text={ele}>
                          {ele}
                        </span>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.addToFavorite}>
              <MdFavorite />
            </div>
          </div>
        ))}
    </>
  );
}

function PaginatedItems({ itemsPerPage }) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [offerts, setOfferts] = useState(null);

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("offerts")));

    if (
      JSON.parse(localStorage.getItem("offerts")) &&
      offerts &&
      JSON.parse(localStorage.getItem("offerts"))[0].companyName ===
        offerts[0].companyName
    ) {
      let items = JSON.parse(localStorage.getItem("offerts"));
      const endOffset = itemOffset + itemsPerPage;

      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    } else {
      fetchData().then((res) => {
        console.log(res);
        setOfferts(res);
        localStorage.setItem("offerts", JSON.stringify(res));
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(res.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(res.length / itemsPerPage));
      });
    }
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={9}
        previousLabel="< previous"
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
}

const JobOffertsPage = () => {
  return (
    <>
      <JobOfferttDetailsComponent />
      <div className={styles.page}>
        <Navbar hideHeadder={true} />
        <h1 className={styles.header}>Praca w IT</h1>
        <h2 className={styles.header} style={{ marginTop: 0 }}>
          Najnowsze oferty pracy
        </h2>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <PaginatedItems
              itemsPerPage={9}
              ofertDetailsStyle={jobOfertsStyle}
            />
            ;
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
