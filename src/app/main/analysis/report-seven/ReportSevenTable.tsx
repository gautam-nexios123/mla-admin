import Box from "@mui/material/Box";
import {
  GridRowModes,
  GridRowModesModel,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  DataGridPro,
  GridPinnedColumnFields,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectUserRole } from "src/app/auth/user/store/userSlice";
import { stockIdMaster } from "src/utils/stockMaster";
import { columnsNew } from "./ReportSevenColumn";

function CustomToolbar(props: any) {
  const { rowsNew, setRowsNew, setRowModesModel } = props;
  const userRole = useSelector(selectUserRole);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  return (
    <div className="pb-4">
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
          className="table-global-filter"
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "outlined" },
          }}
        />
      </GridToolbarContainer>
    </div>
  );
}

const ReportSevenTable = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [rowsNew, setRowsNew] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: [
        "status",
        "ny_la",
        "imageUrl",
        "id",
        "avgDaysDifference",
        "brand",
        "model",
      ],
    });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    []
  );

  React.useEffect(() => {
    async function fetchDataNew() {
      try {
        const response = await fetch(
          `https://api-dev.mlawatches.com/api/admin/stock/stockReportSeven?year=${props?.selectYear}`,
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
          setRowsNew(data?.results);
          setLoading(false);
        } else if (data.statusCode == 403) {
          enqueueSnackbar(
            "Unauthorized access. You don't have permission to view or edit this content.",
            { variant: "error" }
          );
        } else {
          enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        }
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchDataNew();
    // if (props.isChangeTab != 3) {
    //   setRowsNew([]);
    // }
  }, [props.isChangeTab, props?.selectYear]);

  if (error) {
    return <div>Error: {error}</div>;
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
    <Box sx={{ height: "95vh", width: "100%", display: "flex" }} ref={gridRef}>
      <DataGridPro
        rows={rowsNew}
        loading={loading}
        columns={columnsNew}
        // stickyHeader
        pagination={false}
        hideFooter
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
        // getRowHeight={() => "auto"}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: { rowsNew, setRowsNew, setRowModesModel },
        }}
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
        checkboxSelection={false}
      />
    </Box>
  );
};

export default ReportSevenTable;
