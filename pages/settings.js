import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@/components/table";

export default function User() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get('/api/user').then(response => {
      setUsers(response.data);
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
      name: "Role",
      selector: "role",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link href={'/users/edit/' + row._id} className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4">
            Edit
          </Link>
          <Link href={'/users/delete/' + row._id} className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4">
            Delete
          </Link>
        </div>
      ),
    },
  ];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    setUsers(filteredUsers);
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/users/new'}
          >
            Add new user
          </Link>

          <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/data'}
          >
           Data mangement
          </Link>

 <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/activities'}
          >
        Activity Log
          </Link>

    
<Table columns={columns} data={users} title="Users" showSearch={true} itemsPerPage={10} />
  
        </div>
      </div>
    </Layout>
  );
}
