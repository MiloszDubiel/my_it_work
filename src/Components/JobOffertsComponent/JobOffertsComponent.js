import React, { use, useEffect, useState } from "react";
import axios from "axios";

const fetchData = async () => {
  let request = await axios.get(
    "http://localhost:3001/api/get-job-offerts?pages=1"
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
            <div>
              <span>{offert.title}</span>
              <span>{offert.companyName}</span>
            </div>
            <div></div>
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
