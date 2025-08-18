import { formatter } from "src/utils/coreFunction";

const getColorRed = (value) => {
  if (value < 0) return true;
  return false;
};

export const columnsNew: any = [
  // {
  //   field: "rows_id",
  //   headerName: "No.",
  //   width: 10,
  //   // headerAlign: 'center',
  //   align: "center",
  //   editable: false,
  //   type: "number",
  //   // filterable: false,
  //   renderCell: (params) => <div className="font-600">{params.value}</div>,
  // },
  {
    field: "avgDaysDifference",
    headerName: "Avg Days",
    width: 10,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="font-600">
        {params?.value !== null
          ? params?.value === 0
            ? 0
            : Math.round(params?.value)
          : "-"}
      </div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 55,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "dial",
    headerName: "Dial",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "strap_bracelet",
    headerName: "Strap Bracelet",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "paper",
    headerName: "Paper",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "sold_count",
    headerName: "No. of Time Sold",
    width: 140,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "avgProfit",
    headerName: "Profit",
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div
        style={{ color: getColorRed(params?.row?.avgProfit) ? "red" : "black" }}
        className=""
      >
        {formatter.format(params?.row?.avgProfit)}
      </div>
    ),
  },
  {
    field: "item_in_stock",
    headerName: "Item In Stock",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
];
