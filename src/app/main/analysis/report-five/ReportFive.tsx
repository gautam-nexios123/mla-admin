import * as React from "react";
import Box from "@mui/material/Box";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { columns } from "./ReportFiveColumn";

export default function ReportFiveTable(props) {
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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
      const { month, brand, avrg_time_to_sell_watch } = current;
      const monthName = monthNames[month]; // Get month name from mapping

      // Check if brand already exists in accumulator
      let brandData = acc.find((item) => item.brand === brand);

      if (!brandData) {
        // If brand doesn't exist, create a new object for the brand
        brandData = {
          brand: brand,
          [monthName.toLowerCase()]: avrg_time_to_sell_watch, // Add current month's value
          months: 1, // Initialize count of months
          total: avrg_time_to_sell_watch, // Initialize total sum
        };
        acc.push(brandData);
      } else {
        // If brand exists, add current month's value to existing object
        brandData[monthName.toLowerCase()] = avrg_time_to_sell_watch;
        brandData.total += avrg_time_to_sell_watch;
        brandData.months++;
      }

      return acc;
    }, []);

    // Calculate average for each brand
    transformedData.forEach((item) => {
      item.avg = +parseFloat(item.total / item.months).toFixed(2);
      delete item.total;
      delete item.months;
    });

    const monthWiseAverage = {};
    let avg: number = 0;
    let count: number = 0;
    for (let month = 1; month <= 12; month++) {
      const monthName = monthNames[month].toLowerCase();
      const totalSum = transformedData.reduce((sum, item) => {
        return sum + (item[monthName] || 0);
      }, 0);
      const average = +parseFloat(
        (totalSum / transformedData.length).toFixed(2)
      );
      if (average) {
        count += 1;
        avg += average;
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
          `https://api-dev.mlawatches.com/api/admin/stock/stockReportFive?year=${props?.selectYear}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const totalSumOfTotalPieces = data.results.reduce((sum, item) => {
          return sum + item.totalPieces;
        }, 0);

        // Calculate average for each object and create a new key 'average'
        const transformedData = data.results.map((item) => ({
          totalPieces: item.totalPieces,
          from: item.from,
          to: item.to ?? "Oldest",
          avrg_time_to_sell_watch: item.avrg_time_to_sell_watch,
          average: `${parseFloat(((item.totalPieces / totalSumOfTotalPieces) * 100).toFixed(2))}%`,
        }));
        setRows(
          transformedData
            .map((item, i) => ({ ...item, id: i }))
            .sort((a, b) => a.from - b.from)
        );
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [props.isChangeTab, props?.selectYear]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ height: "95vh", width: "100%" }}>
      <DataGridPro
        rows={rows}
        loading={loading}
        apiRef={gridApiRef}
        columns={columns}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        disableColumnMenu
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
        }}
        checkboxSelection={false}
      />
    </Box>
  );
}
