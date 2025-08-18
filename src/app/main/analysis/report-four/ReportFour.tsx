import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
  GridPinnedColumnFields,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import { columns } from "./ReportFourColumn";
import { sortData } from "../utils";
import { useSnackbar } from "notistack";

export default function ReportFourTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: ["brand"], // Pin the "Brand" column
    });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    []
  );

  const monthNames = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  // Use reduce to create an array of objects grouped by brand and month values
  const transformedDataFn = (inputData) => {
    const transformedData = inputData.reduce((acc, current) => {
      const { month, brand, avrg_time_to_sell_watch, time_to_sell, count } =
        current;
      const monthName = monthNames[month]; // Get month name from mapping

      // Check if brand already exists in accumulator
      let brandData = acc.find((item) => item.brand === brand);

      if (!brandData) {
        // If brand doesn't exist, create a new object for the brand
        brandData = {
          brand: brand,
          [monthName.toLowerCase()]: avrg_time_to_sell_watch, // Add current month's value
          months: 1, // Initialize count of months
          total: time_to_sell, // Initialize total sum
          count: count, // Initialize count sum
        };
        acc.push(brandData);
      } else {
        // If brand exists, add current month's value to existing object
        brandData[monthName.toLowerCase()] = avrg_time_to_sell_watch;
        brandData.total += time_to_sell;
        brandData.count += count;
        brandData.months++;
      }

      return acc;
    }, []);

    // Calculate average for each brand
    transformedData.forEach((item) => {
      item.avg = +parseFloat(item.total / item.count).toFixed(2);
      delete item.total;
      delete item.months;
    });

    const monthWiseAverage = {};
    let avg: number = 0;
    let count: number = 0;
    for (let month = 1; month <= 12; month++) {
      const monthName = monthNames[month].toLowerCase();
      // const totalSum = transformedData.reduce((sum, item) => {
      //   return sum + (item[monthName] || 0);
      // }, 0);
      // const average = +parseFloat(
      //   (totalSum / transformedData.length).toFixed(2)
      // );
      const totalSum = inputData.reduce((sum, item) => {
        return sum + ((item.month === month && item.time_to_sell) || 0);
      }, 0);

      const count_time_to_sell = inputData.reduce((sum, item) => {
        return sum + ((item.month === month && item.count) || 0);
      }, 0);

      const average = +parseFloat((totalSum / count_time_to_sell).toFixed(2));
      if (average) {
        count += count_time_to_sell;
        avg += totalSum;
        monthWiseAverage[monthName] = average;
      }
      if (month === 12) {
        monthWiseAverage["avg"] = parseFloat(avg / count).toFixed(2);
      }
    }

    // Add the month-wise average object to transformedData
    transformedData.push({
      brand: "Average",
      ...monthWiseAverage,
    });

    return transformedData;
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api-dev.mlawatches.com/api/admin/stock/stockReportFour?year=${props?.selectYear}`,
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
          setRows(
            sortData(transformedDataFn(data.results), "brand").map(
              (item, i) => ({
                ...item,
                id: i,
              })
            )
          );
          // setRows(data.results);
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
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [props.isChangeTab, props?.selectYear]);

  const getCellClassName = (params: any) => {
    if (params?.id == rows[rows?.length - 1]?.id) {
      return "last-column";
    }
  };

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
    <Box sx={{ height: "95vh", width: "100%" }} ref={gridRef}>
      <DataGridPro
        rows={rows}
        loading={loading}
        apiRef={gridApiRef}
        columns={columns}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        getCellClassName={getCellClassName}
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
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
          "& .last-column": {
            fontWeight: 600,
            background: "rgb(192, 216, 193)",
            border: "1px solid #e2e8f0",
          },
        }}
        disableColumnMenu
        checkboxSelection={false}
      />
    </Box>
  );
}
