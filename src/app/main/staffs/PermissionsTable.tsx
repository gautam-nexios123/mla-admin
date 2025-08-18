import React, { useEffect } from "react";
import { Typography, Checkbox, IconButton, Box } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GridCellParams } from "@mui/x-data-grid";

const cellClassName = (params: GridCellParams<any, number>) => {
  const lastColumnModules = [
    "general-setting",
    "commision-report",
    "staff",
    "activity-log",
    "vintage",
  ];
  if (
    params.field === "moduleName" &&
    lastColumnModules.includes(params.row.moduleName)
  ) {
    return "last-column";
  }
  return "";
};

const navigationConfig = [
  { id: "inventory-in-stock", title: "Inventory In Stocks" },
  { id: "inventory-sold-pending", title: "Inventory SOLD Pending" },
  { id: "online-orders", title: "Orders" },
  { id: "inventory-sold-completed", title: "Inventory SOLD completed" },
  { id: "box-inventory", title: "Box inventory" },
  { id: "price-finder", title: "Price finder" },
  { id: "stock-replacement", title: "Stock replacement" },
  { id: "wish-list", title: "Wish list" },
  { id: "create-package", title: "Create package" },
  { id: "package-history", title: "Package history" },
  { id: "shipping-package", title: "Shipping Package" },
  { id: "share-inventory", title: "Share Inventory" },
  { id: "analysis", title: "Analysis" },
  { id: "statistic", title: "Statistic" },
  { id: "log-file", title: "Log file" },
  { id: "customers", title: "Customers" },
  { id: "export-csv", title: "Export" },
  // { id: "retail-inventory", title: "Retail Inventory" },
  { id: "settings", title: "Setting" },
  { id: "general-setting", title: "General Setting" },
  { id: "commision-report", title: "Commision Report" },
  { id: "staff", title: "Staff" },
  { id: "activity-log", title: "Activity Log" },
  { id: "vintage", title: "Vintage" },
  { id: "price-display-config", title: "Price Display Config" },
  { id: "inventory-cost", title: "Inventory Cost" },
];

function PermissionsTable({ rows, setRows, editMode , isMlaValue }) {
  const gridApiRef = useGridApiRef();

  useEffect(() => {
    if (!isMlaValue) {
      const resetRows = rows?.map((row) => ({
        ...row,
        isView: false,
        isEdit: false,
        subModules: row?.subModules?.map((subModule) => ({
          ...subModule,
          isView: false,
          isEdit: false,
        })) || [],
      }));
      setRows(resetRows);
    }
  }, [isMlaValue]);

  const handleCheckboxChange =
    (moduleName, field, isSubModule = false, parentModuleName = "") =>
    async (event) => {
      if (!editMode) return;

      const updatedRows = rows.map((row) => {
        if (isSubModule && row.moduleName === parentModuleName) {
          const updatedSubModules = row.subModules.map((subModule) =>
            subModule.moduleName === moduleName
              ? { ...subModule, [field]: event.target.checked }
              : subModule
          );
          const isAnySubModuleFieldChecked = updatedSubModules.some(
            (subModule) => subModule[field]
          );

          return {
            ...row,
            subModules: updatedSubModules,
            [field]: isAnySubModuleFieldChecked ? true : false,
          };
        } else if (!isSubModule && row.moduleName === moduleName) {
          return { ...row, [field]: event.target.checked };
        }
        return row;
      });

      setRows(updatedRows);
    };

  const defaultColumnProps = {
    filterable: false,
    hideSortIcons: false,
    pinnable: false,
    resizable: false,
    sortable: false,
    headerAlign: "left",
    align: "left",
    editable: false,
    cellClassName,
  };

  const columns: any = [
    {
      field: "moduleName",
      headerName: "Module Name",
      width: 200,
      ...defaultColumnProps,
      renderHeader: () => (
        <div className="font-600 text-center">
          Module Name <br /> (MLA)
        </div>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {navigationConfig.find((nav) => nav.id === params.row.moduleName)
            ?.title || params.row.moduleName}
          {params.row.subModules?.length > 0 && (
            <IconButton
              size="small"
              onClick={() => {
                const newRows = rows?.map((row) =>
                  row.moduleName === params.row.moduleName
                ? { ...row, isExpanded: !row.isExpanded }
                : row
              );
                setRows(newRows);
              }}
            >
              <ExpandMoreIcon
                sx={{
                  transform: params.row.isExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: "isView",
      headerName: "View",
      width: 100,
      ...defaultColumnProps,
      renderHeader: () => <div className="font-600 text-center">View</div>,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={handleCheckboxChange(
            params.row.moduleName,
            "isView",
            params.row.isSubModule,
            params.row.parentModuleName
          )}
          // disabled={!editMode}
          disabled={params.row.subModules?.length > 0 || !isMlaValue ? true : !editMode}
        />
      ),
    },
    {
      field: "isEdit",
      headerName: "Edit",
      width: 100,
      ...defaultColumnProps,
      renderHeader: () => <div className="font-600 text-center">Edit</div>,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={handleCheckboxChange(
            params.row.moduleName,
            "isEdit",
            params.row.isSubModule,
            params.row.parentModuleName
          )}
          // disabled={!editMode}
          disabled={params.row.subModules?.length > 0 || !isMlaValue ? true : !editMode}
        />
      ),
    },
  ];

  const getSubRows = (row) => {
    return (
      row.subModules?.map((subModule) => ({
        id: `${row?.moduleName}-${subModule?.moduleName}`,
        moduleName: subModule?.moduleName,
        isView: subModule?.isView,
        isEdit: subModule?.isEdit,
        isSubModule: true,
        parentModuleName: row?.moduleName,
      })) || []
    );
  };

  const expandedRows = rows?.flatMap((row) => [
    {
      ...row,
      id: row.moduleName, // Ensure top-level modules have unique IDs
    },
    ...(row.isExpanded ? getSubRows(row) : []),
  ]);

  return (
    <div>
      <div className={`px-32 ${rows[rows?.length - 1]?.isExpanded ? "max-h-[740px]" : "max-h-[590px]"}`}>
        <Typography className="pb-16 text-2xl font-semibold leading-tight">
          Permissions
        </Typography>
        <div style={{ height: "auto", width: "100%" }}>
          <DataGridPro
            rows={expandedRows}
            apiRef={gridApiRef}
            columns={columns}
            // stickyHeader
            pagination={false}
            hideFooter
            getRowHeight={() => "auto"}
            getRowId={(row) => row.id}
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableRowSelectionOnClick
            disableVirtualization
            checkboxSelection={false}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "inherit",
                },
              },
              "& .MuiCheckbox-root": {
                border: "none",
                padding: "0",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none", // Remove focus outline on cells
              },
              "& .last-column": {
                paddingLeft: "25px",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PermissionsTable;
