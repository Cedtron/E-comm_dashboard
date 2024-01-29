import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend
);

export default function Osummer({ data }) {
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const filteredOrders = data.filter(
    order => new Date(order.createdAt) >= currentWeekStart
  );

  const chartData = {
    labels: filteredOrders.map(order => new Date(order.createdAt)),
    datasets: [
      {
        label: 'Number of orders',
        data: filteredOrders.map(order => order.line_items.length),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM D',
          displayFormats: {
            day: 'MMM D',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Orders',
        },
      },
    },
  };

  return (
    <div className="w-3/6 m-2 p-2">
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg">
        <div className="font-bold text-xl text-center">Weekly Orders</div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
