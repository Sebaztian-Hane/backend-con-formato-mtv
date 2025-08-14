import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getProvinces } from '../SelectsApi';

export function SelectProvince({ departamentId, value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProvincias = async () => {
      if (!departamentId) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getProvinces(departamentId);
        setOptions(data.map(p => ({ value: p.id, label: p.name })));
      } catch (error) {
        console.error("Error loading provincias:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProvincias();
  }, [departamentId]);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={!departamentId || loading}
      showSearch
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      placeholder={departamentId ? "Seleccione provincia" : "Primero seleccione departamento"}
      notFoundContent={loading ? <Spin size="small" /> : "No hay provincias para este departamento"}
      {...rest}
    />
  );
}