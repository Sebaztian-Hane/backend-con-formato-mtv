import {
  Button,
  ConfigProvider,
  Form,
  Modal,
  Radio,
  Table,
  notification,
  DatePicker,
  Select,
  Input,
  Checkbox,
  Row,
  Col,
  Typography,
  Space,
  Divider,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import { SelectPaymentStatus } from '../../../../components/Select/SelectPaymentStatus';
import SelectPrices from '../../../../components/Select/SelectPrices';
import { getPatientById } from '../../../patients/service/patientsService';

const { Title } = Typography;
const { Option } = Select;

const EditAppointment = ({ appointmentId, onEditSuccess }) => {
  // Estados principales
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Estados de campos
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('continuador');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Estados de modales
  const [isSelectPatientModalOpen, setIsSelectPatientModalOpen] =
    useState(false);
  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] =
    useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  // Hooks
  const { getAppointmentDetails, updateExistingAppointment } =
    useAppointments();
  const {
    patients,
    loading: patientsLoading,
    setSearchTerm,
  } = usePatients(true);

  // Estados adicionales
  const [paymentOptionsLoaded, setPaymentOptionsLoaded] = useState(false);
  const [serviceOptionsLoaded, setServiceOptionsLoaded] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  // Detectar cuando las opciones de métodos de pago están listas
  useEffect(() => {
    // Suponiendo que SelectPaymentStatus y SelectPrices exponen un callback o puedes usar un efecto similar
    setPaymentOptionsLoaded(true); // Simulación, reemplaza por lógica real si tienes acceso
    setServiceOptionsLoaded(true); // Simulación, reemplaza por lógica real si tienes acceso
  }, []);

  // Cargar datos de la cita y guardarlos en appointmentData
  useEffect(() => {
    if (appointmentId) {
      (async () => {
        setLoading(true);
        try {
          const data = await getAppointmentDetails(appointmentId);
          setAppointmentData(data);
          // Buscar paciente en la lista local si no viene el nombre
          let patientObj = null;
          if (patients && patients.length > 0) {
            const found = patients.find(
              (p) => String(p.id) === String(data.patient_id),
            );
            if (found) {
              patientObj = {
                id: found.id,
                full_name:
                  found.full_name ||
                  `${found.paternal_lastname || ''} ${found.maternal_lastname || ''} ${found.name || ''}`.trim(),
              };
            }
          }
          // Si no se encuentra, hacer fetch individual
          if (!patientObj && data.patient_id) {
            try {
              const fetched = await getPatientById(data.patient_id);
              patientObj = {
                id: fetched.id,
                full_name:
                  fetched.full_name ||
                  `${fetched.paternal_lastname || ''} ${fetched.maternal_lastname || ''} ${fetched.name || ''}`.trim(),
              };
            } catch (e) {
              patientObj = {
                id: data.patient_id,
                full_name: data.patient_id,
              };
            }
          }
          if (patientObj) {
            setSelectedPatient(patientObj);
            setPatientType('continuador');
          }

          // Configurar campos
          setShowHourField(!!data.appointment_hour);
          setIsPaymentRequired(!!data.payment);

          // Configurar monto (pero NO preseleccionar método de pago)
          setPaymentAmount(data.payment ? String(data.payment) : '');

          // Establecer valores del formulario
          form.setFieldsValue({
            appointment_date: data.appointment_date
              ? dayjs(data.appointment_date)
              : null,
            appointment_hour: data.appointment_hour
              ? data.appointment_hour.slice(0, 5)
              : '',
            diagnosis: data.diagnosis || '',
            observation: data.observation || '',
            payment: data.payment ? String(data.payment) : '',
            payment_type_id: data.payment_type_id
              ? String(data.payment_type_id)
              : '',
            service_id: data.service_id ? String(data.service_id) : '',
            patient_id: data.patient_id || '',
            ailments: data.ailments || '',
            surgeries: data.surgeries || '',
            reflexology_diagnostics: data.reflexology_diagnostics || '',
            medications: data.medications || '',
            initial_date: data.initial_date ? dayjs(data.initial_date) : null,
            final_date: data.final_date ? dayjs(data.final_date) : null,
            appointment_type: data.appointment_type || '',
            room: data.room || '',
          });

          setInitialDataLoaded(true);
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'No se pudieron cargar los datos de la cita.',
          });
          console.error('Error loading appointment data:', error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [appointmentId]);

  // Cuando tienes los datos de la cita y las opciones listas, setea los valores del formulario
  useEffect(() => {
    if (appointmentData && paymentOptionsLoaded && serviceOptionsLoaded) {
      form.setFieldsValue({
        appointment_date: appointmentData.appointment_date
          ? dayjs(appointmentData.appointment_date)
          : null,
        appointment_hour: appointmentData.appointment_hour
          ? appointmentData.appointment_hour.slice(0, 5)
          : '',
        diagnosis: appointmentData.diagnosis || '',
        observation: appointmentData.observation || '',
        payment: appointmentData.payment ? String(appointmentData.payment) : '',
        payment_type_id: appointmentData.payment_type_id
          ? String(appointmentData.payment_type_id)
          : '',
        service_id: appointmentData.service_id
          ? String(appointmentData.service_id)
          : '',
        patient_id: appointmentData.patient_id || '',
        ailments: appointmentData.ailments || '',
        surgeries: appointmentData.surgeries || '',
        reflexology_diagnostics: appointmentData.reflexology_diagnostics || '',
        medications: appointmentData.medications || '',
        initial_date: appointmentData.initial_date
          ? dayjs(appointmentData.initial_date)
          : null,
        final_date: appointmentData.final_date
          ? dayjs(appointmentData.final_date)
          : null,
        appointment_type: appointmentData.appointment_type || '',
        room: appointmentData.room || '',
      });
      setInitialDataLoaded(true);
    }
  }, [appointmentData, paymentOptionsLoaded, serviceOptionsLoaded]);

  // Manejar cambio de tipo de pago desde SelectPaymentStatus
  const handlePaymentTypeChange = (value) => {
    form.setFieldsValue({
      payment_type_id: value,
    });
  };

  // Manejar cambio de precio desde SelectPaymentStatus
  const handlePriceChange = (price) => {
    setPaymentAmount(price);
    form.setFieldsValue({
      payment: price,
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (values) => {
    console.log('🔍 Debug - handleSubmit iniciado');
    console.log('🔍 Debug - values:', values);
    console.log('🔍 Debug - appointmentData:', appointmentData);
    console.log('🔍 Debug - selectedPatient:', selectedPatient);
    console.log('🔍 Debug - form values:', form.getFieldsValue());
    console.log('🔍 Debug - form errors:', form.getFieldsError());

    setIsSubmitting(true);
    try {
      if (!selectedPatient) {
        notification.error({
          message: 'Error',
          description: 'Debe seleccionar o crear un paciente primero',
        });
        return;
      }
      if (
        !values.payment ||
        isNaN(Number(values.payment)) ||
        Number(values.payment) <= 0
      ) {
        notification.error({
          message: 'Error',
          description: 'El monto es requerido y debe ser mayor a cero',
        });
        return;
      }
      if (!values.appointment_date) {
        notification.error({
          message: 'Error',
          description: 'La fecha de la cita es requerida',
        });
        return;
      }
      if (!values.payment_type_id) {
        notification.error({
          message: 'Error',
          description: 'El tipo de pago es requerido',
        });
        return;
      }

      // Determinar estado de la cita
      const appointmentDate = dayjs(values.appointment_date);
      const currentDate = dayjs();
      const appointment_status_id = appointmentDate.isBefore(currentDate, 'day')
        ? 2
        : 1;

      // Limpiar valor de pago
      let paymentValue = values.payment;
      if (typeof paymentValue === 'string') {
        paymentValue = paymentValue.replace(/[^\d.]/g, '');
        paymentValue = parseFloat(paymentValue);
      }

      // Usar los datos originales y sobrescribir con los editados
      const payload = {
        ...appointmentData, // datos originales
        ...values, // sobrescribe con los editados
        appointment_status_id,
        patient_id: selectedPatient.id,
        ...(showHourField && values.appointment_hour
          ? { appointment_hour: values.appointment_hour }
          : {}),
      };

      // Si service_id está vacío, lo quitamos del payload para no sobrescribir el original
      if (!values.service_id) {
        delete payload.service_id;
      }

      console.log('🔍 Debug - payload final:', payload);
      console.log('🔍 Debug - appointmentId:', appointmentId);

      await updateExistingAppointment(appointmentId, payload);

      notification.success({
        message: 'Cita actualizada',
        description: 'La cita se ha actualizado correctamente.',
      });

      if (onEditSuccess) {
        onEditSuccess();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      let errorMessage =
        'No se pudo actualizar la cita. Por favor intente nuevamente.';

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      notification.error({
        message: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar selección de paciente
  const handlePatientSelection = () => {
    if (!selectedRowKey) {
      notification.warning({
        message: 'Advertencia',
        description: 'Por favor seleccione un paciente primero',
      });
      return;
    }

    const selectedPatientData = processedPatients.find(
      (p) => p.key === selectedRowKey,
    );
    setSelectedPatient(selectedPatientData);
    setIsSelectPatientModalOpen(false);
    setSelectedRowKey(null);

    notification.success({
      message: 'Paciente seleccionado',
      description: `Se ha seleccionado a ${selectedPatientData.full_name}`,
    });
  };

  // Manejar creación de paciente
  const handlePatientCreated = (result) => {
    if (result && typeof result === 'object') {
      const fullName =
        `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();
      setSelectedPatient({
        ...result,
        full_name: fullName,
      });
      setIsCreatePatientModalOpen(false);

      notification.success({
        message: 'Paciente creado',
        description: 'Paciente creado y seleccionado correctamente',
      });
    }
  };

  // Procesar pacientes para la tabla
  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`,
  }));

  // Columnas de la tabla de pacientes
  const patientColumns = [
    {
      title: '',
      dataIndex: 'selection',
      width: 50,
      render: (_, record) => (
        <Radio
          value={record.key}
          checked={selectedRowKey === record.key}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKey(record.key);
            }
          }}
        />
      ),
    },
    {
      title: 'Pacientes',
      dataIndex: 'full_name',
      key: 'full_name',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#1cb54a',
            colorPrimaryHover: '#148235',
            colorPrimaryActive: '#148235',
            borderRadius: 6,
            fontWeight: 500,
          },
          Table: {
            headerBg: '#272727',
            headerColor: '#ffffff',
            colorBgContainer: '#272727',
            borderColor: '#555555',
            rowHoverBg: '#555555',
          },
          Radio: {
            colorPrimary: '#1cb54a',
          },
          DatePicker: {
            colorBgElevated: '#333333',
            colorText: '#ffffff',
            colorTextHeading: '#ffffff',
            colorIcon: '#ffffff',
            colorPrimary: '#1cb54a',
            cellHoverBg: '#444444',
            colorBgContainer: '#333333',
            colorBorder: '#555555',
            colorTextPlaceholder: '#aaaaaa',
          },
          Select: {
            colorBgElevated: '#333333',
            colorText: '#ffffff',
            colorTextPlaceholder: '#aaaaaa',
            controlItemBgHover: '#444444',
            selectorBg: '#333333',
          },
          Input: {
            colorBgContainer: '#333333',
            colorText: '#ffffff',
            colorBorder: '#555555',
            colorTextPlaceholder: '#aaaaaa',
          },
        },
        token: {
          colorBgElevated: '#333333',
          colorTextBase: '#fff',
        },
      }}
    >
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {initialDataLoaded && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ color: '#ffffff' }}
          >
            {/* Fecha de cita */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="appointment_date"
                  label="Fecha de cita"
                  rules={[{ required: true, message: 'La fecha es requerida' }]}
                >
                  <ConfigProvider
                    theme={{
                      components: {
                        DatePicker: {
                          colorBgElevated: '#333333',
                          colorText: '#ffffff',
                          colorTextHeading: '#ffffff',
                          colorIcon: '#ffffff',
                          colorPrimary: '#1cb54a',
                          cellHoverBg: '#444444',
                          colorBgContainer: '#333333',
                          colorBorder: '#555555',
                          colorTextPlaceholder: '#aaaaaa',
                        },
                      },
                      token: {
                        colorBgElevated: '#333333',
                        colorTextBase: '#fff',
                      },
                    }}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      placeholder="Seleccionar fecha"
                      dropdownClassName="custom-dark-datepicker"
                      value={form.getFieldValue('appointment_date')}
                      onChange={(date) =>
                        form.setFieldsValue({ appointment_date: date })
                      }
                    />
                  </ConfigProvider>
                </Form.Item>
              </Col>
            </Row>

            {/* Paciente */}
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item label="Paciente" required>
                  <Input
                    value={selectedPatient?.full_name || ''}
                    placeholder="Seleccione un paciente"
                    readOnly
                    style={{ backgroundColor: '#444444' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Space style={{ marginTop: '32px' }}>
                  <Button
                    type="primary"
                    onClick={() => setIsSelectPatientModalOpen(true)}
                    disabled={patientType === 'nuevo'}
                  >
                    Seleccionar
                  </Button>
                  <Button
                    onClick={() => setIsCreatePatientModalOpen(true)}
                    disabled={patientType === 'continuador'}
                  >
                    Crear Nuevo
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* Tipo de paciente */}
            <Row gutter={16}>
              <Col span={24}>
                <Space>
                  <Checkbox
                    checked={patientType === 'continuador'}
                    onChange={(e) => {
                      setPatientType(
                        e.target.checked ? 'continuador' : 'nuevo',
                      );
                      setSelectedPatient(null);
                    }}
                  >
                    Continuador
                  </Checkbox>
                  <Checkbox
                    checked={patientType === 'nuevo'}
                    onChange={(e) => {
                      setPatientType(
                        e.target.checked ? 'nuevo' : 'continuador',
                      );
                      setSelectedPatient(null);
                    }}
                  >
                    Nuevo
                  </Checkbox>
                </Space>
              </Col>
            </Row>

            <Divider style={{ borderColor: '#555555' }} />

            {/* Método de pago y monto */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="payment_type_id"
                  label="Método de Pago"
                  rules={[
                    {
                      required: true,
                      message: 'El método de pago es requerido',
                    },
                  ]}
                >
                  <SelectPaymentStatus
                    value={form.getFieldValue('payment_type_id')}
                    onChange={handlePaymentTypeChange}
                    placeholder="Selecciona método de pago"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="service_id" label="Opciones de Pago">
                  <SelectPrices
                    value={form.getFieldValue('service_id')}
                    initialPrice={form.getFieldValue('payment')}
                    onChange={(value) =>
                      form.setFieldsValue({ service_id: value })
                    }
                    // onPriceChange eliminado para evitar warning en DOM/AntD
                    placeholder="Selecciona una opción"
                    hidePriceInput={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Campo de monto */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="payment"
                  label="Monto"
                  rules={[
                    {
                      required: true,
                      message: 'El monto es requerido',
                    },
                    {
                      validator: (_, value) => {
                        if (
                          value &&
                          (isNaN(Number(value)) || Number(value) <= 0)
                        ) {
                          return Promise.reject(
                            new Error('El monto debe ser mayor a cero'),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese el monto"
                    prefix="S/"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Hora de cita */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="appointment_hour" label="Hora de cita">
                  <Input placeholder="HH:MM" disabled={!showHourField} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={showHourField}
                  onChange={(e) => setShowHourField(e.target.checked)}
                  style={{ marginTop: '32px' }}
                >
                  Incluir hora
                </Checkbox>
              </Col>
            </Row>

            {/* Botones */}
            <Row justify="end" style={{ marginTop: '30px' }}>
              <Col>
                <Space>
                  <Button
                    onClick={() => onEditSuccess && onEditSuccess()}
                    style={{
                      backgroundColor: '#666666',
                      borderColor: '#666666',
                      color: '#ffffff',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    onClick={() => {
                      console.log('🔍 Debug - Botón clickeado');
                      console.log(
                        '🔍 Debug - Form values en botón:',
                        form.getFieldsValue(),
                      );
                      console.log(
                        '🔍 Debug - Form errors en botón:',
                        form.getFieldsError(),
                      );
                    }}
                  >
                    Actualizar Cita
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        )}

        {/* Modal para seleccionar paciente */}
        <Modal
          title="Seleccionar Paciente"
          open={isSelectPatientModalOpen}
          onCancel={() => setIsSelectPatientModalOpen(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsSelectPatientModalOpen(false)}
            >
              Cancelar
            </Button>,
            <Button
              key="select"
              type="primary"
              onClick={handlePatientSelection}
            >
              Seleccionar
            </Button>,
          ]}
          width={500}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={processedPatients}
            columns={patientColumns}
            pagination={false}
            rowKey="key"
            loading={patientsLoading}
            onRow={(record) => ({
              onClick: () => setSelectedRowKey(record.key),
            })}
          />
        </Modal>

        {/* Modal para crear paciente */}
        <Modal
          title="Crear Nuevo Paciente"
          open={isCreatePatientModalOpen}
          onCancel={() => setIsCreatePatientModalOpen(false)}
          footer={null}
          width={500}
          destroyOnClose
        >
          <NewPatient
            onCancel={() => setIsCreatePatientModalOpen(false)}
            onSubmit={handlePatientCreated}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default EditAppointment;
