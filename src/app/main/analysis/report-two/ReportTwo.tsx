import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
  GridToolbarContainer,
  GridPinnedColumnFields,
  GridRenderCellParams,
  useGridApiContext,
  DataGridProProps,
  useGridApiRef,
  gridFilteredDescendantCountLookupSelector,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import { GridRowModesModel, useGridSelector } from "@mui/x-data-grid";
import Button, { ButtonProps } from "@mui/material/Button";
import { columns } from "./ReportTwoColumn";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { sortData } from "../utils";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";

function CustomToolbar(props) {
  return (
    <div className="pb-4">
      <GridToolbarContainer>
        <GridToolbarFilterButton />

        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      /> */}
      </GridToolbarContainer>
    </div>
  );
}

export default function ReportTwoTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: ["_id"], // Pin the "Brand" column
    });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    []
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // function fillMissingMonths(data) {
  //   const allMonths = [
  //     "01",
  //     "02",
  //     "03",
  //     "04",
  //     "05",
  //     "06",
  //     "07",
  //     "08",
  //     "09",
  //     "10",
  //     "11",
  //     "12",
  //   ];
  //   const year = new Date().getFullYear();

  //   data.forEach((item) => {
  //     const existingMonths = item.monthlyData.map((entry) =>
  //       entry.month.slice(-2)
  //     );

  //     allMonths.forEach((month) => {
  //       const fullMonth = `${year}-${month}`;
  //       if (!existingMonths.includes(month)) {
  //         item.monthlyData.push({
  //           month: fullMonth,
  //           profit: 0,
  //           profit_percentage: 0,
  //           cost: 0,
  //           amount_sold: 0,
  //         });
  //       }
  //     });

  //     item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  //     let data = {
  //       profit: 0,
  //       profit_percentage: 0,
  //       cost: 0,
  //       amount_sold: 0,
  //       month: "2024-13",
  //     };
  //     item.monthlyData.forEach((item) => {
  //       data.profit += item.profit;
  //       data.cost += item.cost;
  //       data.amount_sold += item.amount_sold;
  //     });

  //     item.monthlyData.push({
  //       ...data,
  //       profit_percentage: parseFloat(
  //         (data.profit / data.amount_sold) * 100
  //       ).toFixed(2),
  //     });
  //   });

  //   return data;
  // }

  // const adjust = (data) => {
  //   const monthlySums = {};

  //   const months = [
  //     "2024-01",
  //     "2024-02",
  //     "2024-03",
  //     "2024-04",
  //     "2024-05",
  //     "2024-06",
  //     "2024-07",
  //     "2024-08",
  //     "2024-09",
  //     "2024-10",
  //     "2024-11",
  //     "2024-12",
  //     "2024-13",
  //   ];
  //   months.forEach((month) => {
  //     monthlySums[month] = {
  //       profit: 0,
  //       profit_percentage: 0,
  //       cost: 0,
  //       amount_sold: 0,
  //     };
  //   });

  //   data.forEach((brand) => {
  //     brand.monthlyData.forEach((monthlyData) => {
  //       const month = monthlyData.month;
  //       if (monthlyData.profit !== 0) {
  //         monthlySums[month].profit += monthlyData.profit;
  //       }
  //       if (monthlyData.profit_percentage !== 0) {
  //         monthlySums[month].profit_percentage += monthlyData.profit_percentage;
  //       }
  //       if (monthlyData.cost !== 0) {
  //         monthlySums[month].cost += monthlyData.cost;
  //       }
  //       if (monthlyData.amount_sold !== 0) {
  //         monthlySums[month].amount_sold += monthlyData.amount_sold;
  //       }
  //     });
  //   });
  //   const monthlyAverages = months.map((month) => {
  //     return {
  //       month,
  //       profit: monthlySums[month].profit,
  //       profit_percentage:
  //         monthlySums[month].profit && monthlySums[month].amount_sold
  //           ? parseFloat(
  //               (monthlySums[month].profit / monthlySums[month].amount_sold) *
  //                 100
  //             ).toFixed(2)
  //           : 0,
  //       cost: monthlySums[month].cost,
  //       amount_sold: monthlySums[month].amount_sold,
  //     };
  //   });

  //   const result = {
  //     _id: "Total",
  //     monthlyData: monthlyAverages,
  //   };

  //   return [...data, result];
  // };

  function fillMissingMonths(data) {
    const allMonths = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    const year = props?.selectYear; // Get current year dynamically

    data.forEach((item) => {
      const existingMonths = item.monthlyData.map((entry) =>
        entry.month.slice(-2)
      );

      allMonths.forEach((month) => {
        const fullMonth = `${year}-${month}`;
        if (!existingMonths.includes(month)) {
          item.monthlyData.push({
            month: fullMonth,
            profit: 0,
            profit_percentage: 0,
            cost: 0,
            amount_sold: 0,
          });
        }
      });

      item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));

      let data = {
        profit: 0,
        profit_percentage: 0,
        cost: 0,
        amount_sold: 0,
        month: `${year}-13`, // Dynamically calculate the "13th month"
      };

      item.monthlyData.forEach((item) => {
        data.profit += item.profit;
        data.cost += item.cost;
        data.amount_sold += item.amount_sold;
      });

      item.monthlyData.push({
        ...data,
        profit_percentage:
          data?.amount_sold !== 0
            ? parseFloat((data.profit / data.cost) * 100).toFixed(2)
            : "0",
      });
    });

    return data;
  }

  const adjust = (data) => {
    const year = props?.selectYear; // Get current year dynamically

    const monthlySums = {};
    const months = Array.from({ length: 13 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return `${year}-${month}`; // Dynamically create months for the current year
    });

    months.forEach((month) => {
      monthlySums[month] = {
        profit: 0,
        profit_percentage: 0,
        cost: 0,
        amount_sold: 0,
      };
    });

    data.forEach((brand) => {
      brand.monthlyData.forEach((monthlyData) => {
        const month = monthlyData.month;
        if (monthlyData.profit !== 0) {
          monthlySums[month].profit += monthlyData.profit;
        }
        if (monthlyData.profit_percentage !== 0) {
          monthlySums[month].profit_percentage += monthlyData.profit_percentage;
        }
        if (monthlyData.cost !== 0) {
          monthlySums[month].cost += monthlyData.cost;
        }
        if (monthlyData.amount_sold !== 0) {
          monthlySums[month].amount_sold += monthlyData.amount_sold;
        }
      });
    });

    const monthlyAverages = months.map((month) => {
      return {
        month,
        profit: monthlySums[month].profit,
        profit_percentage:
          monthlySums[month].profit && monthlySums[month].amount_sold
            ? parseFloat(
                (monthlySums[month].profit / monthlySums[month].cost) * 100
              ).toFixed(2)
            : 0,
        cost: monthlySums[month].cost,
        amount_sold: monthlySums[month].amount_sold,
      };
    });

    const result = {
      _id: "Total",
      monthlyData: monthlyAverages,
    };

    return [...data, result];
  };

  const createdata = (data) => {
    const newdata = data.results.map((item) => ({
      ...item,
      hierarchy: [item.hierarchy[0], monthNames[item.hierarchy[1] - 1]],
      month: monthNames[item.month - 1],
    }));
    const brands = {};

    newdata.forEach((record) => {
      const brand = record.brand;
      const month = record.hierarchy[1];

      if (!brands[brand]) {
        brands[brand] = {
          _id: brand,
          monthlyData: [],
        };
      }

      brands[brand].monthlyData.push({
        month: `${record.year}-${String(record._id.month).padStart(2, "0")}`,
        profit: record.profit,
        cost: record.cost,
        profit_percentage: record.profit_percentage,
        amount_sold: record.amount_sold,
      });
    });

    const result = [
      ...sortData(adjust(fillMissingMonths(Object.values(brands))), "_id"),
    ].map((item, i) => ({ ...item, id: i }));
    return result;
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          userActiveRole === "MLA"
            ? `https://api-dev.mlawatches.com/api/admin/stock/stockReportTwo?year=${props?.selectYear}`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/stockReportTwo?year=${props?.selectYear}`,
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
          setRows(createdata(data));
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
  }, [props.isChangeTab, props?.selectYear, userActiveRole]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  function CustomGridTreeDataGroupingCell(props: GridRenderCellParams) {
    const { id, field, rowNode } = props;

    const apiRef = useGridApiContext();
    const filteredDescendantCountLookup = useGridSelector(
      apiRef,
      gridFilteredDescendantCountLookupSelector
    );
    const filteredDescendantCount =
      filteredDescendantCountLookup[rowNode.id] ?? 0;
    const handleClick: ButtonProps["onClick"] = (event) => {
      if (rowNode.type !== "group") {
        return;
      }

      apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
      apiRef.current.setCellFocus(id, field);
      event.stopPropagation();
    };

    return (
      <Box
        className="flex items-center justify-center"
        sx={{ width: "100%", height: "100%", ml: rowNode.depth * 4 }}
      >
        <div>
          {filteredDescendantCount > 0 ? (
            <Button
              className="w-full h-full hover:bg-transparent"
              onClick={handleClick}
              tabIndex={-1}
              size="large"
            >
              <FuseSvgIcon className="text-48" size={22} color="action">
                {rowNode?.childrenExpanded
                  ? "heroicons-solid:chevron-down"
                  : "heroicons-solid:chevron-right"}
              </FuseSvgIcon>
              {rowNode?.groupingKey}
            </Button>
          ) : (
            <span />
          )}
        </div>
      </Box>
    );
  }

  const groupingColDef: DataGridProProps["groupingColDef"] = {
    headerName: "Brand",
    filterable: false,
    hideSortIcons: false,
    pinnable: false,
    resizable: false,
    sortable: false,
    headerAlign: "center",
    align: "end",
    renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
  };
  const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) =>
    row.hierarchy;

  const getCellClassName = (params: any) => {
    if (params?.id == rows[rows?.length - 1]?.id) {
      return "last-column";
    }
  };

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
    <Box sx={{ width: "100%", marginBottom: "30px" }} ref={gridRef}>
      <DataGridPro
        rows={rows}
        loading={loading}
        apiRef={gridApiRef}
        columns={columns}
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        getCellClassName={getCellClassName}
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
            padding: "0px",
          },
          "& .MuiDataGrid-row:last-child ": {
            borderBottom: "1px solid lightgray",
          },
          "& .last-column": {
            fontWeight: 600,
            background: "rgb(192, 216, 193)",
            borderBottom: "1px solid #fff",
          },
        }}
        checkboxSelection={false}
        disableColumnMenu
      />
    </Box>
  );
}
