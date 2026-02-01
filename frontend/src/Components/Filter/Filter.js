import React, { useState } from "react";
import styles from "./JobFilter.module.css";
import { useNavigate } from "react-router-dom";

const Filter = ({ candidatesPage, offersPage, employersPage }) => {
  const [filters, setFilters] = useState({
    title: "",
    experience: "",
    location: "",
    companyName: "",
    nip: "",
    technologia: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    if (offersPage) {
      navigate("/job-offers/filltred", { state: filters });
    } else if (employersPage) {
      navigate("/employers/filltred", { state: filters });
    } else {
      navigate("/candidates/filltred", { state: filters });
    }
  };

  return (
    <div className={styles.filterContainer}>
      <h2>
        {offersPage
          ? "Filtruj oferty pracy"
          : employersPage
            ? "Filtruj pracodawców"
            : "Filtruj kandydatów"}
      </h2>

      <div className={styles.filters}>
        {/* Nazwa stanowiska */}
        {offersPage && (
          <div className={styles.filterGroup}>
            <label htmlFor="title">Stanowisko</label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleChange}
              placeholder="np. Frontend Developer"
            />
          </div>
        )}

        {/* Nazwa firmy */}
        {employersPage && (
          <div className={styles.filterGroup}>
            <label htmlFor="title">Nazwa firmy</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={filters.companyName}
              onChange={handleChange}
              placeholder="Asseco"
            />
          </div>
        )}
        {/*NIP */}
        {employersPage && (
          <div className={styles.filterGroup}>
            <label htmlFor="NIP">NIP</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.nip}
              onChange={handleChange}
              placeholder="NIP"
            />
          </div>
        )}

        {/*Technologia */}
        {candidatesPage && (
          <div className={styles.filterGroup}>
            <label htmlFor="title">Technologia</label>
            <input
              type="text"
              id="technologia"
              name="technologia"
              value={filters.technologia}
              onChange={handleChange}
              placeholder="JavaScript"
            />
          </div>
        )}

        {/* Doświadczenie */}
        {offersPage && (
          <div className={styles.filterGroup}>
            <label htmlFor="experience">Doświadczenie</label>
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleChange}
            >
              <option value="">Dowolne</option>
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid / Regular</option>
              <option value="Senior">Senior</option>
              <option value="Lead / Principal">Lead / Principa</option>
            </select>
          </div>
        )}

        {/* Lokalizacja */}

        {(offersPage || candidatesPage) && (
          <div className={styles.filterGroup}>
            <label htmlFor="location">Lokalizacja</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Warszawa, Kraków..."
            />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.setBttn} onClick={handleSearch}>
          Szukaj
        </button>
      </div>
    </div>
  );
};

export default Filter;
