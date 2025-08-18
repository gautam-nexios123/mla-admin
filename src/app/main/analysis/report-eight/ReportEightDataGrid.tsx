import React, { useEffect, useState } from "react";
import ReportEightColumn from "./ReportEightColumn";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";

interface ReportEightDataGridProps {
  tabName: string;
}

const ReportEightDataGrid: React.FC<ReportEightDataGridProps> = ({
  tabName,
}) => {
  const session = localStorage.getItem(`jwt_access_token`);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const columns = ReportEightColumn();

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/stockReportEight?location=${tabName?._id}`,
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
        setData(
          data?.results?.all_stocks.map((stock: any) => ({
            ...stock,
            id: stock.stockId,
          }))
        );
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [tabName]);

  const gridRef = React.useRef(null);

  // Automatically focus the grid on mount

  React.useEffect(() => {
    const gridEl = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );

    const handleKeyDown = (e) => {
      if (!gridEl) return;

      const scrollAmount = 50; // px per arrow press
      switch (e.key) {
        case "ArrowUp":
          gridEl.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "ArrowDown":
          gridEl.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowLeft":
          gridEl.scrollLeft -= scrollAmount;
          e.preventDefault();
          break;
        case "ArrowRight":
          gridEl.scrollLeft += scrollAmount;
          e.preventDefault();
          break;
      }
    };

    gridEl?.addEventListener("keydown", handleKeyDown);
    return () => gridEl?.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box
      sx={{ height: "calc(100vh - 170px)", width: "100%", display: "flex" }}
      ref={gridRef}
    >
      <DataGridPro
        rows={data}
        columns={columns}
        loading={loading}
        pagination={false}
        hideFooter
        sx={{
          border: 1,
          borderColor: "lightgray",
          color: "black",
          scrollbarWidth: "auto",
          scrollbarColor: "black",
          "& .MuiDataGrid-columnHeaders": {
            borderTop: 0,
            borderRadius: 0,
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: 1,
            borderTop: 1,
            borderBottom: 0,
            borderRadius: 0,
            borderColor: "lightgray",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            borderColor: "lightgray",
            borderRight: 1,
            borderRightColor: "lightgray",
            borderTop: 1,
            borderTopColor: "lightgray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
        }}
      />
    </Box>
  );
};

export default ReportEightDataGrid;
