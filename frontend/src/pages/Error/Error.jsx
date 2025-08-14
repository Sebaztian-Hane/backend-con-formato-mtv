import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './Error404.module.css';
import imgerror from '../../assets/Img/Error/imageError.png';
import { initializeParticles } from '../../hooks/loginpacticles';
import { useNavigate } from 'react-router';

const Error500 = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/');
  };
  useEffect(() => {
    const cleanup = initializeParticles();

    return cleanup;
  }, []);

  return (
    <div className={styles.errorBg}>
      {/* Contenedor para las partículas */}
      <div id="particles-js" className={styles.particlesJs}></div>

      <div className={styles.errorContent}>
        <img
          src={imgerror}
          alt="Error"
          className={styles.errorImage}
          style={{ width: '320px', maxWidth: '100%' }}
        />
        <h1 className={styles.title}>Oops!</h1>
        <p className={styles.subtitle}>
          Algo esta fallando.
          <br />
          Por favor, intenta iniciar sesion de nuevo o contactanos.
        </p>
        <Button
          className={styles.homeButton}
          size="large"
          onClick={handleButtonClick}
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
};

export default Error500;
