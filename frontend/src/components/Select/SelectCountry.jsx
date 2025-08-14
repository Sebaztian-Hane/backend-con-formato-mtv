import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getCountries } from './SelectsApi';

export function SelectCountries() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        console.log ('realizando consulta')
        const data = await getCountries();
        console.log (data)
        const paises = data.map((pais) => ({
          value: pais.id,
          label: pais.name,
        }));

        setOptions(paises);
      } catch {
        console.error('Error al obtener los paises');
      }
    };

    fetchPaises();
  }, []);

  return (
    <Select
      style={{ color: '#fff' }}
      showSearch
      filterOption={(input, option) => {
        var _a;
        return (
          (_a =
            option === null || option === void 0 ? void 0 : option.label) !==
            null && _a !== void 0
            ? _a
            : ''
        )
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
      placeholder="Pais"
      options={options}
      onChange={(value) => console.log(value)}
    />
  );
}

export default SelectCountries;