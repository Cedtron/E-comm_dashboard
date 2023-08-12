import React, { useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function Summer(props) {
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
                  <th className="col">Items sold</th>
            <th className="col">Name of the saler</th>
            <th className="col">Total price</th>
            <th className="col">Date</th>
                  </tr>
                </thead>
                <tbody>
        {sales.length > 0 && sales.map(sale => (
          <tr key={sale._id}  className="border-b text-black transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
          >
           
            <td>
              {sale.line_items.map(l => (
                <>
                  {l.price_data?.product_data.name} x
                  {l.quantity}<br />
                </>
              ))}
            </td> 
           <td>{sale.saler}</td>
           <td>{sale.price}</td>
           <td>{(new Date(sale.createdAt)).toLocaleString()}
            </td>
          </tr>
        ))}
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
