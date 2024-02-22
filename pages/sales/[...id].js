import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "@/components/Layout";
import Invoice from "@/components/Invoice";

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

  const handlePrint = () => {
    try {
      if (!sales) {
        enqueueSnackbar("Sales data not found.", { variant: "error" });
        return;
      }
  
      // Check if window is defined (client-side)
      if (typeof window !== 'undefined') {
        // Import print-js only on the client-side
        import('print-js').then((printJS) => {
          printJS.default({
            printable: 'pdf-content',
            type: 'html'
          });
        });
      }
    } catch (error) {
      console.error("Error printing:", error);
      enqueueSnackbar("Error printing", { variant: "error" });
    }
  };

  return (
    <Layout>
      <div id="pdf-content">
        <Invoice sales={sales} />
      </div>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="bg-green-400 rounded-md p-2 m-4 text-white w-1/5"
      >
        Print
      </button>
    </Layout>
  );
}