import { Button, Col, ConfigProvider, Form, Row } from 'antd';
import { useState, forwardRef } from 'react';
import styles from '../Form/Form.module.css';
import InputField from '../Input/Input';

const { useForm } = Form;

const FormComponent = forwardRef(
  (
    {
      fields = [],
      mode = 'create',
      showHourField = false,
      isPaymentRequired = true,
      patientType = '',
      paymentOption = '',
      customAmount = '',
      onSubmit = () => {},
      onPaymentOptionChange = () => {},
      onPatientTypeChange = () => {},
      onShowHourFieldChange = () => {},
      onPaymentRequiredChange = () => {},
      onOpenCreateModal = () => {},
      onOpenSelectModal = () => {},
      onCancel = () => {},
      form: externalForm,
      onPriceChange,
    },
    ref,
  ) => {
    const [internalForm] = useForm();
    const form = externalForm || internalForm;
    const [loading, setLoading] = useState(false);
    const [isPhoneRequired, setIsPhoneRequired] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState('XD');

    const togglePhoneRequired = () => {
      setIsPhoneRequired((prev) => !prev);
      form.validateFields(['primary_phone']);
    };

    const handleSelectedPatientChange = (newText) => {
      setSelectedPatient(newText);
    };

    const renderField = (field, index) => {
      if (field.type === 'title') {
        return (
          <Col span={24} key={index}>
            <h2 className={styles.title}>{field.label}</h2>
          </Col>
        );
      }

      if (field.type === 'customRow') {
        return (
          <Col span={24} key={index}>
            <Row gutter={[25, 0]}>
              {field.fields.map((subField, subIndex) =>
                renderField(subField, `${index}-${subIndex}`),
              )}
            </Row>
          </Col>
        );
      }

      if (field.type === 'customComponent') {
        if (field.show === 'showHourField' && !showHourField) return null;

        return (
          <Col span={field.span || 24} key={index}>
            <InputField
              selectedPatient={selectedPatient}
              changeSelectedPatient={handleSelectedPatientChange}
              type="cita"
              componentType={field.componentType}
              form={form}
              {...field.props}
              showHourField={showHourField}
              isPaymentRequired={isPaymentRequired}
              patientType={patientType}
              paymentOption={paymentOption}
              customAmount={customAmount}
              paymentOptions={field.props?.paymentOptions}
              onPatientTypeChange={onPatientTypeChange}
              onPaymentOptionChange={onPaymentOptionChange}
              onShowHourFieldChange={onShowHourFieldChange}
              onPaymentRequiredChange={onPaymentRequiredChange}
              onOpenCreateModal={onOpenCreateModal}
              onOpenSelectModal={onOpenSelectModal}
              onPriceChange={onPriceChange}
            />
          </Col>
        );
      }

      const isPhoneField = field.name === 'primary_phone';
      return (
        <Col span={field.span || 8} key={index}>
          <Form.Item
            name={field.name}
            label={<span className={styles.label}>{field.label}</span>}
            className={`${styles.formItem} ${field.className || ''}`}
            rules={
              isPhoneField
                ? [
                    ...(isPhoneRequired
                      ? [
                          {
                            required: true,
                            message: 'Por favor ingrese su teléfono',
                          },
                        ]
                      : []),
                    () => ({
                      validator(_, value) {
                        if (!value || (value && value.length === 9)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('El teléfono debe tener 9 dígitos'),
                        );
                      },
                    }),
                  ]
                : field.rules
            }
          >
            <InputField
              type={isPhoneField ? 'phoneNumber' : field.type}
              selectedPatient={selectedPatient}
              label={field.label}
              options={field.options || []}
              isPhoneField={isPhoneField}
              isPhoneRequired={isPhoneRequired}
              togglePhoneRequired={togglePhoneRequired}
              onPriceChange={onPriceChange}
            />
          </Form.Item>
        </Col>
      );
    };

    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#FFFFFFFF',
            colorBgContainer: '#444444',
            colorText: '#FFFFFFFF',
            colorBorder: '#444',
            controlOutline: 'none',
            fontFamily: 'sans-serif',
          },
        }}
      >
        <div className={styles.container}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            className={styles.formContainer}
            ref={ref}
          >
            <Row gutter={[20, 0]}>
              {fields.map((field, index) => renderField(field, index))}
            </Row>

            <Form.Item className={styles.buttonGroup}>
              <div className={styles.buttonWrapper}>
                <Button
                  htmlType="button"
                  className={styles.buttonCancel}
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  className={styles.buttonSubmit}
                  loading={loading}
                  onClick={() => form.submit()}
                >
                  {mode === 'edit' ? 'Actualizar' : 'Registrar'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </ConfigProvider>
    );
  },
);

export default FormComponent;
