import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Profitstab from "@/components/profitstripe";

export default function Home() {

 const [sales, setSales] = useState([]);
 const { data: session } = useSession();
const  user=session?.user?.name
const  role=session?.user?.roles

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


useEffect(() => {
  setIsLoading(true);
  setError(null);

  let apiUrl = '/api/sales';


  axios.get(apiUrl)
    .then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setSales(response.data);
        console.log(response.data);
      } else {
        console.error("Invalid data format in the API response.");
      }
    })
    .catch((error) => {
      console.error("Error fetching sales data:", error);
      setError(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [role, user]);


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
    <Layout>
      <Profitstab salesData={sales}/>
      <div className="flex flex-row">
        <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Sold items</div>
            </div>
            
            <div className="table-responsive">
            <div>
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="all">All Months</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
        
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
        sortServer // Enable server-side sorting
      />
    </div>
            </div>
          </div>
        </div>
        <Summer data={sales} />
      </div>
    </Layout>
  );
}
