import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function CGPAChart({ semesters }) {
  const labels = semesters.map(s => `Sem ${s.semester}`);
  const sgpaData = semesters.map(s => s.sgpa);

  const data = {
    labels,
    datasets: [
      {
        label: 'SGPA',
        data: sgpaData,
        backgroundColor: sgpaData.map(v =>
          v >= 8.5 ? '#10b981' : v >= 6.5 ? '#e05d2c' : v >= 5.0 ? '#f59e0b' : '#ef4444'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (ctx) => {
            const v = ctx.parsed.y;
            if (v >= 8.5) return 'First Class with Distinction';
            if (v >= 6.5) return 'First Class';
            if (v >= 5.5) return 'Second Class';
            if (v >= 5.0) return 'Pass';
            return 'Below Pass';
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { color: '#9ca3af', stepSize: 2 },
        grid: { color: '#2e3245' },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} height={80} />;
}
