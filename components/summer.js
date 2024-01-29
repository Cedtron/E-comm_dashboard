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
  console.log(data)
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.createdAt);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }),
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
   
      yAxis: {
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



