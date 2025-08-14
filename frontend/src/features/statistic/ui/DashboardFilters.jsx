import React from 'react';
import { Radio, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const DashboardFilters = ({
  timeFilter,
  handleTimeFilterChange,
  showDatePicker,
  setShowDatePicker,
  dateRange,
  handleDateRangeChange,
  Style,
  dayjs,
}) => (
  <div className={Style.filterBar}>
    <Radio.Group
      value={timeFilter}
      onChange={handleTimeFilterChange}
      buttonStyle="solid"
      className={Style.timeFilters}
    >
      <Radio.Button value="24horas">24 HORAS</Radio.Button>
      <Radio.Button value="7días">7 DÍAS</Radio.Button>
      <Radio.Button value="28días">28 DÍAS</Radio.Button>
      <Radio.Button value="3meses">3 MESES</Radio.Button>
      <Radio.Button value="1año">1 AÑO</Radio.Button>
    </Radio.Group>
    <Button
      type={showDatePicker ? 'primary' : 'default'}
      onClick={() => setShowDatePicker(!showDatePicker)}
      className={Style.customDateButton}
    >
      Personalizado
    </Button>
    {showDatePicker && (
      <RangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
        className={Style.datePicker}
        disabledDate={(current) => current && current > dayjs().endOf('day')}
        placeholder={['Fecha inicio', 'Fecha fin']}
        format="DD/MM/YYYY"
        allowClear={false}
        size="large"
      />
    )}
  </div>
);

export default DashboardFilters;
