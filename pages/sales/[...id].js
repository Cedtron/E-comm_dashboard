import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "@/components/Layout";
import Invoice from "@/components/Invoice";
import { PDFDownloadLink } from "@react-pdf-viewer/react-to-pdf";

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

  return (
    <Layout>
      <div id="pdf-content">
        <Invoice sales={sales} />
      </div>

      {/* React-to-PDF Download Link */}
      <PDFDownloadLink document={<Invoice sales={sales} />} fileName="sales_report.pdf">
        {({ loading }) => (
          <button className="bg-green-400 rounded-md p-2 m-4 text-white w-1/5" disabled={loading}>
            {loading ? "Generating PDF..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>

      {/* Additional content */}
    </Layout>
  );
}