import { Form, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';

// Reutilizamos los mismos campos del formulario de creación
const fields = [
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type',
        label: 'Tipo de Documento',
        type: 'typeOfDocument',
        span: 8,
        required: true,
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'documentNumber',
        required: true,
        span: 8,
        rules: [
          {
            required: true,
            message: 'Por favor ingrese el número de documento',
          },
          {
            pattern: /^\d{8,9}$/,
            message: 'El documento debe tener 8 dígitos',
          },
        ],
      },
    ],
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'paternal_lastname',
        label: 'Apellido Paterno',
        type: 'text',
        required: true,
        span: 8,
      },
      {
        name: 'maternal_lastname',
        label: 'Apellido Materno',
        type: 'text',
        span: 8,
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        span: 8,
      },
    ],
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'birth_date',
        label: 'Fecha de Nacimiento',
        type: 'date',
        span: 8,
      },
      {
        name: 'sex',
        label: 'Sexo',
        type: 'select',
        options: [
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' },
        ],
        span: 8,
        required: true,
      },
      {
        name: 'occupation',
        label: 'Ocupación',
        type: 'text',
        span: 8,
      },
    ],
  },
  { type: 'title', label: 'Información de contacto' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'primary_phone',
        label: 'Teléfono',
        type: 'phoneNumber',
        required: true,
        span: 8,
        rules: [
          {
            required: true,
            message: 'Por favor ingrese su número telefónico',
          },
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(
                  new Error('Por favor ingrese su teléfono'),
                );
              }
              if (value.length < 9) {
                return Promise.reject(
                  new Error('El teléfono debe tener 9 dígitos'),
                );
              }
              if (value.length > 9) {
                return Promise.reject(
                  new Error('El teléfono debe tener exactamente 9 dígitos'),
                );
              }
              return Promise.resolve();
            },
          }),
        ],
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        type: 'email',
        span: 16,
      },
    ],
  },
  {
    name: 'ubicacion',
    label: 'Ubicación',
    type: 'ubigeo',
    span: 12,
  },
  {
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 12,
    required: true,
  },
];

const EditPatient = ({ patient, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { handleUpdatePatient } = usePatients();
  const [loading, setLoading] = useState(false);

  // Actualiza el formulario con los datos recibidos
  const setFormWithPatient = (data) => {
    if (!data) return;
    // Usar document_type
    const ubicacion = {
      region_id: data.region,
      province_id: data.province,
      district_id: data.district,
    };
    if (ubicacion.region_id !== null)
      ubicacion.region_id = String(ubicacion.region_id);
    if (ubicacion.province_id !== null)
      ubicacion.province_id = String(ubicacion.province_id);
    if (ubicacion.district_id !== null)
      ubicacion.district_id = String(ubicacion.district_id);
    const formData = {
      name: data.name || '',
      paternal_lastname: data.paternal_lastname,
      maternal_lastname: data.maternal_lastname,
      document_type:
        data.document_type !== undefined && data.document_type !== null
          ? String(data.document_type)
          : undefined,
      document_number: data.document_number,
      personal_reference: data.personal_reference,
      birth_date: data.birth_date ? dayjs(data.birth_date) : null,
      sex: data.sex,
      primary_phone: data.primary_phone,
      secondary_phone: data.secondary_phone,
      email: data.email,
      occupation: data.ocupation,
      address: data.address,
      country_id: data.country_id,
      ubicacion,
    };
    form.setFieldsValue(formData);
    console.log('Valores seteados en el form:', formData);
  };

  // Inicializa el formulario con los datos de la prop patient
  useEffect(() => {
    setFormWithPatient(patient);
  }, [patient]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // Convertir el tipo de documento a número y renombrar el campo
      const dataToSend = {
        ...formData,
        document_type_id: Number(formData.document_type),
      };
      delete dataToSend.document_type;

      // Solo enviar email si cambió
      if (formData.email === patient.email) {
        delete dataToSend.email;
      }

      await handleUpdatePatient(patient.id, dataToSend);
      notification.success({
        message: 'Éxito',
        description: 'Paciente actualizado correctamente',
      });
      if (onSave) onSave();
      onClose();
    } catch (error) {
      notification.error({
        message: 'Error',
        description:
          error.response?.data?.message || 'Error al actualizar el paciente',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  const modalTitle =
    patient.full_name ||
    `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();

  return (
    <Modal
      title={`Editar Paciente: ${modalTitle}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <FormGenerator
        form={form}
        fields={fields}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default EditPatient;
