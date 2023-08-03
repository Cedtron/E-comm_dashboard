import React, { useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function Summer() {
  const data = {
    labels: ['Jan', 'Feb', 'March', 'April'],
    datasets: [
      {
        label: 'Sales',
        data: [100, 200, 150, 300],
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

 

  return (
    <div>
      <div className="flex flex-row">
        {/* Sold Items Table */}
        <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Sold items</div>
            </div>
            <div className="table-responsive">
              <table className="table text-grey-darkest">
                <thead className="bg-grey-dark text-white text-normal">
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      <button className="bg-blue-500 hover:bg-blue-800 text-white font-light py-1 px-2 rounded-full">
                        Twitter
                      </button>
                    </td>
                    <td>4500</td>
                    <td>
                      <span className="text-green-500">
                        <i className="fas fa-arrow-up"></i>5%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Line Graph */}
        <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg">
            <div className="font-bold text-xl text-center">Week sales</div>
            <Line data={data} options={options} />
            <div className="font-bold text-xl text-center">Daily sales</div>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
