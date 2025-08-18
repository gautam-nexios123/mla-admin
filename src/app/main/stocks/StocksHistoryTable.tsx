import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { DataGridPro, DataGridProProps } from "@mui/x-data-grid-pro";
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
  calculateColS_WhosalePrice,
  calculateDayFromPurchaseDate,
  calculateDecreasePriceEveryNDays,
  calculateMinimumWhosalePriceFromCost,
  calculateR_MinPrice,
  calculateRange,
  calculateRetailPrice,
  calculateSuggestWhosalePriceFromCost,
  calculateTotalAmountDecreasedFromWhosalePrice,
  calculateWholesalePriceDecreasedAfterDay,
  calculateWholesalePriceWillDecreaseNext,
  hideFullSerial,
} from "src/utils/coreFunction";

interface EditToolbarProps {
  rows: GridRowsProp;
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { rows, setRows, setRowModesModel } = props;

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedRows(selectedIds);
  };

  const handleArchiveClick = () => {
    if (!rows) return; // Handle case where rows is undefined or null

    const updatedRows = rows.filter((row) => !selectedRows.includes(row.id));
    setRows(() => updatedRows);
    setSelectedRows([]);
  };

  const handleClickAdd = () => {
    const id = Math.floor(26000 + (50000 - 26000) * Math.random());
    let imageUrl = `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${id}.jpg`;
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${loginResult.token}`, // 👈 New Code
        // ...headerParams
      },
      body: JSON.stringify({
        id: id,
        imageUrl: imageUrl,
      }),
      //...body,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));

    setRows((oldRows) => [
      {
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
        qb: "",
        sold_price: "",
        notes: "",
        internal_notes: "",
        product_type: "",
        new_column: "",
        watch_from: "",
        auct: "",
        japan_box: "",
        lot: "",
        have_link: "",
        purchase_date: "",
        sold_date: "",
        ch24: "",
        days_from_purchase_date: "",
        total_images: "",
        have_video: "",
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
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "id" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickAdd}
      >
        Add
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CollectionsBookmarkIcon />}
        onClick={handleArchiveClick}
      >
        Archive
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
      >
        Publish
      </Button>
    </GridToolbarContainer>
  );
}

export default function StocksHistoryTable() {
  const session = localStorage.getItem(`jwt_access_token`);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api-dev.mlawatches.com/api/admin/stock?tab=5",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
          }
        );
        // const response = await fetch('assets/importjsondata.json');
        console.log("response", response);
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
  }, []);

  const roundValue = (value) => {
    // Convert value to string and split it into integer and decimal parts
    const [integerPart, decimalPart] = value.toFixed(2).toString().split(".");
    const formattedValue = integerPart;

    return Number(formattedValue);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    console.log("newRow", newRow);
    const fullSerialNo = newRow.full_serial_number_not_in_link;
    if (fullSerialNo && !newRow.serial_no) {
      newRow.serial_no = hideFullSerial(fullSerialNo);
    }

    const cost = newRow.cost_usd;
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
    // const currentData = rows.find(f => f.id === newRow.id)
    // if (cost != '' && cost !== currentData.cost) {
    //   newRow.minimum_wholesale_price_usd_only_mla = roundValue(calculateMinimumWhosalePriceFromCost(newRow.brand, cost))
    //   newRow.suggested_wholesale_price_usd_only_mla = roundValue(calculateSuggestWhosalePriceFromCost(newRow.brand, cost , newRow?.watch_from))
    //   newRow.range = roundValue(calculateRange(newRow.minimum_wholesale_price_usd_only_mla, cost));

    //   // BU
    //   // IF(BD649>50,
    //   //   IF(
    //   //     OR(
    //   //       AND(ISBLANK(BY649),ISBLANK(B649)),
    //   //       AND(DAYS(TODAY(),BY649)>2,ISBLANK(B649))
    //   //     ),
    //   //     INT(((IF(BT649>0,BT649,BP649)-V649)/(170-50)*(BD649-50))/150)*150,
    //   //     INT(((IF(BT649>0,BT649,BP649)-V649)/(170-50)*(BY649-AM649-50))/150)*150),0
    //   //   )
    //   newRow.total_amount_decreased_from_wholesale_price = roundValue(calculateTotalAmountDecreasedFromWhosalePrice(
    //     newRow.days_from_purchase_date,
    //     newRow.hold_sold_on_date,
    //     newRow.status,
    //     newRow.manual_max_price,
    //     newRow.suggested_wholesale_price_usd_only_mla,
    //     cost,
    //     newRow.purchase_date
    //   ));
    //   // console.log('BU', newRow.total_amount_decreased_from_wholesale_price)
    //   // BV
    //   newRow.w_s_price_decrease_every_n_days_starting_from_day_50 = roundValue(calculateDecreasePriceEveryNDays(
    //     newRow.manual_max_price,
    //     newRow.suggested_wholesale_price_usd_only_mla,
    //     cost
    //   ));
    //   // console.log('BV', newRow.w_s_price_decrease_every_n_days_starting_from_day_50)
    //   // BW
    //   // console.log('body::BW:', {
    //   //   total_amount_decreased_from_wholesale_price:newRow.total_amount_decreased_from_wholesale_price,
    //   //   w_s_price_decrease_every_n_days_starting_from_day_50:newRow.w_s_price_decrease_every_n_days_starting_from_day_50,
    //   //   days_from_purchase_date:newRow.days_from_purchase_date,
    //   // })
    //   newRow.wholesale_price_will_decrease_next_date = calculateWholesalePriceWillDecreaseNext(
    //     newRow.total_amount_decreased_from_wholesale_price,
    //     newRow.w_s_price_decrease_every_n_days_starting_from_day_50,
    //     newRow.days_from_purchase_date,
    //   );
    //   console.log('BW', newRow.wholesale_price_will_decrease_next_date)
    //   // BZ
    //   // console.log('body::BZ:', {
    //   //   manual_max_price:newRow.manual_max_price,
    //   //   suggested_wholesale_price_usd_only_mla:newRow.suggested_wholesale_price_usd_only_mla,
    //   //   total_amount_decreased_from_wholesale_price:newRow.total_amount_decreased_from_wholesale_price,
    //   // })
    //   newRow.wholesale_price_decreased_after_x_days_from_purchase_date = roundValue(calculateWholesalePriceDecreasedAfterDay(
    //     newRow.manual_max_price,
    //     newRow.suggested_wholesale_price_usd_only_mla,
    //     newRow.total_amount_decreased_from_wholesale_price,
    //   ));
    //   // console.log('BZ', newRow.wholesale_price_decreased_after_x_days_from_purchase_date)
    //   newRow.column_s_wholesale_price = roundValue(calculateColS_WhosalePrice(
    //     newRow.wholesale_price_decreased_after_x_days_from_purchase_date,
    //     cost,
    //     0
    //   ));
    //   newRow.wholesale_price_usd = newRow.column_s_wholesale_price;

    //   newRow.retail_price_usd = roundValue(calculateRetailPrice(
    //     newRow.column_s_wholesale_price
    //   ));

    //   newRow.extra_300_for_rx_where_wholesale_price_20 = roundValue(calculateCAExtra(
    //     newRow.brand,
    //     newRow.column_s_wholesale_price,
    //     newRow.watch_box,
    //   ));

    //   newRow.column_r_min_price = roundValue(calculateR_MinPrice(
    //     newRow.manualmin_price,
    //     newRow.minimum_wholesale_price_usd_only_mla,
    //     cost,
    //     newRow.total_amount_decreased_from_wholesale_price,
    //     newRow.extra_300_for_rx_where_wholesale_price_20
    //   ));
    //   newRow.minimum_wholesale_price_usd = newRow.column_r_min_price;
    //   // console.log('bn_minimumWhosalePrice',newRow.minimum_wholesale_price_usd_only_mla)
    // }
    console.log("newRow:::", newRow);
    fetch(`https://api-dev.mlawatches.com/api/admin/stock/${newRow.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${loginResult.token}`, // 👈 New Code
        // ...headerParams
      },
      body: JSON.stringify(newRow),
      //...body,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  if (loading) {
    // return <div>Loading...</div>;
    return <FuseLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "status",
      headerName: "Status",
      width: 80,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: statusDropdown,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "Available":
            // color = 'red';
            params.value = "";
            break;
          case "Sold":
            color = "red";
            break;
          case "Shipped":
            color = "blue";
            break;
          case "Archived":
            color = "green";
            break;
          default:
            color = "inherit"; // Use default color for other values
        }
        return (
          <div style={{ color }} className="font-600">
            {params.value}
          </div>
        );
      },
    },
    {
      field: "ny_la",
      headerName: "NY/LA",
      width: 60,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: nyLaDropdown,
      renderCell: (params) => <div className="font-600">{params.value}</div>,
    },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderCell: (params) => (
        <img
          style={{ minWidth: "120%", maxHeight: "100%" }}
          src={params.value}
          alt="Image"
        />
      ),
    },
    {
      field: "id",
      headerName: "Stock",
      width: 60,
      // headerAlign: 'center',
      align: "center",
      editable: false,
      renderCell: (params) => <div className="font-600">{params.value}</div>,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 60,
      // headerAlign: 'center',
      align: "center",
      editable: true,
      renderCell: (params) => <div className="font-600">{params.value}</div>,
    },
    {
      field: "model",
      headerName: "Model",
      width: 200,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderCell: (params) => <div className="font-600">{params.value}</div>,
    },
    {
      field: "description",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      width: 300,
      editable: true,
    },
    {
      field: "collection",
      headerName: "Collection/Family",
      headerAlign: "center",
      align: "center",
      width: 300,
      editable: true,
      type: "singleSelect",
      valueOptions: collectionDropdown,
    },
    {
      field: "full_serial_number_not_in_link",
      headerName: "Full Serial Number Not in Link", // Not in Link
      width: 180,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Full Serial Number <br /> Not in Link
        </div>
      ),
    },
    {
      field: "serial_no",
      headerName: "Serial No.",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "dial",
      headerName: "Dial",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: dialDropdown,
    },
    {
      field: "strap_bracelet",
      headerName: "Strap / Bracelet",
      width: 180,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: strapDropdown,
    },
    {
      field: "num_of_links",
      headerName: "# of Links*",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: numOfLinksDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {params.value == "Blank" ? `` : params.value}
        </div>
      ),
    },
    {
      field: "paper",
      headerName: "Paper",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: paperDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {params.value == "Blank" ? `` : params.value}
        </div>
      ),
    },
    {
      field: "paper_date",
      headerName: "Paper Date",
      width: 120,
      // type: 'date',
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderHeader: (params) => (
        <div className="font-600 text-center">Paper Date </div>
      ),
      renderCell: (params) => {
        return (
          <div className="font-500">
            {params.value
              ? new Date(params.value).toLocaleDateString("en-US")
              : ""}
          </div>
        );
      },
    },
    {
      field: "watch_box",
      headerName: "Box",
      width: 100,
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: boxDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {typeof params.value == "number"
            ? `+ $${params.value}`
            : params.value}
        </div>
      ),
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: conditionDropdown,
    },
    {
      field: "minimum_wholesale_price_usd",
      headerName: "Minimum Wholesale Price",
      width: 90,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Minimum <br /> Wholesale <br /> Price
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "wholesale_price_usd",
      headerName: "Wholesale Price",
      width: 90,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Wholesale <br /> Price{" "}
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "retail_price_usd",
      headerName: "Retail Price",
      width: 90,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Retail <br /> Price{" "}
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "location",
      headerName: "Loc",
      width: 35,
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: LocDropdown,
    },
    {
      field: "cost_usd",
      headerName: "Cost",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "qb",
      headerName: "QB",
      width: 60,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "sold_price",
      headerName: "Sold Price",
      width: 80,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "number",
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Sold <br /> Price
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      headerAlign: "center",
      editable: true,
    },
    {
      field: "internal_notes",
      headerName: "Internal Notes",
      width: 200,
      headerAlign: "center",
      editable: true,
    },
    {
      field: "product_type",
      headerName: "Product Type",
      headerAlign: "center",
      align: "center",
      width: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: productTypeDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {params.value === "WATCH" ? "A" : params.value === "BAG" ? "B" : ""}
        </div>
      ),
    },
    {
      field: "new_column",
      headerName: "New",
      headerAlign: "center",
      align: "center",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: newDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {params.value === "PRE OWNED"
            ? "P"
            : params.value === "NEW SPECIAL"
              ? "S"
              : params.value === "NEW"
                ? "N"
                : ""}
        </div>
      ),
    },
    {
      field: "watch_from",
      headerName: "From",
      width: 80,
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: fromDropdown,
      renderCell: (params) => <div className="font-500">{params.value}</div>,
    },
    {
      field: "auct",
      headerName: "Auct",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "japan_box",
      headerName: "Japan Box#",
      width: 60,
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Japan <br /> Box#
        </div>
      ),
    },
    {
      field: "lot",
      headerName: "Lot",
      width: 40,
      align: "center",
      editable: true,
    },
    {
      field: "have_link",
      headerName: "Link ?",
      width: 60,
      align: "center",
      editable: true,
      type: "singleSelect",
      valueOptions: nyDropdown,
    },
    {
      field: "purchase_date",
      headerName: "Purchase Date",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "date",
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Purchase <br /> Date{" "}
        </div>
      ),
      renderCell: (params) => {
        return (
          <div className="font-500">
            {params.value
              ? new Date(params.value).toLocaleDateString("en-US")
              : ""}
          </div>
        );
      },
    },
    {
      field: "sold_date",
      headerName: "Sold Date",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
    },
    {
      field: "ch24",
      headerName: "CH24 USD+6%",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          CH24 <br /> USD+6%{" "}
        </div>
      ),
    },
    {
      field: "days_from_purchase_date",
      headerName: "Days from Purchase Date",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Days from
          <br /> Purchase Date{" "}
        </div>
      ),
    },
    {
      field: "total_images",
      headerName: "Total Images",
      width: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Total <br /> Images{" "}
        </div>
      ),
    },
    {
      field: "have_video",
      headerName: "Have Video",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Have <br /> Video{" "}
        </div>
      ),
      type: "singleSelect",
      valueOptions: videoDropdown,
      renderCell: (params) => (
        <div className="font-500">
          {params.value === "MOV" ? "Y" : params.value === "MP4" ? "M" : "N"}
        </div>
      ),
    },
    {
      field: "public_image",
      headerName: "Image/Video Links active",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Image/Video <br /> Links active{" "}
        </div>
      ),
      type: "singleSelect",
      valueOptions: nyDropdown,
      // renderCell: (params) => <div className='font-500'>{params.value === 'MOV' ? 'Y' : params.value === 'MP4' ? 'M' : 'N'}</div>
    },
    {
      field: "minimum_wholesale_price_usd_only_mla",
      headerName: "Minimum Wholesale Price USD (only MLA)",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Minimum <br />
          Wholesale Price <br />
          (only MLA)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "manualmin_price",
      headerName: "Manual Min Price",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Manual <br /> Min Price
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "suggested_wholesale_price_usd_only_mla",
      headerName: "Suggested Wholesale Price USD (only MLA)",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Suggested <br />
          Wholesale Price <br />
          (only MLA)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "column_r_min_price",
      headerName: "Column R (Min price)",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Column R <br />
          (Min price)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "range",
      headerName: "Range",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">Range</div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "column_s_wholesale_price",
      headerName: "Column S (Wholesale price)",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Column S <br />
          (Wholesale Price)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "manual_max_price",
      headerName: "Manual Max Price",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Manual <br /> Max Price
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "total_amount_decreased_from_wholesale_price",
      headerName: "Total amount decreased from Wholesale price",
      width: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Total amount <br /> decreased from <br />
          Wholesale Price
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "w_s_price_decrease_every_n_days_starting_from_day_50",
      headerName: "W/S price decrease every N days (starting from day 50)",
      width: 160,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          W/S price decrease <br />
          every N days <br />
          (starting from day 50)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">{params.value > 0 ? params.value : ""}</div>
      ),
    },
    {
      field: "wholesale_price_will_decrease_next_date",
      headerName: "Wholesale price will decrease next (date)",
      width: 160,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Wholesale price <br />
          will decrease <br />
          next (date)
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "hold_sold_on_date",
      headerName: "Hold/Sold on (Date)",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Hold/Sold on <br /> (Date)
        </div>
      ),
    },
    {
      field: "wholesale_price_decreased_after_x_days_from_purchase_date",
      headerName: "Wholesale price decreased after X days from purchase date",
      width: 180,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Wholesale price <br />
          decreased after X days <br /> from purchase date
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
    {
      field: "extra_300_for_rx_where_wholesale_price_20",
      headerName:
        "Extra $300 for RX where wholesale price > $20,000 and box INCLUDED",
      width: 190,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderHeader: (params) => (
        <div className="font-600 text-center">
          Extra $300 for RX <br />
          where wholesale price <br /> $20,000 and box INCLUDED
        </div>
      ),
      renderCell: (params) => (
        <div className="font-500">
          {params.value && params.value != 0
            ? params.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      ),
    },
  ];

  return (
    // <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
    // <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }} square>
    <Box sx={{ height: "95vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => "auto"}
        stickyHeader
        pagination={true}
        hideFooter={false}
        processRowUpdate={processRowUpdate}
        onSelectionChange={(newSelection) => {
          console.log("newSelection", newSelection.rows);

          // **** The following line breaks the page upon selection ****
          // currentlySelected(newSelection)
        }}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
        }}
        sx={{
          // borderTop: 1,
          // borderRight: 1,
          // borderBottom: 1,
          border: 1,
          borderColor: "lightgray",
          color: "black",
          scrollbarWidth: "auto",
          scrollbarColor: "black",
          "& .MuiDataGrid-columnHeaders": {
            border: 1,
            borderTop: 0,
            borderBottom: 1,
            borderRadius: 0,
            borderColor: "lightgray",

            // backgroundColor: 'black',
            // fontWeight: 600
          },
          "& .MuiDataGrid-columnHeader": {
            // border: 1,
            // borderTop: 0,
            // // borderBottom: 1,
            // borderRadius: 0,
            // borderColor: 'lightgray',
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            // border: 1,
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
        // initialState={{ pinnedColumns: { left: ['image'] } }}
        // initialState={{
        // pagination: {
        //     paginationModel: {
        //       pageSize: 100,
        //     },
        // },
        // }}
        // pageSizeOptions={[100,500]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    // </Paper>
    // </div>
  );
}
