import { useState, useEffect } from 'react';
import { fetchStatisticData } from '../services/statisticService';
import dayjs from 'dayjs';

export const useStatistic = (startDate, endDate) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [pieOptions, setPieOptions] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [therapistPerformance, setTherapistPerformance] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [monthlySessions, setMonthlySessions] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);
  const [metricsSeries, setMetricsSeries] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStatisticData(startDate, endDate);

      // Calcular totales para las métricas
      const sessionsTotal = Object.values(data.data.sesiones).reduce(
        (acc, val) => acc + Number(val),
        0,
      );
      const earningsTotal = Number(data.data.metricas.ttlganancias);
      const patientsTotal = Number(data.data.metricas.ttlpacientes);

      setTotalSessions(sessionsTotal);
      setTotalPatients(patientsTotal);
      setTotalEarnings(earningsTotal);

      // Procesar datos de terapeutas (ordenados por sesiones)
      const sortedTherapists = [...data.data.terapeutas]
        .sort((a, b) => b.sesiones - a.sesiones)
        .map((therapist) => ({
          id: therapist.id,
          name: therapist.terapeuta.split(',')[0].trim(), // Mostrar solo el apellido
          fullName: therapist.terapeuta, // Guardar nombre completo para tooltip
          sessions: therapist.sesiones,
          income: therapist.ingresos,
          rating: therapist.raiting,
        }));

      setTherapistPerformance(sortedTherapists);

      // Procesar tipos de pago (convertir a porcentajes)
      const totalPayments = Object.values(data.data.tipos_pago).reduce(
        (acc, val) => acc + Number(val),
        0,
      );
      const paymentPercentages = Object.entries(data.data.tipos_pago).map(
        ([key, value]) => ({
          name: key,
          value: Number(value),
          percentage:
            totalPayments > 0
              ? ((Number(value) / totalPayments) * 100).toFixed(1)
              : 0,
        }),
      );

      setPaymentTypes(paymentPercentages);

      // Determinar formato de categorías según el rango de fechas
      const daysDiff = endDate.diff(startDate, 'day');
      let dateCategories = [];
      let dateFormat = '';

      if (daysDiff <= 1) {
        // 24 horas - mostrar horas
        dateFormat = 'HH:mm';
        for (let i = 0; i < 24; i++) {
          dateCategories.push(
            dayjs(startDate).add(i, 'hour').format(dateFormat),
          );
        }
      } else if (daysDiff <= 7) {
        // 7 días - mostrar días de la semana
        dateFormat = 'ddd';
        dateCategories = Object.keys(data.data.sesiones);
      } else if (daysDiff <= 30) {
        // 28 días - mostrar semanas
        dateFormat = 'DD MMM';
        const weeks = Math.ceil(daysDiff / 7);
        for (let i = 0; i < weeks; i++) {
          dateCategories.push(
            dayjs(startDate).add(i * 7, 'day').format('DD MMM'),
          );
        }
      } else if (daysDiff <= 365) {
        // Hasta 1 año - mostrar meses
        dateFormat = 'MMM YYYY';
        const months = endDate.diff(startDate, 'month') + 1;
        for (let i = 0; i < months; i++) {
          dateCategories.push(
            dayjs(startDate).add(i, 'month').format(dateFormat),
          );
        }
      } else {
        // Más de 1 año - mostrar años
        dateFormat = 'YYYY';
        const years = endDate.diff(startDate, 'year') + 1;
        for (let i = 0; i < years; i++) {
          dateCategories.push(
            dayjs(startDate).add(i, 'year').format(dateFormat),
          );
        }
      }

      setCategories(dateCategories);

      // Configurar series de gráfico de sesiones
      setChartSeries([
        {
          name: 'Sesiones',
          data: Object.values(data.data.sesiones).map(Number),
        },
      ]);

      // Configurar series de ingresos mensuales
      setMonthlySessions([
        {
          name: 'Ingresos',
          data: Object.values(data.data.ingresos).map((val) => Number(val)),
        },
      ]);

      // Configurar gráfico de pastel (tipos de pacientes)
      setPieSeries([
        Number(data.data.tipos_pacientes.c),
        Number(data.data.tipos_pacientes.cc),
      ]);

      setPieOptions({
        labels: ['Nuevos', 'Continuadores'],
        colors: ['#1DB954', '#10B981'],
      });

      // Configurar métricas
      setMetricsSeries([
        {
          name: 'Ingresos',
          data: [earningsTotal],
        },
        {
          name: 'Sesiones',
          data: [sessionsTotal],
        },
        {
          name: 'Pacientes',
          data: [patientsTotal],
        },
      ]);

      // Configurar opciones del gráfico principal
      setChartOptions({
        chart: {
          type: 'area',
          height: '100%',
          toolbar: { show: false },
          zoom: { enabled: false },
          background: 'transparent',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        stroke: {
          curve: 'smooth',
          width: 3,
          colors: ['#1DB954'],
        },
        markers: {
          size: 5,
          colors: ['#1DB954'],
          strokeWidth: 2,
          strokeColors: '#1DB954',
          hover: {
            size: 8,
            sizeOffset: 3,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 0.8,
            opacityTo: 0.1,
            colorStops: [
              {
                offset: 0,
                color: '#1DB954',
                opacity: 0.8,
              },
              {
                offset: 50,
                color: '#1DB954',
                opacity: 0.4,
              },
              {
                offset: 100,
                color: '#1DB954',
                opacity: 0.1,
              },
            ],
          },
        },
        xaxis: {
          categories: dateCategories,
          labels: {
            style: {
              colors: '#9CA3AF',
              fontSize: '11px',
              fontWeight: 500,
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#9CA3AF',
              fontSize: '11px',
            },
            formatter: (val) => Math.floor(val),
          },
        },
        colors: ['#1DB954'],
        grid: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
          strokeDashArray: 2,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        tooltip: {
          theme: 'dark',
          style: {
            fontSize: '12px',
          },
          x: {
            show: true,
            formatter: (val) => {
              if (daysDiff <= 1) return `Hora: ${val}`;
              if (daysDiff <= 7) return `Día: ${val}`;
              if (daysDiff <= 30) return `Semana: ${val}`;
              if (daysDiff <= 365) return `Mes: ${val}`;
              return `Año: ${val}`;
            },
          },
          y: {
            formatter: (val) => `${val} sesiones`,
          },
          marker: {
            show: true,
          },
        },
        dataLabels: { enabled: false },
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  return {
    chartSeries,
    categories,
    pieSeries,
    pieOptions,
    chartOptions,
    therapistPerformance,
    paymentTypes,
    monthlySessions,
    patientTypes,
    metricsSeries,
    totalSessions,
    totalPatients,
    totalEarnings,
    loading,
    formatCurrency,
  };
};