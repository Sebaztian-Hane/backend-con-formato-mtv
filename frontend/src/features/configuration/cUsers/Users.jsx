import React, { useState, useEffect } from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import { useUsers } from './usersHook';
import {
  Button,
  Space,
  Form,
  Input,
  message,
  Select,
  Row,
  Col,
  ConfigProvider,
  Popconfirm,
} from 'antd';
import styles from './Users.module.css';
import BaseModal from '../../../components/Modal/BaseModalPayments/BaseModalPayments';
import SelectTypeOfDocument from '../../../components/Select/SelctTypeOfDocument';

const { Option } = Select;

// Función para capitalizar la primera letra de cada palabra
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const renderStatus = (status) => {
  return status === 'Habilitado' ? (
    <span className={styles.statusEnabled}>{status}</span>
  ) : (
    <span className={styles.statusDisabled}>{status}</span>
  );
};

// Componente SelectRole con el mismo estilo que SelectTypeOfDocument
const SelectRole = ({ value, onChange, ...rest }) => {
  const [internalValue, setInternalValue] = useState(value);

  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Usuario' },
  ];

  const options = roles.map((role) => ({
    label: <span style={{ color: '#fff' }}>{role.name}</span>,
    value: role.id,
  }));

  // Sincronizar value cuando cambia el value externo
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(value);
    } else {
      setInternalValue(undefined);
    }
  }, [value]);

  const handleChange = (val) => {
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <Select
      {...rest}
      value={internalValue}
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        (option?.label?.props?.children ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      placeholder="Seleccionar rol"
      options={options}
      style={{
        width: '100%',
      }}
    />
  );
};

// Componente SelectSex con el mismo estilo
const SelectSex = ({ value, onChange, ...rest }) => {
  const [internalValue, setInternalValue] = useState(value);

  const options = [
    { label: <span style={{ color: '#fff' }}>Masculino</span>, value: 'M' },
    { label: <span style={{ color: '#fff' }}>Femenino</span>, value: 'F' },
  ];

  // Sincronizar value cuando cambia el value externo
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(value);
    } else {
      setInternalValue(undefined);
    }
  }, [value]);

  const handleChange = (val) => {
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <Select
      {...rest}
      value={internalValue}
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        (option?.label?.props?.children ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      placeholder="Seleccionar sexo"
      options={options}
      style={{
        width: '100%',
      }}
    />
  );
};

const Users = () => {
  const {
    users,
    loading,
    addUser,
    editUser,
    removeUser,
    pagination,
    handlePageChange,
  } = useUsers();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [action, setAction] = useState(''); // 'create' | 'edit'

  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Usuario' },
  ];

  // Preparar los valores iniciales para el modal
  const getInitialValues = () => {
    if (action === 'edit' && currentRecord) {
      return {
        document_number: currentRecord.document_number,
        name: currentRecord.name,
        paternal_lastname: currentRecord.paternal_lastname,
        maternal_lastname: currentRecord.maternal_lastname,
        email: currentRecord.email,
        phone: currentRecord.phone,
        user_name: currentRecord.user_name,
        sex: currentRecord.sex,
        account_statement: currentRecord.account_statement === 'Habilitado',
        document_type_id:
          currentRecord.document_type?.id || currentRecord.document_type_id,
        role_id: currentRecord.role?.id,
      };
    }
    // Valores por defecto para crear un nuevo usuario
    return {
      document_number: '',
      name: '',
      paternal_lastname: '',
      maternal_lastname: '',
      email: '',
      phone: '',
      user_name: '',
      sex: undefined,
      account_statement: true,
      document_type_id: undefined,
      role_id: undefined,
      password: '',
    };
  };

  const handleAction = (action, record) => {
    setAction(action);
    setCurrentRecord(record);

    // Resetear el formulario antes de abrir el modal
    form.resetFields();

    if (action === 'edit') {
      setModalVisible(true);

      // Usar setTimeout para asegurar que el modal se haya renderizado
      setTimeout(() => {
        const formData = {
          document_number: record.document_number,
          name: record.name,
          paternal_lastname: record.paternal_lastname,
          maternal_lastname: record.maternal_lastname,
          email: record.email,
          phone: record.phone,
          user_name: record.user_name,
          sex: record.sex,
          account_statement: record.account_statement === 'Habilitado',
          document_type_id: record.document_type?.id || record.document_type_id,
          role_id: record.role?.id,
        };

        form.setFieldsValue(formData);
      }, 0);
    } else if (action === 'delete') {
      // Se maneja con Popconfirm
    } else if (action === 'deactivate') {
      handleDeactivate(record);
    }
  };

  const handleAddUser = () => {
    setAction('create');
    setCurrentRecord(null);

    // Resetear completamente el formulario
    form.resetFields();

    setModalVisible(true);

    // Establecer valores por defecto después de abrir el modal
    setTimeout(() => {
      form.setFieldsValue({
        document_number: '',
        name: '',
        paternal_lastname: '',
        maternal_lastname: '',
        email: '',
        phone: '',
        user_name: '',
        sex: undefined,
        account_statement: true,
        document_type_id: undefined,
        role_id: undefined,
        password: '',
      });
    }, 0);
  };

  const handleDeactivate = async (record) => {
    try {
      await editUser(record.id, {
        ...record,
        account_statement:
          record.account_statement === 'Habilitado' ? false : true,
      });
      message.success('Estado del usuario actualizado correctamente');
    } catch (error) {
      message.error('Error al cambiar el estado del usuario');
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeUser(id);
      message.success('Usuario eliminado correctamente');
    } catch (error) {
      message.error('Error al eliminar el usuario');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        document_number: values.document_number?.trim(),
        name: capitalizeFirstLetter(values.name?.trim()),
        paternal_lastname: capitalizeFirstLetter(
          values.paternal_lastname?.trim(),
        ),
        maternal_lastname: capitalizeFirstLetter(
          values.maternal_lastname?.trim(),
        ),
        email: values.email?.toLowerCase().trim(),
        phone: values.phone?.trim(),
        user_name: values.user_name?.toLowerCase().trim(),
        sex: values.sex,
        account_statement: values.account_statement,
        document_type_id: values.document_type_id,
        role_id: values.role_id,
      };

      if (action === 'create') {
        await addUser(payload);
        message.success('Usuario creado exitosamente');
      } else {
        await editUser(currentRecord.id, payload);
        message.success('Usuario actualizado exitosamente');
      }

      handleModalCancel();
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Error al procesar la solicitud',
      );
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentRecord(null);
    setAction('');
    // Resetear el formulario al cancelar
    form.resetFields();
  };

  // Efecto para resetear el formulario cuando cambia el modal
  useEffect(() => {
    if (!modalVisible) {
      form.resetFields();
    }
  }, [modalVisible, form]);

  const userColumns = [
    {
      title: 'Nombre',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role?.name || 'Sin rol',
    },
    {
      title: 'Estado',
      dataIndex: 'account_statement',
      key: 'account_statement',
      render: renderStatus,
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            className={styles.editButton}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          {/* <Button
            className={styles.deactivateButton}
            onClick={() => handleAction('deactivate', record)}
          >
            {record.account_+
            statement === 'Habilitado'
              ? 'Desactivar'
              : 'Activar'}
          </Button> */}
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button className={styles.deleteButton}>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            controlHeight: 40,
            borderRadius: 6,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 6,
            colorPrimary: '#FFFFFFFF',
            optionSelectedBg: '#333333',
            colorText: '#fff',
            colorBgElevated: '#444444',
            colorTextPlaceholder: '#aaa',
            controlItemBgHover: '#1a1a1a',
            selectorBg: '#444444',
          },
          Button: {
            controlHeight: 40,
            borderRadius: 6,
            colorPrimary: '#4CAF50',
            colorTextLightSolid: '#ffffff',
            colorBgContainer: '#333333',
            colorText: '#ffffff',
            colorBorder: '#333333',
          },
          Popconfirm: {
            borderRadius: 8,
            padding: 12,
          },
          Popover: {
            colorBgElevated: '#000',
            colorText: '#ffffff',
          },
        },
        token: {
          colorPrimary: '#4CAF50',
          colorText: '#ffffff',
          colorTextBase: '#fff',
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Usuarios</h2>
          <Button
            type="primary"
            className={styles.addButton}
            onClick={handleAddUser}
          >
            Agregar Usuario
          </Button>
        </div>

        <ModeloTable
          columns={userColumns}
          data={users}
          loading={loading}
          pagination={{
            current: pagination.currentPage,
            total: pagination.totalItems,
            pageSize: pagination.pageSize,
            onChange: handlePageChange,
          }}
        />

        <BaseModal
          visible={modalVisible}
          onCancel={handleModalCancel}
          onOk={handleSubmit}
          title={
            action === 'create' ? 'Agregar nuevo usuario' : 'Editar usuario'
          }
          form={form}
          okText={action === 'create' ? 'Crear' : 'Actualizar'}
          width={800}
          initialValues={getInitialValues()}
        >
          <div className={styles.formContainer}>
            {/* Primera fila: Tipo de documento y Número de documento */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="document_type_id"
                  label="Tipo de documento"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <SelectTypeOfDocument className={styles.uniformInput} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="document_number"
                  label="Número de documento"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Input className={styles.uniformInput} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Columna izquierda */}
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Nombres"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Input
                    className={styles.uniformInput}
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      form.setFieldValue('name', value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="paternal_lastname"
                  label="Apellido paterno"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Input
                    className={styles.uniformInput}
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      form.setFieldValue('paternal_lastname', value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="maternal_lastname"
                  label="Apellido materno"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Input
                    className={styles.uniformInput}
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      form.setFieldValue('maternal_lastname', value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                    { type: 'email', message: 'Ingrese un correo válido' },
                  ]}
                >
                  <Input
                    className={styles.uniformInput}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      form.setFieldValue('email', value);
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Columna derecha */}
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Teléfono"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Input className={styles.uniformInput} />
                </Form.Item>

                <Form.Item name="user_name" label="Nombre de usuario">
                  <Input
                    className={styles.uniformInput}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      form.setFieldValue('user_name', value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="role_id"
                  label="Rol"
                  rules={[
                    { required: true, message: 'Este campo es requerido' },
                  ]}
                >
                  <Select
                    className={styles.uniformInput}
                    placeholder="Seleccionar rol"
                    options={roles.map((role) => ({
                      label: <span style={{ color: '#fff' }}>{role.name}</span>,
                      value: role.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item name="sex" label="Sexo">
                  <Select
                    className={styles.uniformInput}
                    placeholder="Seleccionar sexo"
                    options={[
                      {
                        label: <span style={{ color: '#fff' }}>Masculino</span>,
                        value: 'M',
                      },
                      {
                        label: <span style={{ color: '#fff' }}>Femenino</span>,
                        value: 'F',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}></Col>
            </Row>
          </div>
        </BaseModal>
      </div>
    </ConfigProvider>
  );
};

export default Users;
