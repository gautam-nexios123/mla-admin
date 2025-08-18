import Button from "@mui/material/Button";
import {
  Row,
  addRow,
  setSelectedRows,
  createCart,
  removeProductFromCart,
  removeRow,
  selectCartState,
  selectCurrentAddCartQueue,
  selectCurrentCart,
  selectedRows,
  setCurrentAddCartQueue,
  updateCart,
  setCurrentRow,
  selectCheckedBoxes,
  selectPickUpCheckedBoxes,
  calPackageCart,
} from "../../store/checkoutSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCheckoutViewPanelState,
  selectGridViewPanelState,
  toggleConfirmView,
} from "../../store/stateSlice";
// import WhatAppShareButton from "./WhatAppShareButton";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";

import ShareIcon from "@mui/icons-material/Share";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { ConvertShortLink, generateShareLink } from "src/utils/share";
import { CITY_MAP_FLAG, PICK_OPTION_COUNTRY } from "src/utils/coreFunction";

async function ShareData(dataToShare) {
  if (navigator?.share) {
    await navigator?.share({
      url: `${dataToShare}`,
    });
  } else {
    window.open(dataToShare, "_blank");
  }
}

const saveToLocalStorage = (data, currentCartData) => {
  const currentTime = new Date().getTime();
  const dataToStore = {
    data,
    currentCartData,
    timestamp: currentTime,
  };
  localStorage.setItem("cartData", JSON.stringify(dataToStore));
};

const getValidCartData = () => {
  const storedData = localStorage.getItem("cartData");
  if (!storedData) return null;

  const { data, currentCartData, timestamp } = JSON.parse(storedData);
  const currentTime = new Date().getTime();

  if (currentTime - timestamp > 3600000) {
    localStorage.removeItem("cartData");
    return null;
  }

  // expiration time to 1 minutes (60000 milliseconds)
  // if (currentTime - timestamp > 60000) {
  //   localStorage.removeItem("cartData");
  //   return null;
  // }

  return { data, currentCartData };
};

export default function ActionButtons({
  selectedRow,
  forCheckoutSummary = false,
  isAfterRemove = false,
}) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isLoadingCart = useSelector(selectCartState);
  const checkoutSelectedRows = useSelector(selectedRows);
//   const shareLink = generateShareLink(selectedRow);
  const currentCart = useSelector(selectCurrentCart);
  const openGridView = useSelector(selectGridViewPanelState);
  const user: any = useSelector(selectUser);
  const navigation = useNavigate();
  const checkedBoxes = useSelector(selectCheckedBoxes);
  const allPickUpCheckedBoxes = useSelector(selectPickUpCheckedBoxes);

  useEffect(() => {
    const validCartData = getValidCartData();
    if (validCartData?.data && validCartData?.currentCartData) {
      dispatch(setSelectedRows(validCartData?.data));
      dispatch(setCurrentRow(validCartData?.currentCartData));
    }
  }, [dispatch]);

  useEffect(() => {
    checkoutSelectedRows?.length > 0 &&
      currentCart &&
      saveToLocalStorage(checkoutSelectedRows, currentCart);
    checkoutSelectedRows?.length === 0 && localStorage.removeItem("cartData");
  }, [checkoutSelectedRows, currentCart]);

  const handleItemAddedButtonClick = async (selectedRow) => {
    const tobeAddedRow: Row = {
      id: selectedRow?.id,
      stockId: selectedRow.stockId,
      location: selectedRow?.location,
      brand: selectedRow.brand,
      model: selectedRow.model,
      serial_no: selectedRow.serial_no,
      paper: selectedRow.paper,
      paper_date: selectedRow.paper_date,
      watch_box: selectedRow.watch_box,
      wholesale_price_usd: selectedRow.wholesale_price_usd,
    };

    if (checkoutSelectedRows.length == 0 && !currentCart) {
      dispatch(createCart({})).then(async (res) => {
        // setCartRows(res);
        if (res.payload?.id) {
          const result = await dispatch(
            updateCart({
              cartId: res.payload?.id,
              stockId: tobeAddedRow.stockId,
            })
          );
          if (result?.payload?.id) {
            dispatch(addRow(tobeAddedRow));
          } else {
            enqueueSnackbar(result?.payload?.message, { variant: "error" });
          }
        }
      });
    } else {
      const result = await dispatch(
        updateCart({
          cartId: currentCart?.id,
          stockId: tobeAddedRow.stockId,
        })
      );
      if (result?.payload?.id) {
        dispatch(addRow(tobeAddedRow));
      } else {
        enqueueSnackbar(result?.payload?.message, { variant: "error" });
      }
    }
  };

  const [openConfirmModel, setOpenConfirmModel] = useState(false);

  const showPickUpStatusShoeModel = (val) => {
    if (PICK_OPTION_COUNTRY?.includes(user?.country)) {
      const watch_country = CITY_MAP_FLAG[val?.toLowerCase()] || "";
      if (watch_country != user.country) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleCalculatePackageCheckModel = async () => {
    const checkCheckBox = checkoutSelectedRows?.filter((item) => {
      return (
        showPickUpStatusShoeModel(item?.location) &&
        allPickUpCheckedBoxes?.includes(item?.stockId)
      );
    });

    if (checkCheckBox?.length > 0) {
      setOpenConfirmModel(true);
    } else {
      setOpenConfirmModel(false);
      handleConfirmButtonClick();
    }
  };

  const onCloseModel = () => {
    setOpenConfirmModel(false);
    handleConfirmButtonClick();
  };

  const handleConfirmButtonClick = () => {
    //Should bring the customer to the checkout page
    // navigate('/checkout');
    // if(user.todayCalculatedPackageCount === 0 ){
    //     enqueueSnackbar("Whoops, Daily Limit Reached! You've reached the maximum daily package calculations. Try again tomorrow or reach out to our support team for help.", { variant: 'error' });
    //     return
    // }
    if (checkoutSelectedRows.length === 1) {
      // dispatch(toggleConfirmView());
      navigation("/checkout");
    }
  };

  const handleCalculatePackage = async () => {
    try {
      await dispatch(
        calPackageCart({
          cartId: currentCart?.id,
          wantBox: checkedBoxes,
          wantPickUp: allPickUpCheckedBoxes,
          // isAfterRemove: true,
        })
      ).then((res) => {
        if (res?.payload?.statusCode && res?.payload?.statusCode !== 200) {
          enqueueSnackbar(res?.payload?.message, { variant: "error" });
          navigation("/stock");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromPackageButtonClick = async (selectedRow) => {
    const removeData = await dispatch(
      removeProductFromCart({
        cartId: currentCart?.id,
        stockId: selectedRow?.stockId,
      })
    );
    dispatch(removeRow(selectedRow?.stockId));
    // if (isAfterRemove) {
    await handleCalculatePackage();
    // }
  };

  if (forCheckoutSummary) {
    return (
      <>
        {/* {checkoutSelectedRows.length === 1 && !isAfterRemove && (
          <ActionButton
            disabled={isLoadingCart}
            color={`!bg-green-500 text-sm`}
            onClick={() => handleCalculatePackageCheckModel()}
          >
            Confirm
          </ActionButton>
        )} */}
        <ActionButton
          disabled={isLoadingCart}
          color={"!bg-red-500 ml-3 text-sm remove-button"}
          onClick={() => handleRemoveFromPackageButtonClick(selectedRow)}
        >
          X
        </ActionButton>
        
      </>
    );
  }

  if (checkoutSelectedRows.length == 0) {
    if (openGridView) {
      return (
        <>
          {selectedRow?.status !== "Sold" && (
            <>
              {/* <WhatAppShareButton
                productType={selectedRow.product_type}
                stockId={selectedRow.stockId}
                productData={selectedRow}
              /> */}
              {/* <IconButton
                className="bg-transparent"
                style={{ backgroundColor: "transparent" }}
                key={`share${selectedRow?.stockId}`}
                onClick={async () => {
                  const getShortLink = await ConvertShortLink(shareLink);
                  ShareData(getShortLink);
                }}
              >
                <ShareIcon />
              </IconButton> */}
              <ActionButton
                disabled={isLoadingCart}
                color={"!bg-blue-500"}
                onClick={() => handleItemAddedButtonClick(selectedRow)}
              >
                Buy Now22
              </ActionButton>
            </>
          )}
        </>
      );
    }
    return (
      <ActionButton
        disabled={isLoadingCart}
        color={"!bg-blue-500"}
        onClick={() => handleItemAddedButtonClick(selectedRow)}
      >
        Buy Now
      </ActionButton>
    );
  }

  if (
    checkoutSelectedRows.length == 1 &&
    checkoutSelectedRows[0].stockId === selectedRow.stockId
  ) {
    if (openGridView) {
      return (
        <>
          {selectedRow?.status !== "Sold" && (
            <>
              {/* <WhatAppShareButton
                productType={selectedRow.product_type}
                stockId={selectedRow.stockId}
                productData={selectedRow}
              /> */}
              {/* <IconButton
                // aria-label="share"
                className="bg-transparent"
                style={{ backgroundColor: "transparent" }}
                key={`share${selectedRow?.stockId}`}
                onClick={async () => {
                  const getShortLink = await ConvertShortLink(shareLink);
                  ShareData(getShortLink);
                }}
              >
                <ShareIcon />
              </IconButton> */}
              <ActionButton
                disabled={isLoadingCart}
                color={"!bg-red-500 text-sm"}
                onClick={() => handleRemoveFromPackageButtonClick(selectedRow)}
              >
                X
              </ActionButton>
              {/* <ActionButton color={`bg-green-500 ml-3`} onClick={() => handleConfirmButtonClick(selectedRow)}>Confirm</ActionButton> */}
            </>
          )}
        </>
      );
    }
    return (
      <div>
        <ActionButton
          disabled={isLoadingCart}
          color={"!bg-red-500 text-sm"}
          onClick={() => handleRemoveFromPackageButtonClick(selectedRow)}
        >
          X
        </ActionButton>
        {/* <ActionButton color={`bg-green-500 mt-3`} onClick={() => handleConfirmButtonClick(selectedRow)}>Confirm</ActionButton> */}
      </div>
    );
  }

  const isStockSelected = checkoutSelectedRows.find(
    (x) => x.stockId == selectedRow.stockId
  );
  if (checkoutSelectedRows.length >= 2 && isStockSelected) {
    if (openGridView) {
      return (
        <>
          {selectedRow?.status !== "Sold" && (
            <>
              {/* <WhatAppShareButton
                productType={selectedRow.product_type}
                stockId={selectedRow.stockId}
                productData={selectedRow}
              /> */}
              {/* <IconButton
                // aria-label="share"
                className="bg-transparent"
                style={{ backgroundColor: "transparent" }}
                key={`share${selectedRow?.stockId}`}
                onClick={async () => {
                  const getShortLink = await ConvertShortLink(shareLink);
                  ShareData(getShortLink);
                }}
              >
                <ShareIcon />
              </IconButton> */}
              <ActionButton
                disabled={isLoadingCart}
                color={"!bg-red-500 text-sm"}
                onClick={() => handleRemoveFromPackageButtonClick(selectedRow)}
              >
                X
              </ActionButton>
            </>
          )}
        </>
      );
    }
    return (
      <ActionButton
        disabled={isLoadingCart}
        color={"!bg-red-500 text-sm"}
        onClick={() => handleRemoveFromPackageButtonClick(selectedRow)}
      >
        X
      </ActionButton>
    );
  }

  if (openGridView) {
    return (
      <>
        {/* <WhatAppShareButton
          productType={selectedRow.product_type}
          stockId={selectedRow.stockId}
          productData={selectedRow}
        /> */}
        {/* <IconButton
          // aria-label="share"
          className="bg-transparent"
          style={{ backgroundColor: "transparent" }}
          key={`share${selectedRow?.stockId}`}
          onClick={async () => {
            const getShortLink = await ConvertShortLink(shareLink);
            ShareData(getShortLink);
          }}
        >
          <ShareIcon />
        </IconButton> */}
        <ActionButton
          disabled={isLoadingCart}
          color={"!bg-blue-800"}
          onClick={() => handleItemAddedButtonClick(selectedRow)}
        >
          Add to package
        </ActionButton>
      </>
    );
  }
  return (
    <ActionButton
      disabled={isLoadingCart}
      color={"!bg-blue-800"}
      onClick={() => handleItemAddedButtonClick(selectedRow)}
    >
      Add to package
    </ActionButton>
  );
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
