import Layout from "@/components/Layout";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "@/components/context";
import { FaCartPlus } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, []); 

  const { cartProducts, addProduct } = useContext(CartContext);
  const [addedProductId, setAddedProductId] = useState(null);
 const [isAdding, setIsAdding] = useState(false);

 function addToCart(productId) {
  if (!cartProducts.includes(productId)) {
    addProduct(productId);
    setAddedProductId(productId); // Set the product ID that is being added to the cart
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000); // Set a timeout of 2000 milliseconds (2 seconds)
  }
}

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          <Link className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4" href={'/check'}>View Items</Link>
          <h2>Number of products in cart: {cartProducts.length}</h2>
          <Link className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4" href={'/report'}>Report</Link>
          <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">

          <table className="table-auto mt-2">
        <thead className="bg-blue-500 text-white">
          <tr>
            <td className="p-2">Product name</td>
            <td className="p-2">Category</td>
            <td className="p-2">Stock</td>
            <td className="p-2">Color</td>
            <td className="p-2">Price</td>
            <td className="p-2">Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}
            className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                  
            >
              <td className="whitespace-nowrap px-6 py-4">{product.title}</td>
              <td className="whitespace-nowrap px-6 py-4">{product.category}</td>
              <td className="whitespace-nowrap px-6 py-4">{product.stock}</td>
              <td className="whitespace-nowrap px-6 py-4">{product.color}</td>
              <td className="whitespace-nowrap px-6 py-4">{product.price}</td>
            
              <td className="whitespace-nowrap px-6 py-4">
                   <button
                      onClick={() => addToCart(product._id)}
                      disabled={addedProductId === product._id}
                      className={`w-full cursor-pointer bg-black hover:bg-gray-900 text-white py-2 px-4 rounded inline-flex items-center ${
                        cartProducts.includes(product._id) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaCartPlus className="w-4 h-4 mr-2" />   {cartProducts.includes(product._id) ? "Added to cart" : "Add to cart"}
                    </button>
                    
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
      </div>
    </Layout>
  );
}