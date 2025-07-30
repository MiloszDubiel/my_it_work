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
  const [offertDetails, setOffertDetails] = useState(null);
  useEffect(() => {
    const updateOffert = () => {
      const stored = localStorage.getItem("currentOfert");
      if (stored) setOffert(JSON.parse(stored));
    };
    updateOffert();
    window.addEventListener("ofert-selected", updateOffert);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!offert) return;
    fetchData(offert.link).then((res) => {
      setOffertDetails(
        <div className={styles.searchOffertsDiv} id="showOfert">
          <div className={styles.searchOfferts}>
            <div className={styles.closeWindow}>
              <p style={{ fontSize: "26px" }}>Szczegóły oferty</p>
              <IoCloseOutline
                onClick={() => {
                  document
                    .querySelector("#showOfert")
                    .classList.remove(styles.showOfert);
                }}
              />
            </div>
            <div className={styles.mainFilters}>
              <div className={styles.details}>
                <p>{res[0].moneyOfHours}</p>
              </div>
              <div className={styles.setFilter}>
                <button>Aplikuj</button>
              </div>
            </div>
          </div>
        </div>
      );
      setIsLoading(false);
    });
  }, [offert]);

  return (
    <>
      {isLoading ? (
        <div className={styles.searchOffertsDiv} id="showOfert">
          <div className={styles.searchOfferts}>
            <div className={styles.closeWindow}>
              <p style={{ fontSize: "26px" }}>Szczegóły oferty</p>
              <IoCloseOutline
                onClick={() => {
                  document
                    .querySelector("#showOfert")
                    .classList.remove(styles.showOfert);
                }}
              />
            </div>
            <div className={styles.loader}>
              <div className={styles.loaderAnimation}></div>
              <p style={{ textAlign: "center" }}>Wczytywanie ofert...</p>
            </div>
          </div>
        </div>
      ) : (
        offertDetails
      )}
    </>
  );
};

export default JobOfferttDetailsComponent;
