import {
  Box,
  Button,
  CardContent,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { useCallback, useEffect, useState } from "react";
import { columns, subColumns } from "./LogFileColumn";
import { Paper, Typography } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import { Controller, useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DigitDisplay from "src/utils/DigitDisplay";

const style = (height) => {
  return {
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
      height: height,
    },
    "& .MuiDataGrid-row:last-child ": {
      borderBottom: "1px solid lightgray",
    },
  };
};

function LogFileTable() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [loading, setLoading] = useState(true);
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState(null);
  const [names, setNames] = useState(null);
  const [filterData, setFilterData] = useState({});

  const methods = useFormContext();
  const { control, getValues } = methods;
  const userActiveRole = useSelector(userActiveRoleState);
  const user: any = useSelector(selectUser);

  const fetchRows = async (page, pageSize, newdata) => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/getStockUpdateLogs?pageNumber=${page + 1}&limit=${pageSize}&stockId=${newdata?.stockId || ""}&name=${newdata?.name || ""}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode == 200) {
        setRows(data?.results?.data);
        setRowCount(data?.results?.totalCount);
        setLoading(false);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const getNameData = async () => {
    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/stock/getStaffNameWhoMakeChanges",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNames(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRows(page, pageSize, filterData);
  }, [page, pageSize, filterData]);

  useEffect(() => {
    getNameData();
  }, []);

  const getDetailPanelContent = useCallback(
    ({ row }: GridRowParams) => {
      const nestedRows = row.difference
        ? Object.entries(row.difference).map(([key, value], index) => ({
            id: `${row.id}-${index}`, // Ensure unique IDs for nested rows
            key: key,
            ...value,
          }))
        : [];

      return (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom component="div">
            Log Details
          </Typography>
          <DataGridPro
            apiRef={apiRef}
            rows={nestedRows}
            columns={subColumns}
            getRowHeight={() => "auto"}
            stickyHeader
            hideFooter
            sx={{
              ...style(50),
              height: "300px",
            }}
            disableColumnMenu
            checkboxSelection={false}
          />
        </Paper>
      );
    },
    [apiRef]
  );

  const getDetailPanelHeight = useCallback(() => "auto", []);

  const handleSubmit = () => {
    setLoading(true);
    const value = getValues();
    const data = {
      stockId: value.stockId,
      name: value.name,
    };
    setFilterData(data);
    setPage(0);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:items-center">
        <CardContent>
          <Controller
            name="stockId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="w-full"
                id="stockId"
                label="stockId"
                autoFocus
                type="text"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </CardContent>
        <CardContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  className=" w-[200px]"
                  id="name"
                  variant="outlined"
                  required
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value={""} disabled>
                    Select Name
                  </MenuItem>
                  {names?.length &&
                    names?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                </Select>
              </>
            )}
          />
        </CardContent>
        <CardContent>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
          >
            Search
          </Button>
        </CardContent>
        <Button
          className="whitespace-nowrap mx-[16px]"
          variant="contained"
          color="secondary"
          onClick={() => {
            setPage(0);
            setFilterData({});
            methods.reset({
              stockId: "",
              name: "",
            });
          }}
        >
          Clear
        </Button>

        {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
          <div className="mx-[16px] flex items-center sm:ml-auto my-[6px] sm:my-0">
            <DigitDisplay user={user} />
          </div>
        )} */}
      </div>
      <Box className="" sx={{ width: "100%" }}>
        <div className="h-[100%]">
          <DataGridPro
            loading={loading}
            apiRef={apiRef}
            rows={rows}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={getDetailPanelHeight}
            columns={columns}
            getRowHeight={() => "auto"}
            stickyHeader
            getRowId={(row) => row._id}
            sx={{ ...style(50), height: "85vh" }}
            disableColumnMenu
            checkboxSelection={false}
            rowSelection={false}
            // pageSizeOptions={[25, 50, 100]}
            pagination={true}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            rowCount={rowCount}
            paginationMode="server"
          />
        </div>
      </Box>
    </>
  );
}

export default LogFileTable;
