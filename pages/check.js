import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/context';
import axios from 'axios';
import Layout from '@/components/Layout';

export default function Check() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (Array.isArray(cartProducts) && cartProducts.length > 0) { // Check if cartProducts is an array and not empty
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else { 
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  function emptyCart() {
    clearCart();
  }

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name,
      email,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const product = products.find((p) => p._id === productId);
    const price = product?.price || 0;
    total += price * cartProducts.filter((id) => id === productId).length;
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
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="shadow-md rounded-md">
                        <div className="w-5 rounded-md">
                          <img src={product.images[0]} alt="" />
                        </div>
                        {product.title}
                      </div>
                    </td>
                    <td>
                      <button onClick={() => lessOfThisProduct(product._id)}>-</button>
                      <label>{cartProducts.filter((id) => id === product._id).length}</label>
                      <button onClick={() => moreOfThisProduct(product._id)}>+</button>
                    </td>
                    <td>${(product.price * cartProducts.filter((id) => id === product._id).length).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td>${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
<button onClick={emptyCart}>Empty Cart</button> 
          {!!cartProducts?.length && (
            <div className="shadow-lg p-2">
              <h2>Order information</h2>
              <input type="text" placeholder="Name" value={name} onChange={(ev) => setName(ev.target.value)} />
              <input type="text" placeholder="Email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
              <input
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                onChange={(ev) => setStreetAddress(ev.target.value)}
              />
              <input type="text" placeholder="Country" value={country} onChange={(ev) => setCountry(ev.target.value)} />
              <button onClick={goToPayment}>Continue to payment</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
