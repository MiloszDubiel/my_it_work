
import styles from "./InfoModal.module.css";

const InfoModal = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeBtn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default InfoModal;
