import React, { useState, useEffect } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaCaretDown,
  FaCaretUp,
} from 'react-icons/fa';
import {RiseLoader} from "react-spinners";
export default function Table({ columns, data, title, showSearch, itemsPerPage = 5 }) {
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call or data loading
    setLoading(true);
    setTimeout(() => {
      setFilteredData(data);
      setLoading(false);
    }, 1000); // Adjust the timeout based on your data loading time
  }, [data]);

  useEffect(() => {
    // Function to filter data based on search term
    const filterData = () => {
      const filtered = data.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    };

    // Debounce the filter function
    const debounceFilter = setTimeout(filterData, 300);

    return () => clearTimeout(debounceFilter); // Cleanup on component unmount or re-render
  }, [searchTerm, data]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
  };

  const sortData = (key, direction) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredData(sortedData);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSkipToFirst = () => {
    setCurrentPage(1);
  };

  const handleSkipToLast = () => {
    const lastPage = Math.ceil(filteredData.length / itemsPerPage);
    setCurrentPage(lastPage);
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {columns.map((column) => (
          <th key={column.name} className={`px-6 py-3 ${column.headerClassName || ''}`}>
            <div className="flex items-center" onClick={() => column.sortable && handleSort(column.selector)}>
              {column.name}
              {column.sortable && (
                <span className="ml-2">
                  {sortConfig.key === column.selector &&
                    (sortConfig.direction === 'ascending' ? <FaCaretUp size="20px" /> : <FaCaretDown size="20px" />)}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={columns.length} className="text-center py-4">
         <div className=" place-content-center "></div> <RiseLoader color="#3182CE" size={5}/>
          </td>
        </tr>
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    return currentItems.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columns.map((column, colIndex) => (
          <td
            className={`p-2 whitespace-wrap my-2 ${column.cellClassName || ''} ${
              column.conditionalClasses ? column.conditionalClasses(row) : ''
            }`}
            key={colIndex}
          >
            {column.cell ? column.cell(row) : row[column.selector]}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div>
      {title && <h2 className="text-xl text-center font-bold dark:text-white">{title}</h2>}

      {showSearch && (
        <div className="pb-4 m-2 w-full bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <table className="items-center w-full border-collapse">
        <thead className="text-xs text-gray-700  bg-prim dark:text-gray-400">{renderTableHeader()}</thead>
        <tbody>{renderTableBody()}</tbody>
      </table>

      <div className="flex p-2 place-content-center">
        <button
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={handleSkipToFirst}
          disabled={currentPage === 1}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        <span
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {currentPage}
        </span>
        <button
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= filteredData.length}
        >
          <FaAngleRight />
        </button>
        <button
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={handleSkipToLast}
          disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
}