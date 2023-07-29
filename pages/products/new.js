import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";

export default function NewProduct() {
  return (
    <Layout>
      <div className="bg-grey-darker p-4 text-white">   <h1 className="text-lg text-center">New Product</h1></div>
      <ProductForm />
    </Layout>
  );
}