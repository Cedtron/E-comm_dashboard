import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Layout from "@/components/Layout";
import { html2pdf } from "html2pdf.js";

export default function SaleProduct() {
  const router = useRouter();
  const { data: session } = useSession();
  const [sales, setSales] = useState(null); // Initialize sales state with null
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar(); // Destructure enqueueSnackbar for displaying messages

  useEffect(() => {
    if (id) {
      axios.get(`/api/sales?id=${id}`).then((response) => {
        setSales(response.data); // Store the response data
      });
    }
  }, [id]);

  const handleDownloadPDF = () => {
    const content = document.getElementById("pdf-content"); // ID of the content you want to capture

    if (content) {
      const pdfOptions = {
        margin: 10,
        filename: "sales_report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(content).set(pdfOptions).save(); // Generate and save PDF
    } else {
      enqueueSnackbar("PDF content not found.", { variant: "error" });
    }
  };

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-4/6">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-lg text-center">Sale</h1>
        </div>
        <div className="p-4" id="pdf-content">
        <div className="p-4">
          <h4> Items sold</h4>
          <table className="table text-grey-darkest">
            <thead className="bg-grey-dark text-white text-normal">
              <tr>
                <th scope="col">Products</th>
                <th scope="col">Qty</th>
                <th scope="col">Price</th>
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
          </table>
          <h4> Sold by: </h4>
          {sales?.saler}
          <h4> Total:</h4>
          {sales?.price}
          <h4>Date:</h4>
          {sales?.esawa.toLocaleDateString()
          }
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-400 rounded-md p-2 text-white w-1/5"
          >
            Download PDF
          </button>
        </div>
      </div>
    
    </Layout>
  );
}
