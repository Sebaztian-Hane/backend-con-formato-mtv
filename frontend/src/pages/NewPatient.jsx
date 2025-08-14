import FormGenerator from '../components/Form/Form';

const fields = [
  // TÍTULO
  { type: 'title', label: 'Nuevo paciente' },

// Primera fila — manual
  {
    type: 'customRow',
    fields: [
      { name: 'documentType', label: 'Tipo de Documento', type: 'select', options: [{ value: 'dni', label: 'DNI' }], span: 8 },
      { name: 'documentNumber', label: 'N° Documento', type: 'text', required: true, span: 8 },
    ]
  },

  // Segunda fila
  { name: 'lastName', label: 'Apellido Paterno', type: 'text', required: true, span: 8 },
  { name: 'motherLastName', label: 'Apellido Materno', type: 'text', span: 8 },
  { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },

  // Tercera fila
  { name: 'apellidoPaterno2', label: 'Apellido Paterno', type: 'text', span: 8 },
  { name: 'gender', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], span: 8 },
  { name: 'occupation', label: 'Ocupación', type: 'text', span: 8 },

  // TÍTULO
  { type: 'title', label: 'Información de contacto' },

  // Cuarta fila
  { name: 'phone', label: 'Teléfono', type: 'text', required: true, span: 8 },
  { name: 'email', label: 'Correo Electrónico', type: 'text', span: 16 },

  // Quinta fila
  { name: 'address', label: 'Dirección de Domicilio', type: 'text', span: 24 },

  // Sexta fila
  { name: 'departamento', label: 'Departamento', type: 'select', options: [], span: 8 },
  { name: 'provincia', label: 'Provincia', type: 'select', options: [], span: 8 },
  { name: 'distrito', label: 'Distrito', type: 'select', options: [], span: 8 },
];

const NewPatient = () => {
  return <FormGenerator fields={fields} />;
};

export default NewPatient;
