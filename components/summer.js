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
export default function Summer ({ data }) {
  const chartData = {
    labels: data.map(item => new Date(item.createdAt)), // Convert createdAt to Date objects
    datasets: [
      {
        label: 'Price',
        data: data.map(item => item.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      xAxis: { // Change from x to xAxis
        type: 'time', // Use time scale for x-axis
        time: {
          unit: 'day', // Adjust this based on your data
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      yAxis: { // Change from y to yAxis
        title: {
          display: true,
          text: 'Price (UGX)',
        },
      },
    },
  };


 

  
 

  return (
    <div className="w-3/6 m-2 p-2">
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg">
        <div className="font-bold text-xl text-center">Weekly Sales</div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};



