import { Button, Space, notification, Spin, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import { useStaff } from '../hook/staffHook';
import { useState } from 'react';
import EditTherapist from './EditTherapist/EditTherapist';
import { getTherapistById } from '../service/staffService';
import { LoadingOutlined } from '@ant-design/icons';
import InfoTherapist from './infoTherapist/infoTherapist';

const whiteSpinIndicator = (
  <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />
);

export default function Staff() {
  const navigate = useNavigate();
  const {
    staff,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    handleDeleteTherapist,
  } = useStaff();
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [therapistInfo, setTherapistInfo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Nuevo handler para editar: hace GET antes de abrir el modal
  const handleEdit = async (record) => {
    setLoadingEditId(record.id);
    setEditingTherapist(record);
    try {
      const freshTherapist = await getTherapistById(record.id);
      setEditingTherapist(freshTherapist);
    } catch (e) {
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener los datos actualizados.',
      });
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDeleteId(id);
    try {
      await handleDeleteTherapist(id);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleInfo = (record) => {
    setTherapistInfo(record);
    setShowInfoModal(true);
  };

  const handleAction = (action, record) => {
    switch (action) {
      case 'edit':
        return (
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
              minWidth: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={async () => {
              setLoadingEditId(record.id);
              setEditingTherapist(record);
              try {
                const freshTherapist = await getTherapistById(record.id);
                setEditingTherapist(freshTherapist);
              } finally {
                setLoadingEditId(null);
              }
            }}
            disabled={loadingEditId === record.id}
          >
            {loadingEditId === record.id ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Editar'
            )}
          </Button>
        );
      case 'info':
        return (
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleInfo(record)}
          >
            Más Info
          </Button>
        );
      case 'delete':
        return (
          <Button
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
              minWidth: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleDelete(record.id)}
            disabled={loadingDeleteId === record.id}
          >
            {loadingDeleteId === record.id ? (
              <ConfigProvider theme={{ token: { colorPrimary: '#fff' } }}>
                <Spin />
              </ConfigProvider>
            ) : (
              'Eliminar'
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const columns = [
    {
      title: 'Nro. Documento',
      dataIndex: 'document_number',
      key: 'document_number',
      width: '150px',
    },
    {
      title: 'Apellidos y Nombres',
      dataIndex: 'full_name',
      key: 'name',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {handleAction('edit', record)}
          {handleAction('info', record)}
          {handleAction('delete', record)}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        height: '100%',
        paddingTop: '50px',
        maxWidth: 'calc(100% - 200px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '0 auto',
        }}
      >
        <CustomButton text="Crear Terapeuta" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={staff}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />

      {editingTherapist && (
        <EditTherapist
          therapist={editingTherapist}
          onClose={() => setEditingTherapist(null)}
          onSave={() => handlePageChange(pagination.currentPage)}
        />
      )}

      {therapistInfo && (
        <InfoTherapist
          therapist={therapistInfo}
          open={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </div>
  );
}
