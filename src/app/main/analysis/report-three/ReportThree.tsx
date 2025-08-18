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
import { columns } from "./ReportThreeColumn";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { sortData } from "../utils";
import { useSnackbar } from "notistack";

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

export default function ReportThreeTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

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
    // const year = new Date().getFullYear();
    const year = props?.selectYear;

    data.forEach((item) => {
      const existingMonths = item.monthlyData.map((entry) =>
        entry.month.slice(-2)
      );

      allMonths.forEach((month) => {
        const fullMonth = `${year}-${month}`;
        if (!existingMonths.includes(month)) {
          item.monthlyData.push({
            month: fullMonth,
            totalQuantity: 0,
            totalAmt: 0,
            quantityVariationPercentage: 0,
            amtVariationPercentage: 0,
          });
        }
      });

      item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
      // let data = {
      //   totalQuantity: 0,
      //   totalAmt: 0,
      //   quantityVariationPercentage: 0,
      //   amtVariationPercentage: 0,
      //   month: `${year}-12`,
      // };

      // item.monthlyData.push({...data})
    });
    return data;
  }
  const adjust = (data) => {
    const year = props?.selectYear;
    const monthlySums: any = {};
    const monthlyCounts = {};

    const months = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return `${year}-${month}`;
    });

    // const months = [
    //   "2024-01",
    //   "2024-02",
    //   "2024-03",
    //   "2024-04",
    //   "2024-05",
    //   "2024-06",
    //   "2024-07",
    //   "2024-08",
    //   "2024-09",
    //   "2024-10",
    //   "2024-11",
    //   "2024-12",
    // ];

    months.forEach((month) => {
      monthlySums[month] = {
        totalQuantity: 0,
        totalAmt: 0,
        quantityVariationPercentage: 0,
        amtVariationPercentage: 0,
      };
      monthlyCounts[month] = {
        totalQuantity: 0,
        totalAmt: 0,
        quantityVariationPercentage: 0,
        amtVariationPercentage: 0,
      };
    });

    data.forEach((brand) => {
      brand.monthlyData?.forEach((monthlyData) => {
        const month: any = monthlyData?.month;

        if (monthlyData?.totalQuantity !== 0) {
          monthlySums[month].totalQuantity += monthlyData?.totalQuantity;
          monthlyCounts[month].totalQuantity += 1;
        }
        if (monthlyData.totalAmt !== 0) {
          monthlySums[month].totalAmt += monthlyData.totalAmt;
          monthlyCounts[month].totalAmt += 1;
        }
        if (monthlyData.quantityVariationPercentage !== 0) {
          monthlySums[month].quantityVariationPercentage +=
            monthlyData.quantityVariationPercentage;
          monthlyCounts[month].quantityVariationPercentage += 1;
        }
        if (monthlyData.amtVariationPercentage !== 0) {
          monthlySums[month].amtVariationPercentage +=
            monthlyData.amtVariationPercentage;
          monthlyCounts[month].amtVariationPercentage += 1;
        }
      });
    });

    const monthlyAverages = months.map((month, i) => {
      let quantityVariationPercentage = 0;
      let amtVariationPercentage = 0;
      const preMonth = monthlySums[months[i - 1]];
      if (i !== 0) {
        if (
          preMonth?.totalQuantity === 0 &&
          monthlySums[months[i]]?.totalQuantity === 0
        ) {
          quantityVariationPercentage = 0;
        } else if (
          preMonth?.totalQuantity === 0 &&
          monthlySums[months[i]]?.totalQuantity > 0
        ) {
          quantityVariationPercentage = 100;
        } else if (
          preMonth?.totalQuantity > 0 &&
          monthlySums[months[i]]?.totalQuantity === 0
        ) {
          quantityVariationPercentage = -100;
        } else {
          quantityVariationPercentage = +parseFloat(
            ((monthlySums[months[i]]?.totalQuantity - preMonth?.totalQuantity) /
              preMonth?.totalQuantity) *
              100
          ).toFixed(2);
        }
        if (preMonth.totalAmt === 0 && monthlySums[months[i]].totalAmt === 0) {
          amtVariationPercentage = 0;
        } else if (
          preMonth.totalAmt === 0 &&
          monthlySums[months[i]].totalAmt > 0
        ) {
          amtVariationPercentage = 100;
        } else if (
          preMonth.totalAmt > 0 &&
          monthlySums[months[i]].totalAmt === 0
        ) {
          amtVariationPercentage = -100;
        } else {
          amtVariationPercentage = +parseFloat(
            ((monthlySums[months[i]]?.totalAmt - preMonth?.totalAmt) /
              preMonth?.totalAmt) *
              100
          ).toFixed(2);
        }
      }

      return {
        month,
        totalQuantity: monthlySums[month].totalQuantity,
        totalAmt: monthlySums[month].totalAmt,
        quantityVariationPercentage:
          `${year}-${`${new Date().getMonth() + 1}`.length == 1 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}` ===
          months[i - 1]
            ? 0
            : quantityVariationPercentage,
        amtVariationPercentage:
          `${year}-${`${new Date().getMonth() + 1}`.length == 1 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}` ===
          months[i - 1]
            ? 0
            : amtVariationPercentage,
      };
    });

    const result = {
      _id: "Total",
      monthlyData: monthlyAverages,
      id: data.length,
    };
    data.push(result);

    return data;
  };

  // function fillMissingMonths(data) {
  //   // const currentYear = new Date().getFullYear();
  //   const currentYear = props?.selectYear;
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

  //   data.forEach((item) => {
  //     const existingMonths = item.monthlyData.map((entry) =>
  //       entry.month.slice(-2)
  //     );

  //     allMonths.forEach((month) => {
  //       const fullMonth = `${currentYear}-${month}`;
  //       if (!existingMonths.includes(month)) {
  //         item.monthlyData.push({
  //           month: fullMonth,
  //           totalQuantity: 0,
  //           totalAmt: 0,
  //           quantityVariationPercentage: 0,
  //           amtVariationPercentage: 0,
  //         });
  //       }
  //     });

  //     item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  //     let data = {
  //       totalQuantity: 0,
  //       totalAmt: 0,
  //       quantityVariationPercentage: 0,
  //       amtVariationPercentage: 0,
  //       month: `${currentYear}-13"`,
  //     };

  //     item.monthlyData.push({ ...data });
  //   });

  //   return data;
  // }

  // const adjust = (data) => {
  //   // const currentYear = new Date().getFullYear();
  //   const currentYear = props?.selectYear;
  //   const currentMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  //   const months = Array.from({ length: 12 }, (_, i) => {
  //     const month = String(i + 1).padStart(2, "0");
  //     return `${currentYear}-${month}`;
  //   });

  //   const monthlySums = {};
  //   const monthlyCounts = {};

  //   months.forEach((month) => {
  //     monthlySums[month] = {
  //       totalQuantity: 0,
  //       totalAmt: 0,
  //       quantityVariationPercentage: 0,
  //       amtVariationPercentage: 0,
  //     };
  //     monthlyCounts[month] = {
  //       totalQuantity: 0,
  //       totalAmt: 0,
  //       quantityVariationPercentage: 0,
  //       amtVariationPercentage: 0,
  //     };
  //   });

  //   data?.forEach((brand) => {
  //     brand?.monthlyData?.forEach((monthlyData) => {
  //       const month = monthlyData.month;
  //       if (monthlyData?.totalQuantity !== 0) {
  //         monthlySums[month].totalQuantity += monthlyData.totalQuantity;
  //         monthlyCounts[month].totalQuantity += 1;
  //       }
  //       if (monthlyData.totalAmt !== 0) {
  //         monthlySums[month].totalAmt += monthlyData.totalAmt;
  //         monthlyCounts[month].totalAmt += 1;
  //       }
  //       if (monthlyData.quantityVariationPercentage !== 0) {
  //         monthlySums[month].quantityVariationPercentage +=
  //           monthlyData.quantityVariationPercentage;
  //         monthlyCounts[month].quantityVariationPercentage += 1;
  //       }
  //       if (monthlyData.amtVariationPercentage !== 0) {
  //         monthlySums[month].amtVariationPercentage +=
  //           monthlyData.amtVariationPercentage;
  //         monthlyCounts[month].amtVariationPercentage += 1;
  //       }
  //     });
  //   });

  //   const monthlyAverages = months.map((month, i) => {
  //     let quantityVariationPercentage = 0;
  //     let amtVariationPercentage = 0;
  //     const preMonth = monthlySums[months[i - 1]];

  //     if (i !== 0) {
  //       if (
  //         preMonth?.totalQuantity === 0 &&
  //         monthlySums[months[i]]?.totalQuantity === 0
  //       ) {
  //         quantityVariationPercentage = 0;
  //       } else if (
  //         preMonth?.totalQuantity === 0 &&
  //         monthlySums[months[i]]?.totalQuantity > 0
  //       ) {
  //         quantityVariationPercentage = 100;
  //       } else if (
  //         preMonth?.totalQuantity > 0 &&
  //         monthlySums[months[i]]?.totalQuantity === 0
  //       ) {
  //         quantityVariationPercentage = -100;
  //       } else {
  //         quantityVariationPercentage = +parseFloat(
  //           ((monthlySums[months[i]]?.totalQuantity - preMonth?.totalQuantity) /
  //             preMonth?.totalQuantity) *
  //             100
  //         ).toFixed(2);
  //       }
  //       if (preMonth.totalAmt === 0 && monthlySums[months[i]].totalAmt === 0) {
  //         amtVariationPercentage = 0;
  //       } else if (
  //         preMonth.totalAmt === 0 &&
  //         monthlySums[months[i]].totalAmt > 0
  //       ) {
  //         amtVariationPercentage = 100;
  //       } else if (
  //         preMonth.totalAmt > 0 &&
  //         monthlySums[months[i]].totalAmt === 0
  //       ) {
  //         amtVariationPercentage = -100;
  //       } else {
  //         amtVariationPercentage = +parseFloat(
  //           ((monthlySums[months[i]]?.totalAmt - preMonth?.totalAmt) /
  //             preMonth?.totalAmt) *
  //             100
  //         ).toFixed(2);
  //       }
  //     }

  //     return {
  //       month,
  //       totalQuantity: monthlySums[month].totalQuantity,
  //       totalAmt: monthlySums[month].totalAmt,
  //       quantityVariationPercentage:
  //         month === currentMonth ? 0 : quantityVariationPercentage,
  //       amtVariationPercentage:
  //         month === currentMonth ? 0 : amtVariationPercentage,
  //     };
  //   });

  //   const result = {
  //     _id: "Total",
  //     monthlyData: monthlyAverages,
  //     id: data.length,
  //   };
  //   data.push(result);

  //   return data;
  // };

  React.useEffect(() => {
    setRows([]);
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api-dev.mlawatches.com/api/admin/stock/stockReportThree?year=${props?.selectYear}`,
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
          const newData = adjust(
            fillMissingMonths(
              sortData(
                data?.results.map((item, i) => ({ ...item, id: i })),
                "_id"
              )
            )
          );
          setRows(newData);
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

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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
    renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
  };
  const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) => row;

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
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        // pinnedColumns={pinnedColumns}
        // onPinnedColumnsChange={handlePinnedColumnsChange}
        // slots={{
        //   toolbar: CustomToolbar
        // }}
        // slotProps={{
        //   toolbar: { rows, setRows, setRowModesModel, gridApiRef },
        // }}
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
        disableColumnMenu
        checkboxSelection={false}
      />
    </Box>
  );
}
