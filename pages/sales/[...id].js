import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Layout from "@/components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SaleProduct() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState(null);
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      axios.get(`/api/sales?id=${id}`).then((response) => {
        setSales(response.data);
      });
    }
  }, [id]);

  const handleDownloadPDF = () => {
    setIsLoading(true); // Set loading state to true

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

  return (
    <Layout>
      <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-4/6">
        <div className="bg-grey-darker p-4 text-white">
          <h1 className="text-lg text-center">Sale</h1>
        </div>
        <div className="p-4">
        <div className="p-4" id="pdf-content">
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
          {sales?.esawa ? new Date(sales.esawa).toLocaleDateString() : ''}
          </div>
         
        </div>
        <button
            onClick={handleDownloadPDF}
            className="bg-green-400 rounded-md p-2 m-4 text-white w-1/5"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? "Generating PDF..." : "Download PDF"}
          </button>
          {isLoading && (
            <div className="loader">Loading...</div> // Add a loader element
          )}
      </div>
    
    </Layout>
  );
}
