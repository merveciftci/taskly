import styles from "./ErrorMessage.module.css";

const ErrorMessage = ({ children }) => {
  return <div className={styles.message}>{children}</div>;
};

export default ErrorMessage;
