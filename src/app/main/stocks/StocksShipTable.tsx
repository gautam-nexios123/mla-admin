import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGridPro,
  GridToolbarContainer,
  GridPinnedColumnFields,
  GridToolbar,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridSlots,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  LocDropdown,
  boxDropdown,
  collectionDropdown,
  conditionDropdown,
  dialDropdown,
  fromDropdown,
  newDropdown,
  numOfLinksDropdown,
  nyDropdown,
  nyLaDropdown,
  paperDropdown,
  productTypeDropdown,
  statusDropdown,
  strapDropdown,
  videoDropdown,
} from "src/utils/dropdownlist";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FuseLoading from "@fuse/core/FuseLoading";
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
  hideFullSerial,
} from "src/utils/coreFunction";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "src/app/auth/user/store/userSlice";
import { stockIdMaster } from "src/utils/stockMaster";
import { columns } from "./StockColumn";
import { useThemeMediaQuery } from "@fuse/hooks";

function CustomToolbar(props) {
  const session = localStorage.getItem(`jwt_access_token`);
  const { rows, setRows, setRowModesModel } = props;
  const userRole = useSelector(selectUserRole);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

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
        new_column: "",
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
        <Box sx={{ flexGrow: 1 }} />
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

export default function StocksShipTable(props) {
  const session = localStorage.getItem(`jwt_access_token`);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

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

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api-dev.mlawatches.com/api/admin/stock?tab=3",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setRows(data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
    if (props.isChangeTab != 2) {
      console.log("changeTabs", props.isChangeTab);
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

  const processRowUpdate = (newRow: GridRowModel) => {
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

    newRow.userStaffId = user.id;
    console.log("newRow:::", newRow);
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
        // Authorization: `Bearer ${loginResult.token}`, // 👈 New Code
        // ...headerParams
      },
      body: JSON.stringify(newRow),
      //...body,
    })
      .then((result) => {
        // console.log(result)
      })
      .catch((error) => console.error(error));
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  if (loading) {
    return <FuseLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ height: "95vh", width: "100%" }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={false}
        hideFooter
        pinnedColumns={pinnedColumns}
        onPinnedColumnsChange={handlePinnedColumnsChange}
        processRowUpdate={processRowUpdate}
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
        }}
        checkboxSelection={false}
      />
    </Box>
  );
}
