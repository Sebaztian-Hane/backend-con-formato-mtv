import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getDiagnoses } from './SelectsApi';

export function SelectDiagnoses() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await getDiagnoses();
        const diagnoses = data.map((diagnosis) => ({
          value: diagnosis.id,
          label: diagnosis.name,
        }));

        setOptions(diagnoses);
      } catch {
        console.error('Error al obtener los diagnósticos');
      }
    };

    fetchDiagnoses();
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
      placeholder="Diagnóstico"
      options={options}
      onChange={(value) => console.log(value)}
    />
  );
}

export default SelectDiagnoses;