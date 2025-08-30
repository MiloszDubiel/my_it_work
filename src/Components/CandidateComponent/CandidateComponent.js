import React from "react";
import Navbar from "../NavBar/NavBar";
import Filter from "../FilterComponent/Filter";
const CandidateComponent = () => {
  return (
    <>
      <Navbar candidatePage={true} />
      <Filter candidatePage={true} />
      <h1>
        Kandydaci IT{" "}
        <button
          onClick={() => {
            document.querySelector("#filter").style.display = "flex";
          }}
        >
          Filtruj
        </button>
      </h1>
    </>
  );
};

export default CandidateComponent;
