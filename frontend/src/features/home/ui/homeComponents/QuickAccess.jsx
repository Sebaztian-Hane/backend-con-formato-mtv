import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickAccess.module.css';
import { Table, FileDoc } from '@phosphor-icons/react';

const QuickAccess = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Pacientes',
      path: '/Inicio/pacientes',
    },
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Citas',
      path: '/Inicio/citas',
    },
    {
      icon: <FileDoc size={24} className={styles.icon} weight="fill" />,
      text: 'Reportes',
      path: '/Inicio/reportes',
    },
    {
      icon: <Table size={24} className={styles.icon} weight="fill" />,
      text: 'Tabla de Terapeutas',
      path: '/Inicio/terapeutas',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Accesos Rápidos</h2>
      <div className={styles.grid}>
        {quickLinks.map((link, index) => (
          <button
            key={index}
            className={styles.card}
            onClick={() => handleNavigation(link.path)}
          >
            {link.icon}
            <span>{link.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
