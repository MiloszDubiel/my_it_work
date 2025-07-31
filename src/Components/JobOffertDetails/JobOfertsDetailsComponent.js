import React, { useRef } from "react";
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
  const [content, setContent] = useState(null);

  let prevOffert = useRef(null);

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
      setOffertDetails(res);

      setContent(
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
              <div className={styles.offertInfo}>
                <div>
                  <img scr={offert.img} alt="logo" />
                </div>
                <div>
                  <div className={styles.detail}>
                    <p>{offert.title}</p>
                    <span>{offert.companyName}</span>
                  </div>
                </div>
              </div>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <p>Stawka godzinowa:</p>
                  <span>{res[0].moneyOfHours}</span>
                </div>
                <div className={styles.detail}>
                  <p>Typ umowy:</p>
                  <span>{res[0].typeOfContract}</span>
                </div>
                {res[0].restInfo.map((el) => {
                  return (
                    <div className={styles.detail}>
                      <p>{el[0][0]}:</p>
                      <span>{el[0][1]}</span>
                    </div>
                  );
                })}
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
        content
      )}
    </>
  );
};

export default JobOfferttDetailsComponent;
