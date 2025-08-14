import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  createPatient,
  deletePatient,
  getPatients,
  searchPatients,
  updatePatient,
} from '../service/patientsService';
import { useToast } from '../../../services/toastify/ToastContext';
import { formatToastMessage } from '../../../utils/messageFormatter';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  const { showToast } = useToast();

  const loadPatients = async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await getPatients(page);
      setPatients(data);
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
          'Error al cargar pacientes',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  //================================================================================================
  const handleUpdatePatient = async (patientId, formData) => {
    try {
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
        ocupation: formData.occupation || null,
        address: formData.address,
        document_type_id: formData.document_type_id,
        country_id: 1,
        region_id: formData.region_id || formData.ubicacion?.region_id || null,
        province_id:
          formData.province_id || formData.ubicacion?.province_id || null,
        district_id:
          formData.district_id || formData.ubicacion?.district_id || null,
      };

      await updatePatient(patientId, payload);
      showToast('actualizacionPaciente');
      // Recargar los datos actualizados
      if (searchTerm.trim()) {
        await searchPatientsByTerm(searchTerm.trim());
      } else {
        await loadPatients(pagination.currentPage);
      }
    } catch (error) {
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error al actualizar paciente',
        ),
      );
      console.error('Error actualizando paciente:', error);
      throw error;
    }
  };
  //==================================================================================================

  const searchPatientsByTerm = async (term) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, total } = await searchPatients(term);
      setPatients(data);
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
          'Error al buscar pacientes',
        ),
      );
      console.error('Error al buscar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
      showToast('eliminacionPaciente');
      // Actualización optimista del estado
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
      setPagination((prev) => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));

      // Recarga de datos para asegurar consistencia
      if (searchTerm.trim()) {
        await searchPatientsByTerm(searchTerm.trim());
      } else {
        await loadPatients(pagination.currentPage);
      }
    } catch (error) {
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'Error eliminando paciente',
        ),
      );
      console.error('Error eliminando paciente:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadPatients(1);
      setInitialLoad(true);
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPatientsByTerm(searchTerm.trim());
      } else {
        loadPatients(1);
      }
    }, 1200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  const submitNewPatient = async (formData) => {
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
      ocupation: formData.occupation || null,
      health_condition: null,
      address: formData.address,
      document_type_id: formData.document_type_id,
      country_id: 1,
      region_id: formData.region_id || formData.ubicacion?.region_id || null,
      province_id:
        formData.province_id || formData.ubicacion?.province_id || null,
      district_id:
        formData.district_id || formData.ubicacion?.district_id || null,
    };

    try {
      const result = await createPatient(payload);
      showToast('registroPaciente');
      await loadPatients(pagination.currentPage); // Recargar lista
      return result;
    } catch (error) {
      showToast(
        'error',
        formatToastMessage(
          error.response?.data?.message,
          'No se pudo crear el paciente',
        ),
      );
      console.error('Error creando paciente:', error);
      throw error;
    }
  };

  return {
    patients,
    loading,
    submitNewPatient,
    handleUpdatePatient, // se añadio nueva funcion
    error,
    pagination,
    handlePageChange: loadPatients,
    setSearchTerm,
    handleDeletePatient,
  };
};
