import moment from "moment";
import { formatter } from "src/utils/coreFunction";
import { boxInventoryStatusDropdown } from "src/utils/dropdownlist";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ImageSliderDialog from "./ImageSliderDialog";

const defaultColumnkey = {
  headerAlign: "center",
  align: "center",
};

export const columns = (handleClickOpen) => {
  return [
    {
      field: "rows_no",
      headerName: "No.",
      width: 10,
      align: "center",
      editable: false,
      type: "number",
      renderCell: (params) => <div className="font-600">{params.value}</div>,
    },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => {
        return (
          <ImageSliderDialog selectedValue={params.value} isGridView={false} />
        );
      },
    },
    // {
    //   field: "imageUrl",
    //   headerName: "Image",
    //   width: 100,
    //   headerAlign: "center",
    //   align: "center",
    //   editable: false,
    //   renderCell: (params) => {
    //     const handleError = (e) => {
    //       e.currentTarget.src =
    //         "https://admin.mlawatches.com/assets/images/logo/mla.svg";
    //       e.currentTarget.style.minWidth = "100%";
    //     };

    //     return (
    //       <img
    //         onError={handleError}
    //         style={{
    //           height: params.value ? "95px" : "100%",
    //           width: params.value ? "95px" : "100%",
    //         }}
    //         src={
    //           params.value ??
    //           "https://admin.mlawatches.com/assets/images/logo/mla.svg"
    //         }
    //         alt="Image"
    //       />
    //     );
    //   },
    // },
    {
      field: "stockId",
      headerName: "Stock Number",
      align: "center",
      width: 120,
      editable: false,
      type: "number",
      ...defaultColumnkey,
      renderCell: (params) => <div className="">B{params.value}</div>,
    },
    {
      field: "brand",
      headerName: "Brand",
      align: "center",
      width: 80,
      editable: false,
      ...defaultColumnkey,
      renderCell: (params) => <div className="">{params.value}</div>,
    },
    {
      field: "model",
      headerName: "Model",
      ...defaultColumnkey,
      align: "center",
      width: 100,
      editable: false,
      renderCell: (params) => <div className="">{params.value}</div>,
    },
    // {
    //   field: "box_price",
    //   headerName: "Box Price",
    //   ...defaultColumnkey,
    //   align: "center",
    //   width: 90,
    //   editable: false,
    //   renderCell: (params) => (
    //     <div className="">
    //       {params.value ? formatter.format(params.value) : ""}
    //     </div>
    //   ),
    // },
    {
      field: "box_wholesale_price",
      headerName: "Box Wholesale Price",
      ...defaultColumnkey,
      align: "center",
      width: 120,
      editable: false,
      renderCell: (params) => (
        <div className="">
          {params.value ? formatter.format(params.value) : ""}
        </div>
      ),
    },
    {
      field: "watch_sold_date",
      headerName: "Watch Sold Date",
      ...defaultColumnkey,
      align: "center",
      width: 122,
      editable: false,
      renderHeader: () => (
        <div className="font-600 text-center">
          Watch Sold <br />
          Date
        </div>
      ),
      renderCell: (params) => (
        <div className="">
          {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
        </div>
      ),
    },
    {
      field: "box_sale_price",
      headerName: "Box Sale Price",
      ...defaultColumnkey,
      align: "center",
      width: 90,
      editable: true,
      renderHeader: () => (
        <div className="font-600 text-center">
          Box Sale <br />
          Price
        </div>
      ),
      renderCell: (params) => (
        <div className="">
          {params.value ? formatter.format(params.value) : ""}
        </div>
      ),
    },
    {
      field: "box_type",
      headerName: "Box Type",
      ...defaultColumnkey,
      align: "center",
      width: 122,
      editable: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "listing_status",
      headerName: "Listing Status",
      ...defaultColumnkey,
      align: "center",
      width: 122,
      editable: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "c24_ebay_date",
      headerName: "Added to C24/Ebay on",
      ...defaultColumnkey,
      align: "center",
      width: 122,
      editable: true,
      type: "date",
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderHeader: () => (
        <div className="font-600 text-center">
          Added to <br />
          C24/Ebay on
        </div>
      ),
      renderCell: (params) => {
        return (
          <div className="">
            {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
          </div>
        );
      },
    },
    {
      field: "ebay_ref_no",
      headerName: "Ebay Ref No.",
      ...defaultColumnkey,
      align: "center",
      width: 120,
      editable: true,
      renderHeader: () => (
        <div className="font-600 text-center">
          Ebay Ref <br />
          No.
        </div>
      ),
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    // {
    //   field: "c24_price",
    //   headerName: "C24 Price",
    //   ...defaultColumnkey,
    //   align: "center",
    //   width: 100,
    //   editable: true,
    //   renderCell: (params) => (
    //     <div className="">
    //       {params.value ? formatter.format(params.value) : ""}
    //     </div>
    //   ),
    // },
    {
      field: "box_retail",
      headerName: "Box Retail Price",
      ...defaultColumnkey,
      align: "center",
      width: 120,
      editable: true,
      renderCell: (params) => (
        <div className="">
          {params.value ? formatter.format(params.value) : ""}
        </div>
      ),
    },
    {
      field: "box_sold_price_standalone",
      headerName: "Box Sold Price",
      ...defaultColumnkey,
      align: "center",
      width: 120,
      editable: true,
      renderHeader: () => (
        <div className="font-600 text-center">
          Box Sold <br />
          Price
        </div>
      ),
      renderCell: (params) => (
        <div className="">
          {params.value ? formatter.format(params.value) : ""}
        </div>
      ),
    },
    {
      field: "box_sold_date",
      headerName: "Box Sold",
      ...defaultColumnkey,
      align: "center",
      width: 122,
      editable: true,
      type: "date",
      valueGetter: (value) => {
        return value ? new Date(value) : null;
      },
      renderCell: (params) => {
        return (
          <div className="">
            {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
          </div>
        );
      },
    },
    {
      field: "sold_type",
      headerName: "Sold Type",
      ...defaultColumnkey,
      align: "center",
      width: 110,
      editable: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "sold_by",
      headerName: "Sold by who (NYC,BKK,JP,K)",
      ...defaultColumnkey,
      align: "center",
      width: 130,
      editable: true,
      renderHeader: () => (
        <div className="font-600 text-center">
          Sold by who
          <br />
          (NYC,BKK,JP,K)
        </div>
      ),
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "quick_book",
      headerName: "Quickbooks",
      ...defaultColumnkey,
      align: "center",
      width: 120,
      editable: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "note",
      headerName: "Note",
      ...defaultColumnkey,
      align: "center",
      width: 100,
      editable: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => <div className="">{params.value ? params.value : ""}</div>,
    },
    {
      field: "action",
      headerName: "Delete",
      align: "center",
      width: 150,
      editable: false,
      ...defaultColumnkey,
      filterable: false,
      hideSortIcons: false,
      pinnable: false,
      resizable: false,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (value) => {
        return value ? value : "";
      },
      renderCell: (params) => (
        <>
          <FuseSvgIcon onClick={() => handleClickOpen(params.id)}>
            heroicons-outline:trash
          </FuseSvgIcon>
        </>
      ),
    },
  ];
};
