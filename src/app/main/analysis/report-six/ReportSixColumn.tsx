import { fontWeight } from "@mui/system";
import moment from "moment-timezone";
import { formatter } from "src/utils/coreFunction";

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "end",
};

const getColorRed = (value) => {
  if (value < 0) return true;
  return false;
};

export const columns = [
  {
    field: "status",
    headerName: "Status",
    width: 128,
    headerAlign: "center",
    align: "false",
    renderCell: (params) => <div className="pr-[4px]">{params.value}</div>,
  },
  {
    field: "stockId",
    headerName: "Stock Id",
    ...defaultColumnkey,

    editable: false,
    align: "center",
    colSpan: (value) => {
      if (value == "TOTAL") {
        return 3;
      }
    },
    cellClassName: (params) => {
      if (params.value == "TOTAL") {
        return "font-bold";
      }
    },
    renderCell: (params) => {
      <div
        className={`${params.row.stockId == "TOTAL" && "font-bold"} pr-[4px]`}
      >
        {params.value}
      </div>;
    },
  },
  {
    field: "brand",
    headerName: "Brand",
    ...defaultColumnkey,
    align: "center",
    editable: false,
    renderCell: (params) => <div className="pr-[4px]">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model",
    ...defaultColumnkey,
    align: "center",
    width: 230,
    editable: false,
    renderCell: (params) => <div className="pr-[4px]">{params.value}</div>,
  },
  {
    field: "days_from_purchase_date",
    headerName: "Days from Purchase Date",
    width: 120,
    ...defaultColumnkey,
    align: "center",
    renderHeader: () => (
      <div className="font-600 text-center">
        Days from
        <br /> Purchase Date
      </div>
    ),
    renderCell: (params) => {
      if (params.row.stockId === "TOTAL") {
        return "";
      }
      const purchaseDate = moment
        .tz(params.row.purchase_date, "Asia/Bangkok")
        .endOf("day");
      const currentDate = moment.tz("Asia/Bangkok").endOf("day");
      const diffInDays = currentDate.diff(purchaseDate, "days");
      return <div className="font-500 pr-[4px]">{diffInDays}</div>;
    },
  },
  {
    field: "wholesale_price_usd",
    headerName: "Wholesale Price",
    ...defaultColumnkey,
    editable: false,
    renderHeader: () => (
      <div className="font-600 text-center">
        Wholesale
        <br /> Price
      </div>
    ),
    renderCell: (params) => (
      <div
        style={{ color: getColorRed(params.value) ? "red" : "black" }}
        className={`${params.row.stockId == "TOTAL" && "font-bold"} pr-[4px]`}
      >
        {formatter.format(params.value)}
      </div>
    ),
  },
  {
    field: "net_cost_usd",
    headerName: "Net Cost",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => (
      <div
        style={{ color: getColorRed(params.value) ? "red" : "black" }}
        className={`${params.row.stockId == "TOTAL" && "font-bold"} pr-[4px]`}
      >
        {formatter.format(params.value)}
      </div>
    ),
  },
  {
    field: "loss",
    headerName: "Loss",
    ...defaultColumnkey,
    editable: false,
    sortable: true,
    renderCell: (params) => (
      <div
        style={{ color: getColorRed(params.value) ? "red" : "black" }}
        className={`${params.row.stockId == "TOTAL" && "font-bold"} pr-[4px]`}
      >
        {formatter.format(params.value)}
      </div>
    ),
  },
];
