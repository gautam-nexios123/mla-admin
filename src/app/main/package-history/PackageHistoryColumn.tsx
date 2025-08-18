import moment from "moment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { formatter } from "src/utils/coreFunction";

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "center",
};

export const columns = (handlDataRow, handleClickOpen) => {
  return [
  {
    field: "name",
    headerName: "Staff Name",
    align: "center",
    width: 200,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{params.row.staffData?.name}</div>
    ),
  },
  {
    field: "quantity",
    headerName: "Total Qty",
    ...defaultColumnkey,
    align: "center",
    width: 122,
    editable: false,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "price",
    headerName: "Total Wholesale Price (USD)",
    align: "center",
    width: 135,
    editable: false,
    ...defaultColumnkey,
    renderHeader: (params) => <div className='font-600 text-center'>Total 
    <br />
    Wholesale Price 
    <br />
    (USD)
    </div>,
    renderCell: (params) => <div className="">{formatter.format(params.value)}</div>,
  },
  {
    field: "net_amount",
    headerName: "Discounted Wholesale Price (USD)",
    align: "center",
    width: 140,
    editable: false,
    ...defaultColumnkey,
    renderHeader: (params) => <div className='font-600 text-center'>Discounted 
    <br />
    Wholesale Price 
    <br />
    (USD)
    </div>,
    renderCell: (params) => <div className="">{formatter.format(params.value)}</div>,
  },
  {
    field: "discount",
    headerName: "Total Savings (USD)",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderHeader: (params) => <div className='font-600 text-center'>Total 
    <br />
    Savings
    
    (USD)
    </div>,
    renderCell: (params) => <div className="">{formatter.format(params.value)}</div>,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    field: "actions",
    headerName: "View Package",
    align: "center",
    width: 150,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <>
        <FuseSvgIcon onClick={()=>handlDataRow(params.row)}>heroicons-outline:eye</FuseSvgIcon>
      </>
    ),
  },
  {
    field: "action",
    headerName: "Delete Package",
    align: "center",
    width: 150,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <>
        <FuseSvgIcon onClick={() => handleClickOpen(params.id)}>heroicons-outline:trash</FuseSvgIcon>
      </>
    ),
  },
]};
