// 28417
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useThemeMediaQuery } from "@fuse/hooks";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ListItemIcon, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  GridRowModel,
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
  formatDateAnyFormat,
  hideFullSerial,
} from "src/utils/coreFunction";
import { columns } from "./RetailTableColumn";

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
  const { rows, setRows, setRowModesModel, apiRef, session } = props;
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);

  // const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  //   const handleClickAdd = () => {
  //     // const id = Math.floor(26000 + (50000 - 26000) * Math.random());
  //     let lastRow = rows[rows.length - 1].id;
  //     const currentMaster = stockIdMaster.findIndex((i) => i === lastRow);
  //     const id = stockIdMaster[currentMaster + 1];
  //     const rows_no = Math.max(...rows.map((o) => o.rows_no)) + 1;
  //     const rows_id = Math.max(...rows.map((o) => o.rows_id)) + 1;
  //     let imageUrl = `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${id}.jpg`;
  //     fetch(`https://api-dev.mlawatches.com/api/admin/stock/create?tab=1`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session}`, // 👈 New Code
  //         // ...headerParams
  //       },
  //       body: JSON.stringify({
  //         rows_no: rows_no,
  //         id: id,
  //         userStaffId: user.id,
  //         imageUrl: imageUrl,
  //       }),
  //       //...body,
  //     }).catch((error) => console.error(error));
  //     setRows((oldRows) => [
  //       ...oldRows,
  //       {
  //         rows_id,
  //         id,
  //         status: "",
  //         ny_la: "",
  //         imageUrl,
  //         // id': '',
  //         brand: "",
  //         model: "",
  //         description: "",
  //         collection: "",
  //         full_serial_number_not_in_link: "",
  //         serial_no: "",
  //         dial: "",
  //         strap_bracelet: "",
  //         num_of_links: "",
  //         paper: "",
  //         paper_date: "",
  //         watch_box: "",
  //         have_box: "",
  //         condition: "",
  //         minimum_wholesale_price_usd: "",
  //         wholesale_price_usd: "",
  //         retail_price_usd: "",
  //         location: "",
  //         cost_usd: "",
  //         qb: "MLA",
  //         sold_price: 0,
  //         sold_price_box: 0,
  //         notes: "",
  //         internal_notes: "",
  //         product_type: "WATCH",
  //         new_type: "PRE OWNED",
  //         watch_from: "",
  //         auct: "",
  //         japan_box: "",
  //         lot: "",
  //         have_link: "N",
  //         purchase_date: `${new Date()}`,
  //         sold_date: "",
  //         ch24_usd_6: "",
  //         days_from_purchase_date: 0,
  //         total_images: 1,
  //         have_video: "N",
  //         public_image: "N",
  //         manual_overwrite_minimum_and_wholesale_price: "N",
  //         minimum_wholesale_price_usd_only_mla: "",
  //         manualmin_price: "",
  //         suggested_wholesale_price_usd_only_mla: "",
  //         column_r_min_price: "",
  //         range: "",
  //         column_s_wholesale_price: "",
  //         manual_max_price: "",
  //         total_amount_decreased_from_wholesale_price: "",
  //         w_s_price_decrease_every_n_days_starting_from_day_50: "",
  //         // wholesale_price_will_decrease_next_date: '',
  //         hold_sold_on_date: "",
  //         wholesale_price_decreased_after_x_days_from_purchase_date: "",
  //         extra_300_for_rx_where_wholesale_price_20: "",
  //       },
  //     ]);
  //     setRowModesModel((oldModel) => ({
  //       ...oldModel,
  //       [id]: { mode: GridRowModes.Edit, fieldToFocus: "id" },
  //     }));
  //     apiRef.current.scrollToIndexes({
  //       rowIndex: rows.length - 1,
  //     });
  //   };

  // const handleClickPublish = () => {
  //   setPublishLoading(true);
  //   fetch(`https://api-dev.mlawatches.com/api/admin/stock/publish-stock?tab=1`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session}`, // 👈 New Code
  //       // ...headerParams
  //     },
  //     //...body,
  //   }).catch((error) => console.error(error));
  //   setTimeout(() => {
  //     setPublishLoading(false);
  //   }, 4000);
  // };

  return (
    <div className="pb-4">
      <GridToolbarContainer>
        {/* <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickAdd}
        >
          Add
        </Button> */}
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
          <GridToolbarQuickFilter
            quickFilterParser={(searchInput: string) =>
              searchInput
                .split(",")
                .map((value) => value.trim())
                .filter((value) => value !== "")
            }
            className="table-global-filter"
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <div className="flex gap-6">
          {userRole === "SUPER_ADMIN" && (
            <>
              {/* <Button
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
              </Button> */}
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
            </>
            // <Button  size='small' variant="outlined" color="primary" startIcon={<CloudUploadIcon />} onClick={handleClickPublish}>
            //   Publish
            // </Button>
          )}
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

export default function RetailStockProTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const apiRef = useGridApiRef();
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const user: any = useSelector(selectUser);

  const columnsModified = React.useMemo(() => {
    // If user role is SUPER_ADMIN, make cost_usd visible and editable
    if (user?.role === "SUPER_ADMIN") {
      return columns?.map((item) => {
        if (item.field === "cost_usd") {
          return {
            ...item,
            editable: true,
          };
        }
        return item;
      });
    }

    // Existing logic for other users
    const inventoryCostModules = user.modulesPermissions.find(
      (module) => module.moduleName === "inventory-cost"
    );

    if (!inventoryCostModules) return columns;

    return columns
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
        return item;
      })
      .filter(Boolean);
  }, [user, columns]);

  const [openModel, setOpenModel] = React.useState(false);
  const [updatedNewRow, setUpdatedNewRow] = React.useState<any>({});
  const [clickedField, setClickedField] = React.useState<string>("");

  const [pinnedColumns, setPinnedColumns] =
    React.useState<GridPinnedColumnFields>({
      left: isMobile
        ? []
        : ["rows_id", "status", "ny_la", "imageUrl", "id", "brand"],
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
        "https://api-dev.mlawatches.com/api/admin/stock/retailInventory?tab=1",
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
        setRows(data.results.length ? data.results : []);
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
    }
  }
  React.useEffect(() => {
    fetchData();

    if (props.isChangeTab != 0) {
      setRows([]);
    }
  }, [props.isChangeTab]);

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
            newRow.suggested_wholesale_price_usd_only_mla = 0;
            newRow.column_r_min_price = 0;
            newRow.range = 0;
            newRow.column_s_wholesale_price = 0;
            newRow.manual_max_price = 0;
            newRow.total_amount_decreased_from_wholesale_price = 0;
            newRow.w_s_price_decrease_every_n_days_starting_from_day_50 = 0;

            delete newRow.wholesale_price_will_decrease_next_date;
            delete newRow.hold_sold_on_date;
            delete newRow.archived_date;

            newRow.wholesale_price_decreased_after_x_days_from_purchase_date = 0;
            newRow.extra_300_for_rx_where_wholesale_price_20 = 0;
          }

          if (
            newRow.wholesale_price_usd > 0 &&
            (newRow.retail_price_usd == "" ||
              newRow.retail_price_usd == 0 ||
              newRow.retail_price_usd == null)
          ) {
            newRow.retail_price_usd = roundValue(
              calculateRetailPrice(newRow.wholesale_price_usd)
            );
          }
        } else {
          // VINTAGE

          if (product_type == "BAG") {
            newRow.minimum_wholesale_price_usd_only_mla = roundValue(
              calculateMinimumWholesalePriceForBags(newRow.status, cost)
            );
            newRow.suggested_wholesale_price_usd_only_mla = roundValue(
              calculateSuggestedWholesalePriceForBags(cost)
            );
            newRow.watch_box = 0.1 * newRow.wholesale_price_usd;
          } else {
            newRow.minimum_wholesale_price_usd_only_mla = roundValue(
              calculateMinimumWhosalePriceFromCost(
                newRow.brand,
                cost,
                newRow?.location,
                newRow?.purchase_date,
                newRow?.watch_from,
                user
              )
            );
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
          }

          newRow.range = roundValue(
            calculateRange(newRow.minimum_wholesale_price_usd_only_mla, cost)
          );

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
          // BV
          newRow.w_s_price_decrease_every_n_days_starting_from_day_50 =
            calculateDecreasePriceEveryNDays(
              newRow.manual_max_price,
              newRow.suggested_wholesale_price_usd_only_mla,
              cost
            ).toFixed(1);

          newRow.wholesale_price_will_decrease_next_date =
            calculateWholesalePriceWillDecreaseNext(
              newRow.total_amount_decreased_from_wholesale_price,
              newRow.w_s_price_decrease_every_n_days_starting_from_day_50,
              newRow.days_from_purchase_date
            );

          newRow.wholesale_price_decreased_after_x_days_from_purchase_date =
            roundValue(
              calculateWholesalePriceDecreasedAfterDay(
                newRow.manual_max_price,
                newRow.suggested_wholesale_price_usd_only_mla,
                newRow.total_amount_decreased_from_wholesale_price
              )
            );

          const currenWholesaleBeforeCA = roundValue(
            calculateColS_WhosalePrice(
              newRow.wholesale_price_decreased_after_x_days_from_purchase_date,
              cost,
              0
            )
          );

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
          }
          newRow.extra_300_for_rx_where_wholesale_price_20 = Number(
            newRow.extra_300_for_rx_where_wholesale_price_20
          );

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
            calculateRetailPrice(newRow.column_s_wholesale_price)
          );

          newRow.column_r_min_price = roundValue(
            calculateR_MinPrice(
              newRow.manualmin_price,
              newRow.minimum_wholesale_price_usd_only_mla,
              cost,
              newRow.total_amount_decreased_from_wholesale_price,
              newRow.extra_300_for_rx_where_wholesale_price_20
            )
          );
          newRow.minimum_wholesale_price_usd = newRow.column_r_min_price;

          if (
            currentData.ch24_usd_6 != newRow.ch24_usd_6 &&
            (currentData.ch24_usd_6 == "" ||
              currentData.ch24_usd_6 == 0 ||
              currentData.ch24_usd_6 == null)
          ) {
          } else {
            newRow.ch24_usd_6 = roundValue(
              calculateCH24Usd_6(
                newRow.days_from_purchase_date,
                newRow.retail_price_usd,
                newRow.watch_box ? newRow.watch_box : ""
              )
            );
          }
        }
      }

      if (newRow.status == "Move to Archive") {
        delete newRow.wholesale_price_will_decrease_next_date;
      }
    } else {
      if (
        newRow.wholesale_price_usd > 0 &&
        (newRow.retail_price_usd == "" ||
          newRow.retail_price_usd == 0 ||
          newRow.retail_price_usd == null)
      ) {
        newRow.retail_price_usd = roundValue(
          calculateRetailPrice(newRow.wholesale_price_usd)
        );
      }

      if (
        currentData.ch24_usd_6 != Number(newRow.ch24_usd_6) &&
        (currentData.ch24_usd_6 == "" ||
          currentData.ch24_usd_6 == 0 ||
          currentData.ch24_usd_6 == null)
      ) {
      } else if (currentData.ch24_usd_6 == Number(newRow.ch24_usd_6)) {
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
      }
      newRow.extra_300_for_rx_where_wholesale_price_20 = Number(
        newRow.extra_300_for_rx_where_wholesale_price_20
      );
      newRow.wholesale_price_will_decrease_next_date =
        newRow.wholesale_price_will_decrease_next_date
          ? newRow.wholesale_price_will_decrease_next_date
          : delete newRow.wholesale_price_will_decrease_next_date;
    }
    if (newRow.have_link == "Y" && newRow.status == "Available") {
      if (
        newRow.minimum_wholesale_price_usd > 0 &&
        newRow.wholesale_price_usd > 0
      ) {
        newRow.have_link = "Y";
      } else {
        newRow.have_link = "N";
        alert(
          "Minimum Whosale Price and Whosale Price must be more than 0 USD"
        );
      }
    }
    newRow.watch_box = `${newRow.watch_box}` as string;
    newRow.have_box = `${newRow.have_box}` as string;
    newRow.watch_from = `${newRow.watch_from}` as string;

    const localDate = formatDateAnyFormat(newRow?.paper_date);
    newRow.paper_date = newRow?.paper_date ? localDate : null;

    newRow.userStaffId = user.id;
    if (newRow.posted_in_group_chat_date != null) {
      newRow.posted_in_group_chat_date = new Date(
        newRow.posted_in_group_chat_date
      );
    } else {
      delete newRow.posted_in_group_chat_date;
    }

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
        `https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}?tab=1`,
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

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleCellClick = (params) => {
    const fieldName = params.field; // Get the name of the clicked field
    const rowId = params.id; // Get the ID of the clicked row

    setClickedField(fieldName);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
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
        const retailvalue = calculateRetailPrice(newRow?.wholesale_price_usd);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ height: "95vh", width: "100%" }}>
      <DataGridPro
        loading={loading}
        apiRef={apiRef}
        rows={rows}
        // rows={rows.map((item, index) => ({ rows_no: index + 4, ...item }))}
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
          toolbar: { rows, setRows, setRowModesModel, apiRef, session },
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
    </Box>
  );
}
