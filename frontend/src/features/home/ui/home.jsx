import React from 'react';
import WelcomeBanner from './homeComponents/WelcomeBanner';
import QuickAccess from './homeComponents/QuickAccess';
import TodayAppointments from './homeComponents/TodayAppointments';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <WelcomeBanner />
      <div className={styles.sections}>
        <QuickAccess />
        <TodayAppointments />
      </div>
    </div>
  );
};

export default Home;
