import { useEffect, useState } from "react";
import axios from "axios";
import Offert from "../OffertComponent/Offert";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import OffertInfo from "../OffertComponent/OffertInfo";

const fetchData = async (amount) => {
  const request = await axios.get(`http://localhost:5000/api/job-offerts`);
  return request.data;
};

const JobOfferttsComponent = ({ amount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobOfferts, setJobOfferts] = useState(null);
  const [details, setDetails] = useState(<OffertInfo />);

  useEffect(() => {
    setIsLoading(true);
    fetchData(amount).then((data) => {
      setJobOfferts(data);
      setIsLoading(false);
    });
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
