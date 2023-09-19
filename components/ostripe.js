import React from 'react';

export default function OrderStatistics(props) {
  const { orderData } = props;

  const currentDate = new Date();

  // Filter orders for today's date
  const dailyOrders = orderData.filter(
    order => new Date(order.createdAt).toDateString() === currentDate.toDateString()
  );

  // Calculate total daily order count
  const dailyOrderCount = dailyOrders.length;

  // Calculate the number of paid orders for today
  const paidDailyOrders = dailyOrders.filter(order => order.paid === true);
  const paidDailyOrderCount = paidDailyOrders.length;

  // Calculate the total number of paid orders for today
  const totalPaidOrderCount = orderData.filter(order => order.paid === true).length;

  // Calculate total weekly order count
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

  // Filter orders for the current week
  const weeklyOrders = orderData.filter(
    order => new Date(order.createdAt) >= currentWeekStart
  );

  // Calculate total weekly order count
  const weeklyOrderCount = weeklyOrders.length;

  return (
    <div>
      <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
        <div className="shadow-lg bg-red-vibrant border-l-8 rounded-md hover:bg-red-vibrant-dark border-red-vibrant-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              {dailyOrderCount}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Total Orders Today
            </a>
          </div>
        </div>

        <div className="shadow bg-info border-l-8 rounded-md hover:bg-info-dark border-info-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              {paidDailyOrderCount}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Total Paid Order Today
            </a>
          </div>
        </div>

        <div className="shadow bg-warning border-l-8 rounded-md hover:bg-warning-dark border-warning-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              {totalPaidOrderCount}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Total of Paid Orders Today
            </a>
          </div>
        </div>

        <div className="shadow bg-success border-l-8 rounded-md hover:bg-success-dark border-success-dark mb-2 p-2 md:w-1/4 mx-2">
          <div className="p-4 flex flex-col">
            <a href="#" className="no-underline text-white text-2xl">
              {weeklyOrderCount}
            </a>
            <a href="#" className="no-underline text-white text-lg">
              Number of Orders in Week
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
