import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Table from "@/components/table";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import * as yup from "yup";
import Layout from "@/components/Layout";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  // Add validation for other fields as needed
});

export default function Expend({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [expend, setExpend] = useState([]);
  const [catexpend, setCatexpend] = useState([]);
  const { handleSubmit, control, reset, setValue, formState } = useForm({
    resolver: yup.resolver(schema),
  });

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
      name: " Description",
      selector: "description",
      sortable: true,
    },
    {
      name: " Category",
      selector: "category",
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

  async function saveCategory(data) {
    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/expend", data);
        setEditedCategory(null);
      } else {
        await axios.post("/api/expend", data);
      }

      reset();
      fetchExpend();
    } catch (error) {
      // Handle error
      console.error("Error saving category:", error);
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setValue("name", category.name);
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

  // Calculate daily and weekly totals
  const dailyTotal = expend.reduce(
    (total, entry) =>
      total +
      // ( ? entry.amount : 0),
    0
  );

  const weeklyTotal = expend.reduce(
    (total, entry) =>
      total +
      // ( ? entry.amount : 0),
    0
  );

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-base font-semibold leading-7 text-gray-50">
            Categories
          </h1>
        </div>
        <div className="mx-auto p-4">
          <form onSubmit={handleSubmit(saveCategory)}>
          <div className="flex gap-1">
  <Controller
    name="name"
    control={control}
    render={({ field, fieldState }) => (
      <input
        {...field}
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Description"
      />
    )}
  />
  <Controller
    name="amount"
    control={control}
    render={({ field, fieldState }) => (
      <input
        {...field}
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Amount"
      />
    )}
  />
  <Controller
    name="date"
    control={control}
    render={({ field, fieldState }) => (
      <input
        {...field}
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Date"
      />
    )}
  />
  <Controller
    name="description"
    control={control}
    render={({ field, fieldState }) => (
      <input
        {...field}
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        placeholder="Description"
      />
    )}
  />
</div>
            <div className="mb-2">
              {/* Additional input fields for amount, date, description go here */}
            </div>
            <div className="flex gap-1">
              {editedCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(null);
                    reset();
                  }}
                  className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
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

          <div className="mb-4">
            <p>Daily Total: {dailyTotal}</p>
            <p>Weekly Total: {weeklyTotal}</p>
          </div>


       <Table columns={columns}  data={expend}  title="Categories" showSearch={true} itemsPerPage={10} />
  

        </div>
      </div>
    </Layout>
  );
}