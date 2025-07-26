import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

const fetchData = async () => {
  let request = await axios.get(
    "http://192.168.100.2:3001/api/get-job-offerts?pages=1"
  );
  let response = await request.data;

  return response;
};

const JobOfferttsComponent = ({ amount, styles }) => {
  const [isLoading, setIsLoading] = useState(false);
  let [jobOfferts, setJobOfferts] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchData().then((data) => {
      setJobOfferts(data);
      setIsLoading(false);
    });
  }, []);
  let jobOffertsDivs = [];

  for (let i = 0; i < amount; i++) {
    if (jobOfferts == null) break;
    else {
      let offert = jobOfferts[i];

      jobOffertsDivs.push(
        <div className={styles.offerts} key={i}>
          <div className={styles.companyImg}>
            <img src={offert.img} width={80} />
          </div>
          <div className={styles.info}>
            <div className={styles.info1}>
              <span style={{ fontWeight: "bold", paddingTop: "10px" }}>
                {offert.title}
              </span>
              <span style={{ fontSize: "12px", paddingTop: "2px" }}>
                {offert.companyName}
              </span>
            </div>
            <div className={styles.info2}>
              <div>
                <span>
                  {" "}
                  <CiLocationOn />
                  {offert.workingMode}
                </span>
                <span>
                  <BsFileText />
                  {offert.contractType}
                </span>
                <span>
                  <MdGrading />
                  {offert.experience}
                </span>
              </div>
              <div>
                {offert.technologies.map((el) => {
                  return <span>{el}</span>;
                })}
              </div>
            </div>
          </div>
          <div className={styles.addToFavorite}>
            <MdFavorite />
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {isLoading ? (
        <div className={styles.loader}>
          <div className={styles.loaderAnimation}></div>

          <p style={{ textAlign: "center" }}>Wczytywanie ofert...</p>
        </div>
      ) : null}
      {jobOffertsDivs}
    </>
  );
};

export default JobOfferttsComponent;
