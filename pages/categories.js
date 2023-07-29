import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [parentCategory,setParentCategory] = useState('');
  const [categories,setCategories] = useState([]);
  const [properties,setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
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
    swal.fire({
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
        await axios.delete('/api/categories?_id='+_id);
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
       <div className=" bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
   <div className="bg-grey-darker p-4 text-white">   <h1 className="text-lg text-center">Categories</h1></div>
    <div className="mx-auto p-4">
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory} className="w-full">
        <div className="flex gap-1">
          <input
            type="text"
            className=" w-1/2 h-8 p-2 rounded-md shadow-md"
            placeholder={'Category name'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
          <select
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
            <option value="">No parent category</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2 p-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            Add new property
          </button>
          {properties.length > 0 && properties.map((property,index) => (
            <div key={property.name} className="flex gap-1 mb-2">
              <input type="text"
                     value={property.name}
                     className="bg-grey-200 appearance-none border-1 border-grey-200 rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple-light"
                     onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="property name (example: color)"/>
              <input type="text"
                     className="bg-grey-200 appearance-none border-1 border-grey-200 rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple-light"
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
                className="bg-red-500 rounded-md p-2 text-white w-1/5">
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
              className="btn-default">Cancel</button>
          )}
          <button type="submit"
                   className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="mt-2 w-5/6">
          <thead className="bg-blue-500 text-white">
          <tr>
            <td className="p-2">Category name</td>
            <td className="p-2">Parent category</td>
            <td className="p-2"></td>
          </tr>
          </thead>
          <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button
                  onClick={() => editCategory(category)}
                  className="btn-default mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="btn-red">Delete</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
      </div>
</div>
 
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal} />
));
