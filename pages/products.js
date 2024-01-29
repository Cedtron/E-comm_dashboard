import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import Color from '@/components/color';
import { CSVLink } from 'react-easy-export';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);
 
  const columns = [
    {
      name: 'Product image',
      cell: (row) => <img src={row.image} alt="" className="w-2/4 rounded-lg m-2" />,
    },
    { name: 'Product name', selector: 'title' },
    { name: 'Category', selector: 'category' },
    { name: 'Stock', selector: 'stock', conditionalClasses: (row) => row.stock < 2 ? 'bg-orange-500' : '' },
    {
      name: 'Color',
      cell: (row) => <Color colors={row.color.split(',')} />,
    },
    { name: 'Price', selector: 'price' },
    { name: 'Expdate', selector: 'expdate', conditionalClasses: (row) => new Date(row.expdate) <= new Date() ? 'bg-red-500 text-white' : '' },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Link type="button" className="shadow m-2 bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" href={`/products/edit/${row._id}`}>
            <FaEdit />
            Edit
          </Link>
          <Link type="button" className="shadow m-2 bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" href={`/products/delete/${row._id}`}>
            <RiDeleteBin5Fill />
            Delete
          </Link>
        </div>
      ),
    },
  ];

  const data = products.map((product) => ({
    ...product,
    image: product.images[0],
  }));

 const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const totalProducts = filteredData.length; 

  
  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/products/new'}
          >
            Add new product
          </Link>

          <CSVLink
            data={filteredData}
            filename="products_report.csv"
            className="shadow bg-green-600 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
          >
            Export CSV
          </CSVLink>
        </div>
        <DataTable
          title="Products"
          columns={columns}
          data={filteredData}
          highlightOnHover
          striped
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search"
              className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          }
          pagination
        />
     <div className="p-4">Total number of products: {totalProducts}</div>
      </div>
    </Layout>
  );
}
