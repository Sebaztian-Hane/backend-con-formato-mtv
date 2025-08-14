import { useEffect, useState } from 'react';
import {
  getPayments,
  getPrices,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
  createPrice,
  updatePrice,
  deletePrice,
} from './paymentsServices';
import { useToast } from '../../../services/toastify/ToastContext'; // Ajusta la ruta según tu estructura

export const usePaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPaymentTypes = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      const formatted = data.map((item) => ({
        id: item.id,
        name: item.name,
        status: item.deleted_at ? 'Deshabilitado' : 'Habilitado',
        deleted_at: item.deleted_at,
      }));
      setPaymentTypes(formatted);
    } catch (error) {
      console.error('Error al cargar tipos de pago:', error);
      showToast('error', 'Error al cargar los tipos de pago');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentType = async (newPayment) => {
    try {
      await createPaymentType(newPayment);
      await fetchPaymentTypes();
      showToast('exito', 'Tipo de pago activado correctamente');
    } catch (error) {
      console.error('Error al crear tipo de pago:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al activar el tipo de pago',
      );
      throw error;
    }
  };

  const editPaymentType = async (id, updatedData) => {
    try {
      await updatePaymentType(id, updatedData);
      await fetchPaymentTypes();
      showToast('efectivo', 'Tipo de pago actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar tipo de pago:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al actualizar el tipo de pago',
      );
      throw error;
    }
  };

  const removePaymentType = async (id) => {
    try {
      await deletePaymentType(id);
      await fetchPaymentTypes();
      showToast('pagoelminado', 'Tipo de pago desactivado correctamente');
    } catch (error) {
      console.error('Error al eliminar tipo de pago:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al desactivar el tipo de pago',
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  return {
    paymentTypes,
    loading,
    addPaymentType,
    editPaymentType,
    removePaymentType,
    refreshPaymentTypes: fetchPaymentTypes,
  };
};

export const usePrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await getPrices();
      const formatted = response.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        formattedPrice: `S/ ${parseFloat(item.price).toFixed(2)}`,
        status: item.deleted_at ? 'Deshabilitado' : 'Habilitado',
        deleted_at: item.deleted_at,
      }));
      setPrices(formatted);
    } catch (error) {
      console.error('Error al cargar precios:', error);
      showToast('error', 'Error al cargar los precios');
    } finally {
      setLoading(false);
    }
  };

  const addPrice = async (newPrice) => {
    try {
      await createPrice(newPrice);
      await fetchPrices();
      showToast('exito', 'Precio activado correctamente');
    } catch (error) {
      console.error('Error al crear precio:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al activar el precio',
      );
      throw error;
    }
  };

  const editPrice = async (id, updatedData) => {
    try {
      await updatePrice(id, updatedData);
      await fetchPrices();
      showToast('efectivo', 'Precio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar precio:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al actualizar el precio',
      );
      throw error;
    }
  };

  const removePrice = async (id) => {
    try {
      await deletePrice(id);
      await fetchPrices();
      showToast('pagoelminado', 'Precio desactivado correctamente');
    } catch (error) {
      console.error('Error al eliminar precio:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al desactivar el precio',
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return {
    prices,
    loading,
    addPrice,
    editPrice,
    removePrice,
    refreshPrices: fetchPrices,
  };
};
