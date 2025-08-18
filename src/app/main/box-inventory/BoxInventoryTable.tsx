import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import { GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import ConfirmationDialog from "app/shared-components/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "src/app/auth/user/store/userSlice";
import { boxInventoryStatusDropdown } from "src/utils/dropdownlist";
import { columns } from "./BoxInventoryColumn";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import DigitDisplay from "src/utils/DigitDisplay";

function CustomToolbar({ filterStatus, setFilterStatus, filteredCount }) {
  const userRole = useSelector(selectUserRole);
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  // Handle dropdown change
  const handleStatusDChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const findMlaPermision = user?.modulesPermissions?.find(
    (item) => item?.moduleName === "export-csv"
  );
  const findMasterLuxuryPermision = user?.modulesPermissionsMasterLuxury?.find(
    (item) => item?.moduleName === "export-csv"
  );

  const getShowExportButton = () => {
    if (userRole === "SUPER_ADMIN") {
      return true;
    } else {
      if (userActiveRole === "MLA") {
        return findMlaPermision?.isView;
      } else {
        return findMasterLuxuryPermision?.isView;
      }
    }
  };

  return (
    <div className="pb-4 pt-[10px]">
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
          className="table-global-filter"
        />
        <FormControl sx={{ width: 200, marginLeft: "15px" }}>
          <TextField
            id="filter"
            select
            label="Filter"
            value={filterStatus || ""}
            onChange={handleStatusDChange}
            variant="outlined"
            fullWidth
          >
            {boxInventoryStatusDropdown?.map((brand) => (
              <MenuItem value={brand}>{brand}</MenuItem>
            ))}
          </TextField>
        </FormControl>
        <Box sx={{ marginLeft: "15px", display: "flex", alignItems: "center" }}>
          <span className="font-semibold text-[18px]">
            Filtered Count: {filteredCount}
          </span>
        </Box>

        <div className="flex flex-col sm:flex-row sm:ml-auto gap-6">
          {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
            <div className="mx-[15px] flex items-center">
              <DigitDisplay user={user} />
            </div>
          )} */}

          {getShowExportButton() && (
            <>
              <div className="w-fit">
                <GridToolbarExport
                  slotProps={{
                    tooltip: { title: "Export data" },
                    button: { variant: "outlined" },
                    // toolbar: {
                    //   csvOptions: {
                    //     includeHeaders: true,
                    //     fields: ['status','ny_la','id']
                    //   }
                    // }
                  }}
                />
              </div>
            </>
            // <Button  size='small' variant="outlined" color="primary" startIcon={<CloudUploadIcon />} onClick={handleClickPublish}>
            //   Publish
            // </Button>
          )}
        </div>
      </GridToolbarContainer>
    </div>
  );
}

function BoxInventoryTable() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [loading, setLoading] = useState(true);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Available");
  const [filteredCount, setFilteredCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    getBoxInventory();
  }, [filterStatus]);

  // ====== get-box-Inventory-data ======//
  const getBoxInventory = async (status = "") => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/boxInventory?filterBasedOnStatus=${filterStatus}`,
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
        setRows(data.results.data);
        setFilteredCount(data.results.data.length);
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
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://api-dev.mlawatches.com/api/admin/boxInventory/delete/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.statusCode == 200) {
        enqueueSnackbar("Data Delete successfully!", { variant: "success" });
        getBoxInventory();
        handleClose();
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting row:", error);
      enqueueSnackbar("Failed to Please try again.", { variant: "error" });
    }
  };

  const handleClickOpen = (id: any) => {
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ====== status-row-update ======//
  const handleRowUpdate = async (newRow, oldRow) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      try {
        const response = await fetch(
          `https://api-dev.mlawatches.com/api/admin/boxInventory/${newRow.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newRow),
          }
        );
        const data = await response.json();

        // Check if update was successful
        if (data.statusCode === 200) {
          return { ...newRow };
        } else {
          enqueueSnackbar("Failed to update status. Please try again.", {
            variant: "error",
          });
          return oldRow;
        }
      } catch (error) {
        enqueueSnackbar("Failed to update status. Please try again.", {
          variant: "error",
        });
        return oldRow;
      }
    }
    return newRow;
  };

  return (
    <>
      <Box className="heightyy" sx={{ height: "95vh", width: "100%" }}>
        <DataGridPro
          loading={loading}
          rows={rows}
          apiRef={gridApiRef}
          processRowUpdate={handleRowUpdate}
          columns={columns(handleClickOpen)}
          getRowHeight={() => "auto"}
          stickyHeader
          pagination={false}
          hideFooter
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: { filterStatus, setFilterStatus, filteredCount },
          }}
          sx={{
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
      </Box>
      <ConfirmationDialog
        isDelete={true}
        title={"Delete"}
        open={open}
        handleDelete={handleDelete}
        handleClose={handleClose}
      />
    </>
  );
}

export default BoxInventoryTable;
