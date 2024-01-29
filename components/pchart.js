import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const PChart = ({ salesData, selectedMonth }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Profits',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
    ],
  });

  useEffect(() => {
    const dailyProfits = calculateDailyProfits(salesData, selectedMonth);
    const labels = Array.from({ length: dailyProfits.length }, (_, index) => (index + 1).toString());

    setChartData({
      ...chartData,
      labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: dailyProfits,
        },
      ],
    });
  }, [salesData, selectedMonth]);

  const calculateDailyProfits = (sales, selectedMonth) => {
    const dailyProfits = Array.from({ length: 31 }, () => 0);

    const filteredSales = sales.filter(
      (item) => new Date(item.esawa).getMonth() === parseInt(selectedMonth, 10)
    );

    filteredSales.forEach((item) => {
      const day = new Date(item.esawa).getDate();
      dailyProfits[day - 1] += calculateProfit([item]);
    });

    return dailyProfits;
  };

  const calculateProfit = (data) => {
    return calculateTotalPrice(data) - calculateTotalCostPrice(data);
  };

  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalCostPrice = (data) => {
    return data.reduce((total, item) => total + item.line_items[0].price_data.product_data.costprice, 0);
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default PChart;