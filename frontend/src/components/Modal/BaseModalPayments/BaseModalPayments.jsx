import React from 'react';
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  Space,
  ConfigProvider,
} from 'antd';

const BaseModal = ({
  visible,
  onCancel,
  onOk,
  title,
  children,
  confirmLoading = false,
  okText = 'Guardar',
  cancelText = 'Cancelar',
  width = 520,
  initialValues,
  form,
}) => {
  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = React.useCallback(async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, [form, onOk]);

  // Manejar eventos de teclado
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!visible) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        handleOk();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onCancel, handleOk]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4CAF50',
          borderRadius: 8,
          colorBgContainer: '#2a2a2a',
          colorBgElevated: '#2a2a2a',
          colorBorder: '#555', // Color de borde más claro
          colorText: 'white',
          colorTextPlaceholder: '#666',
          colorTextDisabled: '#999999',
          colorBgContainerDisabled: '#1a1a1a',
          colorBorderSecondary: '#333',
          colorError: '#ff4d4f',
        },
        components: {
          Modal: {
            contentBg: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)',
            headerBg: 'transparent',
            titleColor: 'white',
            colorText: '#b0b0b0',
            borderRadiusLG: 12,
            paddingContentHorizontal: 12,
            paddingMD: 8,
            colorBgElevated: '#2a2a2a',
            colorBorder: '#444',
          },
          Input: {
            colorBgContainer: '#2a2a2a',
            colorText: 'white',
            colorTextPlaceholder: '#666',
            colorBorder: '#555', // Borde gris por defecto
            activeBorderColor: '#4CAF50', // Borde verde al estar activo
            hoverBorderColor: '#666', // Borde gris ligeramente más claro al hover
            borderRadius: 6,
            paddingInline: 12,
            paddingBlock: 6,
            fontSize: 14,
            colorBgContainerDisabled: 'rgba(76, 175, 80, 0.1)',
            colorTextDisabled: '#666',
            colorBorderBg: 'rgba(76, 175, 80, 0.3)',
            activeShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
            boxShadowSecondary: '0 0 0 2px rgba(76, 175, 80, 0.2)',
          },
          'Input.Password': {
            colorBgContainer: '#2a2a2a',
            colorText: 'white',
            colorTextPlaceholder: '#666',
            colorBorder: '#555',
            activeBorderColor: '#4CAF50',
            hoverBorderColor: '#666',
            borderRadius: 6,
            paddingInline: 12,
            paddingBlock: 6,
            fontSize: 14,
            colorBgContainerDisabled: 'rgba(76, 175, 80, 0.1)',
            colorTextDisabled: '#666',
            colorBorderBg: 'rgba(76, 175, 80, 0.3)',
            colorIcon: '#666666',
            colorIconHover: '#4CAF50',
            activeShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
          },
          Switch: {
            handleBg: '#ffffff',
            handleSize: 14,
            trackHeight: 20,
            trackMinWidth: 40,
            colorPrimary: '#4CAF50',
            colorPrimaryHover: '#388E3C',
          },
          Button: {
            defaultBg: 'transparent',
            defaultBorderColor: '#4CAF50',
            defaultColor: '#4CAF50',
            defaultHoverBg: 'rgba(76, 175, 80, 0.1)',
            defaultHoverBorderColor: '#66BB6A',
            defaultHoverColor: '#66BB6A',
            primaryColor: '#ffffff',
            primaryBg: '#4CAF50',
            primaryBorderColor: '#4CAF50',
            primaryHoverBg: '#388E3C',
            primaryHoverBorderColor: '#388E3C',
            borderRadius: 6,
            fontWeight: 500,
            paddingInline: 16,
            paddingBlock: 6,
          },
          Form: {
            labelColor: 'white',
            labelFontSize: 14,
            labelRequiredMarkColor: '#ff4d4f',
            itemMarginBottom: 12,
          },
        },
      }}
    >
      <Modal
        title={title}
        visible={visible}
        onCancel={onCancel}
        footer={
          <Space size={8}>
            <Button
              onClick={onCancel}
              disabled={confirmLoading}
              style={{
                padding: '6px 16px',
                height: 32,
                borderRadius: 6,
                border: '1px solid #4CAF50',
                color: '#4CAF50',
                backgroundColor: 'transparent',
              }}
              className="modal-cancel-btn"
            >
              {cancelText}
            </Button>
            <Button
              type="primary"
              loading={confirmLoading}
              onClick={handleOk}
              style={{
                padding: '6px 16px',
                height: 32,
                borderRadius: 6,
                fontWeight: 500,
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
              }}
              className="modal-ok-btn"
            >
              {okText}
            </Button>
          </Space>
        }
        width={width}
        centered
        destroyOnClose
        styles={{
          header: {
            borderBottom: '1px solid #444',
            padding: '8px 12px',
            marginBottom: 8,
            backgroundColor: 'transparent',
          },
          body: {
            padding: '0 12px 8px',
            backgroundColor: 'transparent',
          },
          footer: {
            borderTop: '1px solid #444',
            padding: '8px 15px',
            marginTop: 8,
            backgroundColor: 'transparent',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          size="small"
        >
          {children}
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default BaseModal;
