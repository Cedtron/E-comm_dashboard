import React from "react";

const Invoice = ({ sales }) => {
  return (
    <div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
      <h1 className="font-bold text-2xl my-4 text-center text-blue-600">KRP Services</h1>
      <hr className="mb-2" />
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">Invoice</h2>
        <div className="text-gray-700">
          <div>Date: {new Date().toLocaleDateString()}</div>
          <div>Invoice #: <div className="font-bold text-red-600">{sales?._id?.$oid.substring(0, 5)}</div> </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Sold by:</h3>
        <div className="text-gray-700 mb-2">{sales?.saler}</div>
        <div className="text-gray-700 mb-2">Date of sale: {sales?.esawa ? new Date(sales.esawa).toLocaleDateString() : ''}</div>
      </div>
      <table className="w-full mb-8">
        <thead>
          <tr>
            <th className="text-left font-bold text-gray-700">Description</th>
            <th className="text-left font-bold text-gray-700">QTY</th>
            <th className="text-right font-bold text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sales?.line_items.map((l, index) => (
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

export default Invoice;