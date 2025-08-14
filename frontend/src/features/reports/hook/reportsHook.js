import { useState } from 'react';
import { useToast } from '../../../services/toastify/ToastContext';
import { formatToastMessage } from '../../../utils/messageFormatter';
import {
  getAppointmentsforTherapist,
  getPatientsByTherapist,
  getDailyCash,
  getAppointmentsBetweenDates,
} from '../service/reportsService';

export const useDailyTherapistReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // Formatear la fecha a YYYY-MM-DD
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getAppointmentsforTherapist(formattedDate);
      // Si la respuesta es el objeto vacío esperado, no setear data
      if (
        res &&
        typeof res === 'object' &&
        Array.isArray(res.therapists_appointments) &&
        res.therapists_appointments.length === 0 &&
        res.total_appointments_count === 0
      ) {
        showToast('error', 'No se encontraron datos para generar el reporte.');
        setData(null);
      } else if (Array.isArray(res) && res.length === 0) {
        showToast('error', 'No se encontraron datos para generar el reporte.');
        setData(null);
      } else {
        setData(res);
        showToast('reporteGenerado');
      }
    } catch (err) {
      setError(err);
      showToast(
        'error',
        formatToastMessage(
          err.response?.data?.message,
          'Error al generar el reporte.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const usePatientsByTherapistReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getPatientsByTherapist(formattedDate);
      setData(res);

      if (Array.isArray(res) && res.length === 0) {
        showToast('error', 'No se encontraron datos para generar el reporte.');
      } else {
        showToast('reporteGenerado');
      }
    } catch (err) {
      setError(err);
      showToast(
        'error',
        formatToastMessage(
          err.response?.data?.message,
          'Error al generar el reporte.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const useDailyCashReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const res = await getDailyCash(formattedDate);
      setData(res);

      if (Array.isArray(res) && res.length === 0) {
        showToast('error', 'No se encontraron datos para generar el reporte.');
      } else {
        showToast('reporteGenerado');
      }
    } catch (err) {
      setError(err);
      showToast(
        'error',
        formatToastMessage(
          err.response?.data?.message,
          'Error al generar el reporte.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};

export const useAppointmentsBetweenDatesReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchReport = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAppointmentsBetweenDates(startDate, endDate);
      setData(res);

      if (Array.isArray(res) && res.length === 0) {
        showToast('error', 'No se encontraron datos para generar el reporte.');
      } else {
        showToast('reporteGenerado');
      }
    } catch (err) {
      setError(err);
      showToast(
        'error',
        formatToastMessage(
          err.response?.data?.message,
          'Error al generar el reporte.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchReport };
};
