import React from "react";
import styles from "./SortButton.module.css";

export function Sort(copyOfferts, option) {
  try {
    switch (option) {
      case "default":
        return copyOfferts.sort((a, b) => a.id - b.id);

      case "title-a-z":
        return copyOfferts.sort((a, b) => {
          const nameA = a.title?.toUpperCase() || "";
          const nameB = b.title?.toUpperCase() || "";
          return nameA.localeCompare(nameB);
        });

      case "title-z-a":
        return copyOfferts.sort((a, b) => {
          const nameA = a.title?.toUpperCase() || "";
          const nameB = b.title?.toUpperCase() || "";
          return nameB.localeCompare(nameA);
        });

      case "name-a-z":
        return copyOfferts.sort((a, b) => {
          const nameA = a.companyName?.toUpperCase() || "";
          const nameB = b.companyName?.toUpperCase() || "";
          return nameA.localeCompare(nameB);
        });

      case "name-z-a":
        return copyOfferts.sort((a, b) => {
          const nameA = a.companyName?.toUpperCase() || "";
          const nameB = b.companyName?.toUpperCase() || "";
          return nameB.localeCompare(nameA);
        });

      case "newest":
        return copyOfferts.sort((a, b) => {
          const toDate = (str) => {
            if (!str) return Infinity;
            const [dd, mm, yyyy] = str.split(".");
            return new Date(`${yyyy}-${mm}-${dd}`).getTime();
          };
          return toDate(b.active_to) - toDate(a.active_to);
        });

      case "oldest":
        return copyOfferts.sort((a, b) => {
          const toDate = (str) => {
            if (!str) return Infinity;
            const [dd, mm, yyyy] = str.split(".");
            return new Date(`${yyyy}-${mm}-${dd}`).getTime();
          };
          return toDate(a.active_to) - toDate(b.active_to);
        });

      default:
        return copyOfferts;
    }
  } catch (err) {
    console.error(err);
    return copyOfferts;
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
              <option value="newest">Najdłuższa ważność</option>
              <option value="oldest">Najbliższa data wygaśnięcia</option>
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
