import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import Table from "@/components/table";

const SalesTable = ({ salesData }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterSalesByMonth = (sales, selectedMonth) => {
    if (selectedMonth === 'all') {
      return sales;
    }

    const selectedMonthData = sales.filter(
      (item) => new Date(item.esawa).getMonth() === parseInt(selectedMonth, 10)
    );

    return selectedMonthData;
  };

  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => total + item.price, 0);
  };

  const calculateTotalCostPrice = (data) => {
    return data.reduce((total, item) => total + item.line_items[0].price_data.product_data.costprice, 0);
  };

  const calculateProfit = (data) => {
    return calculateTotalPrice(data) - calculateTotalCostPrice(data);
  };

  const calculateLoss = (data) => {
    return calculateTotalCostPrice(data) - calculateTotalPrice(data);
  };

  const calculatePercentage = (profitOrLoss, totalRevenue) => {
    return totalRevenue !== 0 ? ((profitOrLoss / totalRevenue) * 100).toFixed(2) + '%' : '0%';
  };


  const generateTableData = (sales) => {
    return sales.map((item) => {
      const quantity = item.line_items[0].quantity;
      const unitAmount = item.line_items[0].price_data.unit_amount;
      const costPrice = item.line_items[0].price_data.product_data.costprice;
  
      const calculatedPrice = quantity * unitAmount;
      const calculatedProfit = calculatedPrice - costPrice;
  
      // Check if calculated profit is greater or less than the original profit
      const profitColor = calculatedProfit > calculateProfit([item]) ? 'green' : 'red';
  
      return {
        ...item,
        Profit: {
          value: calculateProfit([item]),
          color: profitColor,
        },
        Loss: calculateLoss([item]),
        Percentage: calculatePercentage(calculateProfit([item]), calculateTotalPrice([item])),
      };
    });
  };

  const filteredSales = filterSalesByMonth(salesData, selectedMonth);
  const tableData = generateTableData(filteredSales);



  const columns = [
    {
      name: 'Name of the saler',
      selector: 'saler',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Date',
      selector: 'esawa',
      sortable: true,
      cell: (row) => {
      
        const date = new Date(row.esawa);
        return date.toLocaleString();
      },
    },
    {
      name: 'Profit',
      selector: 'Profit',
      sortable: true,
      cell: (row) => (
        <span style={{ color: row.Profit.color }}>{`$${parseFloat(row.Profit.value).toFixed(2)}`}</span>
      ),
    },
    {
      name: 'Percentage',
      selector: 'Percentage',
      sortable: true,
    },
  ];
 

  const handleExport = () => {
    setCSVReady(true);
  };

  return (
    <div>

      <div className='flex gap-4  place-content-center'>
      <div className="basis-1/4 m-2">
      <label className="text-center">
        Select Month:</label>
        <select value={selectedMonth} onChange={handleMonthChange} 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="all">All Months</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      
</div>
      <CSVLink
            data={tableData}
            filename="sales_report.csv"
            className="bg-green-500 text-white p-1 m-1 rounded-md hover:bg-green-400 focus:outline-none focus:ring focus:border-blue-300"
          >
            Export CSV
          </CSVLink>
       
          </div>
   

<Table columns={columns}  data={tableData}  title="Profits Report" showSearch={true} itemsPerPage={5} />
  

    </div>
  );
};

export default SalesTable;