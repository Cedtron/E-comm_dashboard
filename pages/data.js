import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import Layout from '@/components/Layout'
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import axios from "axios";
import Dataform from "@/components/dataform";

export default function Data() {
  const [selectedSchema, setSelectedSchema] = useState(''); 
  const [files, setFiles] = useState([]); 

  const handleSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
  };

  const uploadfiles = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('selectedSchema', selectedSchema);

      try {
        // Send the file and selected schema to the backend API
        await axios.post('/api/upload', formData);

        // Clear the file input after successful upload
        e.target.value = null;
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const updatefilesOrder = (newOrder) => {
    // Use the new order to update the files state
    setFiles(newOrder);
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
      <div class="grid grid-cols-2 gap-2">

      <div class="col-2 md:col-span-6">
        <div className="p-4">
          <h3>Data upload</h3>
          <form>
            <label>
              Add excel file
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
              {/* Select input for data schema */}
              <select onChange={handleSchemaChange} value={selectedSchema}>
                <option value="">Select Schema</option>
                {/* Fetch and map your MongoDB schema names as options here */}
                <option value="sales">Sales</option>
                <option value="products">Product</option>
                <option value="User">Users</option>
              </select>
            </div>
            <ReactSortable
              list={files}
              className="flex flex-wrap gap-1"
              setList={updatefilesOrder}>
              {!!files?.length && files.map(link => (
                <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-sm border border-gray-200">
                  <img src={link} alt="" className="w-1/4 rounded-lg"/>
                </div>
              ))}
            </ReactSortable>
            <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
              <BsFillFileEarmarkSpreadsheetFill />
              <div>
                Add File
              </div>
              <input type="file" onChange={uploadfiles} className="hidden"/>
            </label>

            <button
              type="submit"
              className="bg-blue-400 rounded-md p-2 text-white w-1/5">
              Upload
            </button>
          </form>
        </div>
        </div>

         <div className="col-2 md:col-span-6">
            <Dataform/>
         </div>



</div>
      </div>
    </Layout>
  );
}