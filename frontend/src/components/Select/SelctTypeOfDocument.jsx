import { ConfigProvider, Select } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { getDocumentTypes } from './SelectsApi';

export function SelectTypeOfDocument({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [internalValue, setInternalValue] = useState(value);
  const [loading, setLoading] = useState(false);

  // Cargar opciones con caché
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setLoading(true);
      try {
        const data = await getDocumentTypes();
        const formattedOptions = data.map((item) => ({
          label: (
            <span style={{ color: '#fff' }}>{item.label || item.name}</span>
          ),
          value: String(item.value),
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al obtener tipos de documento:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentTypes();
  }, []);

  // Sincronizar value cuando cambian las opciones o el value externo
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Si las opciones ya están cargadas y el value existe en ellas, sincroniza
      if (
        options.length > 0 &&
        options.some((opt) => String(opt.value) === String(value))
      ) {
        setInternalValue(String(value));
      } else if (options.length === 0) {
        // Si aún no hay opciones, guarda el value para sincronizarlo después
        setInternalValue(String(value));
      }
    } else {
      setInternalValue(undefined);
    }
  }, [value, options]);

  const handleChange = useCallback(
    (val) => {
      setInternalValue(val);
      if (onChange) onChange(val);
    },
    [onChange],
  );

  const filterOption = useCallback(
    (input, option) =>
      (option?.label?.props?.children ?? '')
        .toLowerCase()
        .includes(input.toLowerCase()),
    [],
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: '#FFFFFFFF',
            optionSelectedBg: '#333333',
            colorText: '#fff',
            colorBgElevated: '#444444', // fondo del dropdown (opciones)
            colorTextPlaceholder: '#aaa',
            controlItemBgHover: '#1a1a1a', // hover sobre opciones
            selectorBg: '#444444', // fondo del input
          },
        },
        token: {
          colorTextBase: '#fff', // texto blanco por defecto
        },
      }}
    >
      <Select
        {...rest}
        value={internalValue}
        onChange={handleChange}
        showSearch
        filterOption={filterOption}
        placeholder="Tipo de documento"
        options={options}
        loading={loading}
        style={{
          width: '100%',
        }}
      />
    </ConfigProvider>
  );
}

export default SelectTypeOfDocument;
