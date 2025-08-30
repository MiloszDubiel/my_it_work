import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/NavBar";

const FilltredContent = ({ offertPage, candidatePage, employersPage }) => {
  const location = useLocation();
  const { state } = location;

  console.log(state?.parma);
  return (
    <>
      <Navbar
        offertPage={offertPage}
        candidatePage={candidatePage}
        employersPage={employersPage}
      />
    </>
  );
};

export default FilltredContent;
