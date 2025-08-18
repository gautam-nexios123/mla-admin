// 28417
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { columns } from "./StaffCommissionTableColumn";

const style = (heigth) => {
  return {
    border: 1,
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      height: heigth,
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      justifyContent: "center",
    },
    "& .Mui-selected": {
      backgroundColor: "white !important",
    },
    "& .MuiDataGrid-filler": {
      height: "auto !important",
    },
  };
};

export default function StaffCommissionTable({ commissionData }) {
  const apiRef = useGridApiRef();

  return (
    <DataGridPro
      loading={false}
      apiRef={apiRef}
      rows={commissionData?.staffList}
      columns={columns}
      getRowHeight={() => "auto"}
      pagination={false}
      hideFooter
      sx={style(50)}
      checkboxSelection={false}
      autoHeight
    />
  );
}
