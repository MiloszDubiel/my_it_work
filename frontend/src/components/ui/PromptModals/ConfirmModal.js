import React from "react";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          <button className={styles.btnYes} onClick={() => onConfirm(true)}>
            Tak
          </button>

          <button className={styles.btnCancel} onClick={() => onCancel(false)}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
