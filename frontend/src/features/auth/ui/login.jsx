import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider, message } from 'antd';
import styles from './Login.module.css';
import logo from '../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { Eye, EyeSlash, Envelope } from '@phosphor-icons/react';
import { initializeParticles } from '../../../hooks/loginpacticles';
import { useNavigate } from 'react-router';
import { useToast } from '../../../services/toastify/ToastContext';
import { useAuth } from '../hook/authHook';
import { removeLocalStorage } from '../../../utils/localStorageUtility';
import { useAuth as useAuthentication } from '../../../routes/AuthContext';

function Login() {
  // Estados de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  // Definir el estado para la visibilidad de la contraseña
  const [passwordVisible, setPasswordVisible] = useState(false);

  //Toastify
  const { showToast } = useToast();

  //Navegación
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthentication();

  //////////Funciones simples///////////////////

  //Redirecciona a la página de olvido de contraseña
  const onForgotPassword = () => {
    navigate('/contraseñaolvidada');
  };

  //Efecto de partículas
  useEffect(() => {
    const cleanup = initializeParticles();
    removeLocalStorage('token');
    removeLocalStorage('user_id');
    removeLocalStorage('name');
    return cleanup;
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Inicio', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  //////////////////////////////////////////////

  //////////////Formulario///////////////////

  const onSubmit = () => {
    const credentials = { email, password };
    login(credentials);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: 'transparent',
            hoverBorderColor: 'transparent',
            activeBorderColor: 'transparent',
            activeBg: 'transparent',
            addonBg: 'transparent',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          },
          Button: {
            colorPrimary: '#1b7b46',
            colorPrimaryHover: '#16623a',
            colorPrimaryActive: '#144e30',
            colorTextLightSolid: '#fff',
            // Estilos para el estado loading
            loadingActiveBorderColor: '#1b7b46',
            loadingBg: '#1b7b46',
            loadingColor: '#fff',
          },
        },
        // Estilos para el spinner de loading
        token: {
          colorPrimary: '#fff',
          colorBgContainer: '#fff',
          colorText: '#fff',
        },
      }}
    >
      <div>
        <div id="particles-js" className={styles.particlesJs}></div>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <img src={logo} className={styles.logo} alt="Logo de la empresa" />
            <h2>Bienvenido al Sistema del Centro de Reflexoterapia</h2>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor ingresa tu correo!' },
                ]}
              >
                <div className={styles.inputContainer}>
                  <Envelope size={24} weight="bold" />
                  <Input
                    placeholder="Correo"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu contraseña!',
                  },
                ]}
              >
                <div className={styles.inputContainer}>
                  {passwordVisible ? (
                    <EyeSlash
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Item>

              {/* <a className={styles.forgot} onClick={onForgotPassword}>
                Olvide mi Contraseña
              </a> */}
              <Form.Item className={styles.buttonContainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.loginButton}
                  loading={loading}
                >
                  {loading ? 'Cargando...' : 'Entrar'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className={styles.footer}>
          © 2025 Centro de Reflexoterapia - Todos los derechos reservados
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Login;
