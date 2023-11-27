import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Layout from "@/components/Layout";

const OrderStatusTimeline = ({ status }) => {
  const timelineSteps = [
    "Order Placed",
    "Confirmed",
    "Shipped",
    "Ready for Pick",
    "Picked Up",
  ];

  return (
    <div className="flex items-center space-x-4">
      {timelineSteps.map((step, index) => (
        <div
          key={index}
          className={`text-sm ${
            index <= status ? "text-green-500" : "text-gray-400"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default function Orderview() {
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState(null);
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (id) {
      axios.get(`/api/orders?id=${id}`).then((response) => {
        setOrder(response.data);
        console.log(response.data);
      });
    }
  }, [id]);

  const handleDownloadPDF = () => {
    const content = document.getElementById("pdf-content");

    if (content) {
      const pdf = new jsPDF();

      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 210);
        pdf.save("sales_report.pdf");
        setIsLoading(false); // Set loading state to false after download
      });
    } else {
      enqueueSnackbar("PDF content not found.", { variant: "error" });
      setIsLoading(false); // Set loading state to false if content not found
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await axios.put(`/api/orders/${id}`, updatedOrder);
      setOrder(updatedOrder);
      enqueueSnackbar("Order status updated successfully.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      enqueueSnackbar("Failed to update order status.", { variant: "error" });
    }
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-4/6">
        <div className="p-4" id="pdf-content">
          <select
            onChange={(e) => handleStatusUpdate(Number(e.target.value))}
            value={order?.status || 0}
            className="mt-4 p-2 rounded-md border border-gray-300"
          >
            <option value={0}>Order Placed</option>
            <option value={1}>Confirmed</option>
            <option value={2}>Shipped</option>
            <option value={3}>Ready for Pick</option>
            <option value={4}>Picked Up</option>
          </select>

          <h4>Items sold</h4>
          <table className="table text-grey-darkest">
            <thead className="bg-grey-dark text-white text-normal">
              <tr>
                <th scope="col">Products</th>
                <th scope="col">Qty</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {order?.line_items?.map((l, index) => (
                <tr key={index}>
                  <td>{l.price_data?.product_data.name}</td>
                  <td>{l.quantity}</td>
                  <td>{l.price_data?.unit_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Name:</h4>
          {order?.saler}
          <h4>Order status</h4>
          <OrderStatusTimeline status={order?.status || 0} />
          <h4>Total:</h4>
          {order?.price}
          <h4>Date:</h4>
          {order?.esawa}

          <button
            onClick={handleDownloadPDF}
            className="bg-green-400 rounded-md p-2 text-white w-1/5 mt-4"
          >
            Download PDF
          </button>
        </div>
      </div>

    </Layout>
  );
}