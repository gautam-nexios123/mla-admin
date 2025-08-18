import { GridCellParams, GridRowParams } from "@mui/x-data-grid";
import { getColor } from "../utils";

// const cellClassName = (params: GridCellParams<any, number>) => {
//   if (params.id == 7) {
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

export const columns = [
  {
    field: "brand",
    headerName: "Brand",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    align: "center",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "jan",
    headerName: "Jan",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "feb",
    headerName: "Feb",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "mar",
    headerName: "Mar",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "apr",
    headerName: "Apr",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "may",
    headerName: "May",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "jun",
    headerName: "Jun",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "jul",
    headerName: "July",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "aug",
    headerName: "Aug",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "sep",
    headerName: "Sep",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "oct",
    headerName: "Oct",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "nov",
    headerName: "Nov",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "dec",
    headerName: "Dec",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
  },
  {
    field: "avg",
    headerName: "Average",
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value}
      </div>
    ),
    headerClassName: "last-column",
    cellClassName: "last-column",
  },
];

// Apply getRowClassName to the DataGrid component
// Example usage in your DataGrid component
/*
<DataGrid
  rows={rows}
  columns={columns}
  getRowClassName={getRowClassName}
  // ...other props
/>
*/

// Add CSS for the last-row class
/*
.last-row {
  background-color: #f0f0f0; // Set your desired background color
}
*/
