import {
  del,
  get,
  post,
  patch,
} from '../../../services/api/Axios/MethodsGeneral';


// Consumir el endpoint real de pacientes
export const getPatients = async (page = 1, perPage = 50) => {
  try {
    const response = await get(`patients?page=${page}&per_page=${perPage}`);
    let data = [];
    if (response.data) {
      if (Array.isArray(response.data.results)) {
        data = response.data.results;
      } else if (Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data.items)) {
        data = response.data.items;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
    }
    return {
      data,
      total: response.data?.count || response.data?.total || data.length || 0,
    };
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    throw error;
  }
};

//==============================================================================
export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await patch(`patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    throw error;
  }
};
//==============================================================================



// Buscar pacientes usando el endpoint real de pacientes
export const searchPatients = async (term) => {
  try {
    const res = await get(`patients?search=${term}&per_page=100`);
    let data = [];
    if (res.data) {
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (Array.isArray(res.data.items)) {
        data = res.data.items;
      }
    }
    return {
      data,
      total: res.data?.total || data.length || 0,
    };
  } catch (error) {
    console.error('Error buscando pacientes:', error);
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    const response = await post('patients', data);
    return response.data;
  } catch (error) {
    console.error('Error creando paciente:', error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await del(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    throw error;
  }
};

export const getPatientById = async (patientId) => {
  try {
    const response = await get(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo paciente por ID:', error);
    throw error;
  }
};
