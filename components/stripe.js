import React from 'react';

export default function Stripe(props) {
  const { salesData } = props;

  if (!Array.isArray(salesData) && typeof salesData !== 'object') {
    // Handle the case where salesData is neither an array nor an object
    return (
      <div>
        <p>Error: salesData is not an array or a valid JSON object.</p>
      </div>
    );
  }
  

  const currentDate = new Date();

  // If salesData is an array, filter and calculate as before
  if (Array.isArray(salesData)) {
    // Filter sales for today's date
    const dailySales = salesData.filter(sale => {
      if (sale.createdAt) {
        const saleDate = new Date(sale.createdAt);
        return saleDate.toDateString() === currentDate.toDateString();
      }
      return false; // Handle null or missing createdAt property
    });

    // Calculate total daily sales price and number of daily sales
    const dailySalesTotal = dailySales.reduce((total, sale) => total + (sale.price || 0), 0);
    const dailySalesCount = dailySales.length;

    // Calculate total weekly sales price and number of weekly sales
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

    // Filter sales for the current week
    const weeklySales = salesData.filter(sale => {
      if (sale.createdAt) {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= currentWeekStart;
      }
      return false; // Handle null or missing createdAt property
    });

    // Calculate total weekly sales price and number of weekly sales
    const weeklySalesTotal = weeklySales.reduce((total, sale) => total + (sale.price || 0), 0);
    const weeklySalesCount = weeklySales.length;

    return (
      <div>
        <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
          <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
                Ugx{dailySalesTotal.toFixed(2)}
              </a>
              <a href="#" className="no-underline text-white text-lg">
                Total Sales Today
              </a>
            </div>
          </div>

          <div className="shadow bg-info border-l-8 rounded-md hover-bg-info-dark border-info-dark mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
              Ugx{weeklySalesTotal.toFixed(2)}
              </a>
              <a href="#" className="no-underline text-white text-lg">
                Total Week Sales
              </a>
            </div>
          </div>

          <div className="shadow bg-warning border-l-8 rounded-md hover-bg-warning-dark border-warning-dark mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
                {dailySalesCount}
              </a>
              <a href="#" className="no-underline text-white text-lg">
                Number of Sales Today
              </a>
            </div>
          </div>

          <div className="shadow bg-success border-l-8 rounded-md hover-bg-success-dark border-success-dark mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
                {weeklySalesCount}
              </a>
              <a href="#" className="no-underline text-white text-lg">
                Number of Sales in Week
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}