import React from "react";
import styles from "./jobDetails.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";

const fetchData = async (link) => {
  const request = await axios.post(
    `http://192.168.100.2:3001/api/get-ofert-details`,
    {
      link,
    }
  );
  return request.data;
};

const JobOfferttDetailsComponent = ({ styles1 }) => {
  let [offert, setOffert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateOffert = () => {
      const stored = localStorage.getItem("currentOfert");
      if (stored) setOffert(JSON.parse(stored));
    };
    updateOffert();
    window.addEventListener("ofert-selected", updateOffert);
  }, []);

  if (
    document.querySelector("#showOfert")?.classList.contains(styles.showOfert)
  ) {
    fetchData(offert.link).then((res) => console.log(res));
  }

  const content = (
    <div className={styles.searchOffertsDiv} id="showOfert">
      <div className={styles.searchOfferts}>
        <div className={styles.closeWindow}>
          <p style={{ fontSize: "26px" }}>Filtruj oferty</p>
          <IoCloseOutline
            onClick={() => {
              document
                .querySelector("#showOfert")
                .classList.remove(styles.showOfert);
            }}
          />
        </div>
        <div className={styles.mainFilters}>
          <div className={styles.setFilter}>
            <button>Resetuj</button>
            <button>Zastosuj</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className={styles.loader}>
          <div className={styles.loaderAnimation}></div>

          <p style={{ textAlign: "center" }}>Wczytywanie ofert...</p>
        </div>
      ) : null}
      {content}
    </>
  );
};

export default JobOfferttDetailsComponent;
