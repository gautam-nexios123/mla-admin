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
import { columns, masterLuxuryColumns } from "./ReportOneColumn";
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

export default function ReportOneTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [rowsMasterLuxury, setRowsMasterLuxury] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const userActiveRole: any = useSelector(userActiveRoleState);

  const roleWiseColumn: any =
    userActiveRole === "MLA" ? columns : masterLuxuryColumns;

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
  //       qty_bought: 0,
  //       qty_sold: 0,
  //       amount_bought: 0,
  //       amount_sold: 0,
  //     };
  //   });

  //   data.forEach((brand) => {
  //     brand.monthlyData.forEach((monthlyData) => {
  //       const month = monthlyData.month;
  //       if (monthlyData.qty_bought !== 0) {
  //         monthlySums[month].qty_bought += monthlyData.qty_bought;
  //       }
  //       if (monthlyData.qty_sold !== 0) {
  //         monthlySums[month].qty_sold += monthlyData.qty_sold;
  //       }
  //       if (monthlyData.amount_bought !== 0) {
  //         monthlySums[month].amount_bought += monthlyData.amount_bought;
  //       }
  //       if (monthlyData.amount_sold !== 0) {
  //         monthlySums[month].amount_sold += monthlyData.amount_sold;
  //       }
  //     });
  //   });
  //   const monthlyAverages = months.map((month) => ({
  //     month,
  //     qty_bought: monthlySums[month].qty_bought,
  //     qty_sold: monthlySums[month].qty_sold,
  //     amount_bought: monthlySums[month].amount_bought,
  //     amount_sold: monthlySums[month].amount_sold,
  //   }));
  //   const result = {
  //     _id: "Total",
  //     monthlyData: monthlyAverages,
  //   };

  //   return [...data, result];
  // };

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
  //           qty_bought: 0,
  //           amount_bought: 0,
  //           qty_sold: 0,
  //           amount_sold: 0,
  //         });
  //       }
  //     });

  //     item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  //     let data = {
  //       qty_bought: 0,
  //       qty_sold: 0,
  //       amount_bought: 0,
  //       amount_sold: 0,
  //       month: "2024-13",
  //     };
  //     item.monthlyData.forEach((item) => {
  //       data.qty_bought += item.qty_bought;
  //       data.qty_sold += item.qty_sold;
  //       data.amount_bought += item.amount_bought;
  //       data.amount_sold += item.amount_sold;
  //     });
  //     item.monthlyData.push(data);
  //   });

  //   return data;
  // }

  const adjust = (data) => {
    const currentYear = props?.selectYear;

    const monthlySums = {};
    const months = Array.from({ length: 13 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return `${currentYear}-${month}`;
    });

    months.forEach((month) => {
      monthlySums[month] = {
        qty_bought: 0,
        qty_sold: 0,
        amount_bought: 0,
        amount_sold: 0,
      };
    });

    data.forEach((brand) => {
      brand.monthlyData.forEach((monthlyData) => {
        const month = monthlyData.month;
        if (monthlyData.qty_bought !== 0) {
          monthlySums[month].qty_bought += monthlyData.qty_bought;
        }
        if (monthlyData.qty_sold !== 0) {
          monthlySums[month].qty_sold += monthlyData.qty_sold;
        }
        if (monthlyData.amount_bought !== 0) {
          monthlySums[month].amount_bought += monthlyData.amount_bought;
        }
        if (monthlyData.amount_sold !== 0) {
          monthlySums[month].amount_sold += monthlyData.amount_sold;
        }
      });
    });

    const monthlyAverages = months.map((month) => ({
      month,
      qty_bought: monthlySums[month].qty_bought,
      qty_sold: monthlySums[month].qty_sold,
      amount_bought: monthlySums[month].amount_bought,
      amount_sold: monthlySums[month].amount_sold,
    }));

    const result = {
      _id: "Total",
      monthlyData: monthlyAverages,
    };

    return [...data, result];
  };

  function fillMissingMonths(data) {
    const currentYear = props?.selectYear;
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

    data.forEach((item) => {
      const existingMonths = item.monthlyData.map((entry) =>
        entry.month.slice(-2)
      );

      allMonths.forEach((month) => {
        const fullMonth = `${currentYear}-${month}`;
        if (!existingMonths.includes(month)) {
          item.monthlyData.push({
            month: fullMonth,
            qty_bought: 0,
            amount_bought: 0,
            qty_sold: 0,
            amount_sold: 0,
          });
        }
      });

      item.monthlyData.sort((a, b) => a.month.localeCompare(b.month));

      let data = {
        qty_bought: 0,
        qty_sold: 0,
        amount_bought: 0,
        amount_sold: 0,
        month: `${currentYear}-13`,
      };

      item.monthlyData.forEach((entry) => {
        data.qty_bought += entry.qty_bought;
        data.qty_sold += entry.qty_sold;
        data.amount_bought += entry.amount_bought;
        data.amount_sold += entry.amount_sold;
      });

      item.monthlyData.push(data);
    });

    return data;
  }

  const createdata = (data) => {
    const newdata = data.results.map((item, i) => ({
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
        qty_bought: record.qty_bought,
        amount_bought: record.amount_bought,
        qty_sold: record.qty_sold,
        amount_sold: record.amount_sold,
      });
    });

    const result = [
      ...sortData(adjust(fillMissingMonths(Object.values(brands))), "_id"),
    ].map((item, i) => ({ ...item, id: i }));

    return result;
  };

  const addTotalInMasterLuxury = (array) => {
    const totals = {
      _id: "Total",
      salesData: [
        {
          saleType: "offlineSale",
          totalQuantity: 0,
          totalYoutube: 0,
          totalFacebook: 0,
          totalInstagram: 0,
          totalWebSite: 0,
        },
        {
          saleType: "onlineSale",
          totalQuantity: 0,
          totalYoutube: 0,
          totalFacebook: 0,
          totalInstagram: 0,
          totalWebSite: 0,
        },
      ],
    };
    // Sum up all the values
    array?.forEach((item) => {
      item?.salesData?.forEach((sale, index) => {
        totals.salesData[index].totalQuantity += sale?.totalQuantity;
        totals.salesData[index].totalYoutube += sale?.totalYoutube;
        totals.salesData[index].totalFacebook += sale?.totalFacebook;
        totals.salesData[index].totalInstagram += sale?.totalInstagram;
        totals.salesData[index].totalWebSite += sale?.totalWebSite;
      });
    });

    // Add the total object to the original array
    const newData = [...array, totals];
    const addIDInData = newData?.map((item, index) => {
      return { ...item, id: index + 1 };
    });

    setRowsMasterLuxury(sortData(addIDInData, "_id"));
  };

  async function fetchData() {
    try {
      const response = await fetch(
        userActiveRole === "MLA"
          ? `https://api-dev.mlawatches.com/api/admin/stock/stockReportOne?year=${props?.selectYear}`
          : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/stockReportOne`,
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
        if (userActiveRole === "MLA") {
          setRows(createdata(data));
        }
        if (userActiveRole === "ML") {
          addTotalInMasterLuxury(data?.results);
        }
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
      enqueueSnackbar("Error fetching data", { variant: "error" });
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }
  React.useEffect(() => {
    fetchData();
  }, [props.isChangeTab, props?.selectYear, userActiveRole]);

  function CustomGridTreeDataGroupingCell(props: GridRenderCellParams) {
    const { id, field, rowNode }: any = props;

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
    renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
  };
  const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) =>
    row.hierarchy;

  const getCellClassName = (params: any) => {
    if (userActiveRole === "MLA") {
      if (params?.id == rows[rows?.length - 1]?.id) {
        return "last-column";
      }
    }

    if (userActiveRole === "ML") {
      if (params?.id == rowsMasterLuxury[rowsMasterLuxury?.length - 1]?.id) {
        return "last-column";
      }
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
        rows={userActiveRole === "MLA" ? rows : rowsMasterLuxury}
        loading={loading}
        apiRef={gridApiRef}
        // treeData
        columns={roleWiseColumn}
        // columns={columns}
        getRowHeight={() => "auto"}
        // groupingColDef={groupingColDef}
        // getTreeDataPath={getTreeDataPath}
        // stickyHeader
        pagination={false}
        hideFooter
        // slots={{
        // toolbar: CustomToolbar
        // }}
        // slotProps={{
        //     toolbar: { rows, setRows, setRowModesModel, gridApiRef },
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
          "& .MuiDataGrid-filler": {
            height: "0px !important",
          },
        }}
        disableColumnMenu
        checkboxSelection={false}
      />
    </Box>
  );
}
