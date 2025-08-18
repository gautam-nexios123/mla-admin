import * as React from "react";
import Box from "@mui/material/Box";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { columns } from "./ReportSixColumn";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";

export default function ReportSixTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const userCompanyWiseColumn = React.useMemo(() => {
    if (userActiveRole === "ML") {
      return columns
        ?.filter(
          (item) => item?.field !== "net_cost_usd" && item?.field !== "loss"
        )
        .map((item) =>
          item.field === "wholesale_price_usd"
            ? {
                ...item,
                field: "wholesale_price_usd",
                headerName: "Cost",
                renderHeader: () => (
                  <div className="font-600 text-center">Cost</div>
                ),
              }
            : item
        );
    }
    return columns;
  }, [columns, userActiveRole]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          userActiveRole === "MLA"
            ? `https://api-dev.mlawatches.com/api/admin/stock/stockReportSix?year=${props?.selectYear}`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/stockReportSix?year=${props?.selectYear}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.statusCode == 200) {
          setRows(data.results.map((item, i) => ({ ...item, id: i })));
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
        setError("Error fetching data");
        setLoading(false);
      }
    }
    fetchData();
  }, [props.isChangeTab, props?.selectYear, userActiveRole]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalRow = rows.find((row) => row.stockId === "TOTAL");
  const rowsWithoutTotal = rows.filter((row) => row.stockId !== "TOTAL");

  if (totalRow && !totalRow.id) {
    totalRow.id = "total-row";
  }

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
    <Box sx={{ height: "95vh", width: "100%" }} ref={gridRef}>
      <DataGridPro
        // rows={rows}
        loading={loading}
        // apiRef={gridApiRef}
        rows={rowsWithoutTotal}
        pinnedRows={{ top: totalRow ? [totalRow] : [] }}
        getRowClassName={(params) =>
          params.row.stockId === "TOTAL" ? "pinned-total-row" : ""
        }
        getRowId={(row) => row.id}
        columns={userCompanyWiseColumn}
        getRowHeight={() => "auto"}
        // stickyHeader
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
            padding: "15px 0px",
          },
          "& .MuiDataGrid-row:last-child ": {
            borderBottom: "1px solid lightgray",
          },
          "& .MuiDataGrid-pinnedRow": {
            backgroundColor: "white !important",
          },

          "& .pinned-total-row": {
            backgroundColor: "white !important",
          },
        }}
        disableColumnMenu
        checkboxSelection={false}
      />
    </Box>
  );
}
