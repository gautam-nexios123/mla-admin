import { useDebounce } from "@fuse/hooks";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, useMediaQuery } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import axios, { AxiosError, AxiosResponse } from "axios";
import { csvDataListcolumns } from "./ImportCsvListColumn";

const ImportCSVDataTable = ({
  csvDataRows,
  loading,
  setPage,
  searchQuery,
  setSearchQuery,
  setCsvDataRows,
}) => {
  const gridApiRef = useGridApiRef();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleScrollEnd = () => {
    if (searchQuery === "") {
      setPage((res: any) => res + 1);
    }
  };

  const adjustedColumns = csvDataListcolumns?.map((column: any) => ({
    ...column,
    minWidth: isMobile ? 100 : column.minWidth || 100,
    maxWidth: isMobile ? 250 : column.maxWidth || undefined,
    width: isMobile ? 250 : column.width || undefined,
    flex: isMobile ? 1 : column.flex || undefined,
  }));

  const onSubmitUpdateRowData = async (updatedRow) => {
    const payload = {
      model: updatedRow?.model || null,
      dial: updatedRow?.dial || null,
      strap_bracelet: updatedRow?.strap_bracelet || null,
      bw: updatedRow?.bw || null,
      warranty_year: updatedRow?.warranty_year || null,
      new_type: updatedRow?.new_type || null,
      winning_bid_usd: Number(updatedRow?.winning_bid_usd) || null,
      brand: updatedRow?.brand || null,
    };
    const response = axios.put(
      `https://api-dev.mlawatches.com/api/admin/stock/marketSaleData/${updatedRow?.id}`,
      payload
    );
    response
      .then(
        (res: AxiosResponse<any>) => {
          if (res?.data?.statusCode === 200) {
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          return axiosError;
        }
      )
      .finally(() => {});
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const updatedRow = { ...newRow };
    for (const key in updatedRow) {
      const column = csvDataListcolumns?.find((col) => col.field === key);
      if (column?.editable && typeof updatedRow[key] === "string") {
        updatedRow[key] = updatedRow[key].toUpperCase();
      }
    }

    await onSubmitUpdateRowData(updatedRow);
    return updatedRow;
  };

  const handleSearch = useDebounce((e: any) => {
    if (e.target.value === "") {
      setCsvDataRows([]);
    }
    setPage(1);
    setSearchQuery(e.target.value);
  }, 800);

  return (
    <div className="px-[16px]">
      <div className="w-full flex justify-end">
        <TextField
          size="small"
          // label="Search"
          placeholder="Search"
          className="mb-[15px]"
          onChange={(e) => handleSearch(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div
        className={
          csvDataRows?.length > 0 ? `h-[60vh] overflow-y-scroll` : `h-[400px]`
        }
        style={{ overflowY: "auto" }}
      >
        <DataGridPro
          loading={loading}
          rows={csvDataRows}
          apiRef={gridApiRef}
          columns={adjustedColumns}
          getRowHeight={() => "auto"}
          pagination={false}
          hideFooter
          onRowsScrollEnd={handleScrollEnd}
          processRowUpdate={processRowUpdate}
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
          }}
          checkboxSelection={false}
        />
      </div>
    </div>
  );
};

export default ImportCSVDataTable;
