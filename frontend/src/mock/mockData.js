// mockData.js
export const mockData = {
  large: {
    chartSeries: [
      {
        name: 'Sesiones',
        data: [20, 25, 22, 24, 28],
      },
    ],
    categories: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY'],
    pieSeries: [10, 15, 5],
    pieOptions: {
      labels: ['Efectivo', 'Yape', 'Cupon'],
    },
    chartOptions: {
      xaxis: {
        categories: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY'],
      },
    },
    therapistPerformance: [
      {
        id: 1,
        name: 'Teresa Lopez',
        data: [15],
      },
      {
        id: 2,
        name: 'Carlos Mendoza',
        data: [12],
      },
      {
        id: 3,
        name: 'Ana Ramirez',
        data: [18],
      },
    ],
    paymentTypes: {
      efectivo: 10,
      yape: 15,
      cupon: 5,
    },
    monthlySessions: [
      {
        name: 'Ingresos',
        data: [1200, 1500, 1300, 1400, 1600],
      },
    ],
    patientTypes: {
      cc: 12,
      c: 2,
    },
  },
};
