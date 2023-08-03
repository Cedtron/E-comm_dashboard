import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { DataTable } from 'simple-datatables';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const table = document.querySelector('#table');
      new DataTable(table, {
        searchable: false,
        fixedHeight: true,
      });
    }
  }, []);

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

        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table
                  id="table"
                  className="min-w-full text-left text-sm font-light"
                >
                  <thead className="border-b bg-blue-500 text-white font-medium dark:border-neutral-500">
                    <tr>
            <td className="p-2">Product image</td>
                  <td className="p-2">Product name</td>
                  <td className="p-2">Category</td>
                  <td className="p-2">Stock</td>
                  <td className="p-2">Color</td>
                  <td className="p-2">Price</td>
                  <td className="p-2">rating</td>
                  <td className="p-2">Actions</td>
               
            </tr>
          </thead>
          <tbody>
                {products.map((product) => (
                  <tr key={product._id} class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                    <td className="whitespace-nowrap px-6 py-4">
                      <img src={product.images[0]} alt="" />
                      </td>
                    <td className="whitespace-nowrap px-6 py-4">{product.title}</td>
                    <td className="whitespace-nowrap px-6 py-4">{product.category}</td>
                    <td className="whitespace-nowrap px-6 py-4">{product.stock}</td>
                    <td className="whitespace-nowrap px-6 py-4">{product.color}</td>
                    <td className="whitespace-nowrap px-6 py-4">{product.price}</td>
                    <td className="whitespace-nowrap px-6 py-4">{product.rating}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link className="btn-default" href={'/products/edit/' + product._id}>
                      <FaEdit />
                  Edit
                </Link>
                <Link className="btn-red" href={'/products/delete/'+product._id}>
                <RiDeleteBin5Fill className="mx-auto text-red-600"/>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
          </tbody>
          </table>
      </div>
    </div>
  </div>
</div>

          
      </div>
    </Layout>
  );
}