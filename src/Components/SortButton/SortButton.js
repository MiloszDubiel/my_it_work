import React from "react";
import styles from "./SortButton.module.css";

export function Sort(copyOfferts, option) {
  try {
    switch (option) {
      case "default": {
        copyOfferts?.sort((a, b) => {
          const nameA = a.id;
          const nameB = b.id;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        return copyOfferts;
      }
      case "title-a-z": {
        copyOfferts?.sort((a, b) => {
          const nameA = a.title.toUpperCase();
          const nameB = b.title.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        return copyOfferts;
      }
      case "title-z-a": {
        copyOfferts?.sort((a, b) => {
          const nameA = a.title.toUpperCase();
          const nameB = b.title.toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        return copyOfferts;
      }
      case "name-a-z": {
        copyOfferts?.sort((a, b) => {
          const nameA = a.companyName.toUpperCase();
          const nameB = b.companyName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        return copyOfferts;
      }
      case "name-z-a": {
        copyOfferts?.sort((a, b) => {
          const nameA = a.companyName.toUpperCase();
          const nameB = b.companyName.toUpperCase();
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        return copyOfferts;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

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

          {offertPage ? (
            <>
              {" "}
              <option value="title-a-z">Tytuł oferty A-Z</option>
              <option value="title-z-a">Tytuł oferty Z-A</option>
            </>
          ) : (
            ""
          )}
          <option value="name-a-z">Nazwa firmy A-Z</option>
          <option value="name-z-a">Nazwa firmy Z-A</option>
          {offertPage ? (
            <>
              <option value="newest">Od najnowszej</option>
              <option value="oldest">Od najstareszej</option>
            </>
          ) : (
            ""
          )}
        </select>
        <span className={styles.chev} aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
};

export default SortButton;
