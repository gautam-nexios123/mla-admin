import moment from "moment";
import React from "react";
import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  gridDetailPanelExpandedRowsContentCacheSelector,
} from "@mui/x-data-grid-pro";
import {
  GridExpandMoreIcon,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { IconButton } from "@mui/material";

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
};
function CustomDetailPanelToggle(props) {
  const { id, value: isExpanded } = props;
  const apiRef = useGridApiContext();

  const contentCache = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector
  );

  const hasDetail = React.isValidElement(contentCache[id]);

  return (
    <IconButton
      color="primary"
      size="small"
      tabIndex={-1}
      className="text-base rounded-md"
      aria-label={isExpanded ? "Close" : "Open"}
    >
      View
      <GridExpandMoreIcon
        sx={{
          transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shortest,
            }),
        }}
        fontSize="inherit"
      />
    </IconButton>
  );
}

// const formatValue = (value) => {
//   return moment(value, moment.ISO_8601, true).isValid()
//     ? moment(value).format("DD-MMM-YYYY")
//     : value;
// };

const formatValue = (value) => {
  // Only try to format if it's a string and a valid ISO date
  if (
    typeof value === "string" &&
    moment(value, moment.ISO_8601, true).isValid()
  ) {
    return moment(value).format("DD-MMM-YYYY");
  }
  return typeof value == "number" ? value?.toFixed(2) : value;
};

export const columns = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    minWidth: 80,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params._id} value={params.value} />
    ),
  },
  {
    field: "stockId",
    headerName: "stockId",
    align: "center",
    width: 200,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{params.row.stocks?.stockId}</div>
    ),
  },
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
    field: "createdAt",
    headerName: "CreatedAt",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
    ),
  },
  // {
  //   field: "updatedAt",
  //   headerName: "UpdatedAt",
  //   align: "center",
  //   width: 122,
  //   editable: false,
  //   ...defaultColumnkey,
  //   renderCell: (params) => (
  //     <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
  //   ),
  // },
];

export const subColumns = [
  {
    field: "key",
    headerName: "Key",
    ...defaultColumnkey,
    editable: false,
    minWidth: 450,
    align: "center",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "before",
    headerName: "Before",
    ...defaultColumnkey,
    editable: false,
    align: "center",
    width: 170,
    renderCell: (params) => {
      return <div>{formatValue(params.row.before)}</div>;
    },
  },
  {
    field: "after",
    headerName: "After",
    ...defaultColumnkey,
    width: 170,
    editable: false,
    align: "center",
    renderCell: (params) => (
      <div className="pr-[4px]">{formatValue(params.row.after)}</div>
    ),
  },
];
