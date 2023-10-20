import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/context';
import axios from 'axios';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';
import SweetAlert2 from 'react-sweetalert2';
import { useSnackbar } from 'notistack';


export default function Check() {
  const { data: session } = useSession();
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [editedPrices, setEditedPrices] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [swalProps, setSwalProps] = useState({});

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
    const data = { items, price, saler, esawa };

    await axios
      .post('/api/sale', data)
      .then(() => {
        clearCart();

        setSwalProps({
          show: true,
          title: 'Sale successfully completed',
          text: 'Done',
        });
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
                          <th className="p-2">Product</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Original Price</th>
                          <th className="p-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr
                            key={product._id}
                            className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="shadow-md rounded-md">
                                <div className="w-5 rounded-md">
                                  <img src={product.images[0]} alt="" className="w-2/4 rounded-lg" />
                                </div>
                                {product.title}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => lessOfThisProduct(product._id)}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:bg-black-900 peer-checked:text-white"
                              >
                                -
                              </button>
                              <label>
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
                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:bg-black-900 peer-checked:text-white ${
                                  cartProducts.filter(id => id === product._id).length >= product.stock
                                    ? 'hidden'
                                    : ''
                                }`}
                                disabled={cartProducts.filter(id => id === product._id).length >= product.stock}
                              >
                                +
                              </button>
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
                              />
                              <button onClick={() => saveEditedPrice(product._id)} className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4">Save</button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td>${total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button className="shadow ml-2 h-10 px-6 font-semibold focus:shadow-outline focus:outline-none rounded-md bg-black text-white" onClick={checkout}>
            Check out
          </button>
          <button
            onClick={emptyCart}
            className="bg-red-600 hover.bg-red-400 focus.shadow-outline focus.outline-none text-white font.bold py-2 px-4 rounded m-4"
          >
            Empty Cart
          </button>
        </div>
      </div>
      <SweetAlert2 {...swalProps} />
    </Layout>
  );
}

