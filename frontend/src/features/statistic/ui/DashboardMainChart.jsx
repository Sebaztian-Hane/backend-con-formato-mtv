import React from 'react';

const DashboardMainChart = ({
  chartOptions,
  chartSeries,
  Style,
  getDateRangeSubtitle,
  Chart,
}) => (
  <div className={Style.mainChartSection}>
    <div className={Style.chartHeader}>
      <h3 className={Style.chartTitle}>Indicación de Sesiones</h3>
      <span className={Style.chartSubtitle}>{getDateRangeSubtitle()}</span>
    </div>
    <div className={Style.chartContainer}>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height="100%"
      />
    </div>
  </div>
);

export default DashboardMainChart;
