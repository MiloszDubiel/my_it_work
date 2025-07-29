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
  let [offertDatails, setOffertDetails] = useState(null);

  useEffect(() => {
    const updateOffert = () => {
      const stored = localStorage.getItem("currentOfert");
      if (stored) setOffert(JSON.parse(stored));
    };
    updateOffert();
    window.addEventListener("ofert-selected", updateOffert);
  }, []);

  useEffect(() => {
    if (!!offert) {
      console.log(offert);
      fetchData(offert.link).then((res) => console.log(res));
    }
  });

  return (
    <div className={styles.conteiner} id="showWindow">
      <div className={styles.details}>
        <div className={styles.closeWindow}>
          <p style={{ fontSize: "26px" }}>Szczegóły oferty</p>
          <IoCloseOutline
            onClick={() => {
              document
                .querySelector("#showWindow")
                .classList.remove(styles1.showWindow);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobOfferttDetailsComponent;
