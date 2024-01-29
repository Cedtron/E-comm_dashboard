import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Layout from "@/components/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Invoice from "@/components/Invoice";

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
    setIsLoading(true);

    const content = document.getElementById("pdf-content");

    if (content) {
      const pdf = new jsPDF();

      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 210);
        pdf.save("sales_report.pdf");
        setIsLoading(false);
      });
    } else {
      enqueueSnackbar("PDF content not found.", { variant: "error" });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
     
      <Invoice sales={sales} />

      <button
        onClick={handleDownloadPDF}
        className="bg-green-400 rounded-md p-2 m-4 text-white w-1/5"
        disabled={isLoading}
      >
        {isLoading ? "Generating PDF..." : "Download PDF"}
      </button>
      {isLoading && (
        <div className="loader">Loading...</div>
      )}
    </Layout>
  );
}