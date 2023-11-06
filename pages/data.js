import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import Layout from '@/components/Layout'
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

export default function Data() {
  const [selectedSchema, setSelectedSchema] = useState(''); // State to store the selected schema
  const [files, setFiles] = useState([]); // State to store uploaded files

  const handleSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
  };

  const uploadfiles = (e) => {
    // Handle file upload and data insertion into the selected schema here
    // You may need to use a library like 'xlsx' to process Excel files
    const file = e.target.files[0];
    if (file) {
      // Process the Excel file data (e.g., using 'xlsx' library)
      // Insert the data into the selected MongoDB schema (replace with your MongoDB code)
      if (selectedSchema) {
        console.log(`Uploading file to schema: ${selectedSchema}`);
        // Insert your MongoDB insertion logic here
      } else {
        console.log("No schema selected. Please select a schema.");
      }
    }
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
          <form>
            <label>
              Add excel file
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
              {/* Select input for data schema */}
              <select onChange={handleSchemaChange} value={selectedSchema}>
                <option value="">Select Schema</option>
                {/* Fetch and map your MongoDB schema names as options here */}
                <option value="schema1">Schema 1</option>
                <option value="schema2">Schema 2</option>
                {/* Add more options for other schemas */}
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
  </Layout>
)

}