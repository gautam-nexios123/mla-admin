import { Checkbox } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import moment from "moment-timezone";
import { formatDate } from "src/utils/coreFunction";
import {
  statusDropdown,
  nyLaDropdown,
  collectionDropdown,
  dialDropdown,
  strapDropdown,
  numOfLinksDropdown,
  paperDropdown,
  boxDropdown,
  conditionDropdown,
  LocDropdown,
  productTypeDropdown,
  newDropdown,
  fromDropdown,
  nyDropdown,
  videoDropdown,
  numDropdown,
  naDropdown,
  soldBoxDropdown,
  movementOptions,
  powerReserveOptions,
  caseShapeOptions,
  caseMaterialOptions,
  crystalMaterialOptions,
  caseBackOptions,
  bezelOptions,
  bezelMaterialOptions,
  hourMarkersOptions,
  dialColorOptions,
  braceletColorOptions,
  braceletMaterialOptions,
  claspStyleOptions,
  genderOptions,
  waterResistanceOptions,
  boxStatusDropdown,
  paperStatusDropdown,
  typeDropdown,
  purchaseCurrencyDropDown,
} from "src/utils/dropdownlist";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

export const columns: any = [
  {
    field: "rows_id",
    headerName: "No.",
    width: 10,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">No.</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  {
    field: "status",
    headerName: "Status",
    width: 128,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: statusDropdown,
    // valueGetter: (value) => {
    //   console.log('status::::',value)
    //   return value;
    // },
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Status</div>,
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
          {params.value == `Move to Archive`
            ? `SOLD/ARCHIVED`
            : params.value == `Sold`
              ? `SOLD`
              : params.value == `To Ship`
                ? `SOLD/TO SHIP`
                : params.value == `Available`
                  ? ``
                  : params.value}
        </div>
      );
    },
  },
  {
    field: "imageUrl",
    headerName: "Image",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Image</div>,
    renderCell: (params) => (
      <img
        onError={(e) => {
          e.currentTarget.src =
            "https://admin.mlawatches.com/assets/images/logo/mla.svg";
        }}
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
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Stock</div>,
    renderCell: (params) => <div className="font-600 ">{params.value}</div>,
  },
  {
    field: "have_link",
    headerName: "Online MLA",
    width: 100,
    align: "center",
    editable: false,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Online MLA</div>,
    // type: "singleSelect",
    // valueOptions: nyDropdown,
    // renderCell: (params) => (
    //   <div className="font-500">
    //     {params.value == "Blank" ? `` : params.value}
    //   </div>
    // ),
  },
  {
    field: "isOnlineMasterLuxury",
    headerName: "Online ML",
    width: 100,
    align: "center",
    editable: false,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Online ML</div>,
    // type: "singleSelect",
    // valueOptions: nyDropdown,
    // renderCell: (params) => (
    //   <div className="font-500">
    //     {params.value == "Blank" ? `` : params.value}
    //   </div>
    // ),
  },
  {
    field: "isOnlineSpecial",
    headerName: "Online Special",
    width: 120,
    align: "center",
    editable: false,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Online Special</div>,
    // type: "singleSelect",
    // valueOptions: nyDropdown,
    // renderCell: (params) => (
    //   <div className="font-500">
    //     {params.value == "Blank" ? `` : params.value}
    //   </div>
    // ),
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: typeDropdown,
    renderHeader: (params) => <div className="text-center">Type</div>,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Brand</div>,
    renderCell: (params) => <div className="font-600 ">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model N.",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Model N.</div>,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "modelName",
    headerName: "Model Name MLA",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Model Name MLA</div>,
    renderCell: (params) => <div className="font-600 ">{params.value}</div>,
  },
  {
    field: "full_serial_number_not_in_link",
    headerName: "Full Serial N.", // Not in Link
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">Full Serial N.</div>,
  },

  {
    field: "serial_no",
    headerName: "Hidden Serial N.",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => (
      <div className="text-center">Hidden Serial N.</div>
    ),
  },
  {
    field: "dial",
    headerName: "Dial",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: dialDropdown,
    renderCell: (params) => (
      <div className="font-500  ">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
    renderHeader: (params) => <div className="text-center">Dial</div>,
  },
  {
    field: "strap_bracelet",
    headerName: "Strap / Bracelet",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: strapDropdown,
    renderCell: (params) => (
      <div className="font-500 ">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
    renderHeader: (params) => (
      <div className="text-center">Strap / Bracelet</div>
    ),
  },
  {
    field: "num_of_links",
    headerName: "Links Counts",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: numOfLinksDropdown,
    renderHeader: (params) => <div className="text-center">Links Counts</div>,
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
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: paperDropdown,
    renderHeader: (params) => <div className="text-center">Paper</div>,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "paper_status",
    headerName: "Paper Status",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: paperStatusDropdown,
    renderHeader: (params) => <div className="text-center">Paper Status</div>,
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value == "Blank"
            ? ``
            : params?.row?.paper === "N/A"
              ? "N/A"
              : params.value}
        </div>
      );
    },
  },
  {
    field: "paper_date",
    headerName: "Paper Date",
    width: 120,
    // type: 'date',
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "date",
    valueGetter: (value) => {
      const dateObj = new Date(value);
      // const localDate = new Date(new Date(value).toISOString().split('T')[0].split('-').slice(1).join('-'));
      const localDate = new Date(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate()
      );
      return value ? localDate : null;
    },
    renderHeader: (params) => <div className="text-center">Paper Date </div>,
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params?.row?.paper_date ? formatDate(params?.row?.paper_date) : ""}
        </div>
      );
    },
  },
  {
    field: "have_box",
    headerName: "Box",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: naDropdown,
    renderHeader: (params) => <div className="text-center">Box</div>,
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value == "Blank" ||
          params.value == "null" ||
          params.value == "" ||
          !params.value
            ? ""
            : params.value}
        </div>
      );
    },
  },
  {
    field: "have_box_status",
    headerName: "Box Status",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: boxStatusDropdown,
    renderHeader: (params) => <div className="text-center">Box Status</div>,
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value == "Blank"
            ? ""
            : params?.row?.have_box === "N/A"
              ? "N/A"
              : params.value}
        </div>
      );
    },
  },
  {
    field: "condition",
    headerName: "Condition",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-green",
    type: "singleSelect",
    valueOptions: conditionDropdown,
    renderHeader: (params) => <div className="text-center">Condition</div>,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "msrp",
    headerName: "MSRP",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: true,
    headerClassName: "custom-header-green",
    renderHeader: (params) => <div className="text-center">MSRP</div>,
  },
  {
    field: "cost_usd",
    headerName: "Base Cost",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    headerClassName: "custom-header-villot",
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
    field: "repair_cost_usd",
    headerName: "Repair Cost",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    headerClassName: "custom-header-villot",
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
    headerName: "Suggested Base W Sale Max Price",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="text-center">
        Suggested W Sale
        <br /> Max Price
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
    headerName: "Manual Base W Sale Max Price Staff Enter",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="text-center">
        Manual W Sale
        <br /> Max Price
      </div>
    ),
    renderCell: (params) => (
      <div className="font-500">
        {params.value && params.value != 0
          ? Number(params.value)?.toLocaleString("en-US", {
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
    headerName: "Location",
    width: 120,
    align: "center",
    headerAlign: "center",
    editable: true,
    type: "singleSelect",
    headerClassName: "custom-header-villot",
    valueOptions: LocDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "shipping_fee",
    headerName: "Shipping Fee",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    headerClassName: "custom-header-villot",
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
    field: "minimum_wholesale_price_usd_only_mla",
    headerName: "Final W Sale Min Price Rounded",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="text-center">
        Final W Sale Min <br />
        Price Rounded
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
    field: "final_w_sale_max_price_rounded",
    headerName: "Final W Sale Max Price Rounded",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="text-center">
        Final W Sale Max <br />
        Price Rounded
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
    field: "manual_final_w_sale_max_price",
    headerName: "Manual Final W Sale Max Price",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: true,
    headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="text-center">
        Manual Final W <br />
        Sale Max Price
      </div>
    ),
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value && params.value != 0
            ? Number(params.value)?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : ""}
        </div>
      );
    },
  },
  // {
  //   field: "suggested_wholesale_price_usd_only_mla",
  //   headerName: "Base Max W Sale Price",
  //   width: 140,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  //   renderHeader: (params) => (
  //     <div className="font-600 text-center w-full h-full bg-[#bebceb] flex justify-center items-center">
  //       Base Max <br />W Sale Price
  //     </div>
  //   ),
  //   renderCell: (params) => (
  //     <div className="font-500">
  //       {params.value && params.value != 0
  //         ? params.value.toLocaleString("en-US", {
  //             style: "currency",
  //             currency: "USD",
  //             minimumFractionDigits: 0,
  //             maximumFractionDigits: 0,
  //           })
  //         : ""}
  //     </div>
  //   ),
  // },
  {
    field: "ny_la",
    headerName: "NY/LA",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: nyLaDropdown,
    renderHeader: (params) => <div className="font-600 text-center">NY/LA</div>,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
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
    width: 200,
    editable: true,
    type: "singleSelect",
    valueOptions: collectionDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },

  {
    field: "watch_box",
    headerName: "Box Price",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: boxDropdown,
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value == "Blank" ||
          params.value == "null" ||
          params.value == "" ||
          !params.value
            ? ""
            : params.value}
        </div>
      );
    },
  },

  {
    field: "minimum_wholesale_price_usd",
    headerName: "Minimum Wholesale Price",
    width: 100,
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
    width: 100,
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
    width: 100,
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
    field: "net_cost_usd",
    headerName: "Net Cost",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
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
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
  },
  {
    field: "purchase_currency",
    headerName: "Purchase Currency",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: purchaseCurrencyDropDown,
    renderCell: (params) => (
      <div className="font-500  ">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
    renderHeader: (params) => (
      <div className="text-center font-bold">
        Purchase <br /> Currency
      </div>
    ),
  },
  {
    field: "exchange_rate",
    headerName: "Exchange Rate",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
    renderHeader: (params) => (
      <div className="text-center font-bold">
        Exchange <br /> Rate
      </div>
    ),
  },
  {
    field: "purchase_price",
    headerName: "Purchase Price",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
    renderHeader: (params) => (
      <div className="text-center font-bold">
        Purchase <br /> Price
      </div>
    ),
  },
  {
    field: "sold_price",
    headerName: "Sold Price",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Sold Price
        <br />
        (Watch)
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
    field: "sold_with_box",
    headerName: "Sold With Box",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: soldBoxDropdown,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Sold With <br /> Box
      </div>
    ),
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value == "BLANK" ? "" : params.value}
        </div>
      );
    },
  },
  {
    field: "sold_price_box",
    headerName: "Sold Price (Box)",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Sold Price
        <br />
        (Box)
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
    field: "profit",
    headerName: "Profit",
    width: 100,
    headerAlign: "center",
    sortable: true,
    align: "center",
    type: "text",
    renderCell: (params) => {
      // const profit = params?.row?.sold_price
      // ? params?.row?.sold_price - params?.row?.cost_usd
      // : 0;
      const profitText = params?.value?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const textColor = params?.value < 0 ? "red" : "inherit";

      return (
        <div className="font-500" style={{ color: textColor }}>
          {profitText}
        </div>
      );
    },
  },
  {
    field: "profit_percentage",
    headerName: "Markup %",
    width: 100,
    headerAlign: "center",
    align: "center",
    sortable: true,
    editable: false,
    type: "number",
    renderCell: (params) => {
      // const profit = params?.row?.sold_price
      //   ? params?.row?.sold_price - params?.row?.cost_usd
      //   : 0;
      // const markupPercentage =
      //   profit !== 0 ? ((profit / params?.row?.cost_usd) * 100).toFixed(2) : "";

      const textColor = params?.value < 0 ? "red" : "inherit";

      return (
        <div className="font-500" style={{ color: textColor }}>
          {params?.value ? `${params?.value}%` : ""}
        </div>
      );
    },
  },
  {
    field: "internal_box_notes",
    headerName: "Internal Box Notes",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Internal Box
        <br />
        Notes
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
    renderCell: (params) => <div className="font-500">{params.value}</div>,
    // renderCell: (params) => <div className='font-500'>{params.value === 'WATCH' ? 'A' : params.value === 'BAG' ? 'B' : params.value === 'WATCH (Old Stock)' ? 'C' : params.value === 'VINTAGE' ? 'D' : ''}</div>
  },
  {
    field: "new_type",
    headerName: "Pre-Owned/New",
    headerAlign: "center",
    align: "center",
    width: 140,
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
              : params.value === "PBB"
                ? "PBB"
                : ""}
      </div>
    ),
  },
  {
    field: "watch_from",
    headerName: "From",
    width: 140,
    align: "center",
    headerAlign: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: fromDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "auct",
    headerName: "Auct",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: true,
  },
  {
    field: "japan_box",
    headerName: "Japan Box#",
    width: 140,
    align: "center",
    headerAlign: "center",
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
    width: 140,
    align: "center",
    headerAlign: "center",
    editable: true,
    renderCell: (params) => (
      <div className="font-500">{params.value == 0 ? `` : params.value}</div>
    ),
  },
  // {
  //   field: "have_link",
  //   headerName: "Active",
  //   width: 60,
  //   align: "center",
  //   editable: true,
  //   type: "singleSelect",
  //   valueOptions: nyDropdown,
  //   renderCell: (params) => (
  //     <div className="font-500">
  //       {params.value == "Blank" ? `` : params.value}
  //     </div>
  //   ),
  // },
  {
    field: "purchase_date",
    headerName: "Purchase Date",
    width: 120,
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
            ? moment(params.value).tz("Asia/Bangkok").format("DD-MMM-YYYY")
            : ""}
        </div>
      );
      // return <div className='font-500'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
    },
  },
  {
    field: "sold_date",
    headerName: "Sold Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "date",
    valueGetter: (value) => {
      return value ? new Date(value) : null;
    },
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value &&
          (params.row.status == "Sold" ||
            params.row.status == "Move to Archive" ||
            params.row.status == "To Ship")
            ? moment(params.value).format("DD-MMM-YYYY")
            : ""}
        </div>
      );
    },
  },
  {
    field: "archive_sold_to",
    headerName: "Client Name",
    width: 120,
    align: "center",
    headerAlign: "center",
    editable: true,
    renderCell: (params) => (
      <div className="font-500">{params.value == 0 ? `` : params.value}</div>
    ),
  },
  {
    field: "archived_date",
    headerName: "Archived Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "date",
    valueGetter: (value) => {
      return value ? new Date(value) : null;
    },
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value &&
          (params.row.status == "Sold" ||
            params.row.status == "Move to Archive" ||
            params.row.status == "To Ship")
            ? moment(params.value).format("DD-MMM-YYYY")
            : ""}
        </div>
      );
    },
  },
  {
    field: "ch24_usd_6",
    headerName: "CH24 USD+6%",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        CH24 <br /> USD+6%{" "}
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
    field: "posted_in_mla_group_chat_times",
    headerName: "Posted in MLA group chat (# of times)",
    width: 120,
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: numDropdown,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Posted in <br /> MLA group chat <br /> (# of times){" "}
      </div>
    ),
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" || params.value == 0 ? `` : params.value}
      </div>
    ),
  },
  {
    field: "posted_in_group_chat_date",
    headerName: "Posted in group chat (date)",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "date",
    valueGetter: (value) => {
      return value ? new Date(value) : null;
    },
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Posted in <br /> group chat <br /> (date){" "}
      </div>
    ),
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
        </div>
      );
    },
  },
  {
    field: "days_from_purchase_date",
    headerName: "Days from Purchase Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Days from
        <br /> Purchase Date
      </div>
    ),
    renderCell: (params) => {
      const purchaseDate = moment
        .tz(params.row.purchase_date, "Asia/Bangkok")
        .endOf("day");
      const currentDate = moment.tz("Asia/Bangkok").endOf("day");
      const diffInDays = currentDate.diff(purchaseDate, "days");
      // console.log(`stock ${params.row.id} purchase :: ${purchaseDate} diffInDays:: ${diffInDays}`)
      return <div className="font-500">{diffInDays}</div>;
    },
  },
  // {
  //   field: 'days_from_purchase_date',
  //   headerName: 'Days from Purchase Date',
  //   width: 120,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderHeader: (params) => <div className='font-600 text-center'>Days from<br /> Purchase Date </div>,
  //   // renderCell: (params) => <div className='font-500'>{(params.value+1)}</div>
  //   // renderCell: (params) => <div className='font-500'>{params.value == 0 ? 0 : (params.value+1)}</div>
  // },
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
    width: 120,
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
    width: 120,
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
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
    // renderCell: (params) => <div className='font-500'>{params.value === 'MOV' ? 'Y' : params.value === 'MP4' ? 'M' : 'N'}</div>
  },
  {
    field: "manual_overwrite_minimum_and_wholesale_price",
    headerName: "Overide Minimum/Wholesale price",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Manual Overwrite <br /> of Minimum &<br /> Wholesale price{" "}
      </div>
    ),
    type: "singleSelect",
    valueOptions: nyDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
    // renderCell: (params) => <div className='font-500'>{params.value === 'MOV' ? 'Y' : params.value === 'MP4' ? 'M' : 'N'}</div>
  },
  {
    field: "minimum_wholesale_price_min_usd_only_mla",
    headerName: "Suggested W Sale Min Price",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: false,
    // headerClassName: "custom-header-villot",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Suggested W Sale Min <br />
        Price
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
    width: 140,
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
    field: "column_r_min_price",
    headerName: "Column R (Min price)",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
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
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderHeader: (params) => <div className="font-600 text-center">Range</div>,
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
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
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
    editable: false,
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
    editable: false,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Wholesale price <br />
        will decrease <br />
        next (date)
      </div>
    ),
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value &&
          params.row.product_type != "WATCH (Old Stock)" &&
          params.row.cost_usd != 0
            ? moment(params.value).format("DD-MMM-YYYY")
            : ""}
        </div>
      );
    },
  },
  {
    field: "hold_sold_on_date",
    headerName: "Hold/Sold on (Date)",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Hold/Sold on <br /> (Date)
      </div>
    ),
    // renderCell: (params) => {
    //   return <div className='font-500'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
    // }
    // editable: true,
    type: "date",
    valueGetter: (value) => {
      return value ? new Date(value) : null;
    },
    // renderCell: (params) => {
    //   return <div className='font-500'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
    // }
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value &&
          (params.row.status == "Sold" ||
            params.row.status == "Move to Archive" ||
            params.row.status == "To Ship")
            ? moment(params.value).format("DD-MMM-YYYY")
            : ""}
        </div>
      );
    },
  },
  {
    field: "wholesale_price_decreased_after_x_days_from_purchase_date",
    headerName: "Wholesale price decreased after X days from purchase date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
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

export const masterLuxuryColumns: any = [
  {
    field: "rows_id",
    headerName: "No.",
    width: 10,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    renderCell: (params) => <div className="font-600">{params.value}</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  {
    field: "status",
    headerName: "Status",
    width: 128,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: statusDropdown,
    // valueGetter: (value) => {
    //   console.log('status::::',value)
    //   return value;
    // },
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
          {params.value == `Move to Archive`
            ? `SOLD/ARCHIVED`
            : params.value == `Sold`
              ? `SOLD`
              : params.value == `To Ship`
                ? `SOLD/TO SHIP`
                : params.value == `Available`
                  ? ``
                  : params.value}
        </div>
      );
    },
  },
  {
    field: "imageUrl",
    headerName: "Image",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <img
        onError={(e) => {
          e.currentTarget.src =
            "https://admin.mlawatches.com/assets/images/logo/mla.svg";
        }}
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
    field: "have_link",
    headerName: "Online MLA",
    width: 100,
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <div className="font-500">
          <Checkbox
            name={params?.field}
            checked={params?.value === "Y" ? true : false}
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon />}
          />
        </div>
      );
    },
  },
  {
    field: "isOnlineMasterLuxury",
    headerName: "Online Master Luxury",
    width: 100,
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <div className="font-500 ">
          <Checkbox
            name={params?.field}
            checked={params?.value === "Y" ? true : false}
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon />}
          />
        </div>
      );
    },
  },
  {
    field: "isOnlineSpecial",
    headerName: "Online Special",
    width: 100,
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <div className="font-500">
          <Checkbox
            name={params?.field}
            checked={params?.value === "Y" ? true : false}
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon />}
          />
        </div>
      );
    },
  },
  {
    field: "isMasterLuxuryPublish",
    headerName: "Active",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: false,
  },
  {
    field: "isRareWatch",
    headerName: "Rare Watch",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: false,
  },
  {
    field: "brand",
    headerName: "Title 1",
    width: 200,
    // minWidth : 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Title 2",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "modelName",
    headerName: "Title 3",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "collection",
    headerName: "Collection/Family",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    type: "singleSelect",
    valueOptions: collectionDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "serial_no",
    headerName: "Serial No.",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    field: "dial",
    headerName: "Title 4",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: dialDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "strap_bracelet",
    headerName: "Title 5",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: strapDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "num_of_links",
    headerName: "# of Links*",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
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
    editable: false,
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
    editable: false,
    type: "date",
    valueGetter: (value) => {
      const dateObj = new Date(value);
      // const localDate = new Date(new Date(value).toISOString().split('T')[0].split('-').slice(1).join('-'));
      const localDate = new Date(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate()
      );
      return value ? localDate : null;
    },
    renderHeader: (params) => (
      <div className="font-600 text-center">Paper Date </div>
    ),
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params?.row?.paper_date ? formatDate(params?.row?.paper_date) : ""}
        </div>
      );
    },
  },
  {
    field: "have_box",
    headerName: "Box",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: naDropdown,
    renderCell: (params) => {
      return (
        <div className="font-500 ">
          {params.value == "Blank" ||
          params.value == "null" ||
          params.value == "" ||
          !params.value
            ? ""
            : params.value}
        </div>
      );
    },
  },
  {
    field: "condition",
    headerName: "Condition",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: conditionDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "markup_price",
    headerName: "Markup Price",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
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
    field: "retail_price_usd",
    headerName: "Retail Price Wire",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Retail Price
        <br /> Wire{" "}
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
    field: "retail_price_other_payment",
    headerName: "Retail Price Other Payment",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Retail Price
        <br /> Other Payment{" "}
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
    field: "retail_sold_price",
    headerName: "Retail Sold Price",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Retail
        <br />
        Sold Price
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
    headerName: "Cost",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params?.row?.sold_price
            ? params?.row?.sold_price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : params?.row?.wholesale_price_usd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
        </div>
      );
    },
  },
  {
    field: "location",
    headerName: "Loc",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: false,
    type: "singleSelect",
    valueOptions: LocDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "purchase_date",
    headerName: "Purchase Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
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
            ? moment(params.value).tz("Asia/Bangkok").format("DD-MMM-YYYY")
            : ""}
        </div>
      );
      // return <div className='font-500'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
    },
  },
  {
    field: "days_from_purchase_date",
    headerName: "Days from Purchase Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Days from
        <br /> Purchase Date
      </div>
    ),
    renderCell: (params) => {
      const purchaseDate = moment
        .tz(params.row.purchase_date, "Asia/Bangkok")
        .endOf("day");
      const currentDate = moment.tz("Asia/Bangkok").endOf("day");
      const diffInDays = currentDate.diff(purchaseDate, "days");
      // console.log(`stock ${params.row.id} purchase :: ${purchaseDate} diffInDays:: ${diffInDays}`)
      return <div className="font-500">{diffInDays}</div>;
    },
  },
  // {
  //   field: "sold_price",
  //   headerName: "Sold Price Retail (USD)",
  //   width: 100,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  //   type: "number",
  //   renderHeader: (params) => (
  //     <div className="font-600 text-center">
  //       Sold Price
  //       <br />
  //       Retail (USD)
  //     </div>
  //   ),
  //   renderCell: (params) => (
  //     <div className="font-500">
  //       {params.value && params.value != 0
  //         ? params.value.toLocaleString("en-US", {
  //             style: "currency",
  //             currency: "USD",
  //             minimumFractionDigits: 0,
  //             maximumFractionDigits: 0,
  //           })
  //         : ""}
  //     </div>
  //   ),
  // },
  {
    field: "sold_date",
    headerName: "Sold Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "date",
    valueGetter: (value) => {
      return value ? new Date(value) : null;
    },
    renderCell: (params) => {
      return (
        <div className="font-500">
          {params.value &&
          (params.row.status == "Sold" ||
            params.row.status == "Move to Archive" ||
            params.row.status == "To Ship")
            ? moment(params.value).format("DD-MMM-YYYY")
            : ""}
        </div>
      );
    },
  },

  {
    field: "notes",
    headerName: "Notes",
    width: 200,
    headerAlign: "center",
    editable: false,
  },
  {
    field: "internal_notes",
    headerName: "Internal Notes",
    width: 200,
    headerAlign: "center",
    editable: false,
  },

  {
    field: "new_type",
    headerName: "Pre-Owned/New",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
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
  // {
  //   field: "isActiveRetailInventory",
  //   headerName: "Active (Retail)",
  //   width: 130,
  //   align: "center",
  //   editable: false,
  //   type: "singleSelect",
  //   valueOptions: nyDropdown,
  //   renderCell: (params) => (
  //     <div className="font-500">
  //       {" "}
  //       {params.value == "Blank" ? "" : params.value}
  //     </div>
  //   ),
  // },
  //   New field
  {
    field: "sku",
    headerName: "SKU",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params?.row?.id}</div>,
  },
  {
    field: "url_key",
    headerName: "Url Key",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "description1",
    headerName: "Description 1",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "description2",
    headerName: "Description 2",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "internal_notes1",
    headerName: "Internal Notes 1",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "internal_notes2",
    headerName: "Internal Notes 2",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "isYoutube",
    headerName: "Youtube",
    headerAlign: "center",
    align: "center",
    width: 100,
    editable: false,
    // type: "singleSelect",
    // valueOptions: [true, false],
    // renderCell: (params) => (
    //   <div className="font-500">{params?.value ? "True" : "False"}</div>
    // ),
  },
  {
    field: "isFacebook",
    headerName: "Facebook",
    headerAlign: "center",
    align: "center",
    width: 100,
    // editable: false,
    // type: "singleSelect",
    // valueOptions: [true, false],
    // renderCell: (params) => (
    //   <div className="font-500">{params?.value ? "True" : "False"}</div>
    // ),
  },
  {
    field: "isInstagram",
    headerName: "Instagram",
    headerAlign: "center",
    align: "center",
    width: 100,
    editable: false,
    // type: "singleSelect",
    // valueOptions: [true, false],
    // renderCell: (params) => (
    //   <div className="font-500">{params?.value ? "True" : "False"}</div>
    // ),
  },
  {
    field: "movement",
    headerName: "Movement",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: movementOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caliber",
    headerName: "Caliber",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "powerReserve",
    headerName: "Power Reserve",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: powerReserveOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "date",
    headerName: "Date",
    headerAlign: "center",
    align: "center",
    width: 120,
    editable: false,
    type: "singleSelect",
    valueOptions: ["Yes", "No"],
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "complications",
    headerName: "Complications",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caseShape",
    headerName: "Case Shape",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: caseShapeOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caseMaterial",
    headerName: "Case Material",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: caseMaterialOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caseDiameter",
    headerName: "Case Diameter",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "crystalMaterial",
    headerName: "Crystal Material",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: crystalMaterialOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caseBack",
    headerName: "Case Back",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: caseBackOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "bezel",
    headerName: "Bezel",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: bezelOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "bezelMaterial",
    headerName: "Bezel Material",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: bezelMaterialOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "hourMarkers",
    headerName: "Hour Markers",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: hourMarkersOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "dialColor",
    headerName: "Dial Color",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: dialColorOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "braceletColor",
    headerName: "Bracelet Color",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: braceletColorOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "braceletMaterial",
    headerName: "Bracelet Material",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: braceletMaterialOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "claspStyle",
    headerName: "Clasp Style",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: claspStyleOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "gender",
    headerName: "Gender",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: genderOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "waterResistance",
    headerName: "Water Resistance",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "singleSelect",
    valueOptions: waterResistanceOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "comesWith",
    headerName: "ComesWith",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: false,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
];
