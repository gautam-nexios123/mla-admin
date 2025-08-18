import { Box, IconButton } from "@mui/material";
import {
  GridExpandMoreIcon,
  useGridApiContext,
  useGridSelector,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  gridDetailPanelExpandedRowsContentCacheSelector,
} from "@mui/x-data-grid-pro";
import moment from "moment";
import React from "react";
import {
  cityMapDisplayFlag,
  formatter,
  getConvertedCurrency,
  hkdFormatter,
} from "src/utils/coreFunction";
import { NeworderDropdown } from "src/utils/dropdownlist";

const defaultColumnkey = {
  headerAlign: "center",
  align: "center",
};

function CustomDetailPanelToggle(
  props: Pick<GridRenderCellParams, "id" | "value">
) {
  const { id, value: isExpanded } = props;
  const apiRef = useGridApiContext();

  // To avoid calling ´getDetailPanelContent` all the time, the following selector
  // gives an object with the detail panel content for each row id.
  const contentCache = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector
  );

  // If the value is not a valid React element, it means that the row has no detail panel.
  const hasDetail = React.isValidElement(contentCache[id]);

  return (
    <IconButton
      color="primary"
      size="small"
      tabIndex={-1}
      className="text-base rounded-md"
      // disabled={!hasDetail}
      aria-label={isExpanded ? "Close" : "Open"}
    >
      {" "}
      View
      <GridExpandMoreIcon
        sx={{
          transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shortest,
            }),
        }}
        fontSize="inherit"
      />
    </IconButton>
  );
}

export const columns = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    minWidth: 100,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params.id} value={params.value} />
    ),
  },
  {
    field: "orderId",
    headerName: "Order Id",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "status",
    headerName: "Status",
    ...defaultColumnkey,
    editable: true,
    type: "singleSelect",
    minWidth: 200,
    valueOptions: NeworderDropdown,
    renderCell: (params) => {
      const option = NeworderDropdown.find((opt) => opt.value === params.value);
      return (
        <div className="pr-[4px]">{option ? option.label : params.value}</div>
      );
    },
  },
  {
    field: "quantity",
    headerName: "Total Items",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => {
      return <div className="font-500">{params?.row?.saleItems?.length}</div>;
    },
  },
  {
    field: "companyName",
    headerName: "Company",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => <div className="pr-[4px]">{params?.value}</div>,
  },
  {
    field: "customerName",
    headerName: "Customer",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => <div className="pr-[4px]">{params?.value}</div>,
  },
  {
    field: "currency",
    headerName: "Currency",
    ...defaultColumnkey,
    editable: false,
    minWidth: 120,
    renderCell: (params) => <div className="pr-[4px]">{params.value}</div>,
  },
  {
    field: "price",
    headerName: "Total Price (USD)",
    ...defaultColumnkey,
    minWidth: 180,
    editable: false,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkPrice
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "additionalShippingPrice",
    headerName: "Total Shipping Price (USD)",
    ...defaultColumnkey,
    minWidth: 180,
    editable: false,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkShippingPrice
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "discount",
    headerName: "Discount (USD)",
    ...defaultColumnkey,
    minWidth: 160,
    editable: false,
    renderCell: (params) => {
      const originalDiscount = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedDiscount =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkDiscount
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalDiscount}
          {convertedDiscount ? ` (${convertedDiscount})` : ""}
        </div>
      );
    },
  },
  {
    field: "netAmount",
    headerName: "Discounted Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 220,
    renderCell: (params) => {
      const originalNet = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedNet =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkNetAmount
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalNet}
          {convertedNet ? ` (${convertedNet})` : ""}
        </div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
    ...defaultColumnkey,
    align: "center",
    minWidth: 140,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
      </div>
    ),
  },
  // {
  //   field: 'updatedAt',
  //   headerName: 'Updated At',
  //   ...defaultColumnkey,
  //   align: "center",
  //   editable: false,
  //   minWidth: 140,
  //   renderCell: (params) => <div className='pr-[4px]'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
  // },
];

export const offlineOrderColumns = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    minWidth: 100,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params.id} value={params.value} />
    ),
  },
  // {
  //   field: "orderId",
  //   headerName: "Order Id",
  //   ...defaultColumnkey,
  //   editable: false,
  //   minWidth: 200,
  //   renderCell: (params) => <div className="font-600">{params.value}</div>,
  // },
  {
    field: "staffName",
    headerName: "Staff Name",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "status",
    headerName: "Status",
    ...defaultColumnkey,
    editable: true,
    type: "singleSelect",
    minWidth: 200,
    valueOptions: NeworderDropdown,
    renderCell: (params) => {
      const option = NeworderDropdown.find((opt) => opt.value === params.value);
      return (
        <div className="pr-[4px]">{option ? option.label : params.value}</div>
      );
    },
  },
  {
    field: "quantity",
    headerName: "Total Items",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => {
      return <div className="font-500">{params?.row?.saleItems?.length}</div>;
    },
  },
  {
    field: "companyName",
    headerName: "Company",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => <div className="pr-[4px]">{params?.value}</div>,
  },
  {
    field: "customerName",
    headerName: "Customer",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => <div className="pr-[4px]">{params?.value}</div>,
  },
  {
    field: "currency",
    headerName: "Currency",
    ...defaultColumnkey,
    editable: false,
    minWidth: 120,
    renderCell: (params) => <div className="pr-[4px]">{params.value}</div>,
  },
  {
    field: "price",
    headerName: "Total Price (USD)",
    ...defaultColumnkey,
    minWidth: 180,
    editable: false,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(
        params.value + params.row.boxAmount,
        "USD",
        1
      ); // Show original value in USD
      // const convertedPrice =
      //   params?.row?.currency !== "USD"
      //     ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
      //         params.row.HkPrice
      //       ) // Converted value in non-USD currency
      //     : null;

      return (
        <div>
          {originalPrice}
          {/* {convertedPrice ? ` (${convertedPrice})` : ""} */}
        </div>
      );
    },
  },
  {
    field: "additionalShippingPrice",
    headerName: "Total Shipping Price (USD)",
    ...defaultColumnkey,
    minWidth: 180,
    editable: false,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkShippingPrice
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "discount",
    headerName: "Discount (USD)",
    ...defaultColumnkey,
    minWidth: 160,
    editable: false,
    renderCell: (params) => {
      const originalDiscount = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedDiscount =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkDiscount
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalDiscount}
          {convertedDiscount ? ` (${convertedDiscount})` : ""}
        </div>
      );
    },
  },
  {
    field: "netAmount",
    headerName: "Discounted Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 220,
    renderCell: (params) => {
      const originalNet = getConvertedCurrency(params.value, "USD", 1); // Show original value in USD
      const convertedNet =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkNetAmount
            ) // Converted value in non-USD currency
          : null;

      return (
        <div>
          {originalNet}
          {convertedNet ? ` (${convertedNet})` : ""}
        </div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
    ...defaultColumnkey,
    align: "center",
    minWidth: 140,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">
        {params.value ? moment(params.value).format("DD-MMM-YYYY") : ""}
      </div>
    ),
  },
  // {
  //   field: 'updatedAt',
  //   headerName: 'Updated At',
  //   ...defaultColumnkey,
  //   align: "center",
  //   editable: false,
  //   minWidth: 140,
  //   renderCell: (params) => <div className='pr-[4px]'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
  // },
];

const colorMap = {
  red: {
    text: "#D32F2F",
    bg: "#FFEBEE",
  },
  green: {
    text: "#388E3C",
    bg: "#E8F5E9",
  },
  purple: {
    text: "#7B1FA2",
    bg: "#F3E5F5",
  },
};

const ColoredStatus = ({ children, color }) => {
  const textColor = colorMap[color]?.text || "#000";
  const bgColor = colorMap[color]?.bg || "#FFF";

  return (
    <div
      style={{
        color: textColor,
        backgroundColor: bgColor,
      }}
      className="text-sm rounded-full px-14 py-7 font-bold"
    >
      {children}
    </div>
  );
};
export const subColumns: any = [
  {
    field: "stockId",
    headerName: "Stock Id",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => (
      <div className="font-600">{params.row.stock.stockId}</div>
    ),
  },
  {
    field: "imageUrl",
    headerName: "Image",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => (
      <div className="pr-[4px]">
        <img
          src={params.row.stock.imageUrl}
          alt=""
          className="w-[80%] lg:max-w-full h-[97px] object-contain "
        />
      </div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">{params.row.stock.brand}</div>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => (
      <div className="pr-[4px]">{params.row.stock.model}</div>
    ),
  },
  {
    field: "additionalBoxPrice",
    headerName: "Box",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => {
      if (params.value) {
        return <ColoredStatus color={"purple"}>+ {params.value}</ColoredStatus>;
      } else {
        const val = Number(params.row.stock?.watch_box.replace(/[^\d]/g, ""));
        if (val) return null;
      }

      var color = "";

      switch (params.row.stock.watch_box) {
        case "INCLUDED": {
          color = "green";
          break;
        }
        case "N/A": {
          color = "red";
          break;
        }
      }
      return (
        <Box className="flex flex-col items-center justify-center gap-2">
        <ColoredStatus color={color}>
          {params.row.stock.watch_box}
        </ColoredStatus>
        {params.row.is_auto_box_update ?  <ColoredStatus color={"purple"}>
            +$300
        </ColoredStatus> : ""}
        </Box>
      );
    },
  },
  {
    field: "location",
    headerName: "Location",
    headerAlign: "center",
    ...defaultColumnkey,
    editable: false,
    minWidth: 100,
    renderCell: (params) => {
      const city =
        cityMapDisplayFlag[params?.row?.stock?.location?.toLowerCase()] || null;

      return (
        <div>
          {city ? (
            <img
              className="w-[30px] h-[30px]"
              src={`assets/images/flags/${city}.svg`}
              alt={"test"}
            />
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    field: "pickupShipFromLoc",
    headerName: "Pickup Location",
    headerAlign: "center",
    ...defaultColumnkey,
    editable: false,
    minWidth: 100,
    renderHeader: () => (
      <div className="font-600 text-center leading-relaxed">
        Pickup
        <br /> Location
      </div>
    ),
    renderCell: (params) => {
      return (
        <div>
          {params?.row?.pickupShipFromLoc ? (
            <img
              className="w-[30px] h-[30px]"
              src={`assets/images/flags/${params?.row?.pickupShipFromLoc}.svg`}
              alt={"test"}
            />
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(params.row.price, "USD", 1);
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkPrice
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "additionalShippingPrice",
    headerName: "Shipping Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(
        params.row.additionalShippingPrice,
        "USD",
        1
      );
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkShippingPrice
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "discount",
    headerName: "Discount (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => {
      const originalDiscount = getConvertedCurrency(
        params.row.discount,
        "USD",
        1
      );
      const convertedDiscount =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkDiscount
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalDiscount}
          {convertedDiscount ? ` (${convertedDiscount})` : ""}
        </div>
      );
    },
  },
  {
    field: "netAmount",
    headerName: "Discounted Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 220,
    renderCell: (params) => {
      const originalNetAmount = getConvertedCurrency(
        params.row.netAmount,
        "USD",
        1
      ); // Show original value in USD
      const convertedNetAmount =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkNetAmount
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalNetAmount}
          {convertedNetAmount ? ` (${convertedNetAmount})` : ""}
        </div>
      );
    },
  },
];

export const subColumnsOffline: any = [
  {
    field: "stockId",
    headerName: "Stock Id",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => (
      <div className="font-600">{params.row.stock.stockId}</div>
    ),
  },
  {
    field: "imageUrl",
    headerName: "Image",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => (
      <div className="pr-[4px]">
        <img
          src={params.row.stock.imageUrl}
          alt=""
          className="w-[80%] lg:max-w-full h-[97px] object-contain "
        />
      </div>
    ),
  },
  {
    field: "brand",
    headerName: "Brand",
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => (
      <div className="pr-[4px]">{params.row.stock.brand}</div>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => (
      <div className="pr-[4px]">{params.row.stock.model}</div>
    ),
  },
  {
    field: "additionalBoxPrice",
    headerName: "Box",
    ...defaultColumnkey,
    editable: false,
    minWidth: 160,
    renderCell: (params) => {
      console.log('paramsaswdsad: ', params);
      if (params.value) {
        return <ColoredStatus color={"purple"}>+ {params.value}</ColoredStatus>;
      } else {
        const val = Number(params.row.stock?.watch_box.replace(/[^\d]/g, ""));
        if (val) return null;
      }

      var color = "";

      switch (params.row.stock.watch_box) {
        case "INCLUDED": {
          color = "green";
          break;
        }
        case "N/A": {
          color = "red";
          break;
        }
      }
      return (
        <Box className="flex flex-col items-center justify-center gap-2">
        <ColoredStatus color={color}>
          {params.row.stock.watch_box}
        </ColoredStatus>
        {params.row.is_auto_box_update ?  <ColoredStatus color={"purple"}>
            +$300
        </ColoredStatus> : ""}
        </Box>
      );
    },
  },
  {
    field: "location",
    headerName: "Location",
    headerAlign: "center",
    ...defaultColumnkey,
    editable: false,
    minWidth: 100,
    renderCell: (params) => {
      const city =
        cityMapDisplayFlag[params?.row?.stock?.location?.toLowerCase()] || null;

      return (
        <div>
          {city ? (
            <img
              className="w-[30px] h-[30px]"
              src={`assets/images/flags/${city}.svg`}
              alt={"test"}
            />
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    field: "pickupShipFromLoc",
    headerName: "Pickup Location",
    headerAlign: "center",
    ...defaultColumnkey,
    editable: false,
    minWidth: 100,
    renderHeader: () => (
      <div className="font-600 text-center leading-relaxed">
        Pickup
        <br /> Location
      </div>
    ),
    renderCell: (params) => {
      return (
        <div>
          {params?.row?.pickupShipFromLoc ? (
            <img
              className="w-[30px] h-[30px]"
              src={`assets/images/flags/${params?.row?.pickupShipFromLoc}.svg`}
              alt={"test"}
            />
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(params.row.price, "USD", 1);
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkPrice
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "additionalShippingPrice",
    headerName: "Shipping Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 180,
    renderCell: (params) => {
      const originalPrice = getConvertedCurrency(
        params.row.additionalShippingPrice,
        "USD",
        1
      );
      const convertedPrice =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkShippingPrice
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalPrice}
          {convertedPrice ? ` (${convertedPrice})` : ""}
        </div>
      );
    },
  },
  {
    field: "discount",
    headerName: "Discount (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 200,
    renderCell: (params) => {
      const originalDiscount = getConvertedCurrency(
        params.row.discount,
        "USD",
        1
      );
      const convertedDiscount =
        params?.row?.currency !== "USD"
          ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
              params.row.HkDiscount
            ) // Converted value for non-USD currencies
          : null;

      return (
        <div className="pr-[4px]">
          {originalDiscount}
          {convertedDiscount ? ` (${convertedDiscount})` : ""}
        </div>
      );
    },
  },
  {
    field: "netAmount",
    headerName: "Discounted Price (USD)",
    ...defaultColumnkey,
    editable: false,
    minWidth: 220,
    renderCell: (params) => {
       const originalNetAmount = getConvertedCurrency(
       (params.row.netAmount + params.row.additionalBoxPrice + params.row.additionalShippingPrice) - params.row.discount,
        "USD",
        1
      ); // Show original value in USD
      // const convertedNetAmount =
      //   params?.row?.currency !== "USD"
      //     ? (params?.row?.currency === "USD" ? formatter : hkdFormatter).format(
      //         params.row.HkNetAmount
      //       ) // Converted value for non-USD currencies
      //     : null;

      return (
        <div className="pr-[4px]">
          {originalNetAmount}
          {/* {convertedNetAmount ? ` (${convertedNetAmount})` : ""} */}
        </div>
      );
    },
  },
];
