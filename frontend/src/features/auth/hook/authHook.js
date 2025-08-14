import {
  login as LoginService,
  logOut as LogOutService,
  validateCode as validateCodeService,
  changePassword as changePasswordService,
  sendVerifyCode as sendVerifyCodeService,
} from '../service/authService';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useToast } from '../../../services/toastify/ToastContext';
import {
  getLocalStorage,
  persistLocalStorage,
  removeLocalStorage,
} from '../../../utils/localStorageUtility';
import { useAuth as useAuthentication } from '../../../routes/AuthContext';
import { useUser } from '../../../context/UserContext';
import { useCompany } from '../../../context/CompanyContext';
import { get } from '../../../services/api/Axios/MethodsGeneral';

export const useAuth = () => {
  const { showToast } = useToast();
  const { setIsAuthenticated, setUserRole } = useAuthentication();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { refetchPhoto, refetchProfile } = useUser();
  const { refetchCompanyLogo, refetchCompanyInfo } = useCompany();

  const fetchUserRole = async () => {
    try {
      const res = await get('get-role');
      if (res.data) {
        setUserRole(res.data.role_id);
        persistLocalStorage('user_role', res.data.role_id);
        persistLocalStorage('name', res.data.name);
        persistLocalStorage('user_id', res.data.user_id);
        return true;
      }
      return false;
    } catch (err) {
      showToast(
        'intentoFallido',
        'No se pudo obtener la información del usuario.',
      );
      return false;
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const loginData = await LoginService(credentials);

      if (loginData.status === 200 && loginData.data) {
        // Verificar si es el primer inicio de sesión
        if (loginData.data.first_login) {
          // Es primer inicio - guardar user_id y redirigir a primer inicio
          persistLocalStorage('user_id', loginData.data.user_id);
          showToast('inicioSesionExitoso');
          navigate('/primerInicio');
        } else {
          // No es primer inicio - flujo normal
          persistLocalStorage('token', loginData.data.token);
          setIsAuthenticated(true);

          const roleFetched = await fetchUserRole();

          if (roleFetched) {
            navigate('/Inicio');
            showToast('inicioSesionExitoso');

            (async () => {
              await refetchPhoto();
              await refetchCompanyLogo();
              await refetchProfile();
              await refetchCompanyInfo();
            })();
          } else {
            removeLocalStorage('token');
            setIsAuthenticated(false);
          }
        }
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await LogOutService();
      showToast('cierreSesion');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      removeLocalStorage('token');
      removeLocalStorage('user_id');
      removeLocalStorage('name');
      removeLocalStorage('user_role');
      setIsAuthenticated(false);
      setUserRole(null);
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const validateCode = async (code) => {
    try {
      const data = await validateCodeService(code, getLocalStorage('user_id'));
      // El backend responde con { valid: true/false, message: ... }
      if (data.data?.valid) {
        showToast('codigoVerificado');
        persistLocalStorage('token', data.data.token);
        navigate('/cambiarContraseña');
      } else {
        showToast('intentoFallido', data.data?.message || 'Código incorrecto');
        // No navega ni permite avanzar
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await changePasswordService(data);
      if (response.status == '200') {
        showToast('contraseñaCambiada');
        // Después de cambiar contraseña, obtener datos del usuario y redirigir
        setIsAuthenticated(true);
        const roleFetched = await fetchUserRole();
        if (roleFetched) {
          navigate('/Inicio');
          (async () => {
            await refetchPhoto();
            await refetchCompanyLogo();
            await refetchProfile();
            await refetchCompanyInfo();
          })();
        }
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  const sendVerifyCode = async () => {
    try {
      const response = await sendVerifyCodeService(getLocalStorage('user_id'));
      if (response.status == '200') {
        showToast('codigoEnviado');
      } else {
        showToast('intentoFallido');
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message || null;
      showToast('intentoFallido', backendMsg);
    }
  };

  return {
    login,
    loading,
    logOut,
    validateCode,
    changePassword,
    sendVerifyCode,
  };
};
