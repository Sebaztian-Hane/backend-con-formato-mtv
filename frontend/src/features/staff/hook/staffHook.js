import { useState, useEffect } from 'react';
import {
  createTherapist,
  getStaff,
  searchStaff,
  deleteTherapist,
  updateTherapist,
} from '../service/staffService';
import dayjs from 'dayjs';
import { useToast } from '../../../services/toastify/ToastContext';
import { formatToastMessage } from '../../../utils/messageFormatter';

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
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al cargar terapeutas',
        ),
      );
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
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al buscar terapeutas',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTherapist = async (id) => {
    try {
      setLoading(true);
      const response = await deleteTherapist(id);
      showToast(
        'exito',
        response.message || 'Terapeuta eliminado correctamente',
      );

      // Actualización optimista
      setStaff((prevStaff) =>
        prevStaff.filter((therapist) => therapist.id !== id),
      );
      setPagination((prev) => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));

      // Recargar datos actualizados
      if (searchTerm.trim()) {
        await searchStaffByTerm(searchTerm.trim());
      } else {
        await loadStaff(pagination.currentPage);
      }
    } catch (error) {
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al eliminar terapeuta',
        ),
      );
      console.error('Error deleting therapist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTherapist = async (therapistId, formData) => {
    try {
      const payload = {
        document_number: formData.document_number,
        paternal_lastname:
          formData.paternal_lastname || formData.paternal_lastName,
        maternal_lastname:
          formData.maternal_lastname || formData.maternal_lastName,
        name: formData.name,
        personal_reference:
          formData.personal_reference || formData.referencia || null,
        birth_date: formData.birth_date
          ? dayjs(formData.birth_date).format('YYYY-MM-DD')
          : null,
        sex: formData.sex,
        primary_phone: formData.primary_phone,
        secondary_phone: formData.secondary_phone || null,
        email: formData.email || null,
        address: formData.address,
        document_type_id: formData.document_type_id,
        country_id: 1,
        region_id: formData.region_id || formData.ubicacion?.region_id || null,
        province_id:
          formData.province_id || formData.ubicacion?.province_id || null,
        district_id:
          formData.district_id || formData.ubicacion?.district_id || null,
      };

      await updateTherapist(therapistId, payload);
      showToast('actualizarTerapeuta');

      // Recargar los datos actualizados
      if (searchTerm.trim()) {
        await searchStaffByTerm(searchTerm.trim());
      } else {
        await loadStaff(pagination.currentPage);
      }
    } catch (error) {
      console.error('Error actualizando terapeuta:', error);
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al actualizar terapeuta',
        ),
      );
      throw error;
    }
  };

  const submitNewTherapist = async (formData) => {
    const payload = {
      document_number: formData.document_number,
      paternal_lastname:
        formData.paternal_lastname || formData.paternal_lastName,
      maternal_lastname:
        formData.maternal_lastname || formData.maternal_lastName,
      name: formData.name,
      personal_reference: formData.personal_reference || null,
      birth_date: formData.birth_date
        ? dayjs(formData.birth_date).format('YYYY-MM-DD')
        : null,
      sex: formData.sex,
      primary_phone: formData.primary_phone,
      secondary_phone: formData.secondary_phone || null,
      email: formData.email || null,
      address: formData.address || null,
      document_type_id: formData.document_type_id || 1,
      region_id: formData.region_id || formData.ubicacion?.region_id || null,
      province_id:
        formData.province_id || formData.ubicacion?.province_id || null,
      district_id:
        formData.district_id || formData.ubicacion?.district_id || null,
    };

    try {
      const result = await createTherapist(payload);
      showToast('nuevoTerapeuta');
      return result;
    } catch (error) {
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'No se pudo crear el terapeuta',
        ),
      );
      throw error;
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
    }, 1200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  return {
    staff,
    loading,
    error,
    pagination,
    submitNewTherapist,
    handleUpdateTherapist,
    handlePageChange: loadStaff,
    setSearchTerm,
    handleDeleteTherapist,
  };
};
