import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Link from "next/link";

export default function Report() {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get('/api/sales').then(response => {
      setSales(response.data);
    });
  }, []);

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
  ];

  const filteredSales = sales.filter((sale) =>
    sale.saler.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
     
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by saler"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <DataTable
            title="Sales Report"
            columns={columns}
            data={filteredSales}
            pagination
            highlightOnHover
            striped
            dense
          />
        </div>
      </div>
    </Layout>
  );
}
