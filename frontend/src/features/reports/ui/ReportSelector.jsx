import React from 'react';
import { Card } from 'antd';
import styles from './reports.module.css';

const ReportSelector = ({ options, selectedReport, onSelectReport }) => {
  return (
    <div className={styles.selectorContainer}>
      {options.map((opt) => (
        <Card
          key={opt.key}
          hoverable
          className={`${styles.reportCard} ${
            selectedReport === opt.key ? styles.selectedCard : ''
          }`}
          onClick={() => onSelectReport(opt.key)}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>{opt.icon}</div>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>{opt.title}</p>
              <p className={styles.cardDescription}>{opt.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportSelector;
