// 28417
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useThemeMediaQuery } from "@fuse/hooks";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  Modal,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  DataGridPro,
  GridPinnedColumnFields,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "src/app/auth/user/store/userSlice";
import {
  OFFICE_LOC,
  WATCH_LOACTION,
  brandNameMap,
  calculateCAExtra,
  calculateCH24Usd_6,
  calculateColS_WhosalePrice,
  calculateDayFromPurchaseDate,
  calculateDecreasePriceEveryNDays,
  calculateMinimumWholesalePriceForBags,
  calculateMinimumWhosalePriceFromCost,
  calculateR_MinPrice,
  calculateRange,
  calculateRetailPrice,
  calculateSuggestWhosalePriceFromCost,
  calculateSuggestedWholesalePriceForBags,
  calculateTotalAmountDecreasedFromWhosalePrice,
  calculateWholesalePriceDecreasedAfterDay,
  calculateWholesalePriceWillDecreaseNext,
  countReverseShippingFeeOnlyN,
  countShipping3PerFeeAndNetCostUsd,
  countShippingFeeAndNetCostUsd,
  countShippingFeeOnlyN,
  formatDateAnyFormat,
  hideFullSerial,
} from "src/utils/coreFunction";
import { stockIdMaster } from "src/utils/stockMaster";
import { columns, masterLuxuryColumns } from "./StockColumn";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import DigitDisplay from "src/utils/DigitDisplay";
import DrawerFilter from "./filter/DrawerFilter";
import { useFilterLocalStorage } from "./filter/useFilterLocalStorage";
import { ClearIcon } from "@mui/x-date-pickers";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function CustomToolbar(props) {
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  const {
    rows,
    setRows,
    setRowModesModel,
    apiRef,
    session,
    setFilter,
    data,
    filteredRows,
    muiFilteredRows,
    filter,
    muiFilterModel,
    setMuiFilterModel,
  } = props;

  const userRole = useSelector(selectUserRole);
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const findMlaPermision = user?.modulesPermissions?.find(
    (item) => item?.moduleName === "export-csv"
  );
  const findMasterLuxuryPermision = user?.modulesPermissionsMasterLuxury?.find(
    (item) => item?.moduleName === "export-csv"
  );

  const {
    filterValueState,
    setFilterValueState,
    resetFilterState,
    clearAllFilters,
    getCheckedItems,
  } = useFilterLocalStorage();

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

  const handleClickAdd = () => {
    // const id = Math.floor(26000 + (50000 - 26000) * Math.random());
    let lastRow = rows[rows.length - 1].id;
    const currentMaster = stockIdMaster.findIndex((i) => i === lastRow);
    const id = stockIdMaster[currentMaster + 1];
    const rows_no = Math.max(...rows.map((o) => o.rows_no)) + 1;
    const rows_id = Math.max(...rows.map((o) => o.rows_id)) + 1;
    let imageUrl = `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${id}.jpg`;
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/create?tab=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`, // 👈 New Code
        // ...headerParams
      },
      body: JSON.stringify({
        rows_no: rows_no,
        id: id,
        userStaffId: user.id,
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
        rows_id,
        id,
        status: "",
        ny_la: "",
        imageUrl,
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
        have_box: "",
        condition: "",
        minimum_wholesale_price_usd: "",
        wholesale_price_usd: "",
        retail_price_usd: "",
        location: "",
        cost_usd: "",
        qb: "MLA",
        sold_price: 0,
        sold_price_box: 0,
        notes: "",
        internal_notes: "",
        product_type: "WATCH",
        new_type: "PRE OWNED",
        watch_from: "",
        auct: "",
        japan_box: "",
        lot: "",
        have_link: "N",
        purchase_date: `${new Date()}`,
        sold_date: "",
        ch24_usd_6: "",
        days_from_purchase_date: 0,
        total_images: 1,
        have_video: "N",
        public_image: "N",
        manual_overwrite_minimum_and_wholesale_price: "N",
        minimum_wholesale_price_usd_only_mla: "",
        minimum_wholesale_price_min_usd_only_mla: "",
        manualmin_price: "",
        suggested_wholesale_price_usd_only_mla: "",
        column_r_min_price: "",
        range: "",
        column_s_wholesale_price: "",
        manual_max_price: "",
        total_amount_decreased_from_wholesale_price: "",
        w_s_price_decrease_every_n_days_starting_from_day_50: "",
        // wholesale_price_will_decrease_next_date: '',
        hold_sold_on_date: "",
        wholesale_price_decreased_after_x_days_from_purchase_date: "",
        extra_300_for_rx_where_wholesale_price_20: "",
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "id" },
    }));
    apiRef.current.scrollToIndexes({
      rowIndex: rows.length - 1,
    });
  };

  const handleClickPublish = () => {
    setPublishLoading(true);
    // console.log(`publish with ${rows.filter(f => f.have_link == 'Y').length} Rows`)
    fetch(
      `https://api-dev.mlawatches.com/api/admin/stock/publish-stock?tab=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`, // 👈 New Code
          // ...headerParams
        },
        //...body,
      }
    )
      // .then((result) => {
      //   // console.log(result)
      // })
      .catch((error) => console.error(error));
    setTimeout(() => {
      setPublishLoading(false);
    }, 4000);
  };
  // console.log(
  //   "piRef.current.state?.pagination?.rowCount: ",
  //   apiRef.current.state?.pagination?.rowCount
  // );
  // console.log(
  //   "Object.keys(filter)?.length: ",
  //   Object.values(filter).every((v) => Array.isArray(v) && v.length === 0)
  // );
  // console.log("muiFilterModel?.items?.length: ", muiFilterModel?.items?.length);
  // console.log(
  //   "muiFilterModel?.quickFilterValues?.length: ",
  //   muiFilterModel?.quickFilterValues?.length
  // );
  // console.log("rows?.length: ", rows?.length);

  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    if (searchValue === "") {
      apiRef.current.setQuickFilterValues([]);
      return;
    }

    const timer = setTimeout(() => {
      apiRef.current.setQuickFilterValues(
        searchValue
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "")
      );
    }, 500); // wait 500ms *after typing stops*

    return () => clearTimeout(timer); // cleanup on next type
  }, [searchValue, apiRef]);

  React.useEffect(() => {
    if (
      Object.values(filter).every((v) => Array.isArray(v) && v.length === 0) ===
        false ||
      muiFilterModel?.items?.length > 0
    ) {
      setSearchValue("");
      apiRef.current.setQuickFilterValues([]);
    }
  }, [filter, muiFilterModel]);

  return (
    <div className="pb-4">
      <GridToolbarContainer>
        {userActiveRole === "MLA" && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickAdd}
          >
            Add
          </Button>
        )}
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {isMobile && (
          <ListItemIcon
            className="w-fit p-0"
            onClick={() => setShowSearch((pre) => !pre)}
          >
            <FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>
          </ListItemIcon>
        )}

        {/* <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      /> */}

        {(!isMobile || showSearch) && (
          // <GridToolbarQuickFilter
          //   quickFilterParser={(searchInput: string) =>
          //     searchInput
          //       .split(",")
          //       .map((value) => value.trim())
          //       .filter((value) => value !== "")
          //   }
          //   className="table-global-filter"
          // />
          <div
            className="relative"
            style={{ display: "flex", alignItems: "center" }}
          >
            <GridToolbarQuickFilter
              value={searchValue}
              onChange={(e) => {
                setMuiFilterModel({
                  items: [],
                  logicOperator: "and" as const,
                  quickFilterValues: [],
                });
                setFilter({
                  brand: [],
                  collection: [],
                  product_type: [],
                  condition: [],
                  have_box: [],
                  paper: [],
                });
                clearAllFilters();
                setSearchValue(e.target.value);
              }}
              className="table-global-filter"
            />
            {searchValue && (
              <div className="absolute top-[2px] right-[17px] z-10">
                <IconButton
                  aria-label="clear search"
                  onClick={() => {
                    setSearchValue("");
                    apiRef.current.setQuickFilterValues([]);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>
        )}

        <DrawerFilter
          rows={rows}
          setFilter={setFilter}
          muiFilteredRows={muiFilteredRows}
        />

        <p style={{ marginLeft: 16, fontWeight: 500 }}>
          Result :
          <span className="font-[600]">
            {apiRef.current.state?.pagination?.rowCount == 0 &&
            Object.values(filter).every(
              (v) => Array.isArray(v) && v.length === 0
            ) &&
            !muiFilterModel?.items?.length &&
            !muiFilterModel?.quickFilterValues?.length
              ? rows?.length
              : apiRef.current.state?.pagination?.rowCount}
          </span>
        </p>

        {/* <Box></Box> */}
        <Box sx={{ flexGrow: 1 }} />
        <div className="flex gap-6 flex-col sm:flex-row">
          {userRole === "SUPER_ADMIN" && userActiveRole === "MLA" && (
            <Button
              disabled={publishLoading}
              type="submit"
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleClickPublish}
            >
              {publishLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "black",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
              Publish
            </Button>
          )}

          {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
            <div className="mx-[15px]">
              <DigitDisplay user={user} />
            </div>
          )} */}

          {getShowExportButton() && (
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
          )}

          {/* // <Button  size='small' variant="outlined" color="primary" startIcon={<CloudUploadIcon />} onClick={handleClickPublish}>
            //   Publish
            // </Button> */}
        </div>

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

export default function StocksProTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = React.useState<any>({
    brand: [],
    collection: [],
    product_type: [],
    condition: [],
    have_box: [],
    paper: [],
  });
  // console.log('filter: ', filter);
  const [currentFilters, setCurrentFilters] = React.useState([]);
  // console.log('currentFilters: ', currentFilters);
  const session = localStorage.getItem(`jwt_access_token`);
  const apiRef = useGridApiRef();
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const columnsByUser =
    userActiveRole === "MLA" ? columns : masterLuxuryColumns;

  const columnsModifiedMasterLuxury = React.useMemo(() => {
    const findMasteColumnEditable = user?.modulesPermissionsMasterLuxury?.find(
      (item) => item?.moduleName === "inventory-in-stock"
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
            ? `https://api-dev.mlawatches.com/api/admin/stock/${params.id}?tab=1`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${params.id}?tab=1`,
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
            ? `https://api-dev.mlawatches.com/api/admin/stock/${params?.id}?tab=1`
            : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${params?.id}?tab=1`,
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
                <div className="font-500 ">
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
      ?.map((item) => {
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

  const [openModel, setOpenModel] = React.useState(false);
  const [shippingOpenModel, setShippingOpenModel] = React.useState(false);
  const [updatedNewRow, setUpdatedNewRow] = React.useState<any>({});
  const [clickedField, setClickedField] = React.useState<string>("");

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: isMobile ? [] : ["rows_id", "status", "imageUrl", "id"],
    });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns: GridPinnedColumnFields) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    []
  );

  async function fetchData() {
    try {
      const response = await fetch(
        userActiveRole === "MLA"
          ? `https://api-dev.mlawatches.com/api/admin/stock?tab=1`
          : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury?tab=1`,
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
        setRows(data?.results?.length ? data?.results : []);

        setData(data?.results?.length ? data?.results : []);

        // if (data?.results?.length > 0) {
        //   for (let i = 0; i < data?.results?.length; i++) {
        //     const ITEM = data?.results[i];
        //     // if (ITEM?.days_from_purchase_date > 4) {
        //     //   UpdateRowFun(ITEM);
        //     // }else{
        //     //   console.log("ITEM", ITEM?.stockId);
        //     // }
        //     UpdateRowFun(ITEM);
        //   }
        // }

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

    if (props.isChangeTab != 0) {
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

  const UpdateRowFun = async (newRow: any) => {
    if (newRow.status === "Sold") {
      setOpen(true);
    }
    const fullSerialNo = newRow.full_serial_number_not_in_link;
    if (fullSerialNo && !newRow.serial_no) {
      newRow.serial_no = hideFullSerial(fullSerialNo);
    }

    const getWatchLoc = OFFICE_LOC[newRow?.location?.toLowerCase()];
    newRow.shipping_fee_one = 0;
    if (clickedField !== "shipping_fee") {
      if (
        // getWatchLoc?.toLowerCase() !== newRow?.watch_from?.toLowerCase() &&
        newRow.manual_overwrite_minimum_and_wholesale_price == "N"
      ) {
        const calShiiping = countShipping3PerFeeAndNetCostUsd(
          newRow?.location,
          newRow?.cost_usd,
          newRow?.purchase_date,
          newRow?.watch_from,
          user,
          newRow?.new_type
        );
        newRow.shipping_fee = calShiiping?.shipping_fee;
        // newRow.net_cost_usd = calShiiping?.net_cost_usd;
      }
    }

    const cost = newRow.cost_usd;
    const product_type = newRow.product_type;

    newRow.minimum_wholesale_price_usd_only_mla =
      newRow.minimum_wholesale_price_usd_only_mla
        ? newRow.minimum_wholesale_price_usd_only_mla
        : 0;
    // newRow.minimum_wholesale_price_usd_only_mla =
    //   newRow.minimum_wholesale_price_usd_only_mla
    //     ? Math.ceil(
    //         (newRow.minimum_wholesale_price_usd_only_mla +
    //           (newRow?.shipping_fee || 0)) /
    //           50
    //       ) * 50
    //     : 0;
    newRow.minimum_wholesale_price_usd = newRow.minimum_wholesale_price_usd
      ? newRow.minimum_wholesale_price_usd
      : 0;
    newRow.minimum_wholesale_price_min_usd_only_mla =
      newRow.minimum_wholesale_price_min_usd_only_mla
        ? newRow.minimum_wholesale_price_min_usd_only_mla
        : 0;
    newRow.wholesale_price_usd = newRow.wholesale_price_usd
      ? newRow.wholesale_price_usd
      : 0;
    newRow.retail_price_usd = newRow.retail_price_usd
      ? newRow.retail_price_usd
      : 0;
    newRow.cost_usd = newRow.cost_usd ? newRow.cost_usd : 0;
    newRow.repair_cost_usd = newRow.repair_cost_usd
      ? newRow.repair_cost_usd
      : 0;
    newRow.manual_max_price = newRow.manual_max_price
      ? newRow.manual_max_price
      : 0;
    newRow.manualmin_price = newRow.manualmin_price
      ? newRow.manualmin_price
      : 0;

    newRow.sold_price = newRow.sold_price ? newRow.sold_price : 0;
    newRow.sold_price_box = newRow.sold_price_box ? newRow.sold_price_box : 0;
    newRow.japan_box = newRow.japan_box ? newRow.japan_box : "";
    newRow.wholesale_price_decreased_after_x_days_from_purchase_date =
      newRow.wholesale_price_decreased_after_x_days_from_purchase_date
        ? newRow.wholesale_price_decreased_after_x_days_from_purchase_date
        : 0;
    newRow.wholesale_price_usd = newRow.wholesale_price_usd
      ? newRow.wholesale_price_usd
      : 0;
    // newRow.wholesale_price_will_decrease_next_date = newRow.wholesale_price_will_decrease_next_date ? newRow.wholesale_price_will_decrease_next_date : 0;
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

    newRow.type = newRow.type ? newRow.type : 0;
    newRow.box_status = newRow.box_status ? newRow.box_status : "";
    newRow.have_box = newRow.have_box ? newRow.have_box : "";
    newRow.msrp = newRow.msrp ? newRow.msrp : "";

    const currentData = rows.find((f) => f.id === newRow.id);

    if (newRow.purchase_date != null && newRow.purchase_date != "") {
      newRow.days_from_purchase_date = calculateDayFromPurchaseDate(
        newRow.purchase_date
      );
    }
    if (currentData.status != "Sold" && newRow.status == "Sold") {
      newRow.sold_date = new Date();
      newRow.hold_sold_on_date = new Date();
    } else if (
      currentData.status == "Sold" &&
      newRow.status != "Sold" &&
      newRow.status != "Move to Archive"
    ) {
      newRow.sold_date = ``;
      newRow.hold_sold_on_date = ``;
      newRow.archived_date = ``;
    } else if (currentData.status == `Move to Archive`) {
      newRow.archived_date = new Date();
    }

    if (clickedField === "manual_final_w_sale_max_price") {
      if (
        newRow.manual_overwrite_minimum_and_wholesale_price == "N" &&
        newRow.product_type != "WATCH (Old Stock)" &&
        newRow.product_type != "WATCH (Old Stock/Vintage)"
      ) {
        const calShiiping = countShippingFeeAndNetCostUsd(
          newRow?.location,
          newRow?.suggested_wholesale_price_usd_only_mla === 0
            ? newRow?.cost_usd
            : newRow?.suggested_wholesale_price_usd_only_mla,
          newRow?.purchase_date,
          newRow?.watch_from,
          user,
          newRow?.new_type,
          Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
        );
        newRow.shipping_fee_one = calShiiping?.shipping_fee;
        // newRow.net_cost_usd = calShiiping?.net_cost_usd;
      }

      newRow.manual_max_price =
        Number(newRow.manual_final_w_sale_max_price) === 0
          ? 0
          : Number(newRow.manual_final_w_sale_max_price) -
            Number(newRow?.shipping_fee_one);
    }

    // && cost !== currentData.cost
    if (
      cost &&
      cost != "" &&
      newRow.manual_overwrite_minimum_and_wholesale_price == "N"
    ) {
      if (
        newRow.status != "Sold" &&
        newRow.status != "Move to Archive" &&
        newRow.status != "To Ship"
      ) {
        if (
          newRow.product_type == "WATCH (Old Stock)" ||
          newRow.product_type == "WATCH (Old Stock/Vintage)"
        ) {
          // TODO
          if (
            (currentData.product_type != "WATCH (Old Stock)" ||
              currentData.product_type != "WATCH (Old Stock/Vintage)") &&
            (newRow.product_type == "WATCH (Old Stock)" ||
              newRow.product_type == "WATCH (Old Stock/Vintage)")
          ) {
            newRow.minimum_wholesale_price_usd_only_mla = 0;
            newRow.minimum_wholesale_price_min_usd_only_mla = 0;
            newRow.suggested_wholesale_price_usd_only_mla = 0;
            newRow.column_r_min_price = 0;
            newRow.range = 0;
            newRow.column_s_wholesale_price = 0;
            // newRow.manual_max_price = 0;
            newRow.total_amount_decreased_from_wholesale_price = 0;
            newRow.w_s_price_decrease_every_n_days_starting_from_day_50 = 0;

            delete newRow.wholesale_price_will_decrease_next_date;
            delete newRow.hold_sold_on_date;
            delete newRow.archived_date;

            newRow.wholesale_price_decreased_after_x_days_from_purchase_date = 0;
            newRow.extra_300_for_rx_where_wholesale_price_20 = 0;
          }

          if (
            newRow.final_w_sale_max_price_rounded > 0 &&
            (newRow.retail_price_usd == "" ||
              newRow.retail_price_usd == 0 ||
              newRow.retail_price_usd == null)
          ) {
            newRow.retail_price_usd = roundValue(
              calculateRetailPrice(newRow.final_w_sale_max_price_rounded)
            );
          }

          // newRow.final_w_sale_max_price_rounded = newRow.wholesale_price_usd;
        } else {
          // VINTAGE
          // else if (newRow.product_type == 'VINTAGE') {
          //   // TODO
          //   if (currentData.product_type != 'VINTAGE' && newRow.product_type == 'VINTAGE') {
          //     newRow.minimum_wholesale_price_usd_only_mla = 0;
          //     newRow.suggested_wholesale_price_usd_only_mla = 0;
          //     newRow.column_r_min_price = 0;
          //     newRow.range = 0;
          //     newRow.column_s_wholesale_price = 0;
          //     newRow.manual_max_price = 0;
          //     newRow.total_amount_decreased_from_wholesale_price = 0;
          //     newRow.w_s_price_decrease_every_n_days_starting_from_day_50 = 0;

          //     delete newRow.wholesale_price_will_decrease_next_date;
          //     delete newRow.hold_sold_on_date;
          //     delete newRow.archived_date;

          //     newRow.wholesale_price_decreased_after_x_days_from_purchase_date = 0;
          //     newRow.extra_300_for_rx_where_wholesale_price_20 = 0;
          //   }

          //   if (newRow.wholesale_price_usd > 0 && (newRow.retail_price_usd == '' || newRow.retail_price_usd == 0 || newRow.retail_price_usd == null)) {
          //     newRow.retail_price_usd = roundValue(calculateRetailPrice(
          //       newRow.wholesale_price_usd
          //     ));
          //   }

          // }

          var flagCheck = false;

          if (product_type == "BAG") {
            newRow.suggested_wholesale_price_usd_only_mla = roundValue(
              calculateSuggestedWholesalePriceForBags(cost)
            );

            if (
              getWatchLoc?.toLowerCase() !== newRow?.watch_from?.toLowerCase()
            ) {
              const calShiiping = countShippingFeeAndNetCostUsd(
                newRow?.location,
                newRow?.suggested_wholesale_price_usd_only_mla === 0
                  ? newRow?.cost_usd
                  : newRow?.suggested_wholesale_price_usd_only_mla,
                newRow?.purchase_date,
                newRow?.watch_from,
                user,
                newRow?.new_type,
                Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
              );
              newRow.shipping_fee_one = calShiiping?.shipping_fee;
              // newRow.net_cost_usd = calShiiping?.net_cost_usd;
            }

            const valForRound =
              calculateMinimumWholesalePriceForBags(newRow.status, cost) +
              (newRow?.shipping_fee_one || 0);

            newRow.minimum_wholesale_price_usd_only_mla =
              Math.ceil(valForRound / 50) * 50;

            newRow.minimum_wholesale_price_min_usd_only_mla =
              calculateMinimumWholesalePriceForBags(newRow.status, cost);

            newRow.watch_box = 0.1 * newRow.wholesale_price_usd;
          } else {
            newRow.suggested_wholesale_price_usd_only_mla = roundValue(
              calculateSuggestWhosalePriceFromCost(
                newRow.brand,
                cost + newRow?.repair_cost_usd,
                newRow?.location,
                newRow?.purchase_date,
                newRow?.watch_from,
                user,
                newRow?.repair_cost_usd
              )
            );

            if (
              newRow.manual_overwrite_minimum_and_wholesale_price == "N" &&
              newRow.product_type != "WATCH (Old Stock)" &&
              newRow.product_type != "WATCH (Old Stock/Vintage)"
            ) {
              const calShiiping = countShippingFeeAndNetCostUsd(
                newRow?.location,
                newRow?.suggested_wholesale_price_usd_only_mla === 0
                  ? newRow?.cost_usd
                  : newRow?.suggested_wholesale_price_usd_only_mla,
                newRow?.purchase_date,
                newRow?.watch_from,
                user,
                newRow?.new_type,
                Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
              );
              newRow.shipping_fee_one = calShiiping?.shipping_fee;
              // newRow.net_cost_usd = calShiiping?.net_cost_usd;
            }

            const valForRound =
              calculateMinimumWhosalePriceFromCost(
                newRow.brand,
                cost,
                newRow?.location,
                newRow?.purchase_date,
                newRow?.watch_from,
                user
              ) + (newRow?.shipping_fee_one || 0);

            newRow.minimum_wholesale_price_usd_only_mla =
              Math.ceil(valForRound / 50) * 50;

            newRow.minimum_wholesale_price_min_usd_only_mla =
              calculateMinimumWhosalePriceFromCost(
                newRow.brand,
                cost,
                newRow?.location,
                newRow?.purchase_date,
                newRow?.watch_from,
                user
              );

            flagCheck = true;

            if (clickedField === "manual_final_w_sale_max_price") {
              newRow.manual_max_price =
                Number(newRow.manual_final_w_sale_max_price) === 0
                  ? 0
                  : Number(newRow.manual_final_w_sale_max_price) -
                    Number(newRow?.shipping_fee_one);
            }
          }

          newRow.range = roundValue(
            calculateRange(newRow.minimum_wholesale_price_usd_only_mla, cost)
          );

          // BU
          // IF(BD649>50,
          //   IF(
          //     OR(
          //       AND(ISBLANK(BY649),ISBLANK(B649)),
          //       AND(DAYS(TODAY(),BY649)>2,ISBLANK(B649))
          //     ),
          //     INT(((IF(BT649>0,BT649,BP649)-V649)/(170-50)*(BD649-50))/150)*150,
          //     INT(((IF(BT649>0,BT649,BP649)-V649)/(170-50)*(BY649-AM649-50))/150)*150),0
          //   )

          newRow.total_amount_decreased_from_wholesale_price = roundValue(
            calculateTotalAmountDecreasedFromWhosalePrice(
              newRow.days_from_purchase_date,
              newRow.hold_sold_on_date,
              watchStatus(newRow.status),
              newRow.manual_max_price,
              newRow.suggested_wholesale_price_usd_only_mla,
              cost,
              newRow.purchase_date
            )
          );

          if (flagCheck) {
            flagCheck = false;

            let findMax =
              newRow?.suggested_wholesale_price_usd_only_mla >=
              newRow?.manual_max_price
                ? newRow?.suggested_wholesale_price_usd_only_mla
                : newRow?.manual_max_price;

            const total_amount_decreased_from_wholesale_price =
              Number(
                Math.abs(newRow?.total_amount_decreased_from_wholesale_price)
              ) ?? 0;

            const addExtra =
              Number(newRow?.extra_300_for_rx_where_wholesale_price_20) ?? 0;

            const findUSWatchPrice = user?.pricingBaseRule?.find(
              (item) => item?.watchLocation == "US"
            )?.basePriceModifier;

            const findZHWatchPrice = user?.pricingBaseRule?.find(
              (item) => item?.watchLocation == "ZH"
            )?.basePriceModifier;

            const findThilandWatchPrice = user?.pricingBaseRule?.find(
              (item) => item?.watchLocation == "TH"
            )?.basePriceModifier;

            let perCount = 1;

            if (WATCH_LOACTION[newRow?.location?.toLowerCase()] === "US") {
              perCount = (95 - findUSWatchPrice) / 100;
            } else if (
              WATCH_LOACTION[newRow?.location?.toLowerCase()] === "ZH"
            ) {
              perCount = (95 - findZHWatchPrice) / 100;
            } else if (
              WATCH_LOACTION[newRow?.location?.toLowerCase()] === "HK"
            ) {
              perCount = (95 - 0) / 100;
            } else if (
              WATCH_LOACTION[newRow?.location?.toLowerCase()] === "TH"
            ) {
              perCount = (95 - findThilandWatchPrice) / 100;
            } else {
              perCount = 0.95;
            }

            const cost_usd_90_per = Number(newRow?.cost_usd) * perCount;

            findMax = Math.max(
              findMax - total_amount_decreased_from_wholesale_price,
              cost_usd_90_per
            );

            newRow.final_w_sale_max_price_rounded =
              Math.ceil(
                (Number(findMax) +
                  Number(newRow?.shipping_fee_one) +
                  addExtra) /
                  50
              ) * 50;

            newRow.manual_final_w_sale_max_price =
              Number(newRow?.manual_max_price) === 0
                ? 0
                : Number(newRow?.manual_max_price) +
                  Number(newRow?.shipping_fee_one);
          }

          // BV
          newRow.w_s_price_decrease_every_n_days_starting_from_day_50 =
            calculateDecreasePriceEveryNDays(
              newRow.manual_max_price,
              newRow.suggested_wholesale_price_usd_only_mla,
              cost
            ).toFixed(1);

          // BW
          // console.log('body::BW:', {
          //   total_amount_decreased_from_wholesale_price:newRow.total_amount_decreased_from_wholesale_price,
          //   w_s_price_decrease_every_n_days_starting_from_day_50:newRow.w_s_price_decrease_every_n_days_starting_from_day_50,
          //   days_from_purchase_date:newRow.days_from_purchase_date,
          // })
          newRow.wholesale_price_will_decrease_next_date =
            calculateWholesalePriceWillDecreaseNext(
              newRow.total_amount_decreased_from_wholesale_price,
              newRow.w_s_price_decrease_every_n_days_starting_from_day_50,
              newRow.days_from_purchase_date
            );
          console.log("BW", newRow.wholesale_price_will_decrease_next_date);
          // BZ
          // console.log('body::BZ:', {
          //   manual_max_price:newRow.manual_max_price,
          //   suggested_wholesale_price_usd_only_mla:newRow.suggested_wholesale_price_usd_only_mla,
          //   total_amount_decreased_from_wholesale_price:newRow.total_amount_decreased_from_wholesale_price,
          // })
          newRow.wholesale_price_decreased_after_x_days_from_purchase_date =
            roundValue(
              calculateWholesalePriceDecreasedAfterDay(
                newRow.manual_max_price,
                newRow.suggested_wholesale_price_usd_only_mla,
                newRow.total_amount_decreased_from_wholesale_price
              )
            );
          console.log(
            "BZ",
            newRow.wholesale_price_decreased_after_x_days_from_purchase_date
          );
          // newRow.column_s_wholesale_price = roundValue(calculateColS_WhosalePrice(
          //   newRow.wholesale_price_decreased_after_x_days_from_purchase_date,
          //   cost,
          //   0
          // ));
          const currenWholesaleBeforeCA = roundValue(
            calculateColS_WhosalePrice(
              newRow.wholesale_price_decreased_after_x_days_from_purchase_date,
              cost,
              0
            )
          );

          // const current300 = newRow.extra_300_for_rx_where_wholesale_price_20
          // if ((newRow.extra_300_for_rx_where_wholesale_price_20 != currentData.extra_300_for_rx_where_wholesale_price_20) && (currentData.extra_300_for_rx_where_wholesale_price_20 != null || currentData.extra_300_for_rx_where_wholesale_price_20 != 0)) {
          //   newRow.extra_300_for_rx_where_wholesale_price_20 = Number(current300)
          // } else {
          //   newRow.extra_300_for_rx_where_wholesale_price_20 = roundValue(calculateCAExtra(
          //     newRow.brand,
          //     currenWholesaleBeforeCA,
          //     newRow.watch_box,
          //   ));
          // }
          // const current300 = newRow.extra_300_for_rx_where_wholesale_price_20;
          // if ((newRow.extra_300_for_rx_where_wholesale_price_20 != currentData.extra_300_for_rx_where_wholesale_price_20) && (currentData.extra_300_for_rx_where_wholesale_price_20 != null || currentData.extra_300_for_rx_where_wholesale_price_20 != 0)) {
          //   newRow.extra_300_for_rx_where_wholesale_price_20 = Number(current300)
          // } else {
          if (
            currentData.extra_300_for_rx_where_wholesale_price_20 !=
              newRow.extra_300_for_rx_where_wholesale_price_20 &&
            (currentData.extra_300_for_rx_where_wholesale_price_20 == "" ||
              currentData.extra_300_for_rx_where_wholesale_price_20 == 0 ||
              currentData.extra_300_for_rx_where_wholesale_price_20 == null)
          ) {
          } else {
            newRow.extra_300_for_rx_where_wholesale_price_20 = calculateCAExtra(
              newRow.brand,
              currenWholesaleBeforeCA,
              newRow.watch_box
            );
            console.log(
              "bbb",
              newRow.extra_300_for_rx_where_wholesale_price_20
            );
          }
          newRow.extra_300_for_rx_where_wholesale_price_20 = Number(
            newRow.extra_300_for_rx_where_wholesale_price_20
          );
          // else if (currentData.extra_300_for_rx_where_wholesale_price_20 == newRow.extra_300_for_rx_where_wholesale_price_20) {
          // }
          // newRow.extra_300_for_rx_where_wholesale_price_20 = roundValue(calculateCAExtra(
          //   newRow.brand,
          //   currenWholesaleBeforeCA,
          //   newRow.watch_box,
          // ));
          // }
          if (newRow.extra_300_for_rx_where_wholesale_price_20 > 0) {
            newRow.column_s_wholesale_price = roundValue(
              calculateColS_WhosalePrice(
                newRow.wholesale_price_decreased_after_x_days_from_purchase_date,
                cost,
                newRow.extra_300_for_rx_where_wholesale_price_20
              )
            );
          } else {
            newRow.column_s_wholesale_price = currenWholesaleBeforeCA;
          }
          newRow.wholesale_price_usd = newRow.column_s_wholesale_price;

          newRow.retail_price_usd = roundValue(
            calculateRetailPrice(newRow.final_w_sale_max_price_rounded)
          );

          // newRow.extra_300_for_rx_where_wholesale_price_20 = roundValue(calculateCAExtra(
          //   newRow.brand,
          //   newRow.column_s_wholesale_price,
          //   newRow.watch_box,
          // ));
          newRow.column_r_min_price = roundValue(
            calculateR_MinPrice(
              newRow.manualmin_price,
              newRow.minimum_wholesale_price_usd_only_mla,
              cost,
              newRow.total_amount_decreased_from_wholesale_price,
              newRow.extra_300_for_rx_where_wholesale_price_20
            )
          );

          const findUSWatchPrice = user?.pricingBaseRule?.find(
            (item) => item?.watchLocation == "US"
          );

          if (
            newRow.location?.toLowerCase() == "ny" ||
            newRow.location?.toLowerCase() == "t/ny" ||
            newRow.location?.toLowerCase() == "r/ny" ||
            newRow.location?.toLowerCase() == "la"
          ) {
            const calShiiping = countShippingFeeAndNetCostUsd(
              newRow?.location,
              newRow?.suggested_wholesale_price_usd_only_mla === 0
                ? newRow?.cost_usd
                : newRow?.suggested_wholesale_price_usd_only_mla,
              newRow?.purchase_date,
              newRow?.watch_from,
              user,
              newRow?.new_type,
              Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
            );
            newRow.shipping_fee_one = calShiiping?.shipping_fee;

            if (
              newRow.manualmin_price <= 0 &&
              newRow.column_r_min_price > cost * 0.87
            ) {
              newRow.minimum_wholesale_price_usd = newRow.column_r_min_price;
            } else {
              newRow.minimum_wholesale_price_usd =
                newRow.column_r_min_price + newRow.shipping_fee_one;
            }
          } else {
            newRow.minimum_wholesale_price_usd = newRow.column_r_min_price;
          }

          // if (currentData.ch24_usd_6 != newRow.ch24_usd_6 && (newRow.ch24_usd_6 )) {

          // } else {

          // }
          if (
            currentData.ch24_usd_6 != newRow.ch24_usd_6 &&
            (currentData.ch24_usd_6 == "" ||
              currentData.ch24_usd_6 == 0 ||
              currentData.ch24_usd_6 == null)
          ) {
          } else {
            console.log("essss", {
              days_from_purchase_date: newRow.days_from_purchase_date,
              retail_price_usd: newRow.retail_price_usd,
              watch_box: newRow.watch_box,
            });
            newRow.ch24_usd_6 = roundValue(
              calculateCH24Usd_6(
                newRow.days_from_purchase_date,
                newRow.retail_price_usd,
                newRow.watch_box ? newRow.watch_box : ""
              )
            );
          }
          // newRow.ch24_usd_6 = roundValue(calculateCH24Usd_6(
          //   newRow.days_from_purchase_date,
          //   newRow.retail_price_usd,
          //   newRow.watch_box,
          // ));
        }
      }

      if (newRow.status == "Move to Archive") {
        delete newRow.wholesale_price_will_decrease_next_date;
      }
      // newRow.final_w_sale_max_price_rounded = newRow.wholesale_price_usd;
    } else {
      if (
        newRow.final_w_sale_max_price_rounded > 0 &&
        (newRow.retail_price_usd == "" ||
          newRow.retail_price_usd == 0 ||
          newRow.retail_price_usd == null)
      ) {
        newRow.retail_price_usd = roundValue(
          calculateRetailPrice(newRow.final_w_sale_max_price_rounded)
        );
      }

      if (
        currentData.ch24_usd_6 != Number(newRow.ch24_usd_6) &&
        (currentData.ch24_usd_6 == "" ||
          currentData.ch24_usd_6 == 0 ||
          currentData.ch24_usd_6 == null)
      ) {
      } else if (currentData.ch24_usd_6 == Number(newRow.ch24_usd_6)) {
        console.log("aaa");
      } else if (
        newRow.ch24_usd_6 == "" ||
        newRow.ch24_usd_6 == null ||
        newRow.ch24_usd_6 == 0
      ) {
        newRow.ch24_usd_6 = roundValue(
          calculateCH24Usd_6(
            newRow.days_from_purchase_date,
            newRow.retail_price_usd,
            newRow.watch_box
          )
        );
      }
      newRow.ch24_usd_6 = Number(newRow.ch24_usd_6);

      if (
        currentData.extra_300_for_rx_where_wholesale_price_20 !=
          newRow.extra_300_for_rx_where_wholesale_price_20 &&
        (currentData.extra_300_for_rx_where_wholesale_price_20 == "" ||
          currentData.extra_300_for_rx_where_wholesale_price_20 == 0 ||
          currentData.extra_300_for_rx_where_wholesale_price_20 == null)
      ) {
      } else if (
        currentData.extra_300_for_rx_where_wholesale_price_20 ==
        newRow.extra_300_for_rx_where_wholesale_price_20
      ) {
      } else if (
        newRow.extra_300_for_rx_where_wholesale_price_20 == "" ||
        newRow.extra_300_for_rx_where_wholesale_price_20 == null ||
        newRow.extra_300_for_rx_where_wholesale_price_20 == 0
      ) {
        newRow.extra_300_for_rx_where_wholesale_price_20 = calculateCAExtra(
          newRow.brand,
          newRow.wholesale_price_usd,
          newRow.watch_box
        );
        console.log("bbb", newRow.extra_300_for_rx_where_wholesale_price_20);
      }
      newRow.extra_300_for_rx_where_wholesale_price_20 = Number(
        newRow.extra_300_for_rx_where_wholesale_price_20
      );
      newRow.wholesale_price_will_decrease_next_date =
        newRow.wholesale_price_will_decrease_next_date
          ? newRow.wholesale_price_will_decrease_next_date
          : delete newRow.wholesale_price_will_decrease_next_date;

      // newRow.final_w_sale_max_price_rounded = newRow.wholesale_price_usd;
    }

    if (
      newRow.status != "Sold" &&
      newRow.status != "Move to Archive" &&
      newRow.status != "To Ship"
    ) {
      if (
        newRow.manual_overwrite_minimum_and_wholesale_price == "Y" ||
        newRow.product_type == "WATCH (Old Stock)" ||
        newRow.product_type == "WATCH (Old Stock/Vintage)"
      ) {
        if (
          clickedField !== "manual_max_price" &&
          clickedField !== "manual_final_w_sale_max_price"
        ) {
          if (Number(newRow.manual_max_price) == 0) {
            newRow.manual_max_price =
              newRow?.final_w_sale_max_price_rounded || 0;
          }

          const calShiiping = countShippingFeeOnlyN(
            newRow?.location,
            newRow?.manual_max_price,
            newRow?.purchase_date,
            newRow?.watch_from,
            user,
            newRow?.new_type,
            Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
          );
          newRow.shipping_fee_one = calShiiping?.shipping_fee;

          newRow.final_w_sale_max_price_rounded =
            Math.ceil(
              (Number(newRow.manual_max_price) +
                Number(newRow?.shipping_fee_one) +
                Number(newRow?.extra_300_for_rx_where_wholesale_price_20)) /
                50
            ) * 50;

          newRow.manual_final_w_sale_max_price =
            Number(newRow?.manual_max_price) === 0
              ? 0
              : Number(newRow?.manual_max_price) +
                Number(newRow?.shipping_fee_one);
        }

        if (clickedField === "manual_max_price") {
          const calShiiping = countShippingFeeOnlyN(
            newRow?.location,
            newRow?.manual_max_price,
            newRow?.purchase_date,
            newRow?.watch_from,
            user,
            newRow?.new_type,
            Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
          );
          newRow.shipping_fee_one = calShiiping?.shipping_fee;

          newRow.manual_final_w_sale_max_price =
            Number(newRow?.manual_max_price) === 0
              ? 0
              : Number(newRow?.manual_max_price) +
                Number(newRow?.shipping_fee_one);

          if (Number(newRow?.manual_max_price) !== 0) {
            newRow.final_w_sale_max_price_rounded =
              Math.ceil(
                (Number(newRow.manual_max_price) +
                  Number(newRow?.shipping_fee_one) +
                  Number(newRow?.extra_300_for_rx_where_wholesale_price_20)) /
                  50
              ) * 50;
          }
        }

        if (clickedField === "manual_final_w_sale_max_price") {
          const calShiiping = countReverseShippingFeeOnlyN(
            newRow?.location,
            newRow?.manual_final_w_sale_max_price,
            newRow?.purchase_date,
            newRow?.watch_from,
            user,
            newRow?.new_type,
            Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
          );
          newRow.shipping_fee_one = calShiiping?.shipping_fee;

          newRow.manual_max_price =
            Number(newRow.manual_final_w_sale_max_price) === 0
              ? 0
              : Number(newRow.manual_final_w_sale_max_price) -
                Number(newRow?.shipping_fee_one);

          if (Number(newRow?.manual_max_price) !== 0) {
            newRow.final_w_sale_max_price_rounded =
              Math.ceil(
                (Number(newRow.manual_max_price) +
                  Number(newRow?.shipping_fee_one) +
                  Number(newRow?.extra_300_for_rx_where_wholesale_price_20)) /
                  50
              ) * 50;
          }
        }

        if (
          newRow.new_type === "PRE OWNED" ||
          (newRow.new_type === "NEW" && newRow.watch_from === "JAPAN") ||
          (newRow.new_type === "NEW" &&
            newRow.watch_from === "NYC" &&
            newRow.auct === "NYC") ||
          (newRow.new_type === "NEW" && newRow.watch_from === "SD")
        ) {
          if (
            newRow.location?.toLowerCase() == "ny" ||
            newRow.location?.toLowerCase() == "t/ny" ||
            newRow.location?.toLowerCase() == "r/ny" ||
            newRow.location?.toLowerCase() == "la"
          ) {
            if (
              Number(newRow.manualmin_price) > 0 ||
              Number(newRow.minimum_wholesale_price_usd_only_mla) > 0
            ) {
              const column_r_min_price_new = roundValue(
                calculateR_MinPrice(
                  newRow.manualmin_price,
                  newRow.minimum_wholesale_price_usd_only_mla,
                  cost,
                  newRow.total_amount_decreased_from_wholesale_price,
                  newRow.extra_300_for_rx_where_wholesale_price_20
                )
              );

              const calShiiping = countShippingFeeAndNetCostUsd(
                newRow?.location,
                newRow?.suggested_wholesale_price_usd_only_mla === 0
                  ? newRow?.cost_usd
                  : newRow?.suggested_wholesale_price_usd_only_mla,
                newRow?.purchase_date,
                newRow?.watch_from,
                user,
                newRow?.new_type,
                Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
              );
              newRow.shipping_fee_one = calShiiping?.shipping_fee;

              if (
                newRow.manualmin_price <= 0 &&
                column_r_min_price_new > cost * 0.87
              ) {
                newRow.minimum_wholesale_price_usd = column_r_min_price_new;
              } else {
                newRow.minimum_wholesale_price_usd =
                  column_r_min_price_new + newRow.shipping_fee_one;
              }
            }
          }
        }
      }
    }

    if (newRow.manual_overwrite_minimum_and_wholesale_price == "Y") {
      if (newRow?.new_type == "NEW SPECIAL" || newRow?.new_type == "NEW") {
        newRow.suggested_wholesale_price_usd_only_mla = 0;
      }
    }

    // if (newRow.have_link == "Y" && newRow.status == "Available") {
    //    if (
    //     newRow.final_w_sale_max_price_rounded > 0
    //   ) {
    //     newRow.have_link = "Y";
    //   } else {
    //     newRow.have_link = "N";
    //     // alert(
    //     //   "Minimum Whosale Price and Whosale Price must be more than 0 USD"
    //     // );
    //   }
    // }
    newRow.watch_box = `${newRow.watch_box}` as string;
    newRow.have_box = `${newRow.have_box}` as string;
    newRow.watch_from = `${newRow.watch_from}` as string;

    const localDate = formatDateAnyFormat(newRow?.paper_date);
    newRow.paper_date = newRow?.paper_date ? localDate : null;
    // newRow.paper_date = newRow?.paper_date
    //   ? moment(newRow?.paper_date).format("YYYY-MM-DD")
    //   : null;

    newRow.userStaffId = user.id;
    if (newRow.posted_in_group_chat_date != null) {
      newRow.posted_in_group_chat_date = new Date(
        newRow.posted_in_group_chat_date
      );
    } else {
      delete newRow.posted_in_group_chat_date;
    }

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

    await axios
      .put(
        userActiveRole === "MLA"
          ? `https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}?tab=1`
          : `https://api-dev.mlawatches.com/api/admin/stock/masterLuxury/${newRow.id}?tab=1`,
        newRow,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      )
      .then((response) => {
        const result = response.data; // axios stores the response data in `response.data`
        fetchData();
        if (result.statusCode === 403) {
          enqueueSnackbar(
            "Unauthorized access. You don't have permission to view or edit this content.",
            { variant: "error" }
          );
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });

    // fetch(`https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}?tab=1`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${session}`,
    //   },
    //   body: JSON.stringify(newRow),
    // })
    //   .then((result) => result.json())
    //   .then((result) => {
    //     if (result.statusCode === 403) {
    //       enqueueSnackbar(
    //         "Unauthorized access. You don't have permission to view or edit this content.",
    //         { variant: "error" }
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(test);
    //     console.error(error);
    //   });
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows?.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleCellClick = (params) => {
    const fieldName = params.field; // Get the name of the clicked field
    const rowId = params.id; // Get the ID of the clicked row

    setClickedField(fieldName);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const getWatchLoc = OFFICE_LOC[newRow?.location?.toLowerCase()];

    const getRowData = rows?.find((item) => item?.id === newRow?.id);

    if (clickedField === "manual_max_price") {
      if (
        newRow?.suggested_wholesale_price_usd_only_mla >
          newRow?.manual_max_price &&
        newRow?.manual_max_price?.toString() !== "0" &&
        newRow?.manual_max_price !== ""
      ) {
        enqueueSnackbar(
          "Manual max price cannot be lower than the suggested price.",
          {
            variant: "error",
          }
        );
        return getRowData;
      }
    }

    if (clickedField == "manual_final_w_sale_max_price") {
      if (
        newRow.manual_overwrite_minimum_and_wholesale_price == "N" &&
        newRow.product_type != "WATCH (Old Stock)" &&
        newRow.product_type != "WATCH (Old Stock/Vintage)"
      ) {
        const calShiiping = countShippingFeeAndNetCostUsd(
          newRow?.location,
          newRow?.suggested_wholesale_price_usd_only_mla === 0
            ? newRow?.cost_usd
            : newRow?.suggested_wholesale_price_usd_only_mla,
          newRow?.purchase_date,
          newRow?.watch_from,
          user,
          newRow?.new_type,
          Number(newRow?.extra_300_for_rx_where_wholesale_price_20)
        );
        newRow.shipping_fee_one = calShiiping?.shipping_fee;
        // newRow.net_cost_usd = calShiiping?.net_cost_usd;
      }
      if (
        newRow?.suggested_wholesale_price_usd_only_mla >
          newRow?.manual_final_w_sale_max_price -
            (newRow?.shipping_fee_one || 0) &&
        newRow?.manual_final_w_sale_max_price?.toString() !== "0" &&
        newRow?.manual_final_w_sale_max_price !== ""
      ) {
        enqueueSnackbar(
          "Manual max price cannot be lower than the suggested price.",
          {
            variant: "error",
          }
        );
        return getRowData;
      }
    }

    if (newRow.watch_from === "-------") {
      enqueueSnackbar("The '-------' option cannot be selected.", {
        variant: "error",
      });
      return getRowData;
    }

    const getUpdateWholesalePrice = rows?.some(
      (item) =>
        item?.wholesale_price_usd !== newRow?.wholesale_price_usd &&
        item?.id === newRow?.id
    );

    if (
      getUpdateWholesalePrice &&
      clickedField === "wholesale_price_usd" &&
      newRow?.manual_overwrite_minimum_and_wholesale_price === "Y"
    ) {
      if (
        newRow?.wholesale_price_usd &&
        newRow?.days_from_purchase_date &&
        newRow?.retail_price_usd &&
        newRow?.watch_box
      ) {
        const retailvalue = calculateRetailPrice(
          newRow?.final_w_sale_max_price_rounded
        );
        const calculatech = calculateCH24Usd_6(
          newRow?.days_from_purchase_date,
          newRow?.retail_price_usd,
          newRow?.watch_box
        );
        let newRowData = {
          ...newRow,
          retail_price_usd: retailvalue,
          ch24_usd_6: calculatech,
        };
        return UpdateRowFun(newRowData);
      } else {
        return UpdateRowFun(newRow);
      }
    }

    if (clickedField === "shipping_fee") {
      setUpdatedNewRow(newRow);
      setShippingOpenModel(true);
      return newRow;
    }

    if (
      (clickedField === "cost_usd" && newRow?.days_from_purchase_date > 4) ||
      clickedField === "purchase_date"
    ) {
      setUpdatedNewRow(newRow);
      setOpenModel(true);
      return newRow;
    } else {
      return UpdateRowFun(newRow);
    }
  };

  const submitRowChange = () => {
    setOpenModel(false);
    UpdateRowFun(updatedNewRow);
  };

  const submitShippingRowChange = () => {
    setShippingOpenModel(false);
    UpdateRowFun(updatedNewRow);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const [muiFilterModel, setMuiFilterModel] = React.useState({
    items: [],
    logicOperator: "and",
    quickFilterValues: [],
  });

  React.useEffect(() => {
    const hasActiveFilters = Object.values(filter).some(
      (value) => Array.isArray(value) && value.length > 0
    );

    if (hasActiveFilters) {
      setMuiFilterModel({ items: [] });
    }
  }, [filter]);

  function getAllowedLocationCodes(selectedCountries: string[]) {
    const locationMap = {
      "United States": ["NY", "T/NY", "R/NY", "LA"],
      JAPAN: ["TKY", "T/TKY", "R/TKY"],
      Thailand: ["BKK", "T/BKK", "R/BKK"],
      "Hong Kong S.A.R": ["HK", "T/HK", "R/HK", "IT", "T/IT", "R/IT", "T"],
      Switzerland: ["ZH", "T/ZH", "R/ZH"],
    };

    return selectedCountries
      .flatMap((country) => locationMap[country] || [])
      .map((code) => code.toUpperCase());
  }

  function normalizeProductType(type) {
    if (!type) return "";
    const watchTypes = [
      "WATCH",
      "WATCH (Vintage)",
      "WATCH (Old Stock)",
      "WATCH (Old Stock/Vintage)",
    ];
    return watchTypes.includes(type) ? "WATCH" : type;
  }

  const filteredRows = React.useMemo(() => {
    if (!filter || Object.keys(filter).length === 0) return rows;

    return rows.filter((row) => {
      // Separate brand/collection from other filters
      const { brand = [], collection = [], ...otherFilters } = filter;

      // --- OR logic for brand/collection ---
      let brandCollectionMatch = true;
      if (brand.length > 0 || collection.length > 0) {
        const brandMatch = brand.length > 0 && brand.includes(row.brand);
        const collectionMatch =
          collection.length > 0 && collection.includes(row.collection);

        brandCollectionMatch = brandMatch || collectionMatch;
      }

      // --- AND logic for other filters ---
      const otherMatch = Object.entries(otherFilters).every(
        ([key, filterValues]) => {
          if (!Array.isArray(filterValues) || filterValues.length === 0)
            return true;

          const rowValue = row[key];

          if (key === "condition") {
            return filterValues.some((filterCondition) => {
              if (filterCondition === "NEW") {
                return row?.new_type === "NEW";
              }
              if (filterCondition === "NEW SPECIAL") {
                return row?.new_type === "NEW SPECIAL";
              }
              if (filterCondition === "PRE OWNED") {
                return row?.new_type === "PRE OWNED";
              }
              if (filterCondition === "VINTAGE") {
                return (
                  row?.product_type === "WATCH (Vintage)" ||
                  row?.product_type === "WATCH (Old Stock/Vintage)"
                );
              }
              return false;
            });
          }

          if (key === "paper" && filterValues.includes("CARD PAPER")) {
            const matchValues = ["CARD", "PAPER", "E-WARRANTY"];
            return matchValues.includes(row["paper"]);
          }

          if (key === "location") {
            const allowedCodes = getAllowedLocationCodes(filterValues);
            const rowLocationCode = row["location"]?.toUpperCase();
            return allowedCodes.includes(rowLocationCode);
          }

          if (key === "product_type") {
            const normalizedRowType = normalizeProductType(row.product_type);
            const normalizedFilters = filterValues.map(normalizeProductType);
            return normalizedFilters.includes(normalizedRowType);
          }

          if (typeof rowValue === "string") {
            return filterValues.includes(rowValue);
          }

          if (Array.isArray(rowValue)) {
            return rowValue.some((val) => filterValues.includes(val));
          }

          return false;
        }
      );

      return brandCollectionMatch && otherMatch;
    });
  }, [rows, filter]);

  const {
    filterValueState,
    setFilterValueState,
    resetFilterState,
    clearAllFilters,
    getCheckedItems,
  } = useFilterLocalStorage();

  React.useEffect(() => {
    const hasActiveMuiFilters = muiFilterModel?.items?.length > 0;
    if (hasActiveMuiFilters) {
      setFilter({});

      clearAllFilters();
    }
  }, [muiFilterModel]);

  const [muiFilteredRows, setMuiFilteredRows] = React.useState([]);

  const getFilteredRows = React.useCallback(() => {
    const hasColumnFilters = muiFilterModel?.items?.length > 0;
    const quickSearchValues = muiFilterModel?.quickFilterValues || [];

    // If no filters and no quick search, return all rows
    if (!hasColumnFilters && quickSearchValues?.length === 0) {
      return rows;
    }

    const logicOp = muiFilterModel?.logicOperator || "and";

    return rows?.filter((row) => {
      const checks: boolean[] = [];

      // 1️⃣ Column-specific filters (existing logic)
      if (hasColumnFilters) {
        const columnChecks = muiFilterModel?.items?.map((filter) => {
          const fieldValue = row[filter?.field];
          const valueStr = String(fieldValue ?? "").toLowerCase();
          const filterVal = String(filter.value ?? "").toLowerCase();

          switch (filter.operator) {
            case "contains":
              return valueStr.includes(filterVal);
            case "doesNotContain":
              return !valueStr.includes(filterVal);
            case "equals":
            case "is":
              return valueStr === filterVal;
            case "doesNotEqual":
            case "not":
              return valueStr !== filterVal;
            case "startsWith":
              return valueStr.startsWith(filterVal);
            case "endsWith":
              return valueStr.endsWith(filterVal);
            case "isEmpty":
              return !fieldValue || valueStr.trim() === "";
            case "isNotEmpty":
              return !!valueStr.trim();
            case "isAnyOf":
              return (
                Array.isArray(filter.value) &&
                filter.value
                  .map((v) => String(v).toLowerCase())
                  .includes(valueStr)
              );
            default:
              return true;
          }
        });

        checks.push(
          logicOp === "or"
            ? columnChecks.some(Boolean)
            : columnChecks.every(Boolean)
        );
      }

      // 2️⃣ Quick search across all keys
      if (quickSearchValues?.length > 0) {
        const quickCheck = quickSearchValues?.every((searchTerm) => {
          const searchLower = String(searchTerm)?.toLowerCase();
          return Object.values(row).some((val) =>
            String(val ?? "")
              .toLowerCase()
              .includes(searchLower)
          );
        });

        checks?.push(quickCheck);
      }

      // If both column filters and quick search are active → AND logic between them
      return checks?.every(Boolean);
    });
  }, [rows, muiFilterModel]);

  React.useEffect(() => {
    const result = getFilteredRows();
    setMuiFilteredRows(result);
  }, [getFilteredRows]);

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

  React.useEffect(() => {
    clearAllFilters();
  }, []);

  // React.useEffect(() => {
  //   if (filter) {
  //     let Arbox = [];
  //     Arbox =
  //       filter.have_box.length > 0
  //         ? filter.have_box.map((m) => (m == "N/A" ? "N" : m))
  //         : filter.have_box;
  //     const collections = filter?.brand?.includes("RX")
  //       ? []
  //       : filter?.collection || [];

  //     setCurrentFilters([
  //       ...filter.brand.map((item) => ({
  //         label: brandNameMap[item] || item,
  //         key: "brand",
  //       })),
  //       ...collections.map((item) => ({
  //         label: item,
  //         key: "collection",
  //       })),
  //       ...filter.condition.map((item) => ({
  //         label: item,
  //         key: "condition",
  //       })),
  //       ...filter.product_type.map((item) => ({
  //         label: item,
  //         key: "product_type",
  //       })),
  //       ...Arbox.map((item) => ({ label: item, key: "have_box" })),
  //       ...filter.paper.map((item) => ({ label: item, key: "paper" })),
  //     ]);
  //   }
  // }, [filter]);

  // const stringLabel = (stringLabel: string) => {
  //   let label = stringLabel;
  //   if (label == "CARD,PAPER,E-WARRANTY") label = "Card/Paper";
  //   if (label == "N/A") label = "No Warranty";
  //   if (label == "Y") label = "With Box";
  //   if (label == "N") label = "No Box";
  //   if (label === "BAG") label = "HANDBAG";

  //   return label;
  // };

  // const handleDelete = (value) => {
  //   console.log("value: ", value);

  // };

  return (
    <Box sx={{ height: "95vh", width: "100%" }} ref={gridRef}>
      {/* <div className="flex flex-row p-2 w-full overflow-auto max-h-112 align-middle gap-2">
        <Stack
          spacing={{ xs: 1, sm: 1 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          {currentFilters?.map((v) => (
            <Chip
              key={`checked_${v.label}`}
              label={stringLabel(v.label)}
              onDelete={() => handleDelete(v)}
            />
          ))}
        </Stack>
        <Button
          className="ml-3 w-fit"
          size="small"
          color="inherit"
          role="button"
          variant="contained"
          onClick={handleClearAll}
        >
          Clear All Filter{" "}
        </Button>
      </div> */}
      <DataGridPro
        loading={loading}
        apiRef={apiRef}
        rows={filteredRows}
        // rows={rows.map((item, index) => ({ rows_no: index + 4, ...item }))}
        columns={columnsModified}
        getRowHeight={() => "auto"}
        // stickyHeader
        pagination={false}
        hideFooter
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
        processRowUpdate={processRowUpdate}
        filterModel={muiFilterModel}
        onFilterModelChange={(model) => setMuiFilterModel(model)}
        onCellClick={handleCellClick}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            rows,
            setRows,
            setRowModesModel,
            apiRef,
            session,
            setFilter,
            data,
            filteredRows,
            muiFilteredRows,
            filter,
            muiFilterModel,
            setMuiFilterModel,
          },
        }}
        isCellEditable={(params) => {
          const { field, row } = params;

          if (field === "final_w_sale_max_price_rounded") {
            if (row?.manual_overwrite_minimum_and_wholesale_price === "Y") {
              if (row?.new_type === "NEW SPECIAL" || row?.new_type === "NEW") {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          // Use column definition fallback
          const column = columnsModified?.find((col) => col.field === field);
          return column?.editable === true;
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
      <Modal
        open={openModel}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-black font-semibold text-[18px] text-center">
            Are you sure to change ?
          </h2>
          <div className="flex gap-[25px] justify-center mt-[15px]">
            <button
              onClick={async () => {
                await fetchData();
                setOpenModel(false);
              }}
              className="bg-red-400 text-white text-[14px] font-semibold py-[6px] px-[12px] rounded-[6px]"
            >
              Cancel
            </button>
            <button
              onClick={() => submitRowChange()}
              className="bg-[#4F46E5] text-white text-[14px] font-semibold py-[6px] px-[12px] rounded-[6px]"
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={shippingOpenModel}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-black font-semibold text-[18px] text-center">
            Are you sure to change ?
          </h2>
          <div className="flex gap-[25px] justify-center mt-[15px]">
            <button
              onClick={async () => {
                await fetchData();
                setShippingOpenModel(false);
              }}
              className="bg-red-400 text-white text-[14px] font-semibold py-[6px] px-[12px] rounded-[6px]"
            >
              Cancel
            </button>
            <button
              onClick={() => submitShippingRowChange()}
              className="bg-[#4F46E5] text-white text-[14px] font-semibold py-[6px] px-[12px] rounded-[6px]"
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
}
