import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from './usersServices';
import { useToast } from '../../../services/toastify/ToastContext';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 20,
  });
  const { showToast } = useToast();

  const fetchUsers = async (page = 1, perPage = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers(page, perPage);
      const data = res.data || [];
      const formattedData = data.map((user) => ({
        id: user.id,
        document_number: user.document_number,
        name: user.name,
        paternal_lastname: user.paternal_lastname,
        maternal_lastname: user.maternal_lastname,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        user_name: user.user_name,
        sex: user.sex,
        account_statement:
          user.account_statement === 1 ? 'Habilitado' : 'Deshabilitado',
        document_type: user.document_type,
        role: user.role,
        country: user.country,
      }));
      setUsers(formattedData);
      setPagination({
        currentPage: res.current_page || 1,
        totalItems: res.total || formattedData.length,
        pageSize: res.per_page || 20,
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios');
      showToast('error', 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, pageSize = pagination.pageSize) => {
    fetchUsers(page, pageSize);
  };

  const addUser = async (userData) => {
    try {
      await createUser(userData);
      await fetchUsers(pagination.currentPage, pagination.pageSize);
      showToast('exito', 'Usuario creado correctamente');
      return true;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al crear el usuario',
      );
      throw error;
    }
  };

  const editUser = async (id, userData) => {
    try {
      await updateUser(id, userData);
      await fetchUsers(pagination.currentPage, pagination.pageSize);
      showToast('actualizadouser', 'Usuario actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al actualizar el usuario',
      );
      throw error;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      await fetchUsers(pagination.currentPage, pagination.pageSize);
      showToast('pagoelminado', 'Usuario eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Error al eliminar el usuario',
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers(1, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
    fetchUsers,
    pagination,
    handlePageChange,
  };
};
