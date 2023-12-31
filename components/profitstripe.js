import React from 'react';

export default function Profitstab(props) {
  const { salesData } = props;

  if (!Array.isArray(salesData) && typeof salesData !== 'object') {
    // Handle the case where salesData is neither an array nor an object
    return (
      <div>
        <p>Error: salesData is not an array or a valid JSON object.</p>
      </div>
    );
  }

  // Calculate weekly and monthly profits and losses
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyData = salesData.filter(item => new Date(item.esawa) > oneWeekAgo);
  const monthlyData = salesData.filter(item => new Date(item.esawa) > oneMonthAgo);

  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalCostPrice = (data) => {
    return data.reduce((total, item) => total + item.line_items.price_data.product_data.costprice, 0);
  };

  const weeklyProfit = calculateTotalPrice(weeklyData) - calculateTotalCostPrice(weeklyData);
  const monthlyProfit = calculateTotalPrice(monthlyData) - calculateTotalCostPrice(monthlyData);

  const weeklyLoss = calculateTotalCostPrice(weeklyData) - calculateTotalPrice(weeklyData);
  const monthlyLoss = calculateTotalCostPrice(monthlyData) - calculateTotalPrice(monthlyData);

  const calculatePercentage = (profitOrLoss, totalRevenue) => {
    return totalRevenue !== 0 ? ((profitOrLoss / totalRevenue) * 100).toFixed(2) : 0;
  };

  const weeklyProfitPercentage = calculatePercentage(weeklyProfit, calculateTotalPrice(weeklyData));
  const monthlyProfitPercentage = calculatePercentage(monthlyProfit, calculateTotalPrice(monthlyData));
  const weeklyLossPercentage = calculatePercentage(weeklyLoss, calculateTotalCostPrice(weeklyData));
  const monthlyLossPercentage = calculatePercentage(monthlyLoss, calculateTotalCostPrice(monthlyData));

  return (
    <div>
      <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              ${weeklyProfit.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Weekly Profits ({weeklyProfitPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow bg-info border-l-8 rounded-md hover-bg-info-dark border-info-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              ${weeklyLoss.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Weekly Loss ({weeklyLossPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow bg-warning border-l-8 rounded-md hover-bg-warning-dark border-warning-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              ${monthlyProfit.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Monthly Profits ({monthlyProfitPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow bg-success border-l-8 rounded-md hover-bg-success-dark border-success-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              ${monthlyLoss.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Monthly Loss ({monthlyLossPercentage}%)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}