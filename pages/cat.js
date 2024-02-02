import React from 'react';
import axios from 'axios';

import swal from 'sweetalert2';


export default function Cat(props) {
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
      selector: 'parent.name',
      sortable: true,
    },
    {
          Header: 'Action',
          accessor: 'actions',
          Cell: ({ row }) => (
            <div>
          <button onClick={() => editCategory(row)}>Edit</button>
          <button onClick={() => deleteCategory(row)}>Delete</button>
        </div>
      ),
    },
  ];

  const data = props.info;

  return (
    
      <div>
        
      </div>
   
  );
}
