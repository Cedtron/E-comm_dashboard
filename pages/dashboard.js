import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Ostripe from "@/components/ostripe"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@/components/table";
import Osummer from "@/components/osummer";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      axios.get('/api/orders').then(response => {
        setOrders(response.data);
      });
    } else if (session?.user?.name) {
      axios.get(`/api/orders?saler=${encodeURIComponent(session.user.name)}`).then(response => {
        setOrders(response.data);
      });
    }
  }, [isAdmin, session]);

  const columns = [
    {
      name: 'Items Order',
      selector: 'line_items',
      sortable: true,
      grow: 2,
      cell: row => {
        const itemNames = row.line_items.map(item => item.price_data.product_data.name);
        return itemNames.join(', ');
      }
    },
    {
      name: 'Customer',
      selector: 'name',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Payment',
      selector: 'paid',
      sortable: true,
    },
    {
      name: 'Date',
      selector: 'createdAt',
      sortable: true,
      format: row => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <Ostripe orderData={orders}/>
      <div className="flex flex-row">
        <div className="w-3/6 m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Sold items</div>
            </div>
            <div className="table-responsive">
           

<Table columns={columns} data={orders} title="Orders" showSearch={true} itemsPerPage={10} />
  

            </div>
          </div>
        </div>
<Osummer
         data={orders} />

      </div>
    </Layout>
  );
}




  