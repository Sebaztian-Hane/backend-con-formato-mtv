import { notification } from 'antd';
import FormGenerator from '../../../../components/Form/Form';
import { useStaff } from '../../hook/staffHook';
import { useNavigate } from 'react-router';

const fields = [
  { type: 'title', label: 'Nuevo Terapista' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type_id',
        label: 'Tipo de Documento',
        type: 'typeOfDocument',
        span: 8,
        required: true,
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'documentNumber', // Usamos nuestro tipo personalizado
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
        name: 'personal_reference',
        label: 'Referencia Personal',
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
        type: 'phoneNumber', // Usamos nuestro tipo personalizado
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
  },
];

const NewTherapist = () => {
  const { submitNewTherapist } = useStaff();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    console.log('📝 Formulario enviado:', formData);

    try {
      // Validación básica de campos requeridos
      if (
        !formData.document_number ||
        !formData.name ||
        !formData.primary_phone
      ) {
        notification.error({
          message: 'Error',
          description: 'Documento, nombre y teléfono son campos obligatorios',
        });
        return;
      }

      const result = await submitNewTherapist(formData);
      console.log('🎉 Terapeuta creado con éxito:', result);
      navigate('/Inicio/terapeutas');
      return result;
    } catch (error) {
      console.error('❌ Error al crear terapeuta:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/Inicio/terapeutas');
  };

  return (
    <FormGenerator
      fields={fields}
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialValues={{
        document_type_id: 1, // Valor por defecto
      }}
    />
  );
};

export default NewTherapist;
