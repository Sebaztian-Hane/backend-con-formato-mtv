import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './Error404.module.css';
import imgerror from '../../assets/Img/Error/imageError404.png';
import { initializeParticles } from '../../hooks/loginpacticles';
import { useNavigate } from 'react-router';

const Error404 = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Inicio');
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
          style={{ width: '320px', maxWidth: '90%' }}
        />
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>
          No pudimos encontrar la página que buscas.
          <br />
          Quizá fue eliminada, movida o nunca existió.
        </p>
        <Button
          className={styles.homeButton}
          size="large"
          onClick={handleButtonClick}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default Error404;
