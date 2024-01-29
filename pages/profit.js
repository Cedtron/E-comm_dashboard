import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Profitstab from "@/components/profitstripe";
import SalesTable from "@/components/ptable";
// Check the correct path for this import

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
              <SalesTable 
                 salesData={sales}
              />

<PChart salesData={salesData} selectedMonth={selectedMonth} />
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  );
}
