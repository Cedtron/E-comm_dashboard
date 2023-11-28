import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

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
    return data.reduce((total, item) => total + item.line_items.price_data.product_data.costprice, 0);
  };

  const calculateProfit = (data) => {
    return calculateTotalPrice(data) - calculateTotalCostPrice(data);
  };

  const calculateLoss = (data) => {
    return calculateTotalCostPrice(data) - calculateTotalPrice(data);
  };

  const calculatePercentage = (profitOrLoss, totalRevenue) => {
    return totalRevenue !== 0 ? ((profitOrLoss / totalRevenue) * 100).toFixed(2) : 0;
  };

  const generateTableData = (sales) => {
    return sales.map((item) => ({
      ...item,
      Profit: calculateProfit([item]),
      Loss: calculateLoss([item]),
      Percentage: calculatePercentage(calculateProfit([item]), calculateTotalPrice([item])),
    }));
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
        <span style={{ color: 'green' }}>{`$${parseFloat(row.Profit).toFixed(2)}`}</span>
      ),
    },
    {
      name: 'Loss',
      selector: 'Loss',
      sortable: true,
      cell: (row) => <span style={{ color: 'red' }}>{`$${parseFloat(row.Loss).toFixed(2)}`}</span>,
    },
    {
      name: 'Percentage',
      selector: 'Percentage',
      sortable: true,
    },
  ];

  return (
    <div>
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="all">All Months</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          {/* Add more months as needed */}
        </select>
      </label>

      <DataTable
        title="Sales Report"
        columns={columns}
        data={tableData}
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={6}
        fixedHeader
        sortServer 
        subHeader
        subHeaderAlign="right"
        subHeaderComponents={[
            <button
              key="export-csv-button"
              className="btn btn-primary"
              onClick={() => {
                dataTable.exportToCSV('SalesReport.csv');
              }}
            >
              Export CSV
            </button>,
          ]}
      />
    </div>
  );
};

export default SalesTable;