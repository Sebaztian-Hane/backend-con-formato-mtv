import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { CaretLeft, ArrowLeft } from '@phosphor-icons/react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router';
dayjs.locale('es');

const { Header } = Layout;
const { Text } = Typography;

const CustomHeader = ({ title, isBack = true }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm:ss'));
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('dddd, D [de] MMMM [del] YYYY'),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm:ss'));
      setCurrentDate(dayjs().format('dddd, D [de] MMMM [del] YYYY'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const back = () => {
    navigate(-1);
  };
  return (
    <div className={styles.headerContent}>
      <div className={styles.headerLeft}>
        {isBack && (
          <button className={styles.backButton} onClick={back}>
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <Text className={styles.headerTitle}>{title || ''}</Text>
      </div>
      <div className={styles.headerRight}>
        <Text className={styles.headerTime}>{currentTime}</Text>
        <Text className={styles.headerDate}>{currentDate}</Text>
      </div>
    </div>
  );
};

export default CustomHeader;
