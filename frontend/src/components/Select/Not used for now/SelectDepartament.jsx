import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getDepartaments } from './SelectsApi';

export function SelectDepartament({ value, onChange, ...rest }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepartamentos = async () => {
      setLoading(true);
      try {
        const data = await getDepartaments();
        const safeDepartamentos = Array.isArray(data) ? data : [];
        setOptions(safeDepartamentos.map(d => ({ value: d.id, label: d.name })));
      } catch (error) {
        console.error("Error loading departamentos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDepartamentos();
  }, []);

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      loading={loading}
      showSearch
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      placeholder="Seleccione departamento"
      notFoundContent={loading ? <Spin size="small" /> : "No hay departamentos"}
      {...rest}
    />
  );
}