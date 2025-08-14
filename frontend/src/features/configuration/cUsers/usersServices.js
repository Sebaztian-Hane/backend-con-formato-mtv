import axios from 'axios';
import {
  get,
  post,
  put,
  del,
} from '../../../services/api/Axios/MethodsGeneral';

export const getUsers = async (page = 1, perPage = 20) => {
  try {
    const res = await get(`users?page=${page}&per_page=${perPage}`);
    return res.data;
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const payload = {
      ...userData,
      country_id: 183, // Perú por defecto
    };
    const res = await post('users', payload);
    return res.data;
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const payload = {
      ...userData,
      password: null,
    };
    const res = await put(`users/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Error en actualizar User:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await del(`users/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error en eliminar User:', error);
    throw error;
  }
};
