import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "@/components/Layout";
import Invoice from "@/components/Invoice";
import html2pdf from "html2pdf.js";

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
      if (!sales) {
        enqueueSnackbar("Sales data not found.", { variant: "error" });
        return;
      }

      const content = document.getElementById("pdf-content");

      if (content) {
        html2pdf().from(content).save("sales_report.pdf");
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