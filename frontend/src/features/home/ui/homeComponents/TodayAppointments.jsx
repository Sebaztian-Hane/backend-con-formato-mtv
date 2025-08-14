import React from 'react';
import styles from './TodayAppointments.module.css';
import { CheckCircle } from '@phosphor-icons/react';
import { useTodayAppointments } from '../../hook/homeHook';
import { Empty, Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const TodayAppointments = () => {
  const { appointments, loading } = useTodayAppointments();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Citas para hoy</h2>
      <div className={styles.scrollArea}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <div
              key={`${appt.details.id}-${index}`}
              className={styles.appointment}
            >
              <div className={styles.appointmentContent}>
                <div className={styles.name}>{appt.name}</div>
                <div className={styles.details}>
                  {appt.service} - {appt.time}
                </div>
              </div>
              <div className={styles.check}>
                <CheckCircle size={22} />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Empty
              image={
                <CalendarOutlined style={{ fontSize: '48px', color: '#999' }} />
              }
              imageStyle={{ height: 60 }}
              description={<span>No hay citas para hoy</span>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TodayAppointments);
