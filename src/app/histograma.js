import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';

// Registra la escala "linear" si aún no está registrada
Chart.register(Chart.LinearScale);

const Histograma = ({ operaciones }) => {
  // Intervalos y etiquetas
  const intervals = [
    { min: 0, max: 10000 },
    { min: 10000, max: 50000 },
    { min: 50000, max: 100000 },
    { min: 100000, max: 500000 },
    { min: 500000, max: 1000000 },
    { min: 1000000, max: 10000000 },
    { min: 10000000, max: Infinity },
  ];
  const labels = [
    'Menor a $10,000',
    'Entre $10,000 y $49,999',
    'Entre $50,000 y $99,999',
    'Entre $100,000 y $499,999',
    'Entre $500,000 y $999,999',
    'Entre $1,000,000 y $9,999,999',
    'Más de $9,999,999',
  ];

  // Calcular el conteo de operaciones en cada intervalo
  const histogram = Array(intervals.length).fill(0);
  for (const operacion of operaciones) {
    const amount = parseInt(operacion.amount);
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      if (amount >= interval.min && amount < interval.max) {
        histogram[i]++;
        break;
      }
    }
  }

  // Datos del gráfico
  const data = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Transacciones',
        data: histogram,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Histograma;