import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import { GridColDef } from "@mui/x-data-grid-pro";
import moment from "moment";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useSelector } from "react-redux";
import { Box, Button, Dialog, styled } from "@mui/material";
import {
  cityMapDisplayFlag,
  CLIENT_COUNTRY_OBJ,
  CLIENT_COUNTRY_SHOWDROPDOWN,
  convertBoxValue,
  formatDate,
  getConvertedCurrency,
  WATCH_LOACTION,
} from "src/utils/coreFunction";
import { ConvertShortLink, generateShareLink } from "src/utils/share";
import ImageSliderDialog from "./ImageSlider";
import ActionButtons from "./ActionButtons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addRow,
  removeRow,
  selectCheckedBoxes,
  selectedCountry,
  selectedRows,
  selectLocPickUpFlag,
  selectPickUpCheckedBoxes,
  toggleLocPickUpFlag,
  togglePickUpBox,
  toggleWantBox,
} from "app/store/checkoutSlice";
import {
  selectConfirmPanelState,
  selectFullViewPanelState,
  toggleCheckoutView,
  toggleFullView,
} from "app/store/stateSlice";
import { FiMaximize2 } from "react-icons/fi";
import { useNavigate } from "react-router";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const columnWidth_SSSSSS = 50;
const columnWidth_SSSSS = 60;
const columnWidth_SSSS = 70;
const columnWidth_SSS = 80;
const columnWidth_SS = 100;
const columnWidth_S = 120;
const columnWidth_M = 150;
const columnWidth_MM = 180;
const columnWidth_L = 200;
const columnWidth_LL = 250;

const columnFlex_SSSSS = 0.1;
const columnFlex_SSSS = 0.2;
const columnFlex_SSS = 0.3;
const columnFlex_SS = 0.5;
const columnFlex_S = 1;
const columnFlex_M = 1.2;
const columnFlex_L = 1.5;
const columnFlex_XL = 2;
const columnFlex_XXL = 2.5;

const ColoredStatus = ({ children, color }) => {
  // var textColor = "text-" + color + "-700";
  // var bgColor = "bg-" + color + "-50";

  let backGroundColor = "";

  if (color === "red") {
    backGroundColor = "#FFEBEE";
  } else if (color === "green") {
    backGroundColor = "#E8F5E9";
  } else if (color === "blue") {
    backGroundColor = "#E3F2FD";
  } else if (color === "purple") {
    backGroundColor = "#F3E5F5";
  }

  return (
    <div
      style={{ color: color, backgroundColor: backGroundColor }}
      className={`font-700 bg-text-sm rounded-full px-14 py-7`}
    >
      {children}
    </div>
  );
};
const columnConfig: Partial<GridColDef> = {
  sortable: false,
  filterable: false,
  pinnable: false,
  hideable: false,
  disableColumnMenu: true,
  resizable: false,
};
const columnSortConfig: Partial<GridColDef> = {
  sortable: true,
  filterable: false,
  pinnable: false,
  hideable: false,
  disableColumnMenu: true,
  resizable: false,
};
const fixedColumns = (
  currency,
  exchangeRate,
  selectedUserCountry
): GridColDef[] => {
  return [
    // {
    //   field: "thumbnailUrl",
    //   headerName: "Images & Video",
    //   ...columnConfig,
    //   minWidth: columnWidth_S,
    //   flex: columnFlex_S,
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     {
    //       /* Add default image if the image is not available */
    //     }
    //     return (
    //       params.row && (
    //         <ImageSliderDialog selectedRow={params.row} isGridView={false} />
    //       )
    //     );
    //   },
    // },
    {
      field: "thumbnailUrl",
      headerName: "Images & Video",
      ...columnConfig,
      minWidth: columnWidth_S,
      flex: columnFlex_S,
      headerAlign: "center",
      renderCell: (params) => {
        const isSold = params.row?.status === "Sold";

        {
          /* Add default image if the image is not available */
        }
        return (
          params.row && (
            <div className="relative">
              {isSold && (
                <p
                  className="absolute top-[50%] left-[50%] z-[100] "
                  style={{
                    transform: "translate(-50%, -50%)",
                    borderRadius: "3px",
                  }}
                >
                  <span
                    className="py-[0px] px-[10px] text-[16px] font-semibold text-[red] bg-[#ffffff87] top-[-12px] left-[-30px]"
                    style={{
                      transform: "rotateZ(-38deg)",
                      position: "absolute",
                      border: "1px solid red",
                    }}
                  >
                    {" "}
                    SOLD{" "}
                  </span>
                </p>
              )}
              <ImageSliderDialog
                selectedRow={params.row}
                isGridView={false}
                isStockViewPanel={false}
              />
            </div>
          )
        );
      },
    },
    {
      field: "brand",
      headerName: "Brand",
      headerAlign: "center",
      ...columnSortConfig,
      minWidth: columnWidth_SSS,
      flex: columnFlex_SSSS,
    },
    {
      field: "model",
      headerName: "Model",
      headerAlign: "center",
      ...columnSortConfig,
      minWidth: columnWidth_MM,
      flex: columnFlex_M,
      renderCell: (params) => {
        return (
          <div className="py-[4px]">
            <div className="font-700">{params?.value ? params?.value : ""}</div>
            <div className="pt-[6px] italic text-[12px]">
              {params?.row?.modelName}
            </div>
          </div>
        );
      },
    },
    {
      field: "serial_no",
      headerName: "Serial No.",
      headerAlign: "center",
      ...columnConfig,
      minWidth: columnWidth_SS,
      flex: columnFlex_SS,
    },
    {
      field: "dial",
      headerName: "Dial",
      headerAlign: "center",
      ...columnSortConfig,
      minWidth: columnWidth_SSS,
      flex: columnFlex_SSS,
    },
    {
      field: "strap_bracelet",
      headerName: "Strap/Bracelet",
      headerAlign: "center",
      ...columnSortConfig,
      minWidth: columnWidth_S,
      flex: columnFlex_SS,
    },
    {
      field: "num_of_links",
      headerName: "No. of Links",
      ...columnConfig,
      headerAlign: "center",
      minWidth: columnWidth_SS,
      flex: columnFlex_SSS,
    },

    {
      field: "paper",
      headerName: "Paper",
      headerAlign: "center",
      minWidth: columnWidth_SSS,
      flex: columnFlex_SSS,
      ...columnConfig,
      renderCell: (params) => {
        var color = "";
        const value = params.value?.trim().toLowerCase() ?? "n/a";
        switch (value) {
          case "paper": {
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
        return <ColoredStatus color={color}>{value}</ColoredStatus>;
      },
    },

    {
      field: "paper_date",
      headerName: "Paper Date",
      minWidth: columnWidth_SS,
      flex: columnFlex_S,
      headerAlign: "center",
      align: "center",
      ...columnSortConfig,
      type: "string",
      renderHeader: (params) => (
        <div className="font-600 text-center">Paper Date</div>
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
      field: "watch_box",
      headerName: "Box",
      // minWidth: columnWidth_SS,
      // flex: columnFlex_S,
      width: 140,
      headerAlign: "center",
      ...columnSortConfig,
      renderCell: (params) => {
        const value = params.value?.trim().toLowerCase();

        if (value && value.startsWith("+")) {
          return (
            <ColoredStatus color={"purple"}>
              {convertBoxValue(params.value, currency, exchangeRate)}
            </ColoredStatus>
          );
        }

        var color = "";

        switch (value) {
          case "included": {
            color = "green";
            break;
          }
          case "n/a": {
            color = "red";
            break;
          }
        }

        return <ColoredStatus color={color}>{params.value}</ColoredStatus>;
      },
    },

    {
      field: "wholesale_price_usd",
      headerName: "Wholesale Price (USD)",
      type: "number",
      minWidth: columnWidth_S,
      flex: columnFlex_S,
      align: "center",
      renderHeader: () => (
        <div className="font-600 text-center leading-relaxed">
          Wholesale
          <br /> Price (USD)
        </div>
      ),
      renderCell: (params) => {
        const formattedValue = getConvertedCurrency(
          params.value,
          currency,
          exchangeRate
        );
        return <h1 className="text-base">{formattedValue}</h1>;
      },
      headerAlign: "center",
      ...columnSortConfig,
    },

    {
      field: "notes",
      headerName: "Notes",
      ...columnConfig,
      headerAlign: "center",
      minWidth: columnWidth_S,
      flex: columnFlex_M,
    },
    {
      field: "stockId",
      headerName: "Stock#",
      ...columnSortConfig,
      headerAlign: "center",
      minWidth: columnWidth_SSS,
      flex: columnFlex_SSSS,
    },
    {
      field: "location",
      headerName: "Location",
      ...columnSortConfig,
      headerAlign: "center",
      minWidth: columnWidth_SSS,
      flex: columnFlex_SSSS,
      renderCell: (params) => {
        const city =
          selectedUserCountry == "United States" &&
          (params?.value?.toLowerCase() == "zh" ||
            params?.value?.toLowerCase() == "t/zh" ||
            params?.value?.toLowerCase() == "r/zh")
            ? "US2"
            : cityMapDisplayFlag[params?.value?.toLowerCase()] || null;

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
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      // minWidth: columnWidth_SS,
      // flex: columnFlex_SS,
      width: 120,
      ...columnSortConfig,
      renderCell: (params) => {
        const isSold = params.value === "Sold";
        const status = isSold ? "Sold" : "In Stock";
        const color = isSold ? "red" : "green";

        return <ColoredStatus color={color}>{status}</ColoredStatus>;
      },
    },
  ];
};

export const LocationModify = (loc: any) => {
  if (loc === "NY") {
    return "NY";
  } else if (loc === "T") {
    return "NY";
  } else if (loc === "LA") {
    return "NY";
  } else if (loc === "BKK") {
    return "Bangkok";
  } else if (loc === "TKY") {
    return "Tokyo";
  } else if (loc === "IT") {
    return "Italy";
  } else {
    return "";
  }
};

export async function ShareData(dataToShare: any) {
  if (navigator?.share) {
    await navigator?.share({
      url: `${dataToShare}`,
    });
  } else {
    window.open(dataToShare, "_blank");
  }
}

export function ActionButton({ children, color, onClick, disabled }: any) {
  return (
    <Button
      size="small"
      role="button"
      variant="contained"
      disabled={disabled}
      className={`${color} ${disabled ? "cursor-not-allowed !text-white" : ""} w-auto text-white text-[14px] !hover:${color}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function GetGridColDef(selectedUser: any) {
  const user: any = useSelector(selectUser);
  const dispatch: any = useDispatch();
  const columns = [
    ...fixedColumns(user?.currency, user?.exchangeRate, selectedUser?.country),
  ];
  const checkoutSelectedRows: any = useSelector(selectedRows);

  const buyNowColumn: GridColDef = {
    field: "buyNowAction",
    headerName: "Action",
    headerAlign: "center",
    ...columnConfig,
    minWidth: columnWidth_M,
    flex: columnFlex_SSS,
    renderCell: (params) => {
      const { status } = params.row;
      if (status === "Sold") {
        return null;
      }

      const isSelected = checkoutSelectedRows?.some(
        (item) => item?.stockId === params?.row?.stockId
      );

      return (
        <div>
          {isSelected ? (
            <ActionButton
              // disabled={isLoadingCart}
              color={"!bg-red-500 text-sm !rounded-[5px]"}
              onClick={() => dispatch(removeRow(params?.row))}
            >
              X
            </ActionButton>
          ) : (
            <button
              role="button"
              // variant="contained"
              className={`w-auto text-white text-[14px] bg-[#2196f3] px-[8px] py-[4px] rounded-[4px] hover:bg-[#2196f3] cursor-pointer  `}
              onClick={() => dispatch(addRow(params?.row))}
            >
              Buy Now
            </button>
          )}
        </div>
      );
    },
  };

  if (!user || !user.id) {
    // columns.push(contactColumn);
  } else {
    columns.push(buyNowColumn);
    // columns.push(contactColumn);
    // columns.push(shareColumn);
  }

  return columns;
}

const summaryColDef: GridColDef[] = [
  {
    field: "stockId",
    headerName: "Stock",
    ...columnSortConfig,
    headerAlign: "center",
    flex: 1,
    minWidth: columnWidth_SS,
    renderCell: (params) => {
      return (
        params.row && (
          <div className="relative">
            <ImageSliderDialog
              selectedRow={params.row}
              isGridView={false}
              isStockViewPanel={true}
            />
          </div>
        )
      );
    },
  },
  {
    field: "brand",
    headerName: "Brand",
    headerAlign: "center",
    ...columnSortConfig,
    flex: 0.8,
    minWidth: columnWidth_SS,
  },
  {
    field: "model",
    headerName: "Model",
    headerAlign: "center",
    ...columnSortConfig,
    flex: 1.3,
    minWidth: columnWidth_SS,
  },
  {
    field: "serial_no",
    headerName: "Serial No.",
    headerAlign: "center",
    ...columnConfig,
    flex: 1.3,
    minWidth: columnWidth_SS,
  },

  {
    field: "paper",
    headerName: "Paper",
    headerAlign: "center",
    flex: 1,
    minWidth: columnWidth_SS,
    ...columnConfig,
    renderCell: (params) => {
      var color = "";
      const value = params.value?.trim().toLowerCase();

      switch (value) {
        case "paper": {
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
      }
      return <ColoredStatus color={color}>{params.value}</ColoredStatus>;
    },
  },

  {
    field: "paper_date",
    headerName: "Paper Date",
    flex: 1,
    minWidth: columnWidth_SS,
    headerAlign: "center",
    align: "center",
    ...columnSortConfig,
    type: "string",
    renderHeader: (params) => (
      <div className="font-600 text-center">Paper Date </div>
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
    field: "watch_box",
    headerName: "Box",
    headerAlign: "center",
    ...columnSortConfig,
    minWidth: columnWidth_SS,
    flex: columnFlex_S,
    renderCell: (params) => {
      const value = params.value?.trim().toLowerCase();
      if (value?.startsWith("+")) {
        return <ColoredStatus color={"purple"}>{params.value}</ColoredStatus>;
      }

      var color = "";

      switch (value) {
        case "included": {
          color = "green";
          break;
        }
        case "n/a": {
          color = "red";
          break;
        }
      }
      return <ColoredStatus color={color}>{params.value}</ColoredStatus>;
    },
  },
];

export function GetCheckOutSummaryColDef() {
  const summaryCols = [...summaryColDef];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user: any = useSelector(selectUser);
  // const isCheckOutPanelOpen = useSelector(selectCheckoutViewPanelState);
  const isTableFullView = useSelector(selectFullViewPanelState);
  const openConfirmPanelState = useSelector(selectConfirmPanelState);
  const allCheckedBoxes = useSelector(selectCheckedBoxes);
  const allPickUpCheckedBoxes = useSelector(selectPickUpCheckedBoxes);
  const allLocPickUpFlag = useSelector(selectLocPickUpFlag);
  const checkoutSelectedRows = useSelector(selectedRows);

  const [wantBoxArray, setWantBoxArray] = useState(allCheckedBoxes || []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(toggleWantBox(wantBoxArray));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [wantBoxArray]);

  useEffect(() => {
    if (checkoutSelectedRows?.length == 0) {
      navigate("/share-inventory");
    }
  }, [checkoutSelectedRows?.length == 0]);

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

  const actionColumn: GridColDef = {
    field: "deleteAction",
    headerAlign: "center",
    minWidth: 105,
    flex: 1,
    ...columnConfig,
    renderHeader: (params) => {
      return (
        <Box className="gap-[10px] flex font-bold">
          {/* {!isTableFullView ? (
            <>
              <IconButton
                className="hover:bg-transparent"
                onClick={() => {
                  dispatch(toggleCheckoutView());
                }}
              >
                <img src="/assets/icons/Minus.svg" alt="Minus" width="22" />
              </IconButton>
              <IconButton
                className="hover:bg-transparent"
                onClick={() => dispatch(toggleFullView())}
              >
                <FiMaximize2 />
              </IconButton>
            </>
          ) : (
            "Action"
          )} */}
          Action
        </Box>
      );
    }, // renderHeader: (params) => { return <IconButton onClick={() => dispatch(toggleCheckoutView())}>{isCheckOutPanelOpen ? <FiMaximize2 /> : <FiMinimize2 />}</IconButton> },
    renderCell: (params) => {
      return (
        <ActionButton
          // disabled={isLoadingCart}
          color={"!bg-red-500 text-sm rounded-[5px]"}
          onClick={() => {
            dispatch(removeRow(params?.row));
          }}
        >
          X
        </ActionButton>
      );
    },
  };
  const watchBoxColWithCheckBox: GridColDef = {
    field: "watch_box",
    headerName: "Box",
    flex: 1,
    minWidth: columnWidth_SS,
    headerAlign: "center",
    ...columnSortConfig,
    renderCell: (params) => {
      const value = params.value?.trim().toLowerCase();
      if (openConfirmPanelState) {
        const stockId = params.row.stockId.toString();

        if (value === "included") {
          return <ColoredStatus color={"green"}>{params.value}</ColoredStatus>;
        }

        if (value === "n/a") {
          return <ColoredStatus color={"red"}>{params.value}</ColoredStatus>;
        }
        const formattedValue = convertBoxValue(
          params?.value,
          user?.currency,
          user?.exchangeRate
        ).replace(/^\+\s*/, "");
        // checked={getCheckedStatus(stockId)}
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
      } else {
        if (value?.startsWith("+")) {
          return (
            <ColoredStatus color={"purple"}>
              {convertBoxValue(
                params.value,
                user?.currency,
                user?.exchangeRate
              )}
            </ColoredStatus>
          );
        }

        var color = "";

        switch (value) {
          case "included": {
            color = "green";
            break;
          }
          case "n/a": {
            color = "red";
            break;
          }
        }
        return <ColoredStatus color={color}>{params.value}</ColoredStatus>;
      }
    },
  };

  // const locationColumn: any = {
  //   field: "location",
  //   headerName: "Location",
  //   flex: 1,
  //   minWidth: columnWidth_SS,
  //   headerAlign: "center",
  //   ...columnSortConfig,
  //   renderCell: (params) => {
  //     return <div className="">{LocationModify(params?.value)}</div>;
  //   },
  // };

  const [pickUPArray, setPickUPArray] = useState(allPickUpCheckedBoxes || []);
  const [pickupSelections, setPickupSelections] = useState(
    allLocPickUpFlag || []
  );

  const selecteduserCountry = useSelector(selectedCountry);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(togglePickUpBox(pickUPArray));
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
    if (checkoutSelectedRows?.length > 0) {
      const defaultIds = checkoutSelectedRows?.map((item) => item.stockId);

      setPickUPArray(defaultIds);

      const defaultSelections = checkoutSelectedRows?.map((row) => {
        const getClientCountry = CLIENT_COUNTRY_OBJ[selecteduserCountry]
          ? CLIENT_COUNTRY_OBJ[selecteduserCountry]
          : "OTHER";
        const getWatchCountry =
          WATCH_LOACTION[row?.location?.toLowerCase()] || null;

        const allPossileDrop = user?.pricingBaseRule?.find(
          (item) =>
            item?.watchLocation?.toLowerCase() ==
              getWatchCountry?.toLowerCase() &&
            item?.clientLocation?.toLowerCase() ==
              getClientCountry?.toLowerCase()
        )?.pickupAdjustments;

        const getPickupAdjustmentsArry =
          allPossileDrop?.length > 1
            ? allPossileDrop?.filter((item) => item?.pickupLocation != "OTHER")
            : allPossileDrop;

        const getClientCountryForDropSelect = CLIENT_COUNTRY_SHOWDROPDOWN[
          selecteduserCountry
        ]
          ? CLIENT_COUNTRY_SHOWDROPDOWN[selecteduserCountry]
          : "OTHER";

        let firstAdjustment: any = getPickupAdjustmentsArry?.find(
          (item) => item?.pickupLocation === getClientCountryForDropSelect
        );

        // Fallback to default
        if (!firstAdjustment?.pickupLocation) {
          firstAdjustment = getPickupAdjustmentsArry?.find(
            (item) => item?.pickupLocation === getWatchCountry
          );
        }

        if (!firstAdjustment?.pickupLocation) {
          firstAdjustment = getPickupAdjustmentsArry?.[0];
        }

        return { stockId: row.stockId, ...firstAdjustment };
      });

      setPickupSelections(defaultSelections);
    }
  }, [user, checkoutSelectedRows]);

  const locationColumn: any = {
    field: "location",
    headerName: "Location",
    ...columnSortConfig,
    headerAlign: "center",
    width: 100,
    // flex: columnFlex_SSSS,
    renderCell: (params) => {
      const city =
        selecteduserCountry == "United States" &&
        (params?.value?.toLowerCase() == "zh" ||
          params?.value?.toLowerCase() == "t/zh" ||
          params?.value?.toLowerCase() == "r/zh")
          ? "US2"
          : cityMapDisplayFlag[params?.value?.toLowerCase()] || null;

      const getClientCountry = CLIENT_COUNTRY_OBJ[selecteduserCountry]
        ? CLIENT_COUNTRY_OBJ[selecteduserCountry]
        : "OTHER";
      const getWatchCountry =
        WATCH_LOACTION[params?.value?.toLowerCase()] || null;

      const getPickupAdjustmentsArry = user?.pricingBaseRule?.find(
        (item) =>
          item?.watchLocation?.toLowerCase() ==
            getWatchCountry?.toLowerCase() &&
          item?.clientLocation?.toLowerCase() == getClientCountry?.toLowerCase()
      );

      return (
        <div>
          {city ? (
            <div className="flex flex-col gap-1 items-center justify-center">
              <img
                className="w-[25px] h-[25px]"
                src={`assets/images/flags/${city}.svg`}
                alt={"test"}
              />

              {/* {getPickUpStatus()} */}
            </div>
          ) : (
            ""
          )}
        </div>
      );
    },
  };

  //Exchanging the box field with checkbox
  summaryCols.pop();
  summaryCols.push(watchBoxColWithCheckBox);

  !openConfirmPanelState && summaryCols?.push(actionColumn);
  // openConfirmPanelState && summaryCols?.splice(1, 0, locationColumn);
  summaryCols?.splice(1, 0, locationColumn);
  return summaryCols;
}
