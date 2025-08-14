import React from 'react';

const DashboardBottomSection = ({
  Style,
  paymentDistributionOptions,
  paymentDistributionSeries,
  Chart,
  therapistPerformance,
  formatCurrency,
  getRatingColor,
  scrollbarStyles,
  pieSeries,
  pieOptions,
  filteredTherapists,
}) => (
  <div className={Style.bottomSection}>
    {/* Distribución de pagos */}
    <div className={Style.paymentSection}>
      <h3 className={Style.sectionTitle}>Distribución de Pagos</h3>
      <p className={Style.sectionSubtitle}>
        Por métodos de pago (en porcentaje)
      </p>
      <div className={Style.paymentChartContainer}>
        <Chart
          options={paymentDistributionOptions}
          series={paymentDistributionSeries}
          type="bar"
          height={280}
        />
      </div>
    </div>
    {/* Rendimiento de terapeutas */}
    <div className={Style.therapistsSection}>
      <h3 className={Style.sectionTitle}>Rendimiento de Terapeutas</h3>
      <p className={Style.sectionSubtitle}>
        {therapistPerformance.length} terapeutas en el período
      </p>
      <div
        className={Style.therapistsTableContainer}
        style={{ maxHeight: '400px', overflowY: 'auto', ...scrollbarStyles }}
      >
        <div className={Style.tableHeader}>
          <span style={{ flex: '2', minWidth: 0 }}>Terapeuta</span>
          <span style={{ flex: '0 0 80px', textAlign: 'center' }}>
            Sesiones
          </span>
          <span style={{ flex: '0 0 90px', textAlign: 'center' }}>
            Ingresos
          </span>
          <span style={{ flex: '0 0 70px', textAlign: 'center' }}>Rating</span>
        </div>
        {therapistPerformance.map((therapist, index) => (
          <div
            key={therapist.id}
            className={`${Style.tableRow} ${index % 2 === 0 ? Style.evenRow : Style.oddRow}`}
          >
            <span
              style={{
                flex: '2',
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={therapist.fullName}
            >
              {therapist.name}
            </span>
            <span style={{ flex: '0 0 80px', textAlign: 'center' }}>
              {therapist.sessions.toLocaleString()}
            </span>
            <span style={{ flex: '0 0 90px', textAlign: 'center' }}>
              {formatCurrency(therapist.income)}
            </span>
            <span
              className={Style.rating}
              style={{
                flex: '0 0 70px',
                textAlign: 'center',
                color: getRatingColor(therapist.rating),
              }}
            >
              {therapist.rating.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardBottomSection;
