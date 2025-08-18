import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import { selectCheckoutViewPanelState } from "app/theme-layouts/shared-components/ViewPanel/store/stateSlice";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import _ from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {
  cityMapDisplayFlag,
  CLIENT_COUNTRY_OBJ,
  convertBoxValue,
  currencyFormatter,
  getConvertedCurrency,
  hkdFormatter,
  myDiscountPrice,
  myMultiPlyer,
  WATCH_LOACTION,
} from "src/utils/coreFunction";
import {
  checkout,
  removeRow,
  Row,
  selectCartState,
  selectCheckedBoxes,
  selectedCountry,
  selectedRows,
  selectedUserObj,
  selectLocPickUpFlag,
  selectPickUpCheckedBoxes,
  toggleLocPickUpFlag,
  togglePickUpBox,
  toggleWantBox,
} from "../../store/checkoutSlice";
import { ActionButton } from "./gridColumn";
import ImageSliderDialog from "./ImageSlider";
import axios from "axios";

const exportCheckoutTableToExcel = ({
  columns,
  rows,
  totalQty,
  totalPrice,
  totalDiscount,
  totalDiscountPrice,
  shippingPrice,
  grandTotal,
  boxQty,
  boxTotal,
  grandBoxTotal,
  wantBoxArray,
  pickupSelections,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Checkout Table");

  const exportableColumns = [
    ...columns
      .filter((col) => col.id !== "actions")
      .map((col) => {
        if (col.id === "location") {
          return [col, { id: "pickupLocation", label: "Pickup Location" }];
        }
        return col;
      })
      .flat(),
  ];
  worksheet.addRow(exportableColumns.map((col) => col.label));

  rows.forEach((row) => {
    worksheet.addRow(
      exportableColumns.map((col) => {
        console.log("col: ", col);
        if (col.id === "pickupLocation") {
          const pickup = pickupSelections?.find(
            (item) => item.stockId === row.stockId
          );
          return pickup?.pickupLocation || "N/A";
        }
        if (col.id === "paper_date" && row[col.id]) {
          // Format the paper_date field
          return moment(row[col.id]).format("YYYY-MM-DD");
        }
        return row[col.id];
      })
    );
  });

  worksheet.addRow([]);
  worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Total Qty",
    totalQty,
    "Total Price (USD)",
    totalPrice,
  ]);
  // worksheet.addRow(["", "", "", "", "", "", "", "", ""]);

  if (wantBoxArray?.length > 0) {
    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Box Qty",
      boxQty,
    ]);
  }

  worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Total Discount Price (USD)",
    totalDiscount,
  ]);
  worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Total Discounted Price (USD)",
    totalDiscountPrice,
  ]);

  if (shippingPrice?.replace(/[^\d.]/g, "") !== "0") {
    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Shipping Price (USD)",
      shippingPrice,
    ]);
  }

  if (wantBoxArray?.length > 0) {
    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total Box Price (USD)",
      boxTotal,
    ]);
    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Grand Total (USD)",
      grandBoxTotal,
    ]);
  } else {
    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Grand Total (USD)",
      grandTotal,
    ]);
  }

  worksheet.columns.forEach((column) => {
    column.width = 20;
  });

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: "application/octet-stream" });
    saveAs(blob, "checkout-table.xlsx");
  });
};

// const exportCheckoutTableToPDF = ({
//   columns,
//   rows,
//   totalQty,
//   totalPrice,
//   totalDiscount,
//   totalDiscountPrice,
//   shippingPrice,
//   grandTotal,
//   boxQty,
//   boxTotal,
//   grandBoxTotal,
//   wantBoxArray,
//   pickupSelections,
// }) => {
//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//   });

//   const updatedColumns = columns.flatMap((col) => {
//     if (col.id === "location") {
//       // Add the pickupLocation object after the location object
//       return [
//         col,
//         {
//           id: "pickupLocation",
//           label: "Pickup Location",
//           align: "center",
//         },
//       ];
//     }
//     return col;
//   });

//   const marginLeft = 2;
//   const marginTop = 20;
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   const cellWidth = (pageWidth + 17 - marginLeft * 2) / updatedColumns.length;
//   const cellHeight = 10;
//   const headerHeight = 13; // Fixed height for the header
//   const rowBaseHeight = 6; // Smaller base height for rows

//   let currentY = marginTop;

//   // Add Title
//   pdf.setFontSize(14);
//   pdf.text("Share Inventory Checkout Table", pageWidth / 2, currentY, {
//     align: "center",
//   });
//   currentY += 10;

//   // Add Column Headers
//   pdf.setFontSize(7);
//   pdf.setFont("bold");
//   updatedColumns
//     .filter((col) => col.id !== "actions")
//     .forEach((col, index) => {
//       // Set background color to #f1f5f9
//       pdf.setFillColor(241, 245, 249); // RGB for #f1f5f9
//       pdf.rect(
//         marginLeft + index * cellWidth,
//         currentY,
//         cellWidth,
//         headerHeight,
//         "F" // Fill the rectangle with the background color
//       );

//       // Draw the border explicitly
//       pdf.setDrawColor(0, 0, 0); // Black border
//       pdf.rect(
//         marginLeft + index * cellWidth,
//         currentY,
//         cellWidth,
//         headerHeight,
//         "S" // Stroke the rectangle to draw the border
//       );

//       // Add wrapped header text
//       const wrappedHeaderText = pdf.splitTextToSize(col.label, cellWidth - 2); // Wrap text
//       wrappedHeaderText.forEach((line, lineIndex) => {
//         pdf.text(
//           line,
//           marginLeft + index * cellWidth + 2,
//           currentY + 6 + lineIndex * 3,
//           { align: "left" } // Adjust line spacing
//         ); // Add wrapped text
//       });
//     });
//   currentY += headerHeight;
//   console.log("rows: ", rows);

//   const totalRow = {
//     watch_box: "Total Qty:",
//     price: totalQty,
//     discount: "Total Price (USD):",
//     netAmount: totalPrice,
//   };

//   const totalRow2 = {
//     discount: "Total Discount (USD):",
//     netAmount: totalDiscount,
//   };

//   const totalRow3 = {
//     discount: "Total Discounted Price (USD):",
//     netAmount: totalDiscountPrice,
//   };

//   const totalRow4 = {
//     discount: "Shipping Price (USD):",
//     netAmount: shippingPrice,
//   };

//   const totalRow5 = {
//     discount: "Box Qty:",
//     netAmount: boxQty,
//   };

//   const totalRow6 = {
//     discount: "Total Box Price (USD):",
//     netAmount: boxTotal,
//   };

//   const totalRow7 = {
//     discount: "Grand Total (USD):",
//     netAmount: grandTotal,
//   };

//   const updatedRows = [
//     ...rows,
//     totalRow,
//     totalRow2,
//     totalRow3,
//     ...(shippingPrice?.replace(/[^\d.]/g, "") !== "0" ? [totalRow4] : []),
//     ...(wantBoxArray?.length > 0 ? [totalRow5] : []),
//     ...(wantBoxArray?.length > 0 ? [totalRow6] : []),
//     totalRow7,
//   ];

//   // Add Rows
//   pdf.setFont("normal");
//   updatedRows.forEach((row) => {
//     let maxRowHeight = rowBaseHeight;

//     // Calculate the maximum height of the row
//     const rowHeights = updatedColumns.map((col) => {
//       console.log("col: ", col);
//       let value = row[col.id] || "";
//       if (col.id === "pickupLocation") {
//         const pickup = pickupSelections?.find(
//           (item) => item.stockId === row.stockId
//         );
//         value = pickup?.pickupLocation || "";
//       }
//       if (col.id === "paper_date" && value) {
//         value = moment(value).format("YYYY-MM-DD");
//       }
//       const wrappedText = pdf.splitTextToSize(value.toString(), cellWidth - 2);
//       return wrappedText.length * rowBaseHeight;
//     });
//     maxRowHeight = Math.max(...rowHeights);

//     // Draw the row
//     updatedColumns
//       .filter((col) => col.id !== "actions")
//       .forEach((col, index) => {
//         let value = row[col.id] || "";
//         if (col.id === "pickupLocation") {
//           const pickup = pickupSelections?.find(
//             (item) => item.stockId === row.stockId
//           );
//           value = pickup?.pickupLocation || "";
//         }
//         if (col.id === "paper_date" && value) {
//           value = moment(value).format("YYYY-MM-DD"); // Format the paper_date
//         }

//         const wrappedText = pdf.splitTextToSize(
//           value.toString(),
//           cellWidth - 2
//         );
//         pdf.rect(
//           marginLeft + index * cellWidth,
//           currentY,
//           cellWidth,
//           maxRowHeight
//         ); // Draw cell border
//         pdf.text(
//           wrappedText,
//           marginLeft + index * cellWidth + 2,
//           currentY + 6,
//           { align: "left" }
//         ); // Add text
//       });

//     // Increment currentY by maxRowHeight to avoid extra rows
//     currentY += maxRowHeight;

//     // Add a new page if the content exceeds the page height
//     if (currentY + rowBaseHeight > pageHeight - 20) {
//       pdf.addPage();
//       currentY = marginTop;
//     }
//   });

//   // Save the PDF
//   const today = new Date();
//   const date = today.toISOString().split("T")[0];
//   pdf.save(`checkout-table-${date}.pdf`);
// };

const cellStyles = {
  border: 1,
  borderColor: "black",
  color: "black",
  padding: "8px",
  textAlign: "center",
  fontWeight: "600",
  position: "unset",
};

const tableStyles = {
  width: "100%",
  borderRadius: "0px",
  boxShadow: "none",
  borderCollapse: "collapse !important",
  // maxHeight: "600px",
  overflowY: "scroll",
};

const columns = [
  { id: "stockId", label: "Stock", align: "center" },
  { id: "location", label: "Location", align: "center" },
  { id: "brand", label: "Brand", align: "center" },
  { id: "model", label: "Model", align: "center" },
  { id: "serial_no", label: "Serial No.", align: "center" },
  { id: "paper", label: "Paper.", align: "center" },
  { id: "paper_date", label: "Paper Date", align: "center" },
  { id: "watch_box", label: "Box", align: "center" },
  { id: "price", label: "Price (USD)", align: "center" },
  { id: "discount", label: "Discount (USD)", align: "center" },
  { id: "netAmount", label: "Discounted Price (USD)", align: "center" },
  { id: "actions", label: "Actions", align: "center" },
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ColoredStatus = ({ children, color, tableType }) => {
  var textColor = "text-" + color + "-700";
  var bgColor = "bg-" + color + "-50";

  return (
    <div
      className={`${tableType ? "" : "font-700"} bg-text-sm ${textColor} ${bgColor} rounded-full px-14 py-7`}
    >
      {children}
    </div>
  );
};

const styles: any = {
  container: {
    padding: "40px",
    marginTop: "40px",
  },
  tables: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    marginBottom: "20px",
    padding: "20px",
  },

  logoImage: {
    width: "200px",
    textAlign: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "20px",
  },
  subTitle: {
    color: "#000",
    textAlign: "center",
    margin: "auto",
    fontSize: "20px",
  },
  lastRow: {
    borderBottom: "2px solid #000",
  },
  live: {
    fontSize: "38px",
  },
};

export default function ShareInventoryCheckout() {
  const user: any = useSelector(selectUser);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const checkoutSelectedRows = useSelector(selectedRows);
  // const openCheckoutView = useSelector(selectCheckoutViewPanelState);
  // const currentCart = useSelector(selectCurrentCart);
  const location = useLocation();
  const currentCart = location?.state;
  const isLoadingCart = useSelector(selectCartState);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // const columns = GetCheckOutPageColDef();

  const [checkoutCalculatedRows, setCheckoutCalculatedRows] = useState([]);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState("0");
  const [grandTotalDiscountPrice, setGrandTotalDiscountPrice] = useState("0");
  const [shippingTotalDiscountPrice, setShippingTotalDiscountPrice] =
    useState("0");
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [totalWholeSale, setTotalWholeSale] = useState("0");
  const [finishCheckOut, setFinishCheckOut] = useState(false);
  const checkedBoxes = useSelector(selectCheckedBoxes);
  const allPickUpCheckedBoxes = useSelector(selectPickUpCheckedBoxes);
  const allLocPickUpFlag = useSelector(selectLocPickUpFlag);
  const selecteduserCountry = useSelector(selectedCountry);
  const selecteduserObjData = useSelector(selectedUserObj);

  const [isLoading, setIsLoading] = useState(false);

  const [wantBoxArray, setWantBoxArray] = useState(checkedBoxes || []);
  const [pickUPArray, setPickUPArray] = useState(allPickUpCheckedBoxes || []);

  useEffect(() => {
    setPickUPArray(allPickUpCheckedBoxes || []);
  }, [allPickUpCheckedBoxes]);
  const [pickupSelections, setPickupSelections] = useState(
    allLocPickUpFlag || []
  );
  const [boxTotal, setBoxTotal] = useState("0");
  const [grandTotalPrice, setGrandTotalPrice] = useState("0");

  useEffect(() => {
    if (!finishCheckOut && checkoutSelectedRows?.length === 0) {
      navigate("/share-inventory");
      return;
    }
    if (currentCart && !finishCheckOut) {
      const calculatedRowsBuffer = [];
      const salesItem = currentCart?.saleItems;

      if (checkoutSelectedRows.length > 0 && salesItem) {
        checkoutSelectedRows.forEach((item, index) => {
          let newItem: any = _.cloneDeep(item) as Row;
          // console.log(`callll ${index} :items:: ${JSON.stringify(newItem)}`)
          const saleItemIndex = salesItem.find(
            (x) => (x?.stock?.stockId || x?.stockId) == newItem.stockId
          );
          // console.log(`saleItemIndex ${newItem.stockId} :saleItemIndex:: ${JSON.stringify(saleItemIndex)}`)
          const findPickFlagObj = pickupSelections?.find(
            (pick) => pick?.stockId == item?.stockId
          );

          const myDiscountPercentage = Math.min(
            0,
            findPickFlagObj?.newDisplayPriceModifier || 0
          );

          const newPrice = myDiscountPrice(
            saleItemIndex?.netAmount,
            myDiscountPercentage
          );

          if (saleItemIndex) {
            newItem.price =
              getConvertedCurrency(
                saleItemIndex.price,
                "USD",
                user?.exchangeRate
              ) || 0;

            // newItem.netAmount =
            //   getConvertedCurrency(
            //     saleItemIndex.netAmount,
            //     "USD",
            //     user?.exchangeRate
            //   ) || 0;

            newItem.netAmount =
              getConvertedCurrency(newPrice, "USD", user?.exchangeRate) || 0;

            newItem.netAmountTotal = calculateDiscountedPrice(
              saleItemIndex,
              newPrice
            );
            newItem.additionalShippingPrice =
              newItem.netAmountTotal.replace(/[^\d.]/g, "") -
              newItem.netAmount.replace(/[^\d.]/g, "");

            newItem.discount =
              getConvertedCurrency(
                saleItemIndex.discount +
                  (saleItemIndex.netAmount -
                    myDiscountPrice(
                      saleItemIndex.netAmount,
                      myDiscountPercentage
                    )),
                "USD",
                user?.exchangeRate
              ) || 0;
            newItem.additionalBox = saleItemIndex.additionalBox || 0;
          }
          calculatedRowsBuffer.push(newItem);
        });
      }

      const totalDiscount = (
        "USD" === "USD" ? currencyFormatter : hkdFormatter
      ).format(
        _.sum(
          calculatedRowsBuffer?.map((m) => +m?.discount?.replace(/[^\d.]/g, ""))
        )
      );
      const totalWholeSale = (
        "USD" === "USD" ? currencyFormatter : hkdFormatter
      ).format(
        _.sum(
          calculatedRowsBuffer?.map((m) => +m?.price?.replace(/[^\d.]/g, ""))
        )
      );

      const totalDiscountNetAmount: any = (
        "USD" === "USD" ? currencyFormatter : hkdFormatter
      ).format(
        _.sum(
          calculatedRowsBuffer?.map(
            (m) => +m?.netAmount?.replace(/[^\d.]/g, "")
          )
        )
      );

      const grandTotalDiscountNetAmount: any = (
        "USD" === "USD" ? currencyFormatter : hkdFormatter
      ).format(
        _.sum(
          calculatedRowsBuffer?.map(
            (m) => +m?.netAmountTotal?.replace(/[^\d.]/g, "")
          )
        )
      );

      const totalShiptingPrace: any = (
        "USD" === "USD" ? currencyFormatter : hkdFormatter
      ).format(
        grandTotalDiscountNetAmount?.replace(/[^\d.]/g, "") -
          totalDiscountNetAmount?.replace(/[^\d.]/g, "")
      );

      setTotalDiscount(totalDiscount);
      setTotalWholeSale(totalWholeSale);
      setCheckoutCalculatedRows(calculatedRowsBuffer);

      setTotalDiscountPrice(totalDiscountNetAmount);
      setGrandTotalDiscountPrice(grandTotalDiscountNetAmount);
      setShippingTotalDiscountPrice(totalShiptingPrace);
    }
  }, [
    currentCart,
    checkoutSelectedRows,
    finishCheckOut,
    navigate,
    pickUPArray,
    pickupSelections,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(togglePickUpBox(pickUPArray));
      ``;
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pickUPArray]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(toggleLocPickUpFlag(pickupSelections));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pickupSelections]);

  useEffect(() => {
    const sumOfWatchBox = getConvertedCurrency(
      checkoutSelectedRows
        .filter((item) => wantBoxArray.includes(item.stockId))
        .reduce((sum, item) => {
          const watchBoxValue = parseFloat(
            item?.watch_box?.replace(/[^\d.]/g, "")
          );
          return sum + (isNaN(watchBoxValue) ? 0 : watchBoxValue);
        }, 0),
      "USD",
      user?.exchangeRate
    );

    setBoxTotal(sumOfWatchBox);

    const grandTotal = (
      "USD" === "USD" ? currencyFormatter : hkdFormatter
    ).format(
      Number(grandTotalDiscountPrice?.replace(/[^\d.]/g, "")) +
        Number(sumOfWatchBox?.replace(/[^\d.]/g, ""))
    );
    setGrandTotalPrice(grandTotal);
    const timeoutId = setTimeout(() => {
      dispatch(toggleWantBox(wantBoxArray));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [wantBoxArray, pickUPArray, grandTotalDiscountPrice, pickupSelections]);

  const handleWantBoxCheck = (stockId) => {
    setWantBoxArray((prv) =>
      prv.includes(stockId)
        ? prv.filter((item) => item !== stockId)
        : [...prv, stockId]
    );
  };

  const getCheckedStatus = (stockId) => {
    const boxStatus = wantBoxArray.find((x) => x === stockId);
    if (!boxStatus) return false;
    return true;
  };

  const getPickUpActiveStatus = (stockId) => {
    const pickUpStatus = pickUPArray?.find((x) => x === stockId);

    if (!pickUpStatus) return false;
    return true;
  };

  if (finishCheckOut) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-28 bg-gray-100 rounded-20">
        <h1 className="text-[28px] lg:text-[70px] font-500">ORDER CONFIRMED</h1>

        <h2 className="text-[16px] lg:text-[28px] text-center font-400">
          We will send you an invoice shortly. Thank you for your business. MLA
          Team.
        </h2>

        <Button
          className="font-500"
          color="inherit"
          onClick={() => {
            // localStorage.removeItem("cartData");
            navigate("/share-inventory");
          }}
          role="button"
          variant="outlined"
        >
          Back to home
        </Button>
      </div>
    );
  }

  const paperBox = (val, row, tableType) => {
    let color = "";
    const value = val?.trim().toLowerCase();
    const stockId = row?.stockId;

    // if(value && value.startsWith("+") && !(row.additionalBox > 0)){
    //   return
    // }
    // const formattedValue = value.replace(/^\+\s*/, '');
    // if(value && value.startsWith("+") && row.additionalBox > 0 ){
    //   return <ColoredStatus color={"purple"}>+ Box ({formattedValue})</ColoredStatus>
    // }

    if (value && value?.startsWith("+")) {
      const formattedValue = convertBoxValue(
        value,
        "USD",
        user?.exchangeRate
      )?.replace(/^\+\s*/, "");
      return (
        <div className="flex items-center justify-center">
          <input
            className="mr-5"
            type="checkbox"
            id={stockId}
            checked={getCheckedStatus(stockId)}
            onChange={() => handleWantBoxCheck(stockId)}
          />
          <label htmlFor={stockId}>+ Box ({formattedValue})</label>
        </div>
      );
      // return <ColoredStatus color={""}>+ Box ({formattedValue})</ColoredStatus>
    }

    switch (value) {
      case "paper": {
        color = "green";
        break;
      }
      case "included": {
        color = "green";
        break;
      }
      case "card": {
        color = "blue";
        break;
      }
      case "n/a": {
        color = "red";
        break;
      }
      case "archive": {
        color = "purple";
        break;
      }
      case "null": {
        color = "red";
        break;
      }
    }
    return (
      <ColoredStatus
        color={tableType ? "transparent" : color}
        tableType={tableType}
      >
        {value}
      </ColoredStatus>
    );
  };

  const showPickUpStatus = (val) => {
    // if (PICK_OPTION_COUNTRY?.includes(user?.country)) {
    //   const watch_country = CITY_MAP_FLAG[val?.toLowerCase()] || "";
    //   if (watch_country != user.country) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
    return true;
  };

  const calculateDiscountedPrice = (item, price) => {
    const itemStockId = item?.stock?.stockId || item?.stockId;

    const findPickFlagObj = pickupSelections?.find(
      (pick) => pick?.stockId == itemStockId
    );

    const myMultiplyer = Math.max(
      0,
      findPickFlagObj?.newDisplayPriceModifier || 0
    );

    if (
      showPickUpStatus(item?.stock?.location) &&
      pickUPArray?.includes(itemStockId)
    ) {
      let netAmount = price * myMultiPlyer(user, myMultiplyer);
      return getConvertedCurrency(netAmount, "USD", user?.exchangeRate);
    } else {
      return getConvertedCurrency(item?.netAmount, "USD", user?.exchangeRate);
    }
  };

  // const handlePickUPCheck = (row, pickupAdjustments) => {
  //   const stockId = row?.stockId;

  //   setPickUPArray((prev) => {
  //     const isChecked = prev.includes(stockId);

  //     if (isChecked) {
  //       // If unchecked, remove from both arrays
  //       setPickupSelections((prevSelections) =>
  //         prevSelections.filter((item) => item.stockId !== stockId)
  //       );
  //       return prev.filter((item) => item !== stockId);
  //     } else {
  //       // If checked, add to both arrays
  //       const getClientCountry = CLIENT_COUNTRY_OBJ[user?.country]
  //         ? CLIENT_COUNTRY_OBJ[user?.country]
  //         : "OTHER";
  //       const getWatchCountry =
  //         WATCH_LOACTION[row?.location?.toLowerCase()] || null;

  //       const getPickupAdjustmentsArry = user?.pricingBaseRule?.find(
  //         (item) =>
  //           item?.watchLocation?.toLowerCase() ==
  //             getWatchCountry?.toLowerCase() &&
  //           item?.clientLocation?.toLowerCase() ==
  //             getClientCountry?.toLowerCase()
  //       )?.pickupAdjustments;

  //       let firstAdjustment: any =
  //         // Case 1: client is "OTHER"
  //         getClientCountry === "OTHER"
  //           ? getPickupAdjustmentsArry?.find(
  //               (item) => item?.pickupLocation === "OTHER"
  //             )
  //           : // Case 2: client and watch country are the same
  //             getClientCountry === getWatchCountry
  //             ? getPickupAdjustmentsArry?.find(
  //                 (item) => item?.pickupLocation === getWatchCountry
  //               )
  //             : null;

  //       // Fallback to default
  //       if (!firstAdjustment?.pickupLocation) {
  //         firstAdjustment = pickupAdjustments?.[0];
  //       }

  //       if (firstAdjustment) {
  //         setPickupSelections((prev) => [
  //           ...prev,
  //           { stockId, ...firstAdjustment },
  //         ]);
  //       }
  //       return [...prev, stockId];
  //     }
  //   });
  // };

  const handlePickupChange = (stockId, newModifier) => {
    setPickupSelections((prev) => {
      const existing = prev.find((item) => item.stockId === stockId);
      if (existing) {
        // Update existing
        return prev.map((item) =>
          item.stockId === stockId ? { ...item, ...newModifier } : item
        );
      } else {
        // Add new entry
        return [...prev, { stockId, ...newModifier }];
      }
    });
  };

  const LocationModifyFlag = (val, row, tableType) => {
    const city =
      selecteduserCountry == "United States" &&
      (val?.toLowerCase() == "zh" ||
        val?.toLowerCase() == "t/zh" ||
        val?.toLowerCase() == "r/zh")
        ? "US2"
        : cityMapDisplayFlag[val?.toLowerCase()] || null;

    const getClientCountry = CLIENT_COUNTRY_OBJ[selecteduserCountry]
      ? CLIENT_COUNTRY_OBJ[selecteduserCountry]
      : "OTHER";
    const getWatchCountry = WATCH_LOACTION[val?.toLowerCase()] || null;

    const allPossileDrop = user?.pricingBaseRule?.find(
      (item) =>
        item?.watchLocation?.toLowerCase() == getWatchCountry?.toLowerCase() &&
        item?.clientLocation?.toLowerCase() == getClientCountry?.toLowerCase()
    )?.pickupAdjustments;

    const getPickupAdjustmentsArry =
      allPossileDrop?.length > 1
        ? allPossileDrop?.filter((item) => item?.pickupLocation != "OTHER")
        : allPossileDrop;

    const getPickUpStatus = () => {
      if (showPickUpStatus(val)) {
        return (
          <div className="flex items-center gap-[6px] mt-[4px]">
            <div className="flex items-center justify-center">
              {/* <input
                className="mr-5"
                type="checkbox"
                // id={stockId}
                checked={getPickUpActiveStatus(row?.stockId)}
                onChange={() =>
                  handlePickUPCheck(
                    row,
                    getPickupAdjustmentsArry?.pickupAdjustments
                  )
                }
              /> */}
              <label className="whitespace-nowrap">Pick up / Ship from</label>
            </div>
            {getPickUpActiveStatus(row?.stockId) && (
              <FormControl sx={{ minWidth: 70 }} size="small">
                {/* <InputLabel id="demo-select-small-label">Location</InputLabel> */}
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  // label="Location"
                  value={pickupSelections
                    ?.find((item) => item?.stockId === row?.stockId)
                    ?.id?.toString()}
                  onChange={(e) => {
                    const findObj = getPickupAdjustmentsArry?.find(
                      (item) => item?.id == e.target.value
                    );
                    handlePickupChange(row?.stockId, findObj);
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      padding: tableType ? "10px 5px 0px" : "5px 10px",
                      border: tableType ? "" : "1px solid #E0E0E0",
                    },
                    border: "none",

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {getPickupAdjustmentsArry?.map((pickup_location, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={pickup_location?.id?.toString()}
                        // disabled={isWatchLocationDisabled(pickup_location)}
                      >
                        {/* {pickup_location} */}
                        {pickup_location?.pickupLocation === "OTHER" ? (
                          pickup_location?.pickupLocation
                        ) : (
                          <img
                            className="w-[25px] h-[25px]"
                            src={`assets/images/flags/${pickup_location?.pickupLocation}.svg`}
                            alt={"test"}
                          />
                        )}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          </div>
        );
      } else {
        return null;
      }

      // if (PICK_OPTION_COUNTRY?.includes(user?.country)) {
      //   const watch_country = CITY_MAP_FLAG[val?.toLowerCase()] || "";
      //   if (watch_country != user.country) {
      //     return (
      //       <div className="flex items-center justify-center">
      //         <input
      //           className="mr-5"
      //           type="checkbox"
      //           // id={stockId}
      //           checked={getPickUpActiveStatus(row?.stockId)}
      //           onChange={() => handlePickUPCheck(row?.stockId)}
      //         />
      //         <label>Pick Up</label>
      //       </div>
      //     );
      //   } else {
      //     return null;
      //   }
      // } else {
      //   return null;
      // }
    };

    return (
      <div>
        {city ? (
          <div className="flex flex-col gap-1 items-center justify-center">
            <img
              className="w-[35px] h-[35px]"
              src={`assets/images/flags/${city}.svg`}
              alt={"test"}
            />

            {getPickupAdjustmentsArry?.length > 1 && getPickUpStatus()}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const bindValue = (title, val, row, tableType) => {
    if (title === "paper_date" && val) {
      return moment(val).format("DD-MMM-YYYY");
    } else if (title === "paper" && val) {
      return paperBox(val, row, tableType);
    } else if (title === "watch_box") {
      return paperBox(val, row, tableType);
    } else if (
      (title === "discount" || title === "netAmount" || title === "price") &&
      val
    ) {
      return val;
    } else if (title === "location") {
      const loc = LocationModifyFlag(val, row, tableType);
      return loc;
    } else if (title === "stockId" && !tableType) {
      return (
        <div className="relative">
          <ImageSliderDialog
            selectedRow={row}
            isGridView={false}
            isStockViewPanel={true}
          />
        </div>
      );
    } else {
      return val;
    }
  };

  const handlePDFDownload = async () => {
    const element = document.getElementById("hidden-table-to-pdf2");

    if (element) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date();
      const date = today.toISOString().split("T")[0];
      pdf.save(`package-${date}.pdf`);
    }
  };

  const confirmOfflineOrder = async () => {
    const extractNumber = (str) => {
      const match = str?.match(/[\d,]+/);
      return match ? match[0].replace(/,/g, "") : null;
    };

    const result = checkoutCalculatedRows?.map((item2) => {
      const match = allLocPickUpFlag?.find(
        (item1) => item1.stockId === item2?.stockId
      );

      return {
        stockId: item2?.stockId,
        price: item2?.wholesale_price_usd,
        discount: Number(extractNumber(item2?.discount)),
        discountedPrice: Number(extractNumber(item2?.netAmount)),
        box: /^\+?\s?\$[\d,]+/.test(item2?.watch_box)
          ? extractNumber(item2?.watch_box)
          : item2?.watch_box,

        location: item2?.location,
        packupLocation: match?.pickupLocation,
        model: item2?.model,
        brand: item2?.brand,
        additionalShippingPrice: item2?.additionalShippingPrice,
      };
    });

    const payload = {
      stocks: result,
      totalPrice: Number(extractNumber(totalWholeSale)),
      totalDiscount: Number(extractNumber(totalDiscount)),
      totalDiscountedPrice: Number(extractNumber(totalDiscountPrice)),
      grandTotal: Number(extractNumber(grandTotalPrice)),
      totalBox: Number(extractNumber(boxTotal)),
      totalShipping: Number(extractNumber(shippingTotalDiscountPrice)),
      boxCount: wantBoxArray?.length,
      customerId: selecteduserObjData?.id || "",
      country:
        selecteduserObjData?.country == "new_customer"
          ? selecteduserCountry
          : selecteduserObjData?.country,
      wantBoxArray: wantBoxArray,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api-dev.mlawatches.com/api/admin/order",
        payload
      );

      setIsLoading(false);

      if (response?.data?.statusCode == 200) {
        enqueueSnackbar("Order successfully", { variant: "success" });

        dispatch(checkout([]));
        dispatch(toggleWantBox([]));
        dispatch(togglePickUpBox([]));

        navigate("/share-inventory");
      }

      // You can show a success message or redirect here
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar("Failed to order !", { variant: "error" });

      if (error.response) {
        console.error("API error:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    }
  };

  return (
    <div className="px-[10px]">
      <div className="w-full flex items-center justify-between mt-[10px]">
        <div className=" w-full rounded-28 flex flex-col sm:flex-row gap-[15px] items-start justify-between">
          <Button
            color="inherit"
            variant="outlined"
            sx={{ borderColor: "lightgray" }}
            onClick={() => {
              navigate(-1);
            }}
            className="font-500 flex items-center justify-between"
          >
            <IoArrowBack className="icon-size-20 mr-5" />
            <p className="">Go Back</p>
          </Button>

          <div className="flex justify-end gap-6 pr-32">
            <button
              onClick={() => confirmOfflineOrder()}
              className="bg-green-600 hover:bg-green-700 text-white rounded-[20px] py-[6px] px-[16px] cursor-pointer flex items-center gap-[4px]"
            >
              <span>Confirm</span>{" "}
              {isLoading && (
                <CircularProgress size={20} className="text-white" />
              )}
            </button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                exportCheckoutTableToExcel({
                  columns,
                  rows: checkoutCalculatedRows,
                  totalQty: checkoutSelectedRows?.length,
                  totalPrice: totalWholeSale,
                  totalDiscount,
                  totalDiscountPrice,
                  shippingPrice: shippingTotalDiscountPrice,
                  grandTotal: grandTotalDiscountPrice,
                  boxQty: wantBoxArray?.length,
                  boxTotal,
                  grandBoxTotal: grandTotalPrice,
                  wantBoxArray,
                  pickupSelections,
                })
              }
            >
              Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              // onClick={() =>
              //   exportCheckoutTableToPDF({
              //     columns,
              //     rows: checkoutCalculatedRows,
              //     totalQty: checkoutSelectedRows?.length,
              //     totalPrice: totalWholeSale,
              //     totalDiscount,
              //     totalDiscountPrice,
              //     shippingPrice: shippingTotalDiscountPrice,
              //     grandTotal: grandTotalDiscountPrice,
              //     boxQty: wantBoxArray?.length,
              //     boxTotal,
              //     grandBoxTotal: grandTotalPrice,
              //     wantBoxArray,
              //     pickupSelections,
              //   })
              // }

              onClick={handlePDFDownload}
            >
              PDF
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`w-full h-full flex flex-col items-start ${isMobile ? "pt-[15px]" : "pt-[30px]"}`}
      >
        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between w-full mb-[12px]">
          <Typography
            variant="h5"
            fontSize={14}
            fontWeight={600}
            textAlign={"end"}
          >
            {user?.company}
          </Typography>
          <Typography
            // sx={{ mb: "10px" }}
            variant="h5"
            fontSize={14}
            fontWeight={600}
            textAlign={"end"}
          >
            Date: {moment(new Date()).format("DD-MMM-YYYY")}
          </Typography>
        </div>
        <div className={`w-[100%]`}>
          <div
            className={`flex-1 w-full overflow-y-scroll`}
            style={{ overflowY: "auto" }}
          >
            <TableContainer sx={tableStyles} component={Paper}>
              <Table
                stickyHeader
                sx={{ borderCollapse: "collapse !important" }}
              >
                <TableHead>
                  <TableRow>
                    {columns?.map((col) => (
                      <TableCell sx={cellStyles} key={col?.id}>
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {checkoutCalculatedRows?.map((row) => (
                    <TableRow key={row?.id}>
                      {columns?.map((col) => (
                        <TableCell
                          key={col?.id}
                          sx={{ ...cellStyles, fontWeight: "400" }}
                          className="whitespace-nowrap"
                        >
                          {col.id === "actions" ? (
                            <ActionButton
                              // disabled={isLoadingCart}
                              color={"!bg-red-500 text-sm !rounded-[5px]"}
                              onClick={() => dispatch(removeRow(row))}
                            >
                              X
                            </ActionButton>
                          ) : (
                            bindValue(col?.id, row[col?.id], row, false)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>

                {!isMobile && (
                  <>
                    <TableBody>
                      <TableRow>
                        <TableCell className="bg-white" colSpan={8}></TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Qty
                        </TableCell>

                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {checkoutSelectedRows?.length}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Price (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalWholeSale}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className="bg-white"
                          colSpan={wantBoxArray?.length > 0 ? 8 : 10}
                        />
                        {wantBoxArray?.length > 0 && (
                          <>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Box QTY
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {wantBoxArray?.length}
                            </TableCell>
                          </>
                        )}

                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Discount Price (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalDiscount}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="bg-white text-center"
                          colSpan={10}
                        ></TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Discounted Price (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalDiscountPrice}
                        </TableCell>
                      </TableRow>
                      {shippingTotalDiscountPrice?.replace(/[^\d.]/g, "") !==
                        "0" && (
                        <TableRow>
                          <TableCell
                            className="bg-white text-center"
                            colSpan={10}
                          >
                            {" "}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Shipping Price (USD) **
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {shippingTotalDiscountPrice}
                          </TableCell>
                        </TableRow>
                      )}

                      {wantBoxArray?.length > 0 ? (
                        ""
                      ) : (
                        <TableRow>
                          <TableCell className="bg-white " colSpan={10}>
                            {/* <div className="flex flex-col items-center">
                              <p className="lg:w-[650px] w-full">
                                * {t("FINALSALEALERTMSG")}
                              </p>
                              {shippingTotalDiscountPrice?.replace(
                                /[^\d.]/g,
                                ""
                              ) !== "0" && (
                                <p className="lg:w-[650px] w-full pt-[2px]">
                                  ** {t("SHIPPINGNOTE")}
                                </p>
                              )}
                            </div> */}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Grand Total (USD)
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {grandTotalDiscountPrice}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    {wantBoxArray?.length > 0 && (
                      <>
                        <TableBody>
                          <TableRow>
                            <TableCell className="bg-white" colSpan={10} />
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Total Box Price (USD)
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {boxTotal}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="bg-white " colSpan={10}>
                              {/* <div className="flex flex-col items-center">
                                <p className="lg:w-[650px] w-full">
                                  * {t("FINALSALEALERTMSG")}
                                </p>
                                {shippingTotalDiscountPrice?.replace(
                                  /[^\d.]/g,
                                  ""
                                ) !== "0" && (
                                  <p className="lg:w-[650px] w-full pt-[2px]">
                                    ** {t("SHIPPINGNOTE")}
                                  </p>
                                )}
                              </div> */}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Grand Total (USD)
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {grandTotalPrice}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </>
                    )}
                  </>
                )}
              </Table>
            </TableContainer>

            {isMobile && (
              <>
                <div className="font-600 text-[16px] text-center my-[10px]">
                  Package Deal Summary
                </div>
                <TableContainer
                  sx={{
                    width: "100%",
                    borderRadius: "0px",
                    boxShadow: "none",
                    borderCollapse: "collapse !important",
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{ borderCollapse: "collapse !important" }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Qty
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {checkoutSelectedRows?.length}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Price (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalWholeSale}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Discount (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalDiscount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Total Discounted Price (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {totalDiscountPrice}
                        </TableCell>
                      </TableRow>
                      {shippingTotalDiscountPrice?.replace(/[^\d.]/g, "") !==
                        "0" && (
                        <TableRow>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Shipping Price (USD) **
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {shippingTotalDiscountPrice}
                          </TableCell>
                        </TableRow>
                      )}

                      {wantBoxArray?.length > 0 ? (
                        ""
                      ) : (
                        <TableRow>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Grand Total (USD)
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {grandTotalDiscountPrice}
                          </TableCell>
                        </TableRow>
                      )}

                      {wantBoxArray?.length > 0 && (
                        <>
                          <TableRow>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Box QTY
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {wantBoxArray?.length}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Total Box Price (USD)
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {boxTotal}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "left",
                                fontWeight: "600",
                              }}
                            >
                              Grand Total (USD)
                            </TableCell>
                            <TableCell
                              sx={{
                                ...cellStyles,
                                textAlign: "right",
                                fontWeight: "400",
                              }}
                            >
                              {grandTotalPrice}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </div>

          <div
            className={`flex-1 w-full overflow-y-scroll fixed pt-[10px] left-[-9999px] top-[0] px-[10px] min-w-[1300px] xl:min-w-full `}
            style={{ overflowY: "auto" }}
            id="hidden-table-to-pdf2"
          >
            <div style={styles.title}>
              <img style={styles.logoImage} src="assets/images/logo/mla.svg" />
              <h1 style={styles.live}>Live Wholesale</h1>
            </div>
            <h3 style={{ ...styles.subTitle, marginBottom: "2px" }}>
              Discounted package (Created on{" "}
              {moment(new Date()).format("DD-MMM-YYYY")})
            </h3>
            <h3 style={{ ...styles.subTitle, marginBottom: "50px" }}>
              The following package is valid for one day only
            </h3>

            <TableContainer sx={tableStyles} component={Paper}>
              <Table
                stickyHeader
                sx={{ borderCollapse: "collapse !important" }}
              >
                <TableHead>
                  <TableRow>
                    {columns
                      ?.filter((col) => col?.id !== "actions")
                      .map((col) => (
                        <TableCell sx={cellStyles} key={col?.id}>
                          {col.label}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {checkoutCalculatedRows?.map((row) => (
                    <TableRow key={row?.id}>
                      {columns
                        ?.filter((col) => col?.id !== "actions")
                        ?.map((col) => (
                          <TableCell
                            key={col?.id}
                            sx={{ ...cellStyles, fontWeight: "400" }}
                            className="whitespace-nowrap"
                          >
                            {bindValue(col?.id, row[col?.id], row, true)}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>

                <>
                  <TableBody>
                    <TableRow>
                      <TableCell className="bg-white" colSpan={7}></TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "left",
                          fontWeight: "600",
                        }}
                      >
                        Total Qty
                      </TableCell>

                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "right",
                          fontWeight: "400",
                        }}
                      >
                        {checkoutSelectedRows?.length}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "left",
                          fontWeight: "600",
                        }}
                      >
                        Total Price (USD)
                      </TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "right",
                          fontWeight: "400",
                        }}
                      >
                        {totalWholeSale}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className="bg-white"
                        colSpan={wantBoxArray?.length > 0 ? 8 : 9}
                      />
                      {wantBoxArray?.length > 0 && (
                        <>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Box QTY
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {wantBoxArray?.length}
                          </TableCell>
                        </>
                      )}

                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "left",
                          fontWeight: "600",
                        }}
                      >
                        Total Discount Price (USD)
                      </TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "right",
                          fontWeight: "400",
                        }}
                      >
                        {totalDiscount}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        className="bg-white text-center"
                        colSpan={9}
                      ></TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "left",
                          fontWeight: "600",
                        }}
                      >
                        Total Discounted Price (USD)
                      </TableCell>
                      <TableCell
                        sx={{
                          ...cellStyles,
                          textAlign: "right",
                          fontWeight: "400",
                        }}
                      >
                        {totalDiscountPrice}
                      </TableCell>
                    </TableRow>
                    {shippingTotalDiscountPrice?.replace(/[^\d.]/g, "") !==
                      "0" && (
                      <TableRow>
                        <TableCell className="bg-white text-center" colSpan={9}>
                          {" "}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Shipping Price (USD) **
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {shippingTotalDiscountPrice}
                        </TableCell>
                      </TableRow>
                    )}

                    {wantBoxArray?.length > 0 ? (
                      ""
                    ) : (
                      <TableRow>
                        <TableCell className="bg-white " colSpan={9}>
                          {/* <div className="flex flex-col items-center">
                              <p className="lg:w-[650px] w-full">
                                * {t("FINALSALEALERTMSG")}
                              </p>
                              {shippingTotalDiscountPrice?.replace(
                                /[^\d.]/g,
                                ""
                              ) !== "0" && (
                                <p className="lg:w-[650px] w-full pt-[2px]">
                                  ** {t("SHIPPINGNOTE")}
                                </p>
                              )}
                            </div> */}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          Grand Total (USD)
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyles,
                            textAlign: "right",
                            fontWeight: "400",
                          }}
                        >
                          {grandTotalDiscountPrice}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {wantBoxArray?.length > 0 && (
                    <>
                      <TableBody>
                        <TableRow>
                          <TableCell className="bg-white" colSpan={9} />
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Total Box Price (USD)
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {boxTotal}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="bg-white " colSpan={9}>
                            {/* <div className="flex flex-col items-center">
                                <p className="lg:w-[650px] w-full">
                                  * {t("FINALSALEALERTMSG")}
                                </p>
                                {shippingTotalDiscountPrice?.replace(
                                  /[^\d.]/g,
                                  ""
                                ) !== "0" && (
                                  <p className="lg:w-[650px] w-full pt-[2px]">
                                    ** {t("SHIPPINGNOTE")}
                                  </p>
                                )}
                              </div> */}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "left",
                              fontWeight: "600",
                            }}
                          >
                            Grand Total (USD)
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellStyles,
                              textAlign: "right",
                              fontWeight: "400",
                            }}
                          >
                            {grandTotalPrice}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </>
                  )}
                </>
              </Table>
            </TableContainer>
          </div>

          {/* Bottom summary */}
          {/* <h4 className="font-medium text-[14px] text-center mt-[20px]">
            *{t("FINALSALEALERTMSG")}.
          </h4> */}
          {/* {isMobile && (
            <h4 className="font-medium text-[14px] mt-[20px]">
              <p>* {t("FINALSALEALERTMSG")}</p>
              {shippingTotalDiscountPrice?.replace(/[^\d.]/g, "") !== "0" && (
                <p className="pt-[4px]">** {t("SHIPPINGNOTE")}</p>
              )}
            </h4>
          )} */}
        </div>
      </div>
    </div>
  );
}
