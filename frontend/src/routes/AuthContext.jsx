// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { get } from '../services/api/Axios/MethodsGeneral';
import {
  getLocalStorage,
  persistLocalStorage,
} from '../utils/localStorageUtility';

import { useToast } from '../services/toastify/ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  // Modo demo: siempre autenticado y con rol admin (1)
  const [authChecked, setAuthChecked] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState(1); // 1 = admin

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        userRole,
        setIsAuthenticated,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
