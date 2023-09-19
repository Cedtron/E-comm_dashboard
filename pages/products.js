import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import DataTable from 'react-data-table-component';

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
      cell: (row) => <img src={row.image} alt="" className="w-2/4 rounded-lg" />,
    },
    { name: 'Product name', selector: 'title' },
    { name: 'Category', selector: 'category' },
    { name: 'Stock', selector: 'stock' },
    { name: 'Color', selector: 'color' },
    { name: 'Price', selector: 'price' },
    { name: 'Rating', selector: 'rating' },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Link className="btn-default" href={`/products/edit/${row._id}`}>
            <FaEdit />
            Edit
          </Link>
          <Link className="btn-red" href={`/products/delete/${row._id}`}>
            <RiDeleteBin5Fill className="mx-auto text-red-600" />
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
              className="p-2"
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
