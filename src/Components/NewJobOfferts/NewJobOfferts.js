import { useEffect, useState } from "react";
import axios from "axios";
import Offert from "../OffertComponent/Offert";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const CACHE_KEY = "jobOffertsCache";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minut

const fetchData = async (amount) => {
  const request = await axios.get(`http://192.168.100.2:3001/api/job-offerts`);
  return request.data;
};

const JobOfferttsComponent = ({ amount }) => {
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
      jobOffertsDivs.push(<Offert offert={offert} index={i} />);
    }
  }
  return (
    <>
      {isLoading ? <LoadingComponent /> : null}
      {jobOffertsDivs}
    </>
  );
};

export default JobOfferttsComponent;
