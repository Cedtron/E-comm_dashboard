import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { useForm, Controller } from 'react-hook-form';
import Cat from './cat';

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { handleSubmit, control, setValue, reset, fields, append, remove } = useForm({
    defaultValues: {
      properties: [{ name: '', values: '' }],
    },
  });

  useEffect(() => {
    const result = axios.get('/api/categories');
    setCategories(result.data);
  }, []);

 

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
            {/* Form content */}
          </form>

          {/* React Table */}
       <Cat info= {categories] />
        </div>
      </div>
    </Layout>
  );
}
