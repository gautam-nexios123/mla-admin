import moment from "moment";
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

export const csvDatacolumns: any = [
  {
    field: "date",
    headerName: "Date",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">
        {moment(params.value?.$date).format("DD-MMM-YYYY")}
      </div>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "modelName",
    headerName: "Model Name",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "dial",
    headerName: "Dial",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "strap_bracelet",
    headerName: "Bracelet",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value ?? ""}</div>,
  },
  {
    field: "bw",
    headerName: "BW",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "warranty_year",
    headerName: "Warranty Year",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">
        {params?.value === null ||
        params?.value === "" ||
        params?.value === "null"
          ? ""
          : params.value}
      </div>
    ),
  },
  {
    field: "winning_bid_usd",
    headerName: "Sale Price",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <div className="">{formatter.format(params.value)}</div>
    ),
  },
  {
    field: "box",
    headerName: "Box",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "lot",
    headerName: "Lot",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "name",
    headerName: "Auction",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
];
