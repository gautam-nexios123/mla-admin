// 28417
import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import { GridRowModel, GridRowParams } from "@mui/x-data-grid";
import {
  columns,
  offlineOrderColumns,
  subColumns,
  subColumnsOffline,
} from "./OrdersColumn";
import { Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import _ from "lodash";

const style = (heigth) => {
  return {
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
      height: heigth,
    },
  };
};

function CustomToolbar() {
  return (
    <div className="pb-4 pt-[10px]">
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
      </GridToolbarContainer>
    </div>
  );
}

export default function OrdersProTable(props) {
  console.log("props: ", props);
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const modifyRowData = React.useMemo(() => {
    const updatedArray = rows?.map((order) => {
      if (props?.tabValue == 0) {
        const { name, company } = order?.orderByCustomer;
        return {
          ...order,
          customerName: name, // Add name to the main object
          companyName: company, // Add company to the main object
        };
      } else if (props?.tabValue == 1) {
        const { name } = order?.staff;
        const customerInfo = order?.customer;

        return {
          ...order,
          staffName: name,
          customerName: customerInfo?.name
            ? customerInfo?.name
            : "New Customer",
          companyName: customerInfo?.company ? customerInfo?.company : "-",
        };
      }
    });

    return updatedArray;
  }, [rows]);

  const getConverteData = (item, exchangeRate) => {
    const data = {
      HkDiscount: Math.round((item.discount * exchangeRate) / 10) * 10,
      HkNetAmount: Math.round((item.netAmount * exchangeRate) / 10) * 10,
      HkPrice: Math.round((item.price * exchangeRate) / 10) * 10,
      HkShippingPrice:
        Math.round((item.additionalShippingPrice * exchangeRate) / 10) * 10,
    };
    return data;
  };
  const getSaleItemsData = (item) => {
    const data = item.saleItems.map((ele) => ({
      ...ele,
      ...getConverteData(ele, item.exchangeRate),
    }));

    const Hkdata = {
      saleItems: data,
      HkDiscount: _.sum(data.map((m) => m.HkDiscount)),
      HkNetAmount: _.sum(data.map((m) => m.HkNetAmount)),
      HkPrice: _.sum(data.map((m) => m.HkPrice)),
      HkShippingPrice: _.sum(data.map((m) => m.HkShippingPrice)),
    };
    return Hkdata;
  };
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          props?.tabValue == 0
            ? "https://api-dev.mlawatches.com/api/admin/order/get-orders"
            : "https://api-dev.mlawatches.com/api/admin/order/getOfflineOrders",
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
            data.results.map((item) =>
              item.currency === "USD"
                ? { ...item }
                : { ...item, ...getSaleItemsData(item) }
            )
          );
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
  }, [props?.tabValue]);

  const processRowUpdate = async (newRow: GridRowModel) => {
    let updatedRow = null;

    await fetch(
      props?.tabValue == 0
        ? `https://api-dev.mlawatches.com/api/admin/order/update_status`
        : `https://api-dev.mlawatches.com/api/admin/order/updateOfflineStatus`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      }
    )
      .then((result) => {
        if (result?.statusCode === 403) {
          enqueueSnackbar(
            "Unauthorized access. You don't have permission to view or edit this content.",
            { variant: "error" }
          );
        }
      })
      .catch((error) => console.error(error));
    updatedRow = { ...newRow };
    setRows((pre) =>
      pre.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="div">
          Order Details
        </Typography>
        <DataGridPro
          apiRef={apiRef}
          rows={row?.saleItems?.map((item) => ({
            ...item,
            currency: row.currency,
            exchangeRate: row.exchangeRate,
          }))}
          columns={props?.tabValue == 0 ? subColumns : subColumnsOffline}
          getRowHeight={() => "auto"}
          pagination={false}
          hideFooter
          sx={style(90)}
          disableColumnMenu
          checkboxSelection={false}
        />
      </Paper>
    ),
    []
  );

  const getDetailPanelHeight = React.useCallback(() => "auto", []);

  return (
    <Box className="heightyy" sx={{ height: "95vh", width: "100%", px: 1 }}>
      <DataGridPro
        loading={loading}
        apiRef={apiRef}
        rows={modifyRowData}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        columns={props?.tabValue == 0 ? columns : offlineOrderColumns}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        slots={{
          toolbar: CustomToolbar,
        }}
        processRowUpdate={processRowUpdate}
        sx={style(50)}
        checkboxSelection={false}
      />
    </Box>
  );
}
