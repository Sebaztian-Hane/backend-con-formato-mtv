import { createContext, useContext, useState } from 'react';
import Toast from './Toast';
import { defaultConfig as toastConfig } from './toastConfig';
import styles from './Toastify.module.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showToast = (type, backendMessage) => {
    const config = toastConfig[type];
    if (!config) return;

    const id = Date.now();

    const toastData = {
      ...config,
      id,
      message: backendMessage || config.message,
    };

    setNotifications((prev) => [...prev, toastData]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== id));
    }, toastData.duration || 5000);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.notifications}>
        {notifications.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => {}} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
