import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { handleSubmit, control, setValue, reset, fields, append, remove } = useForm({
    defaultValues: {
      properties: [{ name: '', values: '' }],
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const result = await axios.get('/api/categories');
    setCategories(result.data);
  }

  async function deleteCategory(category) {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await axios.delete(`/api/categories?_id=${category._id}`);
      fetchCategories();
    }
  }

  const columns = [
    {
      name: 'Category name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Parent category',
      cell: (row) => (row.parent ? row.parent.name : 'No parent category'),
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

  async function saveCategory(data) {
    data.properties = data.properties.map((property) => ({
      name: property.name,
      values: property.values.split(','),
    }));
    
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    
    reset();
    fetchCategories();
  }

  function addProperty() {
    append({ name: '', values: '' });
  }

  function removeProperty(index) {
    remove(index);
  }

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-lg text-center">Categories</h1>
        </div>
        <div className="mx-auto p-4">
          <label>
            {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
          </label>
        
           
          <form onSubmit={handleSubmit(saveCategory)} className="w-full">
            <div className="flex gap-1">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-1/2 h-8 p-2 rounded-md shadow-md"
                    placeholder="Category name"
                  />
                )}
              />
              <Controller
                name="parentCategory"
                control={control}
                render={({ field }) => (
                  <select {...field}>
                    <option value="">No parent category</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                )}
              />
            </div>
            <div className="mb-2 p-2">
              <label className="block">Properties</label>
              <button
                type="button"
                onClick={() => addProperty()}
                  >
                Add new property
              </button>
              {fields?.properties?.map((item, index) => (
                <div key={item.id} className="flex gap-1 mb-2">
                  <Controller
                    name={`properties[${index}].name`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="bg-grey-200 appearance-none border-1 border-grey-200 rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple-light"
                        placeholder="property name (example: color)"
                      />
                    )}
                  />
                  <Controller
                    name={`properties[${index}].values`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="bg-grey-200 appearance-none border-1 border-grey-200 rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-purple-light"
                        placeholder="values, comma separated"
                      />
                    )}
                  />
                  <button
                    onClick={() => removeProperty(index)}
                    type="button"
                    className="bg-red-500 rounded-md p-2 text-white w-1/5"
                  >
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
                    reset();
                  }}
                  className="btn-default"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>

          <div>
        <DataTable
          title="Categories"
          columns={columns}
          data={categories}
          pagination
          highlightOnHover
          striped
        />
      </div>
        </div>
      </div>
    </Layout>
  );
}
