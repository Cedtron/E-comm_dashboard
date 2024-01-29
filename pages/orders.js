import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Table from "@/components/table";
import Link from 'next/link';
import { CSVLink } from 'react-easy-export';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    axios.get('/api/orders').then((response) => {
      setOrders(response.data);
      setTableData(response.data.map((order) => ({ ...order, createdAt: { $date: order.createdAt } })));
    });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Filter orders based on the search query
    const filteredOrders = orders.filter(
      (order) =>
        order.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        order.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        order.city.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTableData(filteredOrders.map((order) => ({ ...order, createdAt: { $date: order.createdAt } })));
  };


  const columns = [
    {
      name: 'Date',
      selector: 'createdAt.$date',
      sortable: true,
      format: (row) => new Date(row.createdAt.$date).toLocaleString(),
    },
    {
      name: 'Paid',
      selector: 'paid',
      sortable: true,
      cell: (row) => (row.paid ? 'YES' : 'NO'),
    },
    {
      name: 'Recipient',
      selector: 'name',
      cell: (row) => (
        <div>
          {`${row.name} ${row.email}`}
          <br />
          {`${row.city} ${row.postalCode} ${row.country}`}
          <br />
          {row.streetAddress}
        </div>
      ),
    },
    {
      name: 'Products',
      selector: 'line_items',
      cell: (row) =>
        row.line_items.map((l, index) => (
          <div key={index}>
            {l.price_data?.product_data.name} x{l.quantity}
          </div>
        )),
    },
    {
      name: 'View',
      cell: (row) => (
        <Link href={`/orders/${row._id}`}   className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          View
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const tableData = orders.map((order) => ({
    ...order,
    createdAt: { $date: order.createdAt },
  }));

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-lg text-center">Orders</h1>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name, email, or city"
            value={searchQuery}
            onChange={handleSearch}
            className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          />

<CSVLink
            data={tableData}
            filename="orders_report.csv"
            className="shadow bg-green-600 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
          >
            Export CSV
          </CSVLink>
        </div>
     
        <Table columns={columns} data={tableData} title="Orders" showSearch={true} itemsPerPage={10} />
  
      </div>
    </Layout>
  );
}
