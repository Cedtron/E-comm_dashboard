import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useSnackbar } from 'notistack';
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  costprice:existingCostprice,
  color: existingColor,
  expdate: existingExpdate,
  stock: existingStock,
 brand : existingBrand,
  images:existingImages,
  category:assignedCategory,
  properties:assignedProperties,
}) {
  const [title,setTitle] = useState(existingTitle || '');
  const [description,setDescription] = useState(existingDescription || '');
  const [category,setCategory] = useState(assignedCategory || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [price,setPrice] = useState(existingPrice || '');
  const [costprice,setCostprice] = useState(existingCostprice || '');
  const [brand,setBrand] = useState(existingBrand || '');
  const [stock,setStock] = useState(existingStock || '');
  const [color,setColor] = useState(existingColor || '');
  const [expdate,setExpdate] = useState(existingExpdate || '');
  const [images,setImages] = useState(existingImages || []);
  const [goToProducts,setGoToProducts] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [swalProps, setSwalProps]= useState({});
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,description,brand,price,costprice,stock,color,expdate,images,category,
      properties:productProperties
    };
    if (_id) {
      //update
      await axios.put('/api/products', {...data,_id})
      .then((data) => {
        setSwalProps({
   show:true,
   title: 'Product successfully Update',
text:'Done',
 })
}) .catch((error) => {
 enqueueSnackbar('Product Update failed ' + error, { variant: error });
});
    } else { 
      //create
      await axios.post('/api/products', data)
      .then((data) => {
         

        Swal.fire({
          title: 'Success',
          text: 'Product successfully Added',
          icon: 'success',
          confirmButtonText: 'Done'
        })

      }) .catch((error) => {
        enqueueSnackbar('Product adding failed ' + error, { variant: error })
      });
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push('/products');
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">

    <div className="p-4 text-black m-2">
      <form onSubmit={saveProduct}  className="mx-auto">
      <div className="sm:col-span-3 my-4">
              <label htmlFor="Product-name" className="block text-sm font-medium leading-6 text-gray-900">
        Product name</label>
        <div className="mt-2">
        <input
         className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}/>
          </div>
           </div>

           <div className="sm:col-span-3 my-4">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
        Category</label>
        <div className="mt-2"> 
        <select value={category}
           className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Choose Categories</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label className="block text-sm font-medium leading-6 text-gray-900">{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
              <select value={productProperties[p.name]} 
                className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
              >
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        </div>
        </div>
       
        <div className="sm:col-span-3 my-4">
              <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
       Brand</label>
       <div className="mt-2">
        <input
         className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Brand name"
          value={brand}
          onChange={ev => setBrand(ev.target.value)}/>
          </div>
          </div>

          <div className="col-span-full my-4">

          <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
            Description</label>
            <div className="mt-2">
               <textarea
        rows={5}
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

          placeholder="description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        </div>
        </div>

        <div className="sm:col-span-3 my-4">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
      Price </label>
      <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          type="number" placeholder="price"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
       </div>
       </div>

       <div className="sm:col-span-3 my-4">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
      Cost Price </label>
      <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          type="number" placeholder="Cost price"
          value={costprice}
          onChange={ev => setCostprice(ev.target.value)}
        />
       </div>
       </div>

       <div className="sm:col-span-3 my-4">
              <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
        Stock</label>
        <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          type="number"
          placeholder="Stock number"
          value={stock}
          onChange={ev => setStock(ev.target.value)}/>
          </div>
          </div>

          <div className="sm:col-span-3 my-4">
              <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
        Exp Date</label>
        <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          type="date"
          placeholder="Product Expdate"
          value={expdate}
          onChange={ev => setExpdate(ev.target.value)}/>
          </div>
          </div>

          <div className="sm:col-span-3 my-4">
              <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
        Color</label>
        <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        
          type="text"
          placeholder="Product colors"
          value={color}
          onChange={ev => setColor(ev.target.value)}/>
          </div>
          </div>

          <div className="sm:col-span-3 my-4">
              <label htmlFor="photos" className="block text-sm font-medium leading-6 text-gray-900">
        
          Photos
        </label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
              <div key={link} className="bg-white p-4 m-4 shadow-sm rounded-lg border">
                <img src={link} alt="" className="w-48 rounded-lg"/>
              </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Add image
            </div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded-md p-2 text-white w-1/5">
          Save
        </button>
      </form>
      </div>
 
      </div>
  );
}
