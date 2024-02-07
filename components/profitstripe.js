import React from 'react';

export default function Profitstab(props) {
  const { salesData } = props;
console.log(salesData)
  // Calculate weekly profit and loss
  const weeklyProfit = salesData.reduce((total, sale) => {
    if (sale.weekly) {
      return total + sale.profit;
    }
    return total;
  }, 0);

  const weeklyLoss = salesData.reduce((total, sale) => {
    if (sale.weekly) {
      return total + sale.loss;
    }
    return total;
  }, 0);

  // Calculate monthly profit and loss
  const monthlyProfit = salesData.reduce((total, sale) => {
    if (sale.monthly) {
      return total + sale.profit;
    }
    return total;
  }, 0);

  const monthlyLoss = salesData.reduce((total, sale) => {
    if (sale.monthly) {
      return total + sale.loss;
    }
    return total;
  }, 0);

  // Calculate profit percentages
  const weeklyProfitPercentage = ((weeklyProfit / (weeklyProfit + weeklyLoss)) * 100).toFixed(2);
  const weeklyLossPercentage = ((weeklyLoss / (weeklyProfit + weeklyLoss)) * 100).toFixed(2);

  const monthlyProfitPercentage = ((monthlyProfit / (monthlyProfit + monthlyLoss)) * 100).toFixed(2);
  const monthlyLossPercentage = ((monthlyLoss / (monthlyProfit + monthlyLoss)) * 100).toFixed(2);

  return (
    <div>
      <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              UGx {weeklyProfit.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Weekly Profits ({weeklyProfitPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              UGx {weeklyLoss.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Weekly Loss ({weeklyLossPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              UGx {monthlyProfit.toFixed(2)}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Monthly Profits ({monthlyProfitPercentage}%)
            </a>
          </div>
        </div>

        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              UGx {monthlyLoss.toFixed(2)}
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