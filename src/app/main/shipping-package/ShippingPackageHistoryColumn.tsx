import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import { formatter } from "src/utils/coreFunction";
import DownloadIcon from '@mui/icons-material/Download';

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "center",
};

export const columns: any = (
  handlDataRow,
  handleClickOpen,
  handleClickOpenShipModel,
  handleClickOpenReceiveModel,
  handlDataRowForInvoice
) => {
  return [
    {
      field: "fromLocation",
      headerName: "From Location",
      align: "center",
      width: 150,
      editable: false,
      ...defaultColumnkey,
      renderCell: (params) => <div className="">{params.value}</div>,
    },
    {
      field: "toLocation",
      headerName: "To Location",
      ...defaultColumnkey,
      align: "center",
      width: 150,
      editable: false,
      renderCell: (params) => <div className="">{params?.value}</div>,
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      align: "center",
      width: 150,
      editable: false,
      ...defaultColumnkey,
      renderCell: (params) => (
        <div className="">{formatter.format(params?.value)}</div>
      ),
    },
    {
      field: "totalWatches",
      headerName: "Total Watches",
      ...defaultColumnkey,
      align: "center",
      width: 150,
      editable: false,
      renderCell: (params) => <div className="">{params?.value}</div>,
    },
    {
      field: "shipStatus",
      headerName: "Ship Status",
      ...defaultColumnkey,
      align: "center",
      width: 150,
      editable: false,
      renderCell: (params) => <div className="">{params?.value}</div>,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      ...defaultColumnkey,
      align: "center",
      width: 150,
      editable: false,
      renderCell: (params) => <div className="">{params?.row?.createdBy?.name}</div>,
    },
    {
      field: "trackingNo",
      headerName: "Tracking No",
      ...defaultColumnkey,
      align: "center",
      width: 180,
      editable: false,
      renderCell: (params) => (
        <div className="">{params?.value !== "" ? params?.value : "-"}</div>
      ),
    },
    {
      field: "courierCompanyName",
      headerName: "Courier Company",
      ...defaultColumnkey,
      align: "center",
      width: 180,
      editable: false,
      renderCell: (params) => (
        <div className="">{params?.value !== "" ? params?.value : "-"}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      align: "center",
      width: 180,
      editable: false,
      ...defaultColumnkey,
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-[8px]">
          {params?.row?.shipStatus === "Pending" && (
            <button
              className="bg-white text-[#4f46e5] rounded-[8px] px-[7px] py-[3px] font-semibold border border-[#4f46e5]"
              onClick={() => handleClickOpenShipModel(params?.row)}
            >
              <div className="flex items-center">Ship </div>
            </button>
          )}
          {params?.row?.shipStatus === "Ship" && (
            <button
              className="bg-white text-[#4f46e5] rounded-[8px] px-[7px] py-[3px] font-semibold border border-[#4f46e5]"
              onClick={() => handleClickOpenReceiveModel(params?.row)}
            >
              <div className="flex items-center">Receive </div>
            </button>
          )}
          <FuseSvgIcon
            className="cursor-pointer"
            onClick={() => handlDataRow(params?.row)}
          >
            heroicons-outline:eye
          </FuseSvgIcon>
          <FuseSvgIcon
            className="cursor-pointer"
            onClick={() => handleClickOpen(params?.row)}
          >
            heroicons-outline:trash
          </FuseSvgIcon>
        </div>
      ),
    },
    {
      field: "pdf_download",
      headerName: "Invoice",
      align: "center",
      width: 180,
      editable: false,
      ...defaultColumnkey,
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-[8px]">
          <button
            className="bg-white text-[#4f46e5] rounded-[8px] px-[7px] py-[3px] font-semibold border border-[#4f46e5]"
            onClick={() => handlDataRowForInvoice(params?.row)}
          >
            <div className="flex items-center"><DownloadIcon fontSize="small" /> Download PDF </div>
          </button>
        </div>
      ),
    },
  ];
};
