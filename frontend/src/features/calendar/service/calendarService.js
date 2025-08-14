import { get } from '../../../services/api/Axios/MethodsGeneral';

export const getPendingAppointments = async () => {
  try {
    const response = await get('appointments/calendar/pending');
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas pendientes:', error);
    throw error;
  }
};

export const getPaginatedAppointments = async (
  date,
  perPage = 10,
  page = 1,
) => {
  try {
    const response = await get(
      `appointments/paginated?per_page=${perPage}&date=${date}&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas paginadas:', error);
    throw error;
  }
};

export const getPaginatedAppointmentsRange = async (
  startDate,
  endDate,
  perPage = 100,
  page = 1,
) => {
  const safePerPage = Math.min(perPage, 100);
  try {
    const response = await get(
      `appointments/paginated?per_page=${safePerPage}&startDate=${startDate}&endDate=${endDate}&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas paginadas por rango:', error);
    throw error;
  }
};

export const getCompletedAppointmentsRange = async (
  startDate,
  endDate,
  perPage = 30,
  page = 1,
) => {
  try {
    const response = await get(
      `appointments/calendar/completed?per_page=${perPage}&startDate=${startDate}&endDate=${endDate}&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas completadas por rango:', error);
    throw error;
  }
};
