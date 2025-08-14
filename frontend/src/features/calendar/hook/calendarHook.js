import { useState, useEffect } from 'react';
import {
  getPendingAppointments,
  getPaginatedAppointments,
  getPaginatedAppointmentsRange,
  getCompletedAppointmentsRange,
} from '../service/calendarService';
import dayjs from 'dayjs';

export const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener eventos del endpoint original (pendientes)
      const pendingPromise = getPendingAppointments();
      // 2. Obtener eventos del endpoint completados para el rango de hoy a dos meses después
      const today = dayjs();
      const twoMonthsLater = today.add(2, 'month');
      const completedPromise = getCompletedAppointmentsRange(
        today.format('YYYY-MM-DD'),
        twoMonthsLater.format('YYYY-MM-DD'),
        30,
        1,
      );
      // Esperar ambas peticiones en paralelo
      const [pendingData, completedData] = await Promise.all([
        pendingPromise,
        completedPromise,
      ]);

      // Mapear eventos pendientes
      let pendingEvents = Array.isArray(pendingData)
        ? pendingData.map((item) => {
            const start = dayjs(
              `${item.appointment_date}T${item.appointment_hour}`,
            );
            const end = start.add(1, 'hour');
            const patient_first_name = item.patient
              ? item.patient.name || ''
              : '';
            const patient_full_name = item.patient
              ? `${item.patient.name || ''} ${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : '';
            const therapist_full_name = item.therapist
              ? `${item.therapist.name || ''} ${item.therapist.paternal_lastname || ''} ${item.therapist.maternal_lastname || ''}`.trim()
              : '';
            const payment_type_name = item.payment_type
              ? item.payment_type.name
              : '';
            return {
              id: item.id,
              title: item.appointment_type,
              start: start.toDate(),
              end: end.toDate(),
              details: {
                ailments: item.ailments,
                diagnosis: item.diagnosis,
                surgeries: item.surgeries,
                reflexology_diagnostics: item.reflexology_diagnostics,
                medications: item.medications,
                observation: item.observation,
                room: item.room,
                payment: item.payment,
                ticket_number: item.ticket_number,
                appointment_status_id: item.appointment_status_id,
                payment_type_id: item.payment_type_id,
                patient_id: item.patient_id,
                therapist_id: item.therapist_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
                patient_name: item.patient?.name || '',
                patient_full_name,
                patient_first_name,
                therapist_full_name,
                payment_type_name,
              },
            };
          })
        : [];

      // Mapear eventos completados
      let completedEvents = Array.isArray(completedData.data)
        ? completedData.data.map((item) => {
            const start = item.appointment_hour
              ? dayjs(`${item.appointment_date}T${item.appointment_hour}`)
              : dayjs(item.appointment_date);
            const end = start.add(1, 'hour');
            const patient_first_name = item.patient
              ? item.patient.name || ''
              : '';
            const patient_full_name = item.patient
              ? `${item.patient.name || ''} ${item.patient.paternal_lastname || ''} ${item.patient.maternal_lastname || ''}`.trim()
              : '';
            const therapist_full_name = item.therapist
              ? `${item.therapist.name || ''} ${item.therapist.paternal_lastname || ''} ${item.therapist.maternal_lastname || ''}`.trim()
              : '';
            const payment_type_name = item.payment_type
              ? item.payment_type.name
              : '';
            return {
              id: item.id,
              title: item.appointment_type || '',
              start: start.toDate(),
              end: end.toDate(),
              details: {
                ailments: item.ailments,
                diagnosis: item.diagnosis,
                surgeries: item.surgeries,
                reflexology_diagnostics: item.reflexology_diagnostics,
                medications: item.medications,
                observation: item.observation,
                room: item.room,
                payment: item.payment,
                ticket_number: item.ticket_number,
                appointment_status_id: item.appointment_status_id,
                payment_type_id: item.payment_type_id,
                patient_id: item.patient_id,
                therapist_id: item.therapist_id,
                created_at: item.created_at,
                updated_at: item.updated_at,
                patient_name: item.patient?.name || '',
                patient_full_name,
                patient_first_name,
                therapist_full_name,
                payment_type_name,
              },
            };
          })
        : [];

      // Unir ambos orígenes de eventos
      setEvents([...pendingEvents, ...completedEvents]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, fetchEvents };
};
