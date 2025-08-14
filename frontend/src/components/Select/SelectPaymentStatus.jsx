import { ConfigProvider, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getPaymentStatuses } from './SelectsApi';

export function SelectPaymentStatus({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const data = await getPaymentStatuses(); // Ya viene con value y label
        const formattedOptions = data.map((item) => ({
          ...item,
          value: String(item.value), // Forzar a string
          label: <span style={{ color: '#fff' }}>{item.label}</span>,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al obtener los estados de pago:', error);
      }
    };

    fetchPaymentStatuses();
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: '#FFFFFFFF',
            optionSelectedBg: '#424242FF',
            colorText: '#fff',
            colorTextPlaceholder: '#aaa',
            controlItemBgHover: '#2E2E2EFF',
            selectorBg: '#444444', // fondo del input
          },
        },
        token: {
          colorTextBase: '#fff',
        },
      }}
    >
      <Select
        style={{ width: '100%' }}
        dropdownStyle={{ backgroundColor: '#444444' }}
        showSearch
        placeholder="Estado de pago"
        options={options}
        value={value}
        onChange={onChange}
        filterOption={(input, option) =>
          (option?.label?.props?.children ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        {...rest}
      />
    </ConfigProvider>
  );
}

export default SelectPaymentStatus;
