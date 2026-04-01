import styles from "./loading.module.css";

const LoadingComponent = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderAnimation}></div>
      <p style={{ textAlign: "center" }}>Wczytywanie ofert...</p>
    </div>
  );
};

export default LoadingComponent;
