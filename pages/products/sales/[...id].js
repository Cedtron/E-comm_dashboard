import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import { useSession} from "next-auth/react"
import { useSnackbar } from 'notistack';
import {useEffect, useState} from "react";
import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function SaleProduct() {
  const router = useRouter();
  const { data: session } = useSession();
  const [productInfo,setProductInfo] = useState();
  const [product,setProduct] = useState();
  const [px,setPx] = useState();
  const [totalPrice,setTotalPrice] = useState();
  const [productId,setProductId] = useState();
  const [saler,setSaler] = useState();
  const [stockx,setStockx] = useState();
  const [stocks,setStocks] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data),
      setPx(response.data.price),
      setProduct(response.data.title),
      setStockx(response.data.stock)
    });


  }, [id]);
 
  async function saleProduct() {
    
 const btn= document.getElementById('dis')

if( parseInt(stocks)>= parseInt(stockx)){
      enqueueSnackbar("This is too much", { variant: 'error' });
    }
    
    else{
      enqueueSnackbar("Good to go", { variant: 'success' });
      const totalPrice=px*stocks 
      setTotalPrice(totalPrice)
      
      btn.classList.remove("invisible")
    }

 

  }
 
async function checkout(){
  const btn= document.getElementById('dis')
  setSaler(session?.user?.name)
    setProductId(id)
    const esawa= new Date(); 
    const stock=stocks
    const price=totalPrice
    const data = {productId,product,stock, price,saler,esawa };
    const inputf=document.getElementById("input");
  await axios
  .post('/api/sales', data)
  .then((data) => {
    // console.log(data);
    // router.push(redirect || '../');
    inputf.value="";
    btn.classList.add("invisible")
   
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

  return (
    <Layout>
       <div className=" bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-4/6">
       

       <div className="bg-grey-darker p-4 text-white">  
        <h1 className="text-lg text-center">{product}</h1></div>
        <div className="p-4">
       <div className="flex font-sans">
  <div className="flex-none w-48 relative">
    <img src="/classic-utility-jacket.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
  </div>
  <div className="flex-auto p-6">
    <div className="flex flex-wrap">
      <h1 className="flex-auto text-lg font-semibold text-slate-900">
      {product}
      </h1>
      <div className="text-lg font-semibold text-slate-500">
      {px}
      </div>
      <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
        In stock :{stockx}
      </div>
    </div>
    
{stocks}<br/>
Total price :{totalPrice}
    <input id="input"
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
          type="text"
          placeholder={stockx}
          
          onChange={ev => setStocks(ev.target.value)}/>
    <div className="flex space-x-4 mb-6 text-sm font-medium">
      <div className="flex-auto flex space-x-4">
        <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" onClick={saleProduct} >
          Calculate
        </button>
      
        <button id="dis" className="invisible ml-2 h-10 px-6 font-semibold rounded-md bg-black text-white" onClick={checkout} >
          Check out 
        </button>
      </div>
      <button className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-slate-300 border border-slate-200" type="button" aria-label="Like">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
       
    </div>
    <p className="text-sm text-slate-700">
      Free shipping on all continental US orders.
    </p>
  </div>
</div>




      
 </div>
      
      </div>
    
    </Layout>
  );
}
