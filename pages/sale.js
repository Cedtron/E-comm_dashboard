import Layout from "@/components/Layout";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@/components/table";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import { CartContext } from "@/components/context";
import Color from "@/components/color";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);
  const { cartProducts, addProduct } = useContext(CartContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      setTableData(response.data);
    });
  }, []); 

  const columns = [
    {
      name: 'Product image',
      cell: (row) => <img src={row.image} alt="" className="w-2/4 rounded-lg m-2" />,
    },
    {
      name: "Product name",
      selector: "title",
      sortable: true,
    },
    {
      name: "Category",
      selector: "category",
      sortable: true,
      cell: (row) => row.category.name, 
    },
    {
      name: "Stock",
      selector: "stock",
      sortable: true,
      conditionalClasses: (row) => row.stock < 2 ? 'bg-orange-500' : '',
    },
    {
      name: 'Color',
      cell: (row) => <Color colors={row.color.split(',')} />,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
      format: (row) => `$${row.price}`,
    },
    {
      name: "Expdate",
      selector: "expdate",
      sortable: true,
      conditionalClasses: (row) => new Date(row.expdate) >= new Date() ? '' : 'bg-red-500 text-white',
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => addToCart(row._id)}
          disabled={new Date(row.expdate) >= new Date() || addedProductId === row._id}
          className={`w-full cursor-pointer bg-black hover:bg-gray-900 text-white py-2 px-4 rounded inline-flex items-center ${
            cartProducts.includes(row._id) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaCartPlus className="w-4 h-4 mr-2" />{" "}
          {cartProducts.includes(row._id) ? "Added to cart" : "Add to cart"}
        </button>
      ),
    },
  ];
  
  function addToCart(productId) {
    if (!cartProducts.includes(productId)) {
      addProduct(productId);
      setAddedProductId(productId);
      setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query)
    );
    setTableData(filteredData);
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <Link
          type="button"
          href={'/check'}
          className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
        >
          Products
          <span
            className="ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700"
          >
            {cartProducts.length}
          </span>
        </Link>
        <Link
          className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
          href={'/report'}
        >
          Report
        </Link>
        <div className="p-4">
       
          <Table columns={columns} data={tableData} title="Products" showSearch={true} itemsPerPage={10} />
  
        </div>
      </div>
    </Layout>
  );
}
