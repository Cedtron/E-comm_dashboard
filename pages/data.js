import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs"; 
import Layout from '@/components/Layout'
import React from 'react'
import { ReactSortable } from 'react-sortablejs'

export default function Data() {


                                                                                                                                                                                                                                                                                                                                                      
  return (
    <Layout>
         <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">
        <div className="p-4">
<form>
<label>
          Add excel file
        </label>
        <div className="mb-2 flex flex-wrap gap-1">
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
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <BsFillFileEarmarkSpreadsheetFill />
            <div>
              Add File
            </div>
            <input type="file" onChange={uploadfiles} className="hidden"/>
          </label>
        </div>


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
