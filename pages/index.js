import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import Stripe from "@/components/stripe"; 
import Summer from "@/components/summer";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DataTable from "react-data-table-component";


export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [sales, setSales] = useState([]);
let saler = session?.user?.name;


useEffect(() => {
  if (isAdmin) {
    axios
      .get('/api/sales')
      .then((response) => {
        setSales(response.data);
        console.log(sales, "admin");
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  } else if (saler) { // Removed unnecessary use of session?.user?.name
    // Fixed code by directly using 'saler' variable
    axios
      .get(`/api/sales?saler=${encodeURIComponent(saler)}`)
      .then((response) => {
        setSales(response.data);
      
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  }
}, [isAdmin, saler]);


  const columns = [
    {
      name: 'Items sold',
      selector: row => {
        const itemNames = row.line_items.map(item => item.price_data.product_data.name);
        return itemNames.join(', ');
      },
      sortable: true,
      grow: 2,
    },
    {
      name: 'Name of the saler',
      selector: 'saler',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Total price',
      selector: 'price',
      sortable: true,
    },
    {
      name: 'Date',
      selector: 'esawa',
      sortable: true,
      format: row => new Date(row.esawa).toLocaleDateString(),
    },
  ];
 


  return <Layout>
    <Stripe salesData={sales}/>

    <div className="flex flex-row">

    <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Sold items</div>
            </div>
            <div className="table-responsive">

            <DataTable
                columns={columns}
                data={sales}
                highlightOnHover
                pointerOnHover
                pagination
                paginationPerPage={6}
                fixedHeader
                sortServer // Enable server-side sorting
                onSort={(column, direction) => {
                  // Handle the sorting here
                  const sortedSales = [...sales].sort((a, b) => {
                    if (direction === 'asc') {
                      return a[column.selector] > b[column.selector] ? 1 : -1;
                    } else {
                      return a[column.selector] < b[column.selector] ? 1 : -1;
                    }
                  });
                  setSales(sortedSales);
                }}
                filterServer
              />

           
            </div>
          </div>
        </div>

        <Summer
         data={sales} />
</div>
  </Layout>
}
