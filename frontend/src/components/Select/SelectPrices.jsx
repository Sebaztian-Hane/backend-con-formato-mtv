// Select/SelectPrices.jsx
import { ConfigProvider, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../Input/Input.module.css';
import { getPredeterminedPrices } from './SelectsApi';

const { Option } = Select;

const SelectPrices = ({
  onChange,
  onPriceChange,
  value,
  initialPrice = '',
  ...rest
}) => {
  const [prices, setPrices] = useState([]);
  const [inputPrice, setInputPrice] = useState(initialPrice);

  useEffect(() => {
    const fetchPrices = async () => {
      const priceOptions = await getPredeterminedPrices();
      setPrices(priceOptions);
    };
    fetchPrices();
  }, []);

  // Si cambia el initialPrice desde el padre, actualizar el input
  useEffect(() => {
    setInputPrice(initialPrice);
  }, [initialPrice]);

  const handleSelectChange = (selectedValue) => {
    const selected = prices.find((item) => item.value === selectedValue);
    const newPrice = selected?.price || '';
    setInputPrice(newPrice);
    if (onChange) onChange(selectedValue);
    if (onPriceChange) onPriceChange(newPrice);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputPrice(newValue);
    if (onPriceChange) onPriceChange(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Select: {
              colorPrimary: '#1677ff',
              optionSelectedBg: '#333333',
              colorText: '#fff',
              colorBgElevated: '#444444',
              colorTextPlaceholder: '#aaa',
              controlItemBgHover: '#444444',
              selectorBg: '#444444',
            },
          },
          token: {
            colorTextBase: '#fff',
          },
        }}
      >
        <Select
          className={styles.inputStyle}
          styles={{
            popup: {
              root: { backgroundColor: '#444444', color: '#fff' },
            },
          }}
          style={{ color: '#fff', backgroundColor: '#1a1a1a' }}
          onChange={handleSelectChange}
          value={value}
          allowClear
          {...rest}
        >
          {prices.map((item) => (
            <Option
              key={item.value}
              value={item.value}
              style={{ color: '#fff' }}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </ConfigProvider>

      <Input
        className={styles.inputStyle}
        value={inputPrice}
        prefix="S/"
        onChange={handleInputChange}
        style={{
          height: '35px',
          lineHeight: '40px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginBottom: '-50px',
          display: rest.hidePriceInput ? 'none' : 'flex',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default SelectPrices;
