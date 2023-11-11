import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/context';
import axios from 'axios';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useSnackbar } from 'notistack';


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
        <div className="p-4 text-black -mt-2.5 -mb-2.5 -ml-2.5 -mr-2.5">
          <h2>Cart</h2>
          {!cartProducts?.length && <div>Your cart is empty</div>}
          {products?.length > 0 && (
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="table-auto mt-2">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th className="p-2 w-1/5">Product</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Original Price</th>
                          <th className="p-2">Edit the Price item</th>
                          <th className="p-2">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr
                            key={product._id}
                            className="border-b rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                          
                           
          <img src={product.images[0]} alt="product-image" class="w-1/12 rounded-lg sm:w-40"loading="lazy"  />
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
                                className="cursor-pointer rounded-l bg-gray-100 p-2 duration-100 hover:bg-blue-500 hover:text-blue-50"
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
                                className={`cursor-pointer rounded-r bg-gray-100 p-2 duration-100 hover:bg-blue-500 hover:text-blue-50 ${
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
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                          <div class="flex m-4 justify-between">
          <p class="text-lg font-bold">Total:</p>
          <div class="">
            <p class="mb-1 text-lg font-bold">  {total}</p>
            
          </div>
          </div>
                            
                            </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
                 <button className="shadow ml-2 h-10  px-6 font-semibold focus:shadow-outline focus:outline-none rounded-md bg-black text-white" onClick={checkout}>
            Check out
          </button>
          <button
            onClick={emptyCart}
            className="bg-red-600 hover.bg-red-400 focus.shadow-outline focus.outline-none text-white font.bold py-2 px-4 rounded m-4"
          >
            Empty Cart
          </button>
            </div>
          )}
       
        </div>
      </div>
   
    </Layout>
  );
}

