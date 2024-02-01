import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@/components/table";

export default function User() {
  const [log, setLog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get('/api/log').then(response => {
      setLog(response.data);
    });
  }, []);

  const columns = [
    {
      name: "User",
      selector: "name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Time",
      selector: "esawa",
      sortable: true,
      format: (row) => new Date(row.createdAt).toLocaleString(),
    },
  
  ];



  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          
        <h1 className="text-inherit font-bold p-2">Activity Logo</h1>

          
        <Table columns={columns} data={log} title="Logs" showSearch={false} itemsPerPage={10} />
 
        </div>
      </div>
    </Layout>
  );
}
