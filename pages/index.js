import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Stripe from "@/components/stripe"; 
import Summer from "@/components/summer"; 
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Table from "@/components/table";

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
  if (role !== "admin") {
    apiUrl = `/api/sales?saler=${user}`;
  }

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

  const columns = [
    {
      name: 'Items sold',
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
      cell: (row) => (
        <div className="text-center">
          {row.saler}
        </div>
      ),
    },
    {
      name: 'Total price',
      selector: 'price',
      sortable: true,
    },
    {
      name: " Date",
      selector: "esawa",
      sortable: true,
      cell: (row) => {
       
        const date = new Date(row.esawa);
        const formattedDate = date.toLocaleDateString(); 
        return formattedDate;
      },
    },
  ];

  return (
    <Layout>
      <Stripe salesData={sales}/>
    
      <div className="flex flex-row">
        <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Sold items</div>
            </div>
            
            <div className="table-responsive">

            <Table columns={columns} data={sales} title="Sales Report" showSearch={false} itemsPerPage={10} />

            </div>
          </div>
        </div>
        <Summer data={sales} />
      </div>
    </Layout>
  );
}