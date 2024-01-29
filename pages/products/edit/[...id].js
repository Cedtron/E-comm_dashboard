import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <div className="bg-grey-darker p-4 text-white">   <h1 className="text-lg text-center">Edit product</h1></div>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}
    </Layout>
  );
}