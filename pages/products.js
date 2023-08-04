import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product image',
        accessor: 'image',
        Cell: ({ value }) => <img src={value} alt="" className='w-2/4  rounded-lg'/>,
      },
      { Header: 'Product name', accessor: 'title' },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Stock', accessor: 'stock' },
      { Header: 'Color', accessor: 'color' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Rating', accessor: 'rating' },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ({ value }) => (
          <div>
            <Link className="btn-default" href={`/products/edit/${value}`}>
              <FaEdit />
              Edit
            </Link>
            <Link className="btn-red" href={`/products/delete/${value}`}>
              <RiDeleteBin5Fill className="mx-auto text-red-600" />
              Delete
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return products.map((product) => ({
      ...product,
      image: product.images[0],
    }));
  }, [products]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useFilters,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/products/new'}
          >
            Add new product
          </Link>
          <div>
            <input
              type="text"
              placeholder="Search"
              value={state.globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table
                  id="table"
                  className="min-w-full text-left text-sm font-light"
                  {...getTableProps()}
                >
                  <thead className="border-b bg-blue-500 text-white font-medium dark:border-neutral-500">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())} className="p-2">
                            {column.render('Header')}
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
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

        <div className="flex justify-between p-4">
          <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>
            <button onClick={previousPage} disabled={!canPreviousPage}>
              {'<'}
            </button>
            <button onClick={nextPage} disabled={!canNextPage}>
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>
          </div>
          <div>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </div>
          <div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Layout>
  );
}
