import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "@/components/Layout";
import Invoice from "@/components/Invoice";
import { jsPDF } from "jspdf";

export default function SaleProduct() {
  const router = useRouter();
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
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF();

      // Get the content of the PDF from the Invoice component
      const content = document.getElementById("pdf-content");

      if (content) {
        pdf.html(content, {
          callback: () => {
            // Save the PDF with a specific filename
            pdf.save("sales_report.pdf");
          }
        });
      } else {
        enqueueSnackbar("PDF content not found.", { variant: "error" });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      enqueueSnackbar("Error generating PDF", { variant: "error" });
    }
  };

  return (
    <Layout>
      <div id="pdf-content">
        <Invoice sales={sales} />
      </div>

      {/* Download PDF button */}
      <button
        onClick={handleDownloadPDF}
        className="bg-green-400 rounded-md p-2 m-4 text-white w-1/5"
      >
        Download PDF
      </button>
    </Layout>
  );
}