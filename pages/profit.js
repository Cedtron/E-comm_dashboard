import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Profitstab from "@/components/profitstripe";
import SalesTable from "@/components/ptable";
import PChart from "@/components/pchart";
import Construct from "@/components/construction";

export default function Home() {

 const [sales, setSales] = useState([]);
 const { data: session } = useSession();
const  user=session?.user?.name
const  role=session?.user?.roles

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedMonth, setSelectedMonth] = useState("01");

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

const handleMonthChange = (e) => {
  setSelectedMonth(e.target.value);
};

  return (
    <Layout>
      <Construct />
      <Profitstab salesData={sales}/>
      <div className="flex flex-row">
        <div className="w-full m-2 p-2">
          <div className="bg-white text-black rounded shadow-lg w-full">
            <div className="px-6 py-2 border-b border-light-grey">
              <div className="font-bold text-xl">Profits</div>
            </div>
            
            <div className="relative inline-block">

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12h.01L10 12zm0 0h.01L10 12zm0 0h.01L10 12zm0 0h.01L10 12z"/></svg>
                </div>
             </div>

            <div className="table-responsive">
              <SalesTable 
                 salesData={sales}
              />

            </div>

          </div>
        </div>


        <div className="m-2 p-2bg-white text-black rounded  shadow-lg ">


         <div className="">

        <div className="mx-2">
      <label for="country" className="block text-sm font-medium leading-6 text-gray-900">Month</label>
          <select
    value={selectedMonth}
    onChange={handleMonthChange}
    className="appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500">
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
            </div>
          </div>



  <PChart salesData={sales} selectedMonth={selectedMonth} />
  </div>


        
      </div>
    </Layout>
  );
}
