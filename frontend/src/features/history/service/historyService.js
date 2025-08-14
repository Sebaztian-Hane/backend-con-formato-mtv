import { get, patch } from '../../../services/api/Axios/MethodsGeneral';

//CONSEGUIR EL HISTORIAL DE UN PACIENTE POR ID
export const getPatientHistoryById = async (patientId) => {
    try {
        const response = await get(`histories/patient/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getPatientHistoryById:', error);
        throw error;
    }
};

//ACTUALIZAR EL HISTORIAL DE UN PACIENTE POR ID
export const updatePatientHistoryById = async (historyId, data) => {
    try {
        const response = await patch(`histories/${historyId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error en updatePatientHistoryById:', error);
        throw error;
    }
}

//ESTO FUE PARA LA INFORMACIÓN DE LA TABLA DEL MODAL Y EL BUSCADOR -------------------------
export const getStaff = async (page = 1, perPage = 10) => {
    try {
        const response = await get(`therapists?page=${page}&per_page=${perPage}`);

        let data = [];
        if (response.data) {
        if (Array.isArray(response.data)) {
            data = response.data;
        } else if (Array.isArray(response.data.data)) {
            data = response.data.data;
        } else if (Array.isArray(response.data.items)) {
            data = response.data.items;
        }
    }

    return {
        data,
        total: response.data?.total || data.length || 0,
    };
    } catch (error) {
        console.error('Error en getStaff:', error);
        throw error;
    }
};

export const searchStaff = async (term) => {
    try {
        const res = await get(`therapists/search?search=${term}&per_page=100`);
        return { 
        data: Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [],
        total: res.data?.total || 0
        };
    } catch (error) {
        console.error('Error en searchStaff:', error);
        throw error;
    }
};

//ESTO ES PARA CONSEGUIR INFORMACIÓN DE CITAS DE UN PACIENTE -------------------------

export const getAppointmentsByPatientId = async (patientId) => {
    try {
        const response = await get(`patients/appoiments/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getAppointmentsByPatientId:', error);
        throw error;
    }
}

//ESTO ES PARA ACTUALIZAR INFORMACIÓN DE CITAS DE UN PACIENTE >:O-------------------------
export const updateAppointmentById = async (appointmentId, payload) => {
    try {
        const response = await patch(`appointments/${appointmentId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error actualizando la cita:', error);
        throw error;
    }
};