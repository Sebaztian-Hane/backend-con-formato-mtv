import { Cascader, ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import {
  getDepartaments,
  getDistricts,
  getProvinces,
} from '../Select/SelectsApi';

const SelectUbigeoCascader = ({ value, onChange, ...rest }) => {
  const [options, setOptions] = useState([]);
  const [loadingUbigeo, setLoadingUbigeo] = useState(false);
  const [cascaderValue, setCascaderValue] = useState([]);

  // Convertir el objeto `value` en un array para el Cascader
  const getCascaderValueFromObject = (ubigeoObj) => {
    if (!ubigeoObj) return [];
    return [
      ubigeoObj.region_id,
      ubigeoObj.province_id,
      ubigeoObj.district_id,
    ].filter(Boolean);
  };

  // Convertir el array del Cascader en un objeto
  const getUbigeoObjectFromValue = (cascaderValue) => {
    return {
      region_id: cascaderValue[0] || null,
      province_id: cascaderValue[1] || null,
      district_id: cascaderValue[2] || null,
    };
  };

  // Cargar departamentos al montar (solo una vez)
  useEffect(() => {
    const loadDepartments = async () => {
      const departamentos = await getDepartaments();
      const safeDepartamentos = Array.isArray(departamentos) ? departamentos : [];
      setOptions(
        safeDepartamentos.map((d) => ({
          label: d.name,
          value: String(d.id),
          isLeaf: false,
        })),
      );
    };
    loadDepartments();
  }, []);

  // Cargar y anidar todo el árbol de ubigeo según los IDs SOLO si el value está completo (modo edición)
  useEffect(() => {
    const loadFullUbigeoTree = async () => {
      if (value && value.region_id && value.province_id && value.district_id) {
        setLoadingUbigeo(true);
        // 1. Cargar departamentos
        const departamentos = await getDepartaments();
        const regionOption = departamentos.find(
          (d) => String(d.id) === String(value.region_id),
        );
        let regionNode = {
          label: regionOption ? regionOption.name : value.region_id,
          value: String(value.region_id),
          isLeaf: false,
        };
        // 2. Cargar provincias
        const provincias = await getProvinces(value.region_id);
        const provinceOption = provincias.find(
          (p) => String(p.id) === String(value.province_id),
        );
        let provinceNode = {
          label: provinceOption ? provinceOption.name : value.province_id,
                value: String(value.province_id),
                isLeaf: false,
        };
        // 3. Cargar distritos
        const distritos = await getDistricts(value.province_id);
        const districtOption = distritos.find(
          (d) => String(d.id) === String(value.district_id),
        );
        let districtNode = {
          label: districtOption ? districtOption.name : value.district_id,
                    value: String(value.district_id),
                    isLeaf: true,
        };
        // Anidar
        provinceNode.children = [districtNode];
        regionNode.children = [provinceNode];
        // Armar el árbol completo
        const optionsTree = departamentos.map((d) => ({
          label: d.name,
          value: String(d.id),
          isLeaf: false,
          children:
            String(d.id) === String(value.region_id)
              ? [provinceNode]
              : undefined,
        }));
        setOptions(optionsTree);
        setCascaderValue([
            String(value.region_id),
            String(value.province_id),
            String(value.district_id),
          ]);
        setLoadingUbigeo(false);
      }
    };
    // Solo ejecutar si el value está completo (modo edición)
    if (value && value.region_id && value.province_id && value.district_id) {
      loadFullUbigeoTree();
    }
  }, [value]);

  // Sincronizar cascaderValue con value (solo si value es incompleto o vacío)
  useEffect(() => {
    if (
      !value ||
      (!value.region_id && !value.province_id && !value.district_id)
    ) {
      setCascaderValue([]);
    } else if (
      (!value.province_id || !value.district_id) &&
      (!cascaderValue.length || cascaderValue[0] !== value.region_id)
    ) {
      // Si el usuario selecciona solo departamento, actualizar cascaderValue
      setCascaderValue(getCascaderValueFromObject(value));
    }
  }, [value]);

  // Cuando el usuario selecciona, cargar hijos normalmente
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    try {
      if (selectedOptions.length === 1) {
        const provinces = await getProvinces(targetOption.value);
        targetOption.children = provinces.map((p) => ({
          label: p.name,
          value: String(p.id),
          isLeaf: false,
        }));
      } else if (selectedOptions.length === 2) {
        const districts = await getDistricts(targetOption.value);
        targetOption.children = districts.map((d) => ({
          label: d.name,
          value: String(d.id),
          isLeaf: true,
        }));
      }
      setOptions([...options]); // SHALLOW COPY para forzar re-render
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      targetOption.loading = false;
    }
  };

  const handleChange = (newCascaderValue, selectedOptions) => {
    setCascaderValue(newCascaderValue);
      if (onChange) {
      onChange(getUbigeoObjectFromValue(newCascaderValue), selectedOptions);
    }
  };

  const filter = (inputValue, path) =>
      path.some((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Cascader: {
            colorBgElevated: '#232323',
            colorText: '#fff',
            colorTextPlaceholder: '#aaa',
            colorTextDisabled: '#888',
            controlItemBgHover: '#333',
            colorPrimary: '#0066FF',
            colorBorder: '#444',
            colorIcon: '#fff',
            colorIconHover: '#0066FF',
            borderRadius: 10,
            controlHeight: 38,
            optionSelectedBg: '#222',
            optionActiveBg: '#333',
            colorScrollbarThumb: '#444',
            colorScrollbarTrack: '#232323',
            zIndexPopup: 2000,
          },
        },
        token: {
          colorTextBase: '#fff',
        },
      }}
    >
      <Cascader
        options={options}
        loadData={loadData}
        onChange={handleChange}
        changeOnSelect
        showSearch={{ filter }}
        placeholder="Seleccione departamento / provincia / distrito"
        style={{
          width: '100%',
          color: '#fff',
          background: '#232323',
          borderRadius: 10,
          border: '1px solid #444',
        }}
        styles={{
          popup: {
            root: {
              backgroundColor: '#232323',
              color: '#fff',
              borderRadius: 10,
              border: '1px solid #444',
            },
          },
        }}
        value={cascaderValue}
        disabled={loadingUbigeo}
        {...rest}
      />
      <style>{`
        .ant-cascader-menu {
          background: #232323 !important;
          color: #fff !important;
          border-radius: 10px !important;
        }
        .ant-cascader-menu-item {
          color: #fff !important;
          border-radius: 6px !important;
        }
        .ant-cascader-menu-item-active, .ant-cascader-menu-item:hover {
          background: #333 !important;
          color: #fff !important;
        }
        .ant-cascader-menu-item-disabled {
          color: #888 !important;
        }
        .ant-cascader-menu::-webkit-scrollbar {
          width: 8px;
          background: #232323;
        }
        .ant-cascader-menu::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default SelectUbigeoCascader;
