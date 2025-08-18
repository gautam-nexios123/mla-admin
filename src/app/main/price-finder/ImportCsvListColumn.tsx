import moment from "moment";
import { formatter } from "src/utils/coreFunction";
import { dialDropdown, strapDropdown } from "src/utils/dropdownlist";

const defaultColumnkey = {
  // filterable: true,
  // hideSortIcons: true,
  // pinnable: true,
  // resizable: true,
  // sortable: true,
  headerAlign: "center",
  align: "center",
};

export const csvDataListcolumns: any = [
  {
    field: "date",
    headerName: "Date",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "dial",
    headerName: "Dial",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "strap_bracelet",
    headerName: "Bracelet",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value ?? ""}</div>,
  },
  {
    field: "bw",
    headerName: "BW",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "warranty_year",
    headerName: "Warranty Year",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">
        {params?.value === null ||
        params?.value === "" ||
        params?.value === "null"
          ? ""
          : params.value}
      </div>
    ),
  },
  {
    field: "new_type",
    headerName: "New",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value ?? ""}</div>,
  },
  {
    field: "winning_bid_usd",
    headerName: "Winning Bid USD",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: true,
    renderCell: (params) => (
      <div className="">{formatter.format(params.value)}</div>
    ),
  },
  {
    field: "box",
    headerName: "Box",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "lot",
    headerName: "Lot",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "name",
    headerName: "Auction",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
];

export const getColorTextByColorGroup = (colorGroup: any) => {
  if (
    colorGroup == "Group A" ||
    colorGroup == "Group B" ||
    colorGroup == "Group C"
  ) {
    return true;
  } else {
    return false;
  }
};
export const csvGetPriceDataListcolumns: any = [
  {
    field: "id",
    headerName: "#",
    align: "center",
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {moment(params.value).format("DD-MMM-YYYY")}
      </div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    align: "center",
    // flex: 1,
    width: 200,
    editable: true,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "dial",
    headerName: "Dial",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: true,
    type: "singleSelect",
    // valueOptions:dialDropdown,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"} font-500`}
      >
        {params.value == "Blank" ? `` : params.value}
      </div>
    ),
  },
  {
    field: "strap_bracelet",
    headerName: "Strap Bracelet",
    align: "center",
    flex: 1,
    editable: true,
    ...defaultColumnkey,
    type: "singleSelect",
    valueOptions: strapDropdown,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params?.value == "Blank" ? `` : params?.value}
      </div>
    ),
  },
  {
    field: "bw",
    headerName: "BW",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "warranty_year",
    headerName: "Warranty Year",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params?.value === null ||
        params?.value === "" ||
        params?.value === "null"
          ? ""
          : params.value}
      </div>
    ),
  },
  // {
  //   field: "new_type",
  //   headerName: "New",
  //   align: "center",
  //   flex: 1,
  //   editable: false,
  //   ...defaultColumnkey,
  //   renderCell: (params) => <div className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}>{params.value ?? ""}</div>,
  // },
  // {
  //   field: "winning_bid_usd",
  //   headerName: "Winning Bid USD",
  //   ...defaultColumnkey,
  //   align: "center",
  //   flex: 1,
  //   editable: false,
  //   renderCell: (params) => (
  //     <div className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}>{formatter.format(params.value)}</div>
  //   ),
  // },
  {
    field: "suggested_price",
    headerName: "MAL Data Price",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      return (
        <div
          className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
        >
          {params.value === undefined || params.value === ""
            ? ""
            : params.value !== "N/A"
              ? formatter.format(params.value)
              : ""}
        </div>
      );
    },
  },
  {
    field: "marketSuggested_price",
    headerName: "Market Data Price",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value === undefined || params.value === ""
          ? ""
          : params.value !== "N/A"
            ? formatter.format(params.value)
            : ""}
      </div>
    ),
  },
  {
    field: "finalPrice",
    headerName: "Combined Price",
    ...defaultColumnkey,
    align: "center",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      return (
        <div
          className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
        >
          {params.value === undefined || params.value === ""
            ? ""
            : params.value !== "N/A"
              ? formatter.format(params.value)
              : ""}
        </div>
      );
    },
  },
  {
    field: "box",
    headerName: "Box",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "lot",
    headerName: "Lot",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "item_in_stock",
    headerName: "Item In stock",
    align: "center",
    flex: 1,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "note_des",
    headerName: "Note",
    align: "center",
    width: 320,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div
        className={`${getColorTextByColorGroup(params?.row?.color) ? "text-white" : "text-black"}`}
      >
        {params.value}
      </div>
    ),
  },
  // {
  //   field: "name",
  //   headerName: "Auction",
  //   align: "center",
  //   flex: 1,
  //   editable: false,
  //   ...defaultColumnkey,
  //   renderCell: (params) => <div className="">{params.value !== undefined ? params.value : ""}</div>,
  // },
];
