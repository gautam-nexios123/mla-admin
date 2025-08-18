import { GridCellParams } from "@mui/x-data-grid";
import { formatter } from "src/utils/coreFunction";
import { getColor } from "../utils";

// const cellClassName = (params: GridCellParams<any, number>) => {
//   if (params.id == 9) {
//     return "last-column";
//   }
// };

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "end",
  // cellClassName,
};

const getValue = (params: any, index: number) => {
  const getColorRed = (value) => {
    if (value < 0) return true;
    return false;
  };

  return (
    <>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {params?.row?.monthlyData[index]?.totalQuantity}
      </span>
      <span
        style={{
          color: getColorRed(
            params?.row?.monthlyData[index]?.quantityVariationPercentage
          )
            ? "red"
            : "black",
        }}
        className="w-full font-600 flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5"
      >
        {`${parseFloat(params?.row?.monthlyData[index]?.quantityVariationPercentage).toFixed(2)}%`}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {formatter.format(params?.row?.monthlyData[index]?.totalAmt)}
      </span>
      <span
        style={{
          color: getColorRed(
            params?.row?.monthlyData[index]?.amtVariationPercentage
          )
            ? "red"
            : "black",
        }}
        className="font-600 MuiDataGrid-cell--textEnd py-0.5"
      >
        {`${parseFloat(params?.row?.monthlyData[index]?.amtVariationPercentage).toFixed(2)}%`}
      </span>
    </>
  );
};

export const columns = [
  {
    field: "_id",
    headerName: "Brand",
    ...defaultColumnkey,
    editable: false,
    align: "center",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "Brand",
    headerName: "",
    ...defaultColumnkey,
    minWidth: 100,
    editable: false,
    align: "center",
    renderCell: (params) => (
      <div className="w-full">
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Qty
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Var %
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Amt
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Var %
        </span>
      </div>
    ),
  },
  {
    field: "monthlyData[0]",
    headerName: "Jan",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 0)}</div>,
  },
  {
    field: "monthlyData[1]",
    headerName: "Feb",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 1)}</div>,
  },
  {
    field: "monthlyData[2]",
    headerName: "Mar",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 2)}</div>,
  },
  {
    field: "monthlyData[3]",
    headerName: "Apr",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 3)}</div>,
  },
  {
    field: "monthlyData[4]",
    headerName: "May",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 4)}</div>,
  },
  {
    field: "monthlyData[5]",
    headerName: "Jun",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 5)}</div>,
  },
  {
    field: "monthlyData[6]",
    headerName: "Jul",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 6)}</div>,
  },
  {
    field: "monthlyData[7]",
    headerName: "Aug",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 7)}</div>,
  },
  {
    field: "monthlyData[8]",
    headerName: "Sep",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 8)}</div>,
  },
  {
    field: "monthlyData[9]",
    headerName: "Oct",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 9)}</div>,
  },
  {
    field: "monthlyData[10]",
    headerName: "Nov",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValue(params, 10)}</div>
    ),
  },
  {
    field: "monthlyData[11]",
    headerName: "Dec",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValue(params, 11)}</div>
    ),
  },
];
