import { useThemeMediaQuery } from "@fuse/hooks";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Checkbox } from "@mui/material";
import Box from "@mui/material/Box";
import {
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  DataGridPro,
  GridPinnedColumnFields,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "src/app/auth/user/store/userSlice";
import {
  calculateDayFromPurchaseDate,
  formatDateAnyFormat,
  hideFullSerial,
} from "src/utils/coreFunction";
import { stockIdMaster } from "src/utils/stockMaster";
import { columns, masterLuxuryColumns } from "./StockColumn";
import DigitDisplay from "src/utils/DigitDisplay";

function CustomToolbar(props) {
  const session = localStorage.getItem(`jwt_access_token`);
  const { rows, setRows, setRowModesModel } = props;
  const userRole = useSelector(selectUserRole);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const handleClickAdd = () => {
    // const id = Math.floor(26000 + (50000 - 26000) * Math.random());
    let lastRow = rows[rows.length - 1].id;
    const currentMaster = stockIdMaster.findIndex((i) => i === lastRow);
    const id = stockIdMaster[currentMaster + 1];
    const rows_no = Math.max(...rows.map((o) => o.rows_no)) + 1;
    let imageUrl = `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${id}.jpg`;
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
        // Authorization: `Bearer ${loginResult.token}`, // 👈 New Code
        // ...headerParams
      },
      body: JSON.stringify({
        rows_no: rows_no,
        id: id,
        imageUrl: imageUrl,
      }),
      //...body,
    })
      // .then((result) => {
      //   // console.log(result)
      // })
      .catch((error) => console.error(error));
    // console.log('rows',rows.length)
    setRows((oldRows) => [
      ...oldRows,
      {
        rows_no,
        id,
        status: "",
        ny_la: "",
        imageUrl: "",
        // id': '',
        brand: "",
        model: "",
        description: "",
        collection: "",
        full_serial_number_not_in_link: "",
        serial_no: "",
        dial: "",
        strap_bracelet: "",
        num_of_links: "",
        paper: "",
        paper_date: "",
        watch_box: "",
        condition: "",
        minimum_wholesale_price_usd: "",
        wholesale_price_usd: "",
        retail_price_usd: "",
        location: "",
        cost_usd: "",
        qb: "MLA",
        sold_price: "",
        notes: "",
        internal_notes: "",
        product_type: "WATCH",
        new_type: "",
        watch_from: "",
        auct: "",
        japan_box: "",
        lot: "",
        have_link: "N",
        purchase_date: `${new Date()}`,
        sold_date: "",
        ch24_usd_6: "",
        days_from_purchase_date: "",
        total_images: 1,
        have_video: "N",
        public_image: "N",
        manual_overwrite_minimum_and_wholesale_price: "N",
        minimum_wholesale_price_usd_only_mla: "",
        manualmin_price: "",
        suggested_wholesale_price_usd_only_mla: "",
        column_r_min_price: "",
        range: "",
        column_s_wholesale_price: "",
        manual_max_price: "",
        total_amount_decreased_from_wholesale_price: "",
        w_s_price_decrease_every_n_days_starting_from_day_50: "",
        wholesale_price_will_decrease_next_date: "",
        hold_sold_on_date: "",
        wholesale_price_decreased_after_x_days_from_purchase_date: "",
        extra_300_for_rx_where_wholesale_price_20: "",
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "id" },
    }));
  };

  const handleClickPublish = () => {
    // console.log(`publish with ${rows.filter(f => f.have_link == 'Y').length} Rows`)
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/publish-stock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${loginResult.token}`, // 👈 New Code
        // ...headerParams
      },
      //...body,
    })
      // .then((result) => {
      //   // console.log(result)
      // })
      .catch((error) => console.error(error));
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
    <div className="pb-4">
      <GridToolbarContainer>
        {/* <Button size='small' variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleClickAdd}>
        Add
      </Button>
      <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton />
        {/* <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      /> */}
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
          className="table-global-filter"
        />
        <Box sx={{ flexGrow: 1 }} />

        {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
          <div className="mx-[15px] flex items-center">
            <DigitDisplay user={user} />
          </div>
        )} */}

        {getShowExportButton() && (
          <GridToolbarExport
            slotProps={{
              tooltip: { title: "Export data" },
              button: { variant: "outlined" },
            }}
          />
        )}
        {/* <Box sx={{ flexGrow: 1 }} /> */}
        {/* {userRole === 'SUPER_ADMIN' && (
        <Button size='small' variant="outlined" color="primary" startIcon={<CloudUploadIcon />} onClick={handleClickPublish}>
          Publish
        </Button>
      )} */}

        {/* <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      /> */}
      </GridToolbarContainer>
    </div>
  );
}

export default function StocksSoldTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const user: any = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const userActiveRole: any = useSelector(userActiveRoleState);
  const columnsByUser =
    userActiveRole === "MLA" ? columns : masterLuxuryColumns;

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: isMobile ? [] : ["rows_id", "status", "ny_la", "imageUrl", "id"],
    });
  const [clickedField, setClickedField] = React.useState<string>("");

  const handleCellClick = (params) => {
    const fieldName = params.field; // Get the name of the clicked field
    const rowId = params.id; // Get the ID of the clicked row
    setClickedField(fieldName);
  };

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    []
  );

  const columnsModifiedMasterLuxury = React.useMemo(() => {
    const findMasteColumnEditable = user?.modulesPermissionsMasterLuxury?.find(
      (item) => item?.moduleName === "inventory-sold-pending"
    );

    const findMastePriceEditable = user?.modulesPermissionsMasterLuxury?.find(
      (item) => item?.moduleName === "inventory-retail-price"
    );

    const handleChangeCheckBox = async (event, params) => {
      const payload = {
        [event.target.name]: event.target.checked,
      };

      await axios
        .put(
          userActiveRole === "MLA"
            ? `https://api-dev.mlawatches.com/api/admin/stock/${params?.id}?tab=2`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${params?.id}?tab=2`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
          }
        )
        .then((response) => {
          const result = response.data; // axios stores the response data in `response.data`
          if (result.statusCode === 403) {
            enqueueSnackbar(
              "Unauthorized access. You don't have permission to view or edit this content.",
              { variant: "error" }
            );
          } else {
            fetchData();
          }
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    };

    return columnsByUser?.map((item) => {
      if (
        item.field === "markup_price" ||
        item.field === "retail_sold_price" ||
        item.field === "sold_date"
      ) {
        return {
          ...item,
          editable: findMastePriceEditable?.isEdit,
        };
      }
      if (
        item.field === "description1" ||
        item.field === "description2" ||
        item.field === "internal_notes1" ||
        item.field === "internal_notes2" ||
        item.field === "movement" ||
        item.field === "caliber" ||
        item.field === "powerReserve" ||
        item.field === "date" ||
        item.field === "complications" ||
        item.field === "caseShape" ||
        item.field === "caseMaterial" ||
        item.field === "caseDiameter" ||
        item.field === "crystalMaterial" ||
        item.field === "caseBack" ||
        item.field === "bezel" ||
        item.field === "bezelMaterial" ||
        item.field === "hourMarkers" ||
        item.field === "dialColor" ||
        item.field === "braceletColor" ||
        item.field === "braceletMaterial" ||
        item.field === "claspStyle" ||
        item.field === "gender" ||
        item.field === "waterResistance" ||
        item.field === "comesWith"
      ) {
        return {
          ...item,
          editable: findMasteColumnEditable?.isEdit,
        };
      }

      if (
        item.field === "isRareWatch" ||
        item.field === "isYoutube" ||
        item.field === "isFacebook" ||
        item.field === "isInstagram" ||
        item.field === "isMasterLuxuryPublish"
      ) {
        return {
          ...item,
          renderCell: (params) => {
            return (
              <div className="font-500">
                <Checkbox
                  name={params?.field}
                  checked={params?.value}
                  onChange={
                    findMasteColumnEditable?.isEdit
                      ? (e) => handleChangeCheckBox(e, params)
                      : undefined
                  }
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CircleIcon />}
                />
              </div>
            );
          },
        };
      }

      return item;
    });
  }, [user, columnsByUser]);

  const columnsModifiedMLA = React.useMemo(() => {
    // If user role is SUPER_ADMIN, make cost_usd visible and editable
    const handleChangeCheckBox = async (event, params) => {
      const payload = {
        [event.target.name]: event.target.checked ? "Y" : "N",
      };

      await axios
        .put(
          userActiveRole === "MLA"
            ? `https://api-dev.mlawatches.com/api/admin/stock/${params?.id}?tab=2`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${params?.id}?tab=2`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
          }
        )
        .then((response) => {
          const result = response.data; // axios stores the response data in `response.data`
          if (result.statusCode === 403) {
            enqueueSnackbar(
              "Unauthorized access. You don't have permission to view or edit this content.",
              { variant: "error" }
            );
          } else {
            fetchData();
          }
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    };

    if (user?.role === "SUPER_ADMIN") {
      return columnsByUser?.map((item) => {
        if (item.field === "cost_usd") {
          return {
            ...item,
            editable: true,
          };
        }

        if (
          item.field === "isOnlineMasterLuxury" ||
          item.field === "have_link" ||
          item.field === "isOnlineSpecial"
        ) {
          return {
            ...item,
            renderCell: (params) => {
              return (
                <div className="font-500">
                  <Checkbox
                    name={params?.field}
                    checked={params?.value === "Y" ? true : false}
                    onChange={(e: any) => handleChangeCheckBox(e, params)}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CircleIcon />}
                  />
                </div>
              );
            },
          };
        }

        return item;
      });
    }

    // Existing logic for other users
    const inventoryCostModules = user.modulesPermissions.find(
      (module) => module.moduleName === "inventory-cost"
    );

    if (!inventoryCostModules) return columnsByUser;

    return columnsByUser
      .map((item) => {
        if (item.field === "cost_usd" && inventoryCostModules?.isView) {
          return {
            ...item,
            editable: inventoryCostModules.isEdit,
          };
        }

        if (!inventoryCostModules?.isView && item.field === "cost_usd") {
          return null;
        }

        if (
          item.field === "isOnlineMasterLuxury" ||
          item.field === "have_link" ||
          item.field === "isOnlineSpecial"
        ) {
          return {
            ...item,
            renderCell: (params) => {
              return (
                <div className="font-500">
                  <Checkbox
                    name={params?.field}
                    checked={params?.value === "Y" ? true : false}
                    onChange={(e: any) => handleChangeCheckBox(e, params)}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CircleIcon />}
                  />
                </div>
              );
            },
          };
        }

        return item;
      })
      .filter(Boolean);
  }, [user, columnsByUser]);

  const columnsModified =
    userActiveRole === "MLA" ? columnsModifiedMLA : columnsModifiedMasterLuxury;

  async function fetchData() {
    try {
      const response = await fetch(
        userActiveRole === "MLA"
          ? "https://api-dev.mlawatches.com/api/admin/stock?tab=2"
          : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury?tab=2`,
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
        setRows(data?.results ?? []);
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
  }
  React.useEffect(() => {
    fetchData();
    if (props.isChangeTab != 1) {
      console.log("changeTabs", props.isChangeTab);
      setRows([]);
    }
  }, [props.isChangeTab, userActiveRole]);

  const roundValue = (value, showDecimal = false) => {
    // Convert value to string and split it into integer and decimal parts
    const [integerPart, decimalPart] = value.toFixed(2).toString().split(".");
    const formattedValue = integerPart;
    return Number(formattedValue);
  };

  const watchStatus = (status) => {
    return status === "Available" ? "" : status;
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    // console.log('newRow',newRow)
    if (newRow.status === "Sold") {
      setOpen(true);
    }
    const fullSerialNo = newRow.full_serial_number_not_in_link;
    if (fullSerialNo && !newRow.serial_no) {
      newRow.serial_no = hideFullSerial(fullSerialNo);
    }

    const cost = newRow.cost_usd;
    const product_type = newRow.product_type;
    newRow.minimum_wholesale_price_usd_only_mla =
      newRow.minimum_wholesale_price_usd_only_mla
        ? newRow.minimum_wholesale_price_usd_only_mla
        : 0;
    newRow.minimum_wholesale_price_usd = newRow.minimum_wholesale_price_usd
      ? newRow.minimum_wholesale_price_usd
      : 0;
    newRow.wholesale_price_usd = newRow.wholesale_price_usd
      ? newRow.wholesale_price_usd
      : 0;
    newRow.retail_price_usd = newRow.retail_price_usd
      ? newRow.retail_price_usd
      : 0;
    newRow.cost_usd = newRow.cost_usd ? newRow.cost_usd : 0;
    newRow.manual_max_price = newRow.manual_max_price
      ? newRow.manual_max_price
      : 0;
    newRow.manualmin_price = newRow.manualmin_price
      ? newRow.manualmin_price
      : 0;

    newRow.sold_price = newRow.sold_price ? newRow.sold_price : 0;
    newRow.wholesale_price_decreased_after_x_days_from_purchase_date =
      newRow.wholesale_price_decreased_after_x_days_from_purchase_date
        ? newRow.wholesale_price_decreased_after_x_days_from_purchase_date
        : 0;
    newRow.wholesale_price_usd = newRow.wholesale_price_usd
      ? newRow.wholesale_price_usd
      : 0;
    newRow.wholesale_price_will_decrease_next_date =
      newRow.wholesale_price_will_decrease_next_date
        ? newRow.wholesale_price_will_decrease_next_date
        : 0;
    newRow.suggested_wholesale_price_usd_only_mla =
      newRow.suggested_wholesale_price_usd_only_mla
        ? newRow.suggested_wholesale_price_usd_only_mla
        : 0;
    newRow.total_amount_decreased_from_wholesale_price =
      newRow.total_amount_decreased_from_wholesale_price
        ? newRow.total_amount_decreased_from_wholesale_price
        : 0;
    newRow.w_s_price_decrease_every_n_days_starting_from_day_50 =
      newRow.w_s_price_decrease_every_n_days_starting_from_day_50
        ? newRow.w_s_price_decrease_every_n_days_starting_from_day_50
        : 0;

    newRow.column_r_min_price = newRow.column_r_min_price
      ? newRow.column_r_min_price
      : 0;
    newRow.range = newRow.range ? newRow.range : 0;
    newRow.column_s_wholesale_price = newRow.column_s_wholesale_price
      ? newRow.column_s_wholesale_price
      : 0;
    newRow.cost_for_min_w_price_formula = newRow.cost_for_min_w_price_formula
      ? newRow.cost_for_min_w_price_formula
      : 0;
    newRow.extra_300_for_rx_where_wholesale_price_20 =
      newRow.extra_300_for_rx_where_wholesale_price_20
        ? newRow.extra_300_for_rx_where_wholesale_price_20
        : 0;
    if (newRow.purchase_date != null && newRow.purchase_date != "") {
      newRow.days_from_purchase_date = calculateDayFromPurchaseDate(
        newRow.purchase_date
      );
    }
    if (newRow.status == "Available") {
      newRow.have_link = "N";
    }
    // && cost !== currentData.cost
    newRow.userStaffId = user?.id;
    const localDate = formatDateAnyFormat(newRow?.paper_date);
    newRow.paper_date = newRow?.paper_date ? localDate : null;

    // const payload = {
    //   ...newRow,
    //   paper_date: moment(newRow?.paper_date).format("YYYY-MM-DD"),
    // };

    if (!newRow?.modelName && clickedField === "model") {
      await axios
        .get(
          `https://api-dev.mlawatches.com/api/admin/stock/modelName/detail?model=${newRow?.model}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
          }
        )
        .then((response) => {
          const result = response?.data; // axios stores the response data in `response.data`
          newRow.modelName = result?.results?.modelName
            ? result?.results?.modelName
            : "";
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    }

    await fetch(
      userActiveRole === "MLA"
        ? `https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}?tab=2`
        : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${newRow.id}?tab=2`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
          // ...headerParams
        },
        body: JSON.stringify(newRow),
        //...body,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        fetchData();
        if (result.statusCode === 403) {
          enqueueSnackbar(
            "Unauthorized access. You don't have permission to view or edit this content.",
            { variant: "error" }
          );
        }
      })
      .catch((error) => console.error(error));
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows?.map((row) => (row?.id === newRow?.id ? updatedRow : row)));
    return updatedRow;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const gridRef = React.useRef(null);

  // Automatically focus the grid on mount

  React.useEffect(() => {
    const gridEl = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );

    const handleKeyDown = (e) => {
      if (!gridEl) return;

      const scrollAmount = 50; // px per arrow press
      switch (e.key) {
        case "ArrowUp":
          gridEl.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "ArrowDown":
          gridEl.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowLeft":
          gridEl.scrollLeft -= scrollAmount;
          e.preventDefault();
          break;
        case "ArrowRight":
          gridEl.scrollLeft += scrollAmount;
          e.preventDefault();
          break;
      }
    };

    gridEl?.addEventListener("keydown", handleKeyDown);
    return () => gridEl?.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box sx={{ height: "95vh", width: "100%" }} ref={gridRef}>
      <DataGridPro
        rows={rows}
        loading={loading}
        columns={columnsModified}
        getRowHeight={() => "auto"}
        // stickyHeader
        pagination={false}
        hideFooter
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
        processRowUpdate={processRowUpdate}
        onCellClick={handleCellClick}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: 100,
          },
          "& .custom-header-villot": {
            backgroundColor: "#bebceb",
            fontWeight: "bold",
          },
          "& .custom-header-green": {
            backgroundColor: "#d7e8d7",
            fontWeight: "bold",
          },
        }}
        checkboxSelection={false}
      />
    </Box>
  );
}
