import axios from 'axios';
import {
  get,
  post,
  patch,
  del,
} from '../../../services/api/Axios/MethodsGeneral';

export const getPayments = async () => {
  try {
    const res = await get(`payment-types`);
    return res.data;
  } catch (error) {
    console.error('Error en getPayments:', error);
    throw error;
  }
};

export const getPrices = async () => {
  try {
    const res = await get(`predetermined-prices`);
    return res.data;
  } catch (error) {
    console.error('Error en getPrices:', error);
    throw error;
  }
};

export const createPaymentType = async (data) => {
  try {
    const res = await post(`payment-types`, data);
    return res.data;
  } catch (error) {
    console.error('Error en createPaymentType:', error);
    throw error;
  }
};

export const updatePaymentType = async (id, data) => {
  try {
    const res = await patch(`payment-types/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error en updatePaymentType:', error);
    throw error;
  }
};

export const deletePaymentType = async (id) => {
  try {
    const res = await del(`payment-types/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error en deletePaymentType:', error);
    throw error;
  }
};

export const createPrice = async (data) => {
  try {
    const res = await post(`predetermined-prices`, data);
    return res.data;
  } catch (error) {
    console.error('Error en createPrice:', error);
    throw error;
  }
};

export const updatePrice = async (id, data) => {
  try {
    const res = await patch(`predetermined-prices/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error en updatePrice:', error);
    throw error;
  }
};

export const deletePrice = async (id) => {
  try {
    const res = await del(`predetermined-prices/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error en deletePrice:', error);
    throw error;
  }
};
