import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/context';
import axios from 'axios';
import Layout from '@/components/Layout';
import { useSession} from "next-auth/react"
import SweetAlert2 from "react-sweetalert2";
import { useSnackbar } from 'notistack';

export default function Check() {
  const { data: session } = useSession();
  const [productId,setProductId] = useState();
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [saler,setSaler] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [swalProps, setSwalProps]= useState({});
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



let total = 0;
  for (const productId of cartProducts) {
    const product = products.find((p) => p._id === productId);
    const price = product?.price || 0;
    total += price 
    // * cartProducts.filter((id) => id === productId).length;
  }

  // setProductId(id)
  async function checkout(){
    const btn= document.getElementById('dis')
    setSaler(session?.user?.name)
    
      const esawa= new Date(); 
     const items=cartProducts
      const price=total
   
      const data = {items,price,saler,esawa };
     
    await axios
    .post('/api/sale', data)
    .then((data) => {
  
      clearCart();

      setSwalProps({
        show:true,
        title: 'Sale successfully completed',
  text:'Done',
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
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                </tr>
              </thead> 
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}  className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="shadow-md rounded-md">
                        <div className="w-5 rounded-md">
                          <img src={product.images[0]} alt="" className='w-2/4  rounded-lg' />
                        </div>
                       
                        {product.title}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button onClick={() => lessOfThisProduct(product._id)} className='w-9 h-9 rounded-lg flex items-center justify-center text-slate-700  peer-checked:bg-black-900 peer-checked:text-white'>-</button>
                      <label>{cartProducts.filter((id) => id === product._id).length}</label>
                      <button onClick={() => moreOfThisProduct(product._id)} className='w-9 h-9 rounded-lg flex items-center justify-center text-slate-700  peer-checked:bg-black-900 peer-checked:text-white'>+</button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">${(product.price * cartProducts.filter((id) => id === product._id).length).toFixed(0)}</td>
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
           <button  className="shadow ml-2 h-10 px-6 font-semibold focus:shadow-outline focus:outline-none rounded-md bg-black text-white" onClick={checkout} >
          Check out 
        </button>
<button onClick={emptyCart} className=" bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4">Empty Cart</button> 
     
        </div>
      </div>
      <SweetAlert2 {...swalProps}/>
    </Layout>
  );
}
