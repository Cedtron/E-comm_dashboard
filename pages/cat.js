import React from 'react'
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
export default function Cat(props) {
 
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
    
      const data = props.info;
    
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data }, useFilters, useSortBy, usePagination);
    return (
    <div>
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
  )
}

