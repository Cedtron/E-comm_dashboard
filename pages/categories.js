import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { useForm, Controller } from 'react-hook-form';

export default function Categories() {
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

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }

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

  function editCategory(category) {
    setEditedCategory(category);
    setValue('name', category.name);
    setValue('parentCategory', category.parent?._id);
    category.properties.forEach((property, index) => {
      setValue(`properties[${index}].name`, property.name);
      setValue(`properties[${index}].values`, property.values.join(','));
    });
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

  function addProperty() {
    append({ name: '', values: '' });
  }

  function removeProperty(index) {
    remove(index);
  }

  const columns = [
    {
      Header: 'Category name',
      accessor: 'name',
    },
    {
      Header: 'Parent category',
      accessor: 'parent.name',
    },
    {
      Header: 'Action',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => editCategory(row.original)}>Edit</button>
          <button onClick={() => deleteCategory(row.original)}>Delete</button>
        </div>
      ),
    },
  ];
  

  const data = categories;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination);

  

  
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
                className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
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



          <div className="flex flex-col">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table {...getTableProps()} className="mt-2 w-5/6">
          <thead className="bg-blue-500 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  key={row.id}
                  className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="whitespace-nowrap px-6 py-4">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </Layout>
  );
}
