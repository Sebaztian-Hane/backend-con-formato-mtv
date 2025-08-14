import React from 'react';

const DashboardMetrics = ({
  totalSessions,
  totalPatients,
  totalEarnings,
  formatCurrency,
  Style,
}) => (
  <div className={Style.compactMetricsSection}>
    <div className={Style.smallMetricCard}>
      <h3 className={Style.metricTitle}>SESIONES TOTALES</h3>
      <div className={Style.metricValue}>{totalSessions.toLocaleString()}</div>
    </div>
    <div className={Style.smallMetricCard}>
      <h3 className={Style.metricTitle}>PACIENTES TOTALES</h3>
      <div className={Style.metricValue}>{totalPatients.toLocaleString()}</div>
    </div>
    <div className={Style.earningsCard}>
      <h3 className={Style.metricTitle}>GANANCIA TOTAL</h3>
      <div className={Style.earningsValue}>{formatCurrency(totalEarnings)}</div>
      <p className={Style.earningsSubtitle}>
        Acumulado en el período seleccionado
      </p>
    </div>
  </div>
);

export default DashboardMetrics;
