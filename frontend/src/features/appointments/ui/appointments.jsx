import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Button, Modal, Space, Spin, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import CustomSearch from '../../../components/Search/CustomSearch';
import ModeloTable from '../../../components/Table/Tabla';
import {
  getAppointmentsByPatientId,
  getPatientHistoryById,
} from '../../history/service/historyService';
import { useAppointments } from '../hook/appointmentsHook';
import EditAppointment from '../ui/EditAppointment/EditAppointment'; // Importar el componente de edición
import { deleteAppointment } from '../service/appointmentsService';
import { useToast } from '../../../services/toastify/ToastContext';
import { defaultConfig } from '../../../services/toastify/toastConfig';
import { formatToastMessage } from '../../../utils/messageFormatter';

export default function Appointments() {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    pagination,
    handlePageChange,
    setSearchTerm,
    loadPaginatedAppointmentsByDate,
    loadAppointments,
  } = useAppointments();

  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [visitasFicha, setVisitasFicha] = useState(0);

  // Estado para manejar el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentIdToEdit, setAppointmentIdToEdit] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingPrintFichaId, setLoadingPrintFichaId] = useState(null);
  const [loadingPrintTicketId, setLoadingPrintTicketId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadPaginatedAppointmentsByDate(selectDate);
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
      width: '180px',
      render: (_, record) => {
        const patient = record?.patient;
        if (!patient) return 'Paciente no disponible';
        return `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();
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
      width: '70px',
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
      width: '150px',
      render: (_, record) => (
        <Space size="small">
          <Button
            style={{
              backgroundColor: '#555555',
              color: '#fff',
              border: 'none',
              minWidth: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={async () => {
              setLoadingEditId(record.id);
              setAppointmentIdToEdit(record.id);
              setIsEditModalOpen(true);
              setLoadingEditId(null); // Limpiar el loader apenas se abre el modal
            }}
            disabled={loadingEditId === record.id}
          >
            {loadingEditId === record.id ? (
              <Spin size="small" style={{ color: '#fff' }} />
            ) : (
              'Editar'
            )}
          </Button>
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('history', record)}
          >
            Rellenar Historia
          </Button>
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('imprimir', record)}
            disabled={loadingPrintFichaId === record.id}
          >
            {loadingPrintFichaId === record.id ? (
              <Spin size="small" />
            ) : (
              'Imprimir'
            )}
          </Button>
          <Button
            style={{
              backgroundColor: '#69276F',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('boleta', record)}
            disabled={loadingPrintTicketId === record.id}
          >
            {loadingPrintTicketId === record.id ? (
              <Spin size="small" />
            ) : (
              'Imprimir Boleta'
            )}
          </Button>
          <Button
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('delete', record)}
            disabled={loadingDeleteId === record.id}
          >
            {loadingDeleteId === record.id ? <Spin size="small" /> : 'Eliminar'}
          </Button>
        </Space>
      ),
    },
  ];

  const handleAction = async (action, record) => {
    switch (action) {
      case 'edit':
        setLoadingEditId(record.id);
        setAppointmentIdToEdit(record.id);
        setIsEditModalOpen(true);
        break;
      case 'delete':
        setLoadingDeleteId(record.id);
        try {
          const response = await deleteAppointment(record.id);
          const backendMsg = response?.message || response?.msg;
          showToast(
            'cancelarCita',
            backendMsg
              ? formatToastMessage(
                  backendMsg,
                  defaultConfig.cancelarCita.message,
                )
              : undefined,
          );
          await loadAppointments();
        } catch (error) {
          showToast(
            'error',
            formatToastMessage(
              error?.response?.data?.message,
              defaultConfig.error.message,
            ),
          );
        }
        setLoadingDeleteId(null);
        break;
      case 'imprimir':
        setLoadingPrintFichaId(record.id);
        await handlePrintFicha(record);
        setLoadingPrintFichaId(null);
        break;
      case 'boleta':
        setLoadingPrintTicketId(record.id);
        setSelectedAppointment(record);
        setShowTicketModal(true);
        setLoadingPrintTicketId(null);
        break;
      case 'history':
        navigate(`/Inicio/pacientes/historia/${record.patient.id}`, {
          state: { appointment: record },
        });
        break;
      default:
        break;
    }
  };

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handlePrintFicha = async (record) => {
    try {
      const res = await getAppointmentsByPatientId(record.patient.id);
      const visitas = Array.isArray(res) ? res.length : 0;
      await printFichaPDF(record, visitas);
    } catch (e) {
      await printFichaPDF(record, 0);
    }
  };

  const printFichaPDF = async (record, visitas) => {
    // Obtener historia clínica por ID
    let historia = {};
    try {
      historia = await getPatientHistoryById(record.patient.id);
    } catch (e) {
      historia = {};
    }
    const doc = (
      <FichaPDF
        cita={record}
        paciente={record.patient}
        visitas={visitas}
        historia={historia.data || {}}
      />
    );
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    const cleanUp = () => {
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 100);
      iframe.contentWindow.removeEventListener('afterprint', cleanUp);
    };

    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow.addEventListener('afterprint', cleanUp);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 500);
    };
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
        <CustomButton text="Registrar Cita" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          width="250px"
          showTime={false}
          format="YYYY-MM-DD"
        />
      </div>

      <ModeloTable
        columns={columns}
        data={appointments}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />

      {/* Modal para mostrar el ticket */}
      <Modal
        open={showTicketModal}
        onCancel={() => setShowTicketModal(false)}
        footer={null}
        width={420}
        bodyStyle={{ padding: 0 }}
      >
        {selectedAppointment && (
          <PDFViewer width="100%" height={600} showToolbar={true}>
            <TicketPDF
              company={{
                name: 'REFLEXOPERU',
                address: 'Calle Las Golondrinas N° 153 - Urb. Los Nogales',
                phone: '01-503-8416',
                email: 'reflexoperu@reflexoperu.com',
                city: 'LIMA - PERU',
                exonerated: 'EXONERADO DE TRIBUTOS',
                di: 'D.I. 626-D.I.23211',
              }}
              ticket={{
                number: selectedAppointment.ticket_number,
                date: dayjs(selectedAppointment.appointment_date).format(
                  'DD/MM/YYYY',
                ),
                patient:
                  `${selectedAppointment.patient?.paternal_lastname || ''} ${selectedAppointment.patient?.maternal_lastname || ''} ${selectedAppointment.patient?.name || ''}`.trim(),
                service: 'Consulta',
                unit: 1,
                amount: `S/ ${Number(selectedAppointment.payment).toFixed(2)}`,
                paymentType:
                  selectedAppointment.payment_type?.name || 'Sin especificar',
              }}
            />
          </PDFViewer>
        )}
      </Modal>

      {/* Modal para editar cita */}
      <Modal
        title="Editar Cita"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={730}
      >
        {appointmentIdToEdit && (
          <EditAppointment
            appointmentId={appointmentIdToEdit}
            onEditSuccess={async () => {
              setIsEditModalOpen(false);
              setLoadingEditId(null);
              await loadAppointments();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
