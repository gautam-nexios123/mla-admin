import moment from "moment-timezone";
import { formatDate } from "src/utils/coreFunction";
import {
  bezelMaterialOptions,
  bezelOptions,
  boxDropdown,
  braceletColorOptions,
  braceletMaterialOptions,
  caseBackOptions,
  caseMaterialOptions,
  caseShapeOptions,
  claspStyleOptions,
  collectionDropdown,
  conditionDropdown,
  crystalMaterialOptions,
  dialColorOptions,
  dialDropdown,
  fromDropdown,
  genderOptions,
  hourMarkersOptions,
  LocDropdown,
  movementOptions,
  naDropdown,
  newDropdown,
  numDropdown,
  numOfLinksDropdown,
  nyDropdown,
  nyLaDropdown,
  paperDropdown,
  powerReserveOptions,
  productTypeDropdown,
  soldBoxDropdown,
  statusDropdown,
  strapDropdown,
  videoDropdown,
  waterResistanceOptions,
} from "src/utils/dropdownlist";

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
    renderCell: (params) => <div className="font-600">{params.value}</div>,
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
    field: "modelName",
    headerName: "Model Name",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: true,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
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
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
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
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
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
    width: 80,
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: naDropdown,
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
    field: "watch_box",
    headerName: "Box Price",
    width: 100,
    align: "center",
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
    field: "condition",
    headerName: "Condition",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: conditionDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
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
  {
    field: "sold_price",
    headerName: "Sold Price Retail (USD)",
    width: 100,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "number",
    renderHeader: (params) => (
      <div className="font-600 text-center">
        Sold Price
        <br />
        Retail (USD)
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
    field: "new_type",
    headerName: "Pre-Owned/New",
    headerAlign: "center",
    align: "center",
    width: 130,
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
    field: "have_link",
    headerName: "Active (Wholesale)",
    width: 130,
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: nyDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "isActiveRetailInventory",
    headerName: "Active (Retail)",
    width: 130,
    align: "center",
    editable: true,
    type: "singleSelect",
    valueOptions: nyDropdown,
    renderCell: (params) => (
      <div className="font-500">
        {" "}
        {params.value == "Blank" ? "" : params.value}
      </div>
    ),
  },
  //   New field
  {
    field: "sku",
    headerName: "SKU",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "url_key",
    headerName: "Url Key",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "fullDescription",
    headerName: "Full Description",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "movement",
    headerName: "Movement",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
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
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "powerReserve",
    headerName: "Power Reserve",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
    type: "singleSelect",
    valueOptions: powerReserveOptions,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "date",
    headerName: "Date",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
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
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "caseShape",
    headerName: "Case Shape",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
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
    editable: true,
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
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
  {
    field: "crystalMaterial",
    headerName: "Crystal Material",
    headerAlign: "center",
    align: "center",
    width: 130,
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
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
    editable: true,
    type: "text",
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },
];
