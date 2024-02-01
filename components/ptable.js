import React, { useState } from 'react';
import { CSVDownload } from 'react-csv';
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
      format: (row) => new Date(row.esawa).toLocaleDateString(),
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
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
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
      </label>

           <button onClick={handleExport}>Export CSV</button>
       <CSVDownload
        data={tableData}
        target="_blank"
        filename="sales_report.csv" 
        headers={Object.keys(tableData[0])} 
      />

   

<Table columns={columns}  data={tableData}  title="Sales Report" showSearch={true} itemsPerPage={5} />
  

    </div>
  );
};

export default SalesTable;