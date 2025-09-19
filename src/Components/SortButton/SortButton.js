import React from "react";
import styles from "./SortButton.module.css";

const SortButton = ({ offertPage, employersPage, candidatePage }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          onChange={(e) => {
            sessionStorage.setItem("sort-option", e.target.value);
            window.dispatchEvent(new Event("changed-sort-option"));
          }}
        >
          <option value="default" defaultValue="default">
            Domyślnie
          </option>
          <option value="title-a-z">Tytuł oferty A-Z</option>
          <option value="title-z-a">Tytuł oferty Z-A</option>
          <option value="name-a-z">Nazwa firmy A-Z</option>
          <option value="name-z-a">Nazwa firmy Z-A</option>
          <option value="newest">Od najnowszej</option>
          <option value="oldest">Od najstareszej</option>
        </select>
        <span className={styles.chev} aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
};

export default SortButton;
