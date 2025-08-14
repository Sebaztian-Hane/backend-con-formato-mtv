import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getDistricts } from '../SelectsApi';

export function SelectDistrit({ provinceId, value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDistritos = async () => {
      if (!provinceId) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getDistricts(provinceId);
        setOptions(data.map(d => ({ value: d.id, label: d.name })));
      } catch (error) {
        console.error("Error loading distritos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDistritos();
  }, [provinceId]);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={!provinceId || loading}
      showSearch
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      placeholder={provinceId ? "Seleccione distrito" : "Primero seleccione provincia"}
      notFoundContent={loading ? <Spin size="small" /> : "No hay distritos para esta provincia"}
      {...rest}
    />
  );
}