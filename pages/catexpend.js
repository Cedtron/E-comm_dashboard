import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import Table from "@/components/table";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function Catexpend({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [categories,setCategories] = useState([]);
  const [properties,setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/catexpend').then(result => {
      setCategories(result.data);
    });
  }

  const columns = [
    {
      name: 'Expend Category name',
      selector: 'name',
      sortable: true,
    },
    
    {
      name: 'Action',
      cell: (row) => (
        <div>
          <button onClick={() => editCategory(row)}  
           className="shadow m-2 bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          ><FaEdit /> Edit</button>
          <button onClick={() => deleteCategory(row)}
           className="shadow m-2 bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          ><RiDeleteBin5Fill/> Delete</button>
        </div>
      ),
    },
  ];
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name,
     
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/catexpend', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/catexpend', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category){
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({name,values}) => ({
      name,
      values:values.join(',')
    }))
    );
  }
  function deleteCategory(category){
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = category;
        await axios.delete('/api/catexpend?_id='+_id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, {name:'',values:''}];
    });
  }
  function handlePropertyNameChange(index,property,newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index,property,newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-base font-semibold leading-7 text-gray-50">Categories</h1>
        </div>
        <div className="mx-auto p-4">
      <label className="block text-sm font-medium leading-6 text-gray-900 p-2">
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text"
            placeholder={'Expend Category name'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
        
        </div>
        <div className="mb-2">
        {/* <label className="block text-sm font-medium leading-6 text-gray-900 p-2">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="shadow m-2 bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
            Add new property
          </button> */}
          {properties.length > 0 && properties.map((property,index) => (
            <div key={property.name} className="flex gap-1 mb-2">
              <input type="text"
                     value={property.name}
                     className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="property name (example: color)"/>
              <input type="text"
                    className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={ev =>
                       handlePropertyValuesChange(
                         index,
                         property,ev.target.value
                       )}
                     value={property.values}
                     placeholder="values, comma separated"/>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                ><RiDeleteBin5Fill/>
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Cancel</button>
          )}
         <button
                type="submit"
                className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
            Save
          </button>
        </div>
      </form>
   

    <Table columns={columns} data={categories}  title="Expend Categories" showSearch={true} itemsPerPage={10} />
  
 </div>
      </div>
    </Layout>
  );
}

