import { Box } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import ConfirmationDialog from "app/shared-components/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceiveModel from "./ReceiveModel";
import { columns } from "./ShippingPackageHistoryColumn";
import ShppingModel from "./ShppingModel";
import ProformaInvoice from "./InvoiceTamplate/ProformaInvoice";
import InvoiceHkToUs from "./InvoiceTamplate/InvoiceHkToUs";
import InvoiceTHToHK from "./InvoiceTamplate/InvoiceTHToHK";
import InvoiceHKToZH from "./InvoiceTamplate/InvoiceHKToZH";

function ShipingPackageHistoryTable({
  rows,
  loading,
  setLoading,
  getShippingPackageList,
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const session = localStorage.getItem(`jwt_access_token`);
  const gridApiRef = useGridApiRef();
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openReceiveModel, setOpenReceiveModel] = useState(false);
  const [shippingRowData, setShippingRowData] = useState({});
  const [receiveRowData, setReceiveRowData] = useState({});
  const [id, setId] = useState("");
  const [detailRows, setDetailRows] = useState([]);
  const [detailRowsHKtoUS, setDetailRowsHKtoUS] = useState([]);
  const [detailRowsTHtoHK, setDetailRowsTHtoHK] = useState([]);

  const handlDataRow = async (row: any) => {
    navigate("/shipping-history-details", { state: { row } });
  };

  const handlDataRowForTKYTOHKInvoice = async (row: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/getShippingPackageItemList?packageId=${row?.id}`,
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
        setDetailRows(data?.results || []);
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
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  const handlDataRowForHKTOUSInvoice = async (row: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/getShippingPackageItemList?packageId=${row?.id}`,
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
        const someEmpty = data?.results?.some(
          (item) =>
            item?.material == "" ||
            item?.material == null ||
            item?.strapBracelet == "" ||
            item?.strapBracelet == null
        );

        if (someEmpty) {
          enqueueSnackbar("Please add material and strap/bracelet!", {
            variant: "error",
          });
          setLoading(false);
          return;
        } else {
          setDetailRowsHKtoUS(data?.results || []);
          setLoading(false);
        }
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handlDataRowForTHTOHKInvoice = async (row: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/getShippingPackageItemList?packageId=${row?.id}`,
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
        const someEmpty = data?.results?.some(
          (item) =>
            item?.material == "" ||
            item?.material == null ||
            item?.strapBracelet == "" ||
            item?.strapBracelet == null ||
            item?.manualAmount == "" ||
            item?.manualAmount == null
        );

        if (someEmpty) {
          enqueueSnackbar("Please add material , strap/bracelet and amount !", {
            variant: "error",
          });
          setLoading(false);
          return;
        } else {
          setDetailRowsTHtoHK(data?.results || []);
          setLoading(false);
        }
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const [getRowData, setRowData] = useState<any>({});

  const handlDataRowForInvoice = async (row: any) => {
    setRowData(row);
    setDetailRows([]);
    setDetailRowsHKtoUS([]);

    if (row?.fromLocation === "TKY" && row?.toLocation === "HK") {
      handlDataRowForTKYTOHKInvoice(row);
    } else if (row?.fromLocation === "HK" && row?.toLocation === "NY") {
      handlDataRowForHKTOUSInvoice(row);
    } else if (row?.fromLocation === "TH" && row?.toLocation === "HK") {
      handlDataRowForTHTOHKInvoice(row);
    } else if (row?.fromLocation === "HK" && row?.toLocation === "ZH") {
      handlDataRowForHKTOUSInvoice(row);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/deleteShippingPackage?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data?.statusCode == 200) {
        enqueueSnackbar("Data Delete successfully!", { variant: "success" });
        getShippingPackageList();
        handleClose();
      } else if (data?.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        handleClose();
      } else {
        enqueueSnackbar(data?.message || "Failed to Please try again.", {
          variant: "error",
        });
        handleClose();
      }
    } catch (error) {
      enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      handleClose();
    }
  };

  const handleClickOpen = (rowData: any) => {
    setId(rowData?.id);
    setOpen(true);
  };

  const handleClickOpenShipModel = (rowData: any) => {
    setShippingRowData(rowData);
    setOpenModel(true);
  };
  const handleClickOpenReceiveModel = (rowData: any) => {
    setReceiveRowData(rowData);
    setOpenReceiveModel(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box className="mt-10 px-[20px]" sx={{ height: "83vh", width: "100%" }}>
        <div className="h-[100%]">
          <DataGridPro
            loading={loading}
            rows={rows}
            apiRef={gridApiRef}
            columns={columns(
              handlDataRow,
              handleClickOpen,
              handleClickOpenShipModel,
              handleClickOpenReceiveModel,
              handlDataRowForInvoice
            )}
            getRowHeight={() => "auto"}
            // stickyHeader
            pagination={false}
            hideFooter
            sx={{
              border: 1,
              width: "100%",
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
                borderBottom: "lightgray",
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
            disableColumnMenu
            checkboxSelection={false}
          />
        </div>

        {getRowData?.fromLocation === "TKY" &&
          getRowData?.toLocation === "HK" && (
            <ProformaInvoice
              detailRows={detailRows}
              setDetailRows={setDetailRows}
            />
          )}

        {getRowData?.fromLocation === "HK" &&
          getRowData?.toLocation === "NY" && (
            <InvoiceHkToUs
              detailRows={detailRowsHKtoUS}
              setDetailRows={setDetailRowsHKtoUS}
            />
          )}

        {getRowData?.fromLocation === "TH" &&
          getRowData?.toLocation === "HK" && (
            <InvoiceTHToHK
              detailRows={detailRowsTHtoHK}
              setDetailRows={setDetailRowsTHtoHK}
            />
          )}

        {getRowData?.fromLocation === "HK" &&
          getRowData?.toLocation === "ZH" && (
            <InvoiceHKToZH
              detailRows={detailRowsHKtoUS}
              setDetailRows={setDetailRowsHKtoUS}
            />
          )}

        <ConfirmationDialog
          isDelete={true}
          title={"Delete Package"}
          open={open}
          handleDelete={handleDelete}
          handleClose={handleClose}
        />
        <ShppingModel
          openModel={openModel}
          setOpenModel={setOpenModel}
          shippingRowData={shippingRowData}
          getShippingPackageList={getShippingPackageList}
        />

        <ReceiveModel
          openModel={openReceiveModel}
          setOpenModel={setOpenReceiveModel}
          receiveRowData={receiveRowData}
          getShippingPackageList={getShippingPackageList}
        />
      </Box>
    </>
  );
}

export default ShipingPackageHistoryTable;
