import { useState, useEffect } from 'react';
import {
  getStaff,
  searchStaff,
  getPatientHistoryById,
  getAppointmentsByPatientId,
  updatePatientHistoryById,
  updateAppointmentById,
} from '../service/historyService';
import { message } from 'antd';
import { defaultConfig } from '../../../services/toastify/toastConfig';
import { useToast } from '../../../services/toastify/ToastContext';

//DATOS DEL PACIENTE -----------------------------
export const usePatientHistory = (patientId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        const response = await getPatientHistoryById(patientId);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { data, loading, error };
};

//ACTUALIZAR DATOS DE HISTORIA DEL PACIENTE
export const useUpdatePatientHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const updateHistory = async (historyId, data) => {
    setLoading(true);
    try {
      await updatePatientHistoryById(historyId, data);
      showToast(
        'actualizarHistoria',
        'Historia clínica actualizada correctamente',
      );
      setError(null);
      return {
        success: true,
        message: 'Historia clínica actualizada correctamente',
      };
    } catch (err) {
      setError(err);
      const backendMsg =
        err?.response?.data?.message ||
        'No se pudo actualizar la historia clínica. Intenta nuevamente o contacta soporte.';
      showToast('error', backendMsg);
      return { success: false, message: backendMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateHistory,
    loading,
    error,
  };
};

//DATOS DEL PERSONAL PARA EL MODAL------------------------------
export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  const { showToast } = useToast();

  const loadStaff = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await getStaff(page);
      setStaff(data);
      setPagination({
        currentPage: page,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
      console.error('Error loading staff:', error);
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  const searchStaffByTerm = async (term) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await searchStaff(term);
      setStaff(data);
      setPagination({
        currentPage: 1,
        totalItems: total,
      });
    } catch (error) {
      setError(error.message);
      console.error('Error searching staff:', error);
      showToast('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadStaff(1);
      setInitialLoad(true);
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchStaffByTerm(searchTerm.trim());
      } else {
        loadStaff(1);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  return {
    staff,
    loading,
    error,
    pagination,
    setSearchTerm,
    handlePageChange: loadStaff,
  };
};

// DATOS DE LAS CITAS DEL PACIENTE -----------------------------
export const usePatientAppointments = (patientId) => {
  const [appointments, setAppointments] = useState([]);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [loadingAppointments, setLoading] = useState(false);
  const [appointmentsError, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await getAppointmentsByPatientId(patientId);
        // Ordenar citas por fecha descendente
        const sortedAppointments = [...response].sort(
          (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date),
        );
        setAppointments(sortedAppointments);
        // Establecer la última cita (primera del array ordenado)
        setLastAppointment(sortedAppointments[0] || null);
        setError(null);
        showToast('busquedaPaciente');
      } catch (error) {
        console.error('Error al cargar las citas del paciente:', error);
        setAppointments([]);
        setLastAppointment(null);
        setError(error);
        showToast('pacienteNoEncontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  return {
    appointments,
    lastAppointment,
    loadingAppointments,
    appointmentsError,
  };
};

// ACTUALIZAR DATOS DE LAS CITAS DEL PACIENTE -----------------------------
export const useUpdateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const updateAppointment = async (appointmentId, payload) => {
    setLoading(true);
    try {
      await updateAppointmentById(appointmentId, payload);
      showToast('actualizarCita', 'Cita modificada correctamente');
      return { success: true, message: 'Cita modificada correctamente' };
    } catch (error) {
      const backendMsg =
        error?.response?.data?.message ||
        'No se pudo actualizar la cita. Por favor, revisa los datos o intenta más tarde.';
      showToast('error', backendMsg);
      return { success: false, message: backendMsg };
    } finally {
      setLoading(false);
    }
  };

  return { updateAppointment, loading };
};
