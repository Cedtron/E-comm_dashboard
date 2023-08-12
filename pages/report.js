import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Report() {
  const [sales,setSales] = useState([]);
  useEffect(() => {
    axios.get('/api/sales').then(response => {
      setSales(response.data);
    });
  }, []);
  return (
    <Layout>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table
                  id="table"
                  className="min-w-full text-left text-sm font-light">
          <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2">Items sold</th>
            <th className="p-2">Name of the saler</th>
            <th className="p-2">Total price</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
        {sales.length > 0 && sales.map(sale => (
          <tr key={sale._id}  className="border-b text-black transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
          >
           
            <td>
              {sale.line_items.map(l => (
                <>
                  {l.price_data?.product_data.name} x
                  {l.quantity}<br />
                </>
              ))}
            </td> 
           <td>{sale.saler}</td>
           <td>{sale.price}</td>
           <td>{(new Date(sale.createdAt)).toLocaleString()}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      </div></div></div></div>
    </Layout>
  );
}
