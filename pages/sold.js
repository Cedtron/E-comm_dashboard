import Layout from "@/components/Layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
 
export default function Products() {
  const [products,setProducts] = useState([]);
  useEffect(() => {
    axios.get('/api/sales').then(response => {
      setProducts(response.data);
    });
  }, []);  
  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
   <table className="table-auto mt-2">
        <thead className="bg-blue-500 text-white">
          <tr>
            <td className="p-2">Product name</td>
            <td className="p-2">No of items</td>
            <td className="p-2">Price</td>
            <td className="p-2">Date</td>
            
            <td className="p-2">Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td className="p-2">{product.product}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.esawa}</td>
             
            
              <td className="p-2">
                <Link className="btn-default" href={'/products/sales/'+product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  View
                </Link>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </Layout>
  );
}