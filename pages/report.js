import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@/components/table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {  CSVLink } from "react-csv";

export default function Report() {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const user = session?.user?.name;
  const role = session?.user?.roles;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSalesPrice, setTotalSalesPrice] = useState(0);
  const [totalMonthSalesPrice, setTotalMonthSalesPrice] = useState(0);
  const [totalWeekSalesPrice, setTotalWeekSalesPrice] = useState(0);
  const [isCSVReady, setCSVReady] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let apiUrl = '/api/sales';
    if (role !== "admin") {
      apiUrl = `/api/sales?saler=${user}`;
    }

    axios.get(apiUrl)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setSales(response.data);

          // Calculate total price of all sales
          const totalSales = response.data.reduce((total, sale) => total + sale.price, 0);
          setTotalSalesPrice(totalSales);

          // Calculate total price of sales this month
          const currentDate = new Date();
          const currentMonthSales = response.data.filter(
            sale =>
              new Date(sale.createdAt).getMonth() === currentDate.getMonth() &&
              new Date(sale.createdAt).getFullYear() === currentDate.getFullYear()
          );
          const totalMonthSales = currentMonthSales.reduce(
            (total, sale) => total + sale.price,
            0
          );
          setTotalMonthSalesPrice(totalMonthSales);

          // Calculate total price of sales this week
          const currentWeekStart = new Date();
          currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
          const currentWeekEnd = new Date();
          currentWeekEnd.setDate(currentWeekEnd.getDate() + (6 - currentWeekEnd.getDay()));
          const currentWeekSales = response.data.filter(
            sale =>
              new Date(sale.createdAt) >= currentWeekStart &&
              new Date(sale.createdAt) <= currentWeekEnd
          );
          const totalWeekSales = currentWeekSales.reduce(
            (total, sale) => total + sale.price,
            0
          );
          setTotalWeekSalesPrice(totalWeekSales);
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

  const columns = [
    {
      name: 'Items sold',
      selector: 'line_items',
      sortable: false,
      cell: (row) => (
        <div>
          {row.line_items.map((l, index) => (
            <div key={index}>
              {l.price_data?.product_data.name} x{l.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      name: 'Name of the saler',
      selector: 'saler',
      sortable: true,
    },
    {
      name: 'Total price',
      selector: 'price',
      sortable: true,
      format: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      name: 'Date',
      selector: 'createdAt',
      sortable: true,
      format: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: 'View',
      cell: (row) => (
        <div className="my-2">
        <Link href={`/sales/${row._id}`} className=" shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
          View
        </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredSales = sales.filter((sale) =>
    sale.saler.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    setCSVReady(true);
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">

            <CSVLink
            data={filteredSales}
            filename="sales_report.csv"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-400 focus:outline-none focus:ring focus:border-green-300"
          >
            Export CSV
          </CSVLink>
        

<Table columns={columns} data={filteredSales} title="Sales Report" showSearch={true} itemsPerPage={10} />
  

          <div className="flex justify-between font-semibold  bg-blue-500 text-gray-200 py-4 px-2">
            <div>Total price of all sales: Ugx {totalSalesPrice.toFixed(0)}</div>
            <div>Total price of sales this week: Ugx {totalWeekSalesPrice.toFixed(0)}</div>
            <div>Total price of sales this month: Ugx {totalMonthSalesPrice.toFixed(0)}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}