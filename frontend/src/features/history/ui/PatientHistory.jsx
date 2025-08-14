import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Modal,
  Table,
  Radio,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  ConfigProvider,
  message,
  Spin,
} from 'antd';
import styles from './PatientHistory.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import CustomSearch from '../../../components/Search/CustomSearch';
import {
  useStaff,
  usePatientHistory,
  usePatientAppointments,
  useUpdatePatientHistory,
  useUpdateAppointment,
} from '../hook/historyHook';
import { updateAppointmentById } from '../service/historyService';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import TicketPDF from '../../../components/PdfTemplates/TicketPDF';
import { PDFViewer } from '@react-pdf/renderer';
import FichaPDF from '../../../components/PdfTemplates/FichaPDF';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const theme = {
  token: {
    colorPrimary: '#4caf50',
    colorBgContainer: '#222',
    colorText: '#eee',
    colorBorder: '#333',
    colorBgElevated: '#222',
    colorTextHeading: '#4caf50',
    colorTextLabel: '#4caf50',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    colorTextLightSolid: '#111',
  },
  components: {
    Table: {
      headerBg: '#272727',
      headerColor: 'rgba(199,26,26,0.88)',
      colorBgContainer: '#272727',
      borderColor: '#555555',
      rowHoverBg: '#555555',
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },
    Radio: {
      colorPrimary: '#4caf50',
      colorBgContainer: '#fff',
    },
    Button: {
      colorPrimary: '#4caf50',
      colorPrimaryHover: '#388e3c',
      colorPrimaryActive: '#2e7d32',
      defaultBorderColor: '#333',
      defaultColor: '#eee',
      defaultBg: '#333',
      dangerBorderColor: '#f44336',
      dangerColor: '#eee',
      dangerBg: '#f44336',
    },
    Input: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      colorTextDisabled: '#eee',
      activeBorderColor: '#4caf50',
      hoverBorderColor: '#4caf50',
    },
    Select: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      optionSelectedBg: '#2e7d32',
      optionSelectedColor: '#111',
      optionActiveBg: '#333',
    },
    DatePicker: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      cellActiveWithRangeBg: '#2e7d32',
      cellHoverBg: '#333',
      panelBg: '#222',
      panelInputBg: '#222',
      colorTextHeading: '#eee',
      colorTextDescription: '#eee',
      colorIcon: '#eee',
      colorIconHover: '#4caf50',
      cellBg: '#222',
      cellColor: '#eee',
      cellActiveBg: '#2e7d32',
      timeColumnBg: '#222',
    },
    Card: {
      colorBgContainer: '#111',
      colorBorderSecondary: '#2e7d32',
    },
    Form: {
      labelColor: '#4caf50',
      itemMarginBottom: 16,
    },
  },
};

const PatientHistory = () => {
  const [form] = Form.useForm();
  const [therapist, setTherapist] = useState(null);
  const [showTherapistDropdown, setShowTherapistDropdown] = useState(false);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [showFichaModal, setShowFichaModal] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); //Para el boton de cancelar
  const appointmentFromState = location.state?.appointment;
  const { staff, loading, setSearchTerm } = useStaff();
  const { data: patientHistory } = usePatientHistory(id);
  const isFemale = patientHistory?.data?.patient?.sex === 'F';
  const {
    appointments,
    lastAppointment,
    loadingAppointments,
    appointmentsError,
  } = usePatientAppointments(id);
  const { updateHistory, loading: updatingHistory } = useUpdatePatientHistory();
  const { updateAppointment } = useUpdateAppointment();

  // MEMORIZAR LAS FECHAS DE CITAS
  const appointmentDates = useMemo(() => {
    return [...new Set(appointments?.map((a) => a.appointment_date) || [])];
  }, [appointments]);

  const selectedAppointment = useMemo(() => {
    return (
      appointments?.find(
        (a) => a.appointment_date === selectedAppointmentDate,
      ) || null
    );
  }, [appointments, selectedAppointmentDate]);

  useEffect(() => {
    if (patientHistory && patientHistory.data && patientHistory.data.patient) {
      const { patient, ...historyData } = patientHistory.data;

      form.setFieldsValue({
        // Información del paciente con verificación segura
        patientName:
          `${patient?.paternal_lastname || ''} ${patient?.maternal_lastname || ''} ${patient?.name || ''}`.trim(),

        // Observaciones
        observationPrivate: historyData?.private_observation || '',
        observation: historyData?.observation || '',

        // Información física
        talla: historyData?.height || '',
        pesoInicial: historyData?.weight || '',
        ultimoPeso: historyData?.last_weight || '',

        // Información médica
        testimonio: historyData?.testimony ? 'Sí' : 'No',
        gestacion: isFemale
          ? historyData?.gestation
            ? 'Sí'
            : 'No'
          : undefined,
        menstruacion: isFemale
          ? historyData?.menstruation
            ? 'Sí'
            : 'No'
          : undefined,
        tipoDIU: isFemale ? historyData?.diu_type || '' : undefined,

        // Campos adicionales
        diagnosticosMedicos: historyData?.diagnosticos_medicos || '',
        operaciones: historyData?.operaciones || '',
        medicamentos: historyData?.medicamentos || '',
        dolencias: historyData?.dolencias || '',
        diagnosticosReflexologia: historyData?.diagnosticos_reflexologia || '',
        observacionesAdicionales: historyData?.observaciones_adicionales || '',
        antecedentesFamiliares: historyData?.antecedentes_familiares || '',
        alergias: historyData?.alergias || '',

        // Fechas
        fechaInicio: dayjs(),
      });

      // Manejo del terapeuta con verificación segura
      if (historyData?.therapist) {
        setTherapist(historyData.therapist.full_name || '');
        setSelectedTherapistId(historyData.therapist.id || null);
      } else {
        setTherapist(null);
        setSelectedTherapistId(null);
      }
    } else {
      // Resetear el formulario si no hay datos válidos
      form.resetFields();
      setTherapist(null);
      setSelectedTherapistId(null);
    }
  }, [patientHistory, form]);

  useEffect(() => {
    if (!selectedAppointmentDate || !Array.isArray(appointments)) return;

    const selectedAppointment = appointments.find(
      (a) => a.appointment_date === selectedAppointmentDate,
    );

    if (selectedAppointment) {
      const therapistObj = selectedAppointment.therapist;
      const fullName = therapistObj
        ? `${therapistObj.paternal_lastname || ''} ${therapistObj.maternal_lastname || ''} ${therapistObj.name || ''}`.trim()
        : '';
      form.setFieldsValue({
        diagnosticosMedicos: selectedAppointment.diagnosis ?? '',
        dolencias: selectedAppointment.ailments ?? '',
        medicamentos: selectedAppointment.medications ?? '',
        operaciones: selectedAppointment.surgeries ?? '',
        observacionesAdicionales: selectedAppointment.observation ?? '',
        diagnosticosReflexologia:
          selectedAppointment.reflexology_diagnostics ?? '',
        therapist: fullName,
      });

      setTherapist(fullName || null);
      setSelectedTherapistId(therapistObj?.id ?? null);
    }
  }, [selectedAppointmentDate, appointments]);

  useEffect(() => {
    if (appointmentFromState?.appointment_date) {
      setSelectedAppointmentDate(appointmentFromState.appointment_date);
    } else if (lastAppointment?.appointment_date) {
      setSelectedAppointmentDate(lastAppointment.appointment_date);
    }
  }, [appointmentFromState, lastAppointment]);

  // Función para abrir el modal
  const showTherapistModal = () => {
    setIsModalVisible(true);
  };

  // Función para cerrar el modal sin selección
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Función para confirmar la selección
  const handleOk = () => {
    if (selectedTherapistId) {
      const selected = staff.find((t) => t.id === selectedTherapistId);
      if (selected) {
        setTherapist(selected.full_name);
        form.setFieldsValue({ therapist: selected.full_name });
      }
    }
    setIsModalVisible(false);
  };

  // Función para manejar la selección en la tabla
  const handleSelectTherapist = (id) => {
    setSelectedTherapistId(id);
  };

  // Función para eliminar la selección actual
  const handleRemoveTherapist = () => {
    setTherapist(null);
    setSelectedTherapistId(null);
    form.setFieldsValue({ therapist: '' });
  };

  const onFinish = async (values) => {
    const historyId = patientHistory?.data?.id;
    const selectedAppointment = appointments.find(
      (a) => a.appointment_date === selectedAppointmentDate,
    );
    const appointmentId = selectedAppointment?.id;

    if (!historyId || !appointmentId) {
      message.error('Falta el ID del historial o la cita.');
      return;
    }

    const historyPayload = {
      weight: values.pesoInicial,
      last_weight: values.ultimoPeso,
      height: values.talla,
      observation: values.observation,
      private_observation: values.observationPrivate,
      diagnosticos_medicos: values.diagnosticosMedicos,
      operaciones: values.operaciones,
      medicamentos: values.medicamentos,
      dolencias: values.dolencias,
      diagnosticos_reflexologia: values.diagnosticosReflexologia,
      observaciones_adicionales: values.observacionesAdicionales,
      antecedentes_familiares: values.antecedentesFamiliares,
      alergias: values.alergias,
      testimony: values.testimonio === 'Sí',
      gestation: values.gestacion === 'Sí',
      menstruation: values.menstruacion === 'Sí',
      diu_type: values.tipoDIU,
      therapist_id: selectedTherapistId,
    };

    const appointmentPayload = {
      appointment_date: selectedAppointmentDate,
      ailments: values.dolencias,
      diagnosis: values.diagnosticosMedicos,
      surgeries: values.operaciones,
      reflexology_diagnostics: values.diagnosticosReflexologia,
      medications: values.medicamentos,
      observation: values.observacionesAdicionales,
      initial_date: dayjs(values.fechaInicio).format('YYYY-MM-DD'),
      final_date: dayjs(values.fechaInicio).add(5, 'day').format('YYYY-MM-DD'),
      appointment_type: 'CC',
      payment: '50.00',
      appointment_status_id: 2,
      payment_type_id: 2,
      patient_id: patientHistory?.data?.patient?.id,
      therapist_id: selectedTherapistId,
    };

    try {
      await updateHistory(historyId, historyPayload);
      await updateAppointment(appointmentId, appointmentPayload);
      navigate(-1);
    } catch (e) {
      console.error('Error actualizando historial y cita:', e);
    }
  };

  // Columnas para la tabla de terapeutas
  const columns = [
    {
      title: 'Seleccionar',
      dataIndex: 'id',
      align: 'center',
      render: (id) => (
        <Radio
          checked={selectedTherapistId === id}
          onChange={() => handleSelectTherapist(id)}
          style={{ color: '#ffffff' }}
        />
      ),
      width: 150,
    },
    {
      title: 'Terapeuta',
      dataIndex: 'full_name',
      key: 'name',
    },
  ];

  if (loadingAppointments || !patientHistory) {
    return (
      <ConfigProvider
        theme={{
          token: { colorPrimary: '#4caf50' },
        }}
      >
        <Spin
          size="large"
          tip="Cargando historial..."
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.title}>
            Detalles del Historial
          </Title>

          <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className={styles.form}
          >
            {/* Fila: Paciente y Observación */}
            <div className={styles.flexRow}>
              <Form.Item
                name="patientName"
                label="Paciente"
                className={styles.flexItem}
              >
                <Input disabled className={styles.input} />
              </Form.Item>
              <Form.Item
                name="observation"
                label="Observación"
                className={styles.flexItem}
              >
                <TextArea rows={1} className={styles.textarea} />
              </Form.Item>
            </div>

            <Title level={3} className={styles.sectionTitle}>
              Citas
            </Title>

            {/* Fila: Fecha de la Cita y Terapeuta */}
            <div className={styles.flexRow}>
              <Form.Item label="Fecha de la Cita" className={styles.flexItem}>
                <Select
                  value={selectedAppointmentDate}
                  onChange={setSelectedAppointmentDate}
                  className={styles.select}
                  placeholder="Seleccione una fecha"
                  loading={loadingAppointments}
                >
                  {appointmentDates.map((date) => (
                    <Option key={date} value={date}>
                      {dayjs(date).format('DD/MM/YYYY')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="therapist"
                label="Terapeuta"
                className={styles.flexItem}
              >
                <div className={styles.therapistRow}>
                  <Input
                    disabled
                    value={therapist || 'No se ha seleccionado terapeuta'}
                    className={styles.input}
                  />
                  <Button
                    type="primary"
                    onClick={showTherapistModal}
                    className={styles.selectButton}
                  >
                    Seleccionar
                  </Button>
                  {form.getFieldValue('therapist') && (
                    <Button
                      danger
                      onClick={handleRemoveTherapist}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </Form.Item>
            </div>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="diagnosticosMedicos"
                  label="Diagnósticos médicos"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="dolencias"
                  label="Dolencias"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="medicamentos"
                  label="Medicamentos"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="operaciones"
                  label="Operaciones"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="observacionesAdicionales"
                  label="Observaciones"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="diagnosticosReflexologia"
                  label="Diagnósticos de Reflexología"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.physicalInfoRow}>
              <Form.Item
                name="talla"
                label="Talla"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="pesoInicial"
                label="Peso Inicial"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="ultimoPeso"
                label="Último Peso"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="testimonio"
                label="Testimonio"
                className={styles.physicalInfoItem}
              >
                <Select className={styles.select}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              {/* Mostrar solo si es mujer */}
              {isFemale && (
                <>
                  <Form.Item
                    name="gestacion"
                    label="Gestación"
                    className={styles.physicalInfoItem}
                  >
                    <Select className={styles.select}>
                      <Option value="Sí">Sí</Option>
                      <Option value="No">No</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="menstruacion"
                    label="Menstruación"
                    className={styles.physicalInfoItem}
                  >
                    <Select className={styles.select}>
                      <Option value="Sí">Sí</Option>
                      <Option value="No">No</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="tipoDIU"
                    label="Tipo DIU"
                    className={styles.physicalInfoItem}
                  >
                    <Input className={styles.input} />
                  </Form.Item>
                </>
              )}
            </div>

            <div className={styles.bottomSection}>
              <Form.Item
                name="fechaInicio"
                label="Fecha de Inicio"
                className={styles.startDateSection}
              >
                <DatePicker className={styles.datePicker} format="DD-MM-YY" />
              </Form.Item>

              <div className={styles.actionButtons}>
                <Button
                  className={styles.printButton}
                  onClick={() => {
                    setShowTicketModal(true);
                  }}
                  disabled={!selectedAppointment}
                >
                  Generar Boleta
                </Button>
                <Button
                  className={styles.printButton}
                  onClick={() => {
                    setShowFichaModal(true);
                  }}
                  disabled={!selectedAppointment}
                >
                  Generar Ticket
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.saveButton}
                >
                  Guardar Cambios
                </Button>
                <Button
                  className={styles.cancelButton}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Form>
        </Card>
        <Modal
          title="Lista de Terapeutas"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              disabled={!selectedTherapistId}
            >
              Seleccionar
            </Button>,
          ]}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={staff}
            rowKey="id"
            loading={loading}
            scroll={{ y: 200 }}
            pagination={false}
            rowClassName={() => styles.tableRow}
          />
        </Modal>
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
                    `${patientHistory?.data?.patient?.paternal_lastname || ''} ${patientHistory?.data?.patient?.maternal_lastname || ''} ${patientHistory?.data?.patient?.name || ''}`.trim(),
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
        <Modal
          open={showFichaModal}
          onCancel={() => setShowFichaModal(false)}
          footer={null}
          width={420}
          bodyStyle={{ padding: 0 }}
        >
          {selectedAppointment && patientHistory?.data && (
            <PDFViewer width="100%" height={600} showToolbar={true}>
              <FichaPDF
                cita={selectedAppointment}
                paciente={patientHistory.data.patient}
                visitas={appointments.length}
                historia={patientHistory.data}
              />
            </PDFViewer>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default PatientHistory;
