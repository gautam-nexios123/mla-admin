import { Box, useMediaQuery } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { csvDatacolumns } from "../MarketSaleDataTable/TableColumn";

const MatchResultTable = ({ rows, csvDataRows, loading, columns }) => {
  const gridApiRef = useGridApiRef();
  const isMobile = useMediaQuery("(max-width:600px)");

  const filterMatchMLASaleData =
    rows &&
    rows?.filter(
      (item) => item?.color === "yellow" || item?.color === "green"
    );
  const filterMatchMarketSaleData =
    csvDataRows &&
    csvDataRows?.filter(
      (item) => item?.color === "yellow" || item?.color === "green"
    );

  const adjustedColumns = columns?.map((column) => ({
    ...column,
    minWidth: isMobile ? 100 : column.minWidth || 100,
    maxWidth: isMobile ? 250 : column.maxWidth || undefined,
    width: isMobile ? 250 : column.width || undefined,
    flex: isMobile ? 1 : column.flex || undefined,
  }));

  const adjustedColumns2 = csvDatacolumns.map((column) => ({
    ...column,
    minWidth: isMobile ? 100 : column.minWidth || 100,
    maxWidth: isMobile ? 250 : column.maxWidth || undefined,
    width: isMobile ? 250 : column.width || undefined,
    flex: isMobile ? 1 : column.flex || undefined,
  }));

  return (
    <div className="mt-[20px] px-[16px]">
      <Box className="heightyy" sx={{ width: "100%", marginBottom: "25px" }}>
        <div
          className={
            filterMatchMLASaleData?.length > 0
              ? `h-[450px] overflow-y-scroll`
              : `h-[250px]`
          }
          style={{ overflowY: "auto" }}
        >
          <DataGridPro
            loading={loading}
            rows={filterMatchMLASaleData}
            apiRef={gridApiRef}
            columns={adjustedColumns}
            getRowHeight={() => "auto"}
            pagination={false}
            hideFooter
            disableRowSelectionOnClick
            getRowClassName={(params) => params?.row?.color === "green" ? `!bg-[#00FF00] hover:!bg-[#00FF00]` : params?.row?.color === "yellow" ? `!bg-[#ffff40] hover:!bg-[#ffff40]` : ""}
            sx={{
              border: 1,
              width: "100%",
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
                borderBottom: "lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "15px 0px",
              },
              "& .MuiDataGrid-row:last-child ": {
                borderBottom: "1px solid lightgray",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "inherit", // Removes hover effect
              },
            }}
            disableColumnMenu
            checkboxSelection={false}
          />
        </div>
      </Box>
      <Box className="heightyy" sx={{ width: "100%", marginBottom: "25px" }}>
        <div
          className={
            filterMatchMarketSaleData?.length > 0
              ? `h-[450px] overflow-y-scroll`
              : `h-[250px]`
          }
          style={{ overflowY: "auto" }}
        >
          <DataGridPro
            loading={loading}
            rows={filterMatchMarketSaleData}
            apiRef={gridApiRef}
            columns={adjustedColumns2}
            getRowHeight={() => "auto"}
            pagination={false}
            hideFooter
            disableRowSelectionOnClick
            getRowClassName={(params) => params?.row?.color === "green" ? `!bg-[#00FF00] hover:!bg-[#00FF00]` : params?.row?.color === "yellow" ? `!bg-[#ffff40] hover:!bg-[#ffff40]` : ""}
            sx={{
              border: 1,
              width: "100%",
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
                borderBottom: "lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "15px 0px",
              },
              "& .MuiDataGrid-row:last-child ": {
                borderBottom: "1px solid lightgray",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "inherit", // Removes hover effect
              },
            }}
            disableColumnMenu
            checkboxSelection={false}
          />
        </div>
      </Box>
    </div>
  );
};

export default MatchResultTable;
