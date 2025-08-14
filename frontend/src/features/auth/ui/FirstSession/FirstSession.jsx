import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import styles from './FirstSession.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../../../../hooks/loginpacticles';
import { useAuth } from '../../hook/authHook';

function FirstSession() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [code, setCode] = useState('');
  const [sendCode, setSendCode] = useState(false);
  const [sending, setSending] = useState(false); // Estado para loading de enviar código
  const [verifying, setVerifying] = useState(false); // Estado para loading de verificación

  const { validateCode, sendVerifyCode } = useAuth();

  useEffect(() => {
    const cleanup = initializeParticles();
    return cleanup;
  }, []);

  const onSubmit = async () => {
    setVerifying(true); // Activar loading de verificación
    try {
      const codeVerification = {
        code: code,
      };
      await validateCode(codeVerification);
    } finally {
      setVerifying(false); // Desactivar loading de verificación
    }
  };

  const sendCodeVerification = async () => {
    setSending(true); // Activar loading de envío
    try {
      await sendVerifyCode();
      setSendCode(true);
    } finally {
      setSending(false); // Desactivar loading de envío
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: '#414141',
            colorErrorBg: '#666666',
            colorErrorText: '#fff',
            colorErrorBgHover: '#414141',
            hoverBorderColor: 'transparent',
            activeBorderColor: 'transparent',
            activeBg: '#666666',
            addonBg: 'transparent',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          },
          Button: {
            colorPrimary: '#1b7b46',
            colorPrimaryHover: '#16623a',
            colorPrimaryActive: '#144e30',
            colorTextLightSolid: '#fff',
            // Estilos para el loading
            loadingBg: '#1b7b46',
            loadingColor: '#fff',
            loadingBorderColor: '#1b7b46',
          },
        },
        token: {
          colorPrimary: '#fff', // Color del spinner
        },
      }}
    >
      <div>
        <div id="particles-js" className={styles.particlesJs}></div>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <img src={logo} className={styles.logo} alt="Logo de la empresa" />
            <h2>¡Es tu primera vez!</h2>
            {sendCode ? (
              <p>
                Ingresa el código de verificación que te hemos enviado a tu
                correo electrónico
              </p>
            ) : (
              <p>
                Dale a enviar codigo para que te enviamos un código de
                verificación
              </p>
            )}
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
            >
              {sendCode ? (
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: 'Por favor ingresa el codigo' },
                  ]}
                >
                  <div className={styles.inputContainer}>
                    <Input.OTP
                      variant="filled"
                      placeholder="######"
                      className={styles.input}
                      onChange={(text) => setCode(text)}
                    />
                  </div>
                </Form.Item>
              ) : (
                <div className={styles.buttoncontainer}>
                  <Button
                    type="link"
                    htmlType="button"
                    className={styles.btnSendCode}
                    onClick={sendCodeVerification}
                    loading={sending} // Loading para enviar código
                  >
                    {sending ? 'Enviando...' : 'Enviar código'}
                  </Button>
                </div>
              )}

              {sendCode && (
                <Form.Item className={styles.buttoncontainer}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginFormButton}
                    loading={verifying} // Loading para verificación
                    disabled={code.length !== 6} // Deshabilitar si el código no está completo
                  >
                    {verifying ? 'Verificando...' : 'Verificar'}
                  </Button>
                </Form.Item>
              )}
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

export default FirstSession;
