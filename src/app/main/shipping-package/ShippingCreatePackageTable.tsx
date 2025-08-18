import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import ShippingCreateForm from "./ShippingCreateForm";
import ShipingPackageHistoryTable from "./ShipingPackageHistoryTable";
import { useEffect, useState } from "react";

export default function ShippingCreatePackageTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = localStorage.getItem(`jwt_access_token`);

  const getShippingPackageList = async () => {
    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/stock/getShippingPackageList",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.statusCode == 200) {
        setRows(data?.results || []);
        setLoading(false);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getShippingPackageList();
  }, []);

  return (
    <>
      <Box sx={{ height: "95vh", width: "100%", backgroundColor: "white" }}>
        <div className="flex flex-col justify-between items-center gap-6 p-10 sm:flex-row px-[20px]">
          <ShippingCreateForm getShippingPackageList={getShippingPackageList} />
        </div>

        <div>
          <ShipingPackageHistoryTable
            rows={rows}
            loading={loading}
            setLoading={setLoading}
            getShippingPackageList={getShippingPackageList}
          />
        </div>

      </Box>
    </>
  );
}
