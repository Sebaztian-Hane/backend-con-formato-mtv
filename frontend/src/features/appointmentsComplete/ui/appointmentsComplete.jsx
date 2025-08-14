import React, { useEffect, useState } from 'react';
import estilo from './appointmentsComplete.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import CustomSearch from '../../../components/Search/CustomSearch';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import { useNavigate } from 'react-router';
import { useAppointmentsComplete } from '../hook/appointmentsCompleteHook';
import dayjs from 'dayjs';
import { Space, Button } from 'antd';

export default function AppointmentsComplete() {
  const navigate = useNavigate();
  const {
    appointmentsComplete,
    loading,
    error,
    pagination,
    handlePageChange,
    setSearchTerm,
    loadPaginatedAppointmentsCompleteByDate,
  } = useAppointmentsComplete();

  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  useEffect(() => {
    loadPaginatedAppointmentsCompleteByDate(selectDate);
  }, [selectDate]);

  const columns = [
    {
      title: 'Nro Ticket',
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      width: '70px',
    },
    {
      title: 'Paciente',
      key: 'patient_id',
      width: '140px',
      render: (text, record) => {
        return `${record.patient.paternal_lastname} ${record.patient.maternal_lastname} ${record.patient.name}`;
      },
    },
    {
      title: 'Terapeuta',
      key: 'therapist_id',
      width: '140px',
      render: (text, record) => {
        if (!record.therapist) return 'Sin asignar';
        return `${record.therapist.name} ${record.therapist.paternal_lastname} ${record.therapist.maternal_lastname}`;
      },
    },
    {
      title: 'Sala',
      dataIndex: 'room',
      key: 'room',
      width: '60px',
    },
    {
      title: 'Hora',
      dataIndex: 'appointment_hour',
      key: 'appointment_hour',
      width: '60px',
    },
    {
      title: 'Pago',
      dataIndex: 'payment',
      key: 'payment',
      width: '70px',
    },
    {
      title: 'Metodo Pago',
      key: 'payment_type',
      width: '100px',
      render: (_, record) => record.payment_type?.name || 'Sin método',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '200px',
      render: (_, record) => (
        <Space size="small">
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('history', record)}
          >
            Editar Historia
          </Button>
        </Space>
      ),
    },
  ];

  const handleAction = (action, record) => {
    // Implementa las acciones según el tipo
    console.log(`${action} action for:`, record);

    switch (action) {
      case 'history':
        // Lógica para eliminar
        navigate(`/Inicio/pacientes/historia/${record.patient.id}`, {
          state: { appointment: record },
        });
        break;
      default:
        break;
    }
  };

  const handleButton = () => {
    // Aquí puedes implementar la lógica de registrar
    navigate('registrar');
  };

  const handleSearch = (value) => {
    // Aquí puedes implementar la lógica de filtrado
    setSearchTerm(value);
  };

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
        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          // onTimeRangeChange={handleTimeRangeChange}
          width="250px"
          showTime={false} // Ocultar hora si no es necesaria
          format="YYYY-MM-DD" // Formato día/mes/año
        />
      </div>

      <ModeloTable
        columns={columns}
        data={appointmentsComplete}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
