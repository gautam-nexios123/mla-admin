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

export const columns: any = [
  {
    field: "sold_date",
    headerName: "Sale Date",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
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
    field: "paper_date",
    headerName: "Warranty Date",
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
          : moment(params.value).format("YYYY")}
      </div>
    ),
  },
  {
    field: "cost_usd",
    headerName: "Cost USD",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{formatter.format(params.value)}</div>
    ),
  },
  {
    field: "sold_price",
    headerName: "Sale USD",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{formatter.format(params.value)}</div>
    ),
  },
  {
    field: "profit_margin_percentage",
    headerName: "Net profit(%)",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{`${parseFloat(params.value).toFixed(2)}%`}</div>
    ),
  },
  {
    field: "purchase_date",
    headerName: "Buy Date",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    field: "stockId",
    headerName: "Stock Number",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
];
