import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Table from "@/components/table";
import Link from 'next/link';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from "@/components/Layout";

const schema = yup.object().shape({
  expcategory: yup.string().required("Expenditure category is required"),
  amount: yup.number().required("Amount is required").positive("Amount must be positive"),
  date: yup.date().required("Date is required"),
  description: yup.string().required("Description is required"),
});

export default function Expend({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [expend, setExpend] = useState([]);
  const [catexpend, setCatexpend] = useState([]);
  const { handleSubmit, control, reset, setValue, formState } = useForm({
    resolver: yupResolver(schema),
  });
  
  const { errors, isSubmitting } = formState;
  useEffect(() => {
    fetchExpend();
    fetchCatexpend();
  }, []);

  function fetchExpend() {
    axios.get("/api/expend").then((result) => {
      setExpend(result.data);
    });
  }

  function fetchCatexpend() {
    axios.get("/api/catexpend").then((result) => {
      setCatexpend(result.data);
    });
  }

  const columns = [
    {
      name: " Category",
      selector: "expcategory",
      sortable: true,
    }, 
    {
      name: " Description",
      selector: "description",
      sortable: true,
    },
   
    {
      name: " Amount",
      selector: "amount",
      sortable: true,
    },
    {
      name: " Date",
      selector: "date",
      sortable: true,
      cell: (row) => {
        const date = new Date(row.date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() => editCategory(row)}
            className="shadow m-2 bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => deleteCategory(row)}
            className="shadow m-2 bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            <RiDeleteBin5Fill /> Delete
          </button>
        </div>
      ),
    },
  ];

  const saveCategory = async (data) => {
    try {
      formState.isSubmitting && formState.isSubmitting(true);

      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/expend", data);
        setEditedCategory(null);
      } else {
        await axios.post("/api/expend", data);
      }

      reset(); // Reset the form after submission
      fetchExpend();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      formState.isSubmitting && formState.isSubmitting(false);
    }
  };

  function editCategory(category) {
    setEditedCategory(category);
    setValue("expcategory", category.expcategory);
    setValue("amount", category.amount);
    setValue("date", category.date.substring(0, 10)); 
    setValue("description", category.description);
    // Set values for other fields as needed
  }

  function deleteCategory(category) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/expend?_id=" + _id);
        fetchExpend();
      }
    });
  }

  const dailyTotal = expend.reduce(
    (total, entry) => total + (entry.amount ? entry.amount : 0),
    0
  );
  
  const weeklyTotal = expend.reduce(
    (total, entry) => total + (entry.amount ? entry.amount : 0),
    0
  );

  const onCancel = () => {
    setEditedCategory(null);
    reset(); 
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-base font-semibold leading-7 text-gray-50">
            Categories
          </h1>
        </div>

        <div className="flex flex-1 py-2 place-content-center flex-col md:flex-row lg:flex-row mx-2">
          <div className="shadow-lg bg-green-400 border-l-8 rounded-md hover:bg-green-500 border-green-500 mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
              {dailyTotal}
              </a>
              <a href="#" className="no-underline text-white text-lg">
              Daily Total
              </a>
            </div>
          </div>

          <div className="shadow-lg bg-green-400 border-l-8 rounded-md hover:bg-green-500 border-green-500 mb-2 p-2 md:w-1/4 mx-2">
            <div className="p-4 flex flex-col">
              <a href="#" className="no-underline text-white text-2xl">
              {weeklyTotal}
              </a>
              <a href="#" className="no-underline text-white text-lg">
              Weekly Total
              </a>
            </div>
          </div>

          </div>

          <Link
            className="shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
            href={'/catexpend'}
          >
            Add new Expend category
          </Link>

        <div className="mx-auto p-4">
          <form onSubmit={handleSubmit(saveCategory)}>
          <div className="flex gap-1">
          <Controller
          name="expcategory"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <select
                className="block w-64 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                {...field}
                disabled={editedCategory !== null}
              >
                <option value="">Expenditure category</option>
                {catexpend.length > 0 &&
                  catexpend.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <p className="text-red-500 font-semibold">{errors.expcategory?.message}</p>
            </div>
          )}
        />
  <Controller
    name="amount"
    control={control}
    render={({ field, fieldState }) => (
      <div>
      <input
        {...field}
        className="block w-64 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Amount"
      /> 
        <p className="text-red-500 font-semibold">{errors. amount?.message}</p>
      </div>
    )}
  />
   
  <Controller
    name="date"
    control={control}
    render={({ field, fieldState }) => (
      <div>
      <input
        {...field}
        className="block w-64 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="date"
        placeholder="Date"
      />
       <p className="text-red-500 font-semibold">{errors. date?.message}</p>
      </div>
    )}
  />
   
  <Controller
    name="description"
    control={control}
    render={({ field, fieldState }) => (
      <div>
      <input
        {...field}
        className="block w-64 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Description"
      />
     <p className="text-red-500 font-semibold">{errors. description?.message}</p>  
      </div>
    )}
  />
  
</div>

<div className="flex gap-1 mt-2">
            {editedCategory && (
              <button
                type="button"
                onClick={onCancel} 
                className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            )}
           <button
          type="submit"
          className={`shadow bg-blue-600 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
          </div>
          </form>

         

       <Table columns={columns}  data={expend}  title="Expenditure" showSearch={true} itemsPerPage={10} />
  

        </div>
      </div>
    </Layout>
  );
}