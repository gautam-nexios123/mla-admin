import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Checkbox, IconButton } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { useEffect } from "react";

const navigationConfig = [
  { id: "inventory-in-stock", title: "Inventory In Stocks" },
  { id: "inventory-sold-pending", title: "Inventory SOLD Pending" },
  { id: "inventory-sold-completed", title: "Inventory SOLD completed" },
  { id: "analysis", title: "Analysis" },
  { id: "inventory-retail-price", title: "Inventory Retail Price" },
  { id: "export-csv", title: "Export" },
];

function MasterLuxuryPermissionTable({
  rows,
  setRows,
  editMode,
  isMasterLuxuryValue,
}) {
  const gridApiRef = useGridApiRef();

  useEffect(() => {
    if (!isMasterLuxuryValue) {
      const resetRows = rows?.map((row) => ({
        ...row,
        isView: false,
        isEdit: false,
        // isPriceEdit: false,
        subModules:
          row?.subModules?.map((subModule) => ({
            ...subModule,
            isView: false,
            isEdit: false,
            // isPriceEdit: false,
          })) || [],
      }));
      setRows(resetRows);
    }
  }, [isMasterLuxuryValue]);

  const handleCheckboxChange =
    (moduleName, field, isSubModule = false, parentModuleName = "") =>
    async (event) => {
      if (!editMode) return;

      // const updatedRows = rows.map((row) => {
      //   if (isSubModule && row.moduleName === parentModuleName) {
      //     const updatedSubModules = row.subModules.map((subModule) =>
      //       subModule.moduleName === moduleName
      //         ? { ...subModule, [field]: event.target.checked }
      //         : subModule
      //     );
      //     return { ...row, subModules: updatedSubModules };
      //   } else if (!isSubModule && row.moduleName === moduleName) {
      //     return { ...row, [field]: event.target.checked };
      //   }
      //   return row;
      // });

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

      // const sanitizedRows = updatedRows.map((row) => {
      //   // Recursively remove isExpanded from the row and its submodules
      //   const sanitizeRow = (r) => {
      //     const { isExpanded, ...sanitized } = r;
      //     return {
      //       ...sanitized,
      //       subModules: sanitized.subModules
      //     };
      //   };

      //   return sanitizeRow(row);
      // });

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
  };

  const columns: any = [
    {
      field: "moduleName",
      headerName: "Module Name",
      width: 200,
      ...defaultColumnProps,
      renderHeader: () => (
        <div className="font-600 text-center">
          Module Name <br />
          (Master Luxury)
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
                const newRows = rows.map((row) =>
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
          disabled={
            params.row.subModules?.length > 0 || !isMasterLuxuryValue
              ? true
              : !editMode
          }
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
          disabled={
            params.row.subModules?.length > 0 || !isMasterLuxuryValue
              ? true
              : !editMode
          }
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
      <div className="px-32 max-h-[220px]">
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MasterLuxuryPermissionTable;
