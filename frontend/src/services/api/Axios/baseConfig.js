import axios from 'axios';
import {
  getLocalStorage,
  removeLocalStorage,
} from '../../../utils/localStorageUtility';


const BaseURL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: BaseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage('token') || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response?.status == 401 || error.response?.status == 403) &&
      window.location.pathname.includes('/Inicio')
    ) {
      removeLocalStorage('token');
      removeLocalStorage('user_id');
      window.location.href = '/error500';
    }
    return Promise.reject(error);
  },
);

export default instance;
