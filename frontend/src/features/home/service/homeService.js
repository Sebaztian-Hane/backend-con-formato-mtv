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
