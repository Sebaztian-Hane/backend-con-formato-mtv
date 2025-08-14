import { useState, useEffect } from 'react';
import { getPendingAppointments } from '../service/homeService';
import dayjs from 'dayjs';

export const useTodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingAppointments();

      if (!Array.isArray(data)) {
        setAppointments([]);
        return;
      }

      // Filtrar solo las citas del día actual
      const today = dayjs().format('YYYY-MM-DD');
      const todayAppointments = data.filter(
        (item) => item.appointment_date === today,
      );

      // Formatear los datos para el componente
      const formattedAppointments = todayAppointments.map((item) => {
        return {
          name: item.full_name || ' ',
          service: item.appointment_type,
          time: dayjs(item.appointment_hour, 'HH:mm:ss').format('HH:mm'),
          details: item, // Guardamos todos los detalles
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  return { appointments, loading, error, refetch: fetchTodayAppointments };
};
