import { get } from '../../../services/api/Axios/MethodsGeneral';

export const searchAppointmentsComplete = async (term) => {
  try {
    const res = await get(
      `appointments/completed/search?search=${term}&per_page=100`,
    );
    console.log('🔍 Resultado de búsqueda:', res.data);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    console.error('❌ Error en searchAppointments:', error);
    throw error;
  }
};

export const getPaginatedAppointmentsCompleteByDate = async (date, perPage = 50) => {
  try {
    const res = await get(
      `appointments/completed?per_page=${perPage}&date=${date}`,
    );
    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    console.error('❌ Error al obtener citas completadas:', error);
    throw error;
  }
};
