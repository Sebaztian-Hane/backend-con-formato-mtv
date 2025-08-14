import React, { useEffect, useState, useRef } from 'react';
import styles from './Toastify.module.css';

const Toast = ({
  id,
  type = 'info',
  icon = 'fa-solid fa-circle-info',
  title = 'Información',
  message = 'Aquí hay información importante',
  duration = 5000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(id);
      }, 300);
    }, duration);

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ''}`}
      role="alert"
    >
      <i className={icon}></i>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
