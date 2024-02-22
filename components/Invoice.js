import React from "react";

export default function Invoice({ sales }) {
  console.log("Sales object:", sales);
  return (
    <div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
      <h1 className="font-bold text-2xl my-4 text-center text-blue-600">Baala</h1>
      <hr className="mb-2" />
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">Invoice</h2>
        <div className="text-gray-700">
          <div>Date: {new Date().toLocaleDateString()}</div>
          <div>Invoice No: <span className="font-bold text-red-600">{sales?._id.substring(0, 5)}</span> </div>
        </div>
      </div>
      <div className="mb-8">
        <div  className="text-lg font-bold mb-4">Sold by: 
        <span className="text-gray-700 mb-2">  {sales?.saler}</span></div >
       
      </div>
      <table className="w-full mb-8">
        <thead className="bg-prim p-2 text-center">
          <tr  className="py-4">
            <th className="text-left font-bold text-gray-100">Description</th>
            <th className="text-left font-bold text-gray-100">QTY</th>
            <th className="text-right font-bold text-gray-100">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sales && sales.line_items && sales.line_items.map((l, index) => (
            <tr key={index}>
              <td>{l.price_data?.product_data.name}</td>
              <td>{l.quantity}</td>
              <td>{l.price_data?.unit_amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-left font-bold text-gray-700">Total</td>
            <td className="text-right font-bold text-gray-700">Ugx {sales?.price}</td>
          </tr>
        </tfoot>
      </table>
      <div className="text-gray-700 mb-2">Thank you for your business!</div>
      <div className="text-gray-700 text-sm">Please remit payment within 30 days.</div>
    </div>
  );
};