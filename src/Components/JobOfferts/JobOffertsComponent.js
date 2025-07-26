import { useEffect, useState } from "react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useCookies } from "react-cookie";

const CACHE_KEY = "jobOffertsCache";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minut

const fetchData = async (amount) => {
  const request = await axios.get(
    `http://192.168.100.2:3001/api/get-job-offerts?pages=1&perPage=${amount}`
  );
  return request.data;
};

const JobOfferttsComponent = ({ amount, styles }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobOfferts, setJobOfferts] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const cached = localStorage.getItem(CACHE_KEY);
    const parsed = cached ? JSON.parse(cached) : null;

    if (parsed && Date.now() < parsed.expiry) {
      setJobOfferts(parsed.data);
      setIsLoading(false);
    } else {
      fetchData(amount).then((data) => {
        setJobOfferts(data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            expiry: Date.now() + CACHE_DURATION_MS,
          })
        );
        setIsLoading(false);
      });
    }
  }, [amount]);

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
              <div className={styles.box}>
                {offert.technologies.map((el) => {
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
