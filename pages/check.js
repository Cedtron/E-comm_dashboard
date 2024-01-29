import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/context';
import axios from 'axios';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useSnackbar } from 'notistack';
import Link from 'next/link';


export default function Check() {
  const { data: session } = useSession();
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [editedPrices, setEditedPrices] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
 
 
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Axios request error:', error);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  function emptyCart() {
    clearCart();
  }

  function handlePriceChange(productId, value) {
    setEditedPrices(prevPrices => ({
      ...prevPrices,
      [productId]: parseFloat(value) || 0,
    }));
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function calculateTotal(products, cartProducts, editedPrices) {
    let total = 0;
    for (const product of products) {
      const price = editedPrices[product._id] || product.price;
      const quantity = cartProducts.filter(id => id === product._id).length;
      total += price * quantity;
    }
    return total;
  }

  const total = calculateTotal(products, cartProducts, editedPrices);
  async function checkout() {
    const btn = document.getElementById('dis');
    const saler = session?.user?.name;
    const esawa = new Date();
    const items = cartProducts;
    const price = total;
    

    const editedItemPrices = [];

    for (const product of products) {
      const editedPrice = editedPrices[product._id];
      if (editedPrice !== undefined) {
        editedItemPrices.push({ productId: product._id, price: editedPrice });
      }
    }
  
    const data = { items, price, saler, esawa, dprice: editedItemPrices }; // Include editedPrices in the data object
  

    await axios
      .post('/api/sale', data)
      .then(() => {
        clearCart();

        Swal.fire({
          title: 'Success',
          text: 'Sale successfully completed',
          icon: 'success',
          confirmButtonText: 'Done'
        })


      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
      });
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
          <div className="p-4 text-black -mt-2.5 -mb-2.5 -ml-2.5 -mr-2.5">
            <h1>Thanks for your order!</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-2 text-black -mt-2.5 -mb-2.5 -ml-2.5 -mr-2.5">




        <div className="h-screen bg-gray-100">
        <div className="bg-grey-darker p-4 text-white mb-2">
    <h1 className="text-center text-2xl font-bold">Items</h1>
    </div>
    {!cartProducts?.length && <div>
      <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <div className='max-w-md mx-auto space-y-6'>
            
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h4 className="mb-4 text-5xl tracking-tight font-extrabold lg:text-6xl text-red-600 dark:text-red-500">Empty!</h4>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-black md:text-4xl">Your checkout is empty</p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Click the button to return to products </p>
                        <Link
          className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
          href={'/sale'}
        >
          Back
        </Link>
                    </div>   
                </div>

        </div>
    </div>
      
      
      </div>}
          {products?.length > 0 && (

    <div className=" max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
      <div className="rounded-lg md:w-2/3">

      <table className="table-auto rounded-md">
                      <thead>
                        <tr className="bg-blue-600 text-center">
                          <th className="p-2 ">Product</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Original Price</th>
                          <th className="p-2">Edit the Price item</th>
                          <th className="p-2">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {products.map(product => (
                          <tr
                            key={product._id}
                            className="border-b rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                          
                           
          <img src={product.images[0]} alt="product-image" class="cart-img  rounded-lg "loading="lazy"  />
          <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
            <div class="mt-5 sm:mt-0">
              <h2 class="text-lg font-bold text-gray-900">{product.title}</h2>
             
            </div>
            </div>
          
                              
                            </td>
                            <td className="whitespace-nowrap mx-6 py-4">

                            <div class="flex items-center border-gray-100">
                
                              <button
                                onClick={() => lessOfThisProduct(product._id)}
                                className="cursor-pointer rounded-l bg-gray-400 p-2 duration-100 hover:bg-blue-500 hover:text-blue-50"
                              >
                                -
                              </button>
                              <label class="font-bold text-gray-900 mx-4">
                                {(() => {
                                  let p = cartProducts.filter(id => id === product._id).length;
                                  let sto = product.stock;

                                  if (p > sto) {
                                    return 'Out of stock';
                                  } else {
                                    return p;
                                  }
                                })()}
                              </label>
                              <button
                                onClick={() => moreOfThisProduct(product._id)}
                                className={`cursor-pointer rounded-r bg-gray-400 p-2 duration-100 hover:bg-blue-500 hover:text-blue-50 ${
                                  cartProducts.filter(id => id === product._id).length >= product.stock
                                    ? 'hidden'
                                    : ''
                                }`}
                                disabled={cartProducts.filter(id => id === product._id).length >= product.stock}
                              >
                                +
                              </button>
                              
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">
                              {product.price}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">
                              <input
                                type="number"
                                min="0"
                                value={editedPrices[product._id] || (product.price * cartProducts.filter(id => id === product._id).length).toFixed(0)}
                                onChange={e => handlePriceChange(product._id, e.target.value)}
                                className="block rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <button onClick={() => saveEditedPrice(product._id)} className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4">Save</button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
        {((editedPrices[product._id] || product.price) * cartProducts.filter(id => id === product._id).length).toFixed(0)}
       </td>
                          </tr>
                        ))}
                       
                      </tbody>
                    </table>
        
      </div>
      
      <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
       
        <hr className="my-4" />
        <h4 className="text-lg font-bold">Total price of all products</h4>
        <hr class="my-4"/>
        <div className="flex justify-between">
                    
          <div className="mx-auto">
            <p className="mb-1 text-lg font-bold">{total}</p>
            <p className="text-sm text-gray-700"> UGX</p>
          </div>
        </div>
        <button className="mt-6 w-full  text-white  rounded-md bg-blue-500 p-2 font-medium text-blue-50 hover:bg-blue-600" onClick={checkout}>Check out</button>
        <button className="mt-6 w-full  text-white  rounded-md bg-red-500 p-2 font-medium text-red-50 hover:bg-red-600" onClick={emptyCart}>Empty Cart</button>
      </div>
    </div>
 

  )}

   
        </div>
      </div>
      </div>
    </Layout>
  );
}

