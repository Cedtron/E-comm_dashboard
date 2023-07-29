import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import { RiDeleteBin5Fill } from 'react-icons/ri';

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo,setProductInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/products');
  }
  async function deleteProduct() {
    await axios.delete('/api/products?id='+id);
    goBack();
  }
  return (
    <Layout>
       <div className=" bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-4/6">
     <div className="p-4"> 
     <RiDeleteBin5Fill size="10em" className="mx-auto text-red-600"/>
     <h1 className="text-center py-2">
     Do you really want to delete
        &nbsp;&quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteProduct}
          className="shadow mx-4 bg-red-600 hover:bg-red-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Yes</button>
        <button
          className="shadow bg-gray-600 hover:bg-gray-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={goBack}>
          NO
        </button>
      </div>
      </div>
      </div>
    </Layout>
  );
}
