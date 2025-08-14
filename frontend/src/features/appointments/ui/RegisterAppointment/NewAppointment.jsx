import {
  Button,
  ConfigProvider,
  Form,
  Modal,
  Radio,
  Table,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormComponent from '../../../../components/Form/Form';
import CustomSearch from '../../../../components/Search/CustomSearch';
import NewPatient from '../../../patients/ui/RegisterPatient/NewPatient';
import { useAppointments, usePatients } from '../../hook/appointmentsHook';
import styles from '../RegisterAppointment/NewAppointment.module.css';
import SelectPaymentStatus from '../../../../components/Select/SelectPaymentStatus';

const NewAppointment = () => {
  const [showHourField, setShowHourField] = useState(false);
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);
  const [patientType, setPatientType] = useState('nuevo');
  const [formValues, setFormValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreatePatientModalVisible, setIsCreatePatientModalVisible] =
    useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('');

  const { submitNewAppointment } = useAppointments();
  const { patients, loading, setSearchTerm, fetchPatients } = usePatients(true);

  // Usar form de Ant Design
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Sincronizar el valor de payment cada vez que cambie el select de precios
  useEffect(() => {
    const unsubscribe = form.subscribe?.(() => {
      const paymentTypeId = form.getFieldValue('payment_type_id');
      const prices = form.getFieldInstance?.('payment_type_id')?.props?.options;
      if (prices && paymentTypeId) {
        const selected = prices.find((item) => item.value === paymentTypeId);
        if (selected) {
          form.setFieldsValue({ payment: selected.price });
        }
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [form]);

  // Callback para actualizar el monto
  const handlePriceChange = (price) => {
    form.setFieldsValue({ payment: price });
    setSelectedPrice(price);
  };

  const handleSubmit = async (values) => {
    // Si falta payment, usar el estado local
    let paymentValue = values.payment;
    if (!paymentValue) {
      paymentValue = selectedPrice;
    }

    if (!selectedPatient) {
      notification.error({
        message: 'Error',
        description: 'Debe seleccionar o crear un paciente primero',
      });
      return;
    }

    // Validar campos requeridos
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
    if (!paymentValue) {
      notification.error({
        message: 'Error',
        description: 'El monto de pago es requerido',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Lógica para determinar appointment_status_id basada en la fecha
      const appointmentDate = dayjs(values.appointment_date);
      const currentDate = dayjs();

      let appointment_status_id;
      if (appointmentDate.isBefore(currentDate, 'day')) {
        appointment_status_id = 2;
      } else {
        appointment_status_id = 1;
      }

      if (typeof paymentValue === 'string') {
        paymentValue = paymentValue.replace(/[^\d.]/g, '');
        paymentValue = parseFloat(paymentValue);
      }

      // Eliminar patient_id del formulario y usar el del estado
      const { appointment_hour, patient_id, ...formDataWithoutHour } = values;
      const payload = {
        ...formDataWithoutHour,
        ...(showHourField && values.appointment_hour
          ? { appointment_hour: values.appointment_hour }
          : {}),
        appointment_status_id: appointment_status_id,
        patient_id: selectedPatient.id,
        payment: paymentValue,
      };

      const result = await submitNewAppointment(payload);

      notification.success({
        message: 'Cita registrada',
        description: 'La cita se ha registrado correctamente',
      });

      form.resetFields();
      setSelectedPatient(null);
      setPatientType('nuevo');
      setShowHourField(false);
      setIsPaymentRequired(false);
      navigate('/Inicio/citas');
    } catch (error) {
      let errorMessage =
        'No se pudo registrar la cita. Por favor intente nuevamente.';
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

  const handleCancel = () => {
    setIsCreatePatientModalVisible(false);
    setIsModalVisible(false);
    navigate('/Inicio/citas');
  };

  const handleOpenCreateModal = () => {
    setIsCreatePatientModalVisible(true);
  };

  const handleOpenSelectModal = () => {
    setIsModalVisible(true);
  };

  const handleChangeSelectedPatient = (newPatient) => {
    setSelectedPatient(newPatient);
    form.setFieldsValue({ patient_id: newPatient?.id });
  };

  const handleLogServerResponse = (result) => {
    if (result && typeof result === 'object') {
      // Concatenar el nombre completo
      const concatenatedName =
        `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();

      // Convertir todo el objeto a string
      const stringified = JSON.stringify(result);

      // Guardar en estado
      setSelectedPatient({
        ...result,
        full_name: concatenatedName,
        stringifiedData: stringified,
      });
      form.setFieldsValue({ patient_id: result.id });
    } else {
      console.error('El resultado no es un objeto válido:', result);
    }
  };

  const appointmentFields = [
    {
      type: 'customRow',
      fields: [{ type: 'title', label: 'Nueva Cita', span: 8 }],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'appointment_date',
          type: 'customComponent',
          componentType: 'dateField',
          required: true,
          span: 15,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'patient_id',
          type: 'customComponent',
          componentType: 'patientField',
          label: 'Paciente',
          required: true,
          span: 21,
          props: {
            patientTypeOptions: [
              { label: 'Nuevo', value: 'nuevo' },
              { label: 'Continuador', value: 'continuador' },
            ],
            selectedPatient,
            onChangeSelectedPatient: handleChangeSelectedPatient,
            patientType,
            onPatientTypeChange: (value) => {
              setPatientType(value);
              setSelectedPatient(null);
            },
            onOpenCreateModal: handleOpenCreateModal,
            onOpenSelectModal: handleOpenSelectModal,
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'payment_type_id',
          type: 'selectPrices',
          required: true,
          span: 15,
          onChange: handlePriceChange,
          hidePriceInput: true,
          className: 'hide-price-input',
        },
        {
          name: 'payment',
          type: 'hidden',
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'spacer',
          span: 24,
          props: {
            height: 40,
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'payment_method_id',
          type: 'customComponent',
          componentType: 'paymentMethodField',
          label: 'Método de Pago',
          required: true,
          span: 15,
          props: {
            component: SelectPaymentStatus,
          },
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          name: 'appointment_hour',
          type: 'customComponent',
          componentType: 'timeField',
          span: 15,
          show: 'showHourField',
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'hourCheckbox',
          span: 8,
        },
      ],
    },
    {
      type: 'customRow',
      fields: [
        {
          type: 'customComponent',
          componentType: 'paymentCheckbox',
          span: 10,
        },
      ],
    },
  ];

  const processedPatients = patients.map((patient, index) => ({
    ...patient,
    key: patient.id || `patient-${index}`,
  }));

  const columns = [
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
            paddingContentHorizontal: 16,
            defaultBg: '#ff3333',
            defaultColor: '#ffffff',
            defaultBorderColor: 'none',
            defaultHoverColor: '#ffffff',
            defaultActiveBg: '#b22525',
            defaultActiveColor: '#ffffff',
          },
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
            colorPrimary: '#1cb54a',
          },
        },
      }}
    >
      <div className={styles.container}>
        <FormComponent
          form={form}
          fields={appointmentFields}
          mode="create"
          showHourField={showHourField}
          isPaymentRequired={!isPaymentRequired}
          patientType={patientType}
          onPatientTypeChange={(value) => {
            setPatientType(value);
            setSelectedPatient(null);
          }}
          onShowHourFieldChange={(e) => setShowHourField(e.target.checked)}
          onPaymentRequiredChange={(e) =>
            setIsPaymentRequired(e.target.checked)
          }
          onSubmit={handleSubmit}
          onOpenCreateModal={handleOpenCreateModal}
          onOpenSelectModal={handleOpenSelectModal}
          onCancel={handleCancel}
          submitButtonText="Registrar"
          isSubmitting={isSubmitting}
          // onPriceChange eliminado para evitar warning en DOM/AntD
        />

        {/* MODAL SELECCIONAR CONTRIBUIDOR */}
        <Modal
          title="Seleccionar Contribuidor"
          open={isModalVisible}
          centered
          width={800}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={async () => {
                if (!selectedRowKey) {
                  notification.warning({
                    message: 'Advertencia',
                    description: 'Por favor seleccione un paciente primero',
                  });
                  return;
                }

                const selectedPatient = processedPatients.find(
                  (p) => p.key === selectedRowKey,
                );
                setSelectedPatient(selectedPatient);
                form.setFieldsValue({ patient_id: selectedPatient.id });

                setIsModalVisible(false);
                setSelectedRowKey(null);

                notification.success({
                  message: 'Paciente seleccionado',
                  description: `Se ha seleccionado a ${selectedPatient.full_name}`,
                });
              }}
            >
              Seleccionar
            </Button>,
          ]}
          styles={{ body: { padding: '24px' } }}
        >
          <CustomSearch
            placeholder="Buscar por Apellido/Nombre o DNI..."
            onSearch={(value) => setSearchTerm(value)}
            width="100%"
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={processedPatients}
            columns={columns}
            pagination={false}
            rowKey="key"
            scroll={{ y: 400 }} // Aumenta la altura del scroll para mostrar más filas
            loading={loading}
            onRow={(record) => ({
              onClick: () => {
                setSelectedRowKey(record.key);
              },
            })}
          />
        </Modal>

        {/* MODAL NUEVO PACIENTE */}
        <Modal
          title="Crear nuevo paciente"
          open={isCreatePatientModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          destroyOnClose
          styles={{ body: { overflow: 'hidden' } }}
        >
          <NewPatient
            onCancel={handleCancel}
            onSubmit={(result) => {
              if (result && typeof result === 'object') {
                // Concatenar el nombre completo
                const concatenatedName =
                  `${result.name} ${result.paternal_lastname} ${result.maternal_lastname}`.trim();

                // Convertir todo el objeto a string
                const stringified = JSON.stringify(result);

                // Guardar en estado
                setSelectedPatient({
                  ...result,
                  full_name: concatenatedName,
                  stringifiedData: stringified,
                });
                form.setFieldsValue({ patient_id: result.id });
              } else {
                console.error('El resultado no es un objeto válido:', result);
              }
            }}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default NewAppointment;
