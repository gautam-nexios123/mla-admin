import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootStateType } from "app/store/types";
import { BaseResponse } from "src/utils/baseResponse";

export type AppRootStateType = RootStateType<checkoutSliceType>;

export interface CartParams {
  cartId: string;
  wantBox?: string[];
  isSingleOrder?: boolean;
}

interface withProductParams extends CartParams {
  stockId: string;
}

export const createCart = createAsyncThunk(
  "stock/createCart",
  async (params: any) => {
    const response = await axios.post<BaseResponse<any>>(
      `https://api-dev.mlawatches.com/api/customer/order`,
      { params }
    );

    return response.data.results;
  }
);
export const updateCart = createAsyncThunk(
  "stock/updateCart",
  async (params: withProductParams, { rejectWithValue }) => {
    try {
      const response = await axios.put<BaseResponse<any>>(
        `https://api-dev.mlawatches.com/api/customer/order`,
        { params }
      );
      return response.data.results;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const removeProductFromCart = createAsyncThunk(
  "stock/removeProductFromCart",
  async (params: withProductParams) => {
    const response = await axios.put<BaseResponse<any>>(
      `https://api-dev.mlawatches.com/api/customer/order/remove-product`,
      { params }
    );
    return response.data.results;
  }
);
export const calPackageCart = createAsyncThunk(
  "stock/calPackageCart",
  async (params: CartParams, { rejectWithValue }) => {
    try {
      const response = await axios.post<BaseResponse<any>>(
        `https://api-dev.mlawatches.com/api/customer/order/calculate-package`,
        { params }
      );
      return response.data.results;
    } catch (error) {
      if (error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const checkoutCart = createAsyncThunk(
  "stock/checkoutCart",
  async (params: CartParams, { rejectWithValue }) => {
    try {
      const response = await axios.post<BaseResponse<any>>(
        `https://api-dev.mlawatches.com/api/customer/order/checkout`,
        { params }
      );
      return response.data.results;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);
type State = {
  selectedRows: Row[];
  isLoadingCart: boolean;
  currentCart: any;
  checkedBoxes: string[];
  checkedPickUpBoxes: string[];
  selectedLocPickUpFlag: any;
  currentAddCartQueue: string[];
  selectedCountry: string;
};

export type Row = {
  id: string;
  stockId: string;
  location: string;
  brand: string;
  model: string;
  serial_no: string;
  paper: string;
  paper_date: string;
  watch_box: string;
  wholesale_price_usd: number;
};

const initState: any = {
  selectedRows: [],
  isLoadingCart: false,
  currentCart: null,
  checkedBoxes: [],
  checkedPickUpBoxes: [],
  selectedLocPickUpFlag: [],
  currentAddCartQueue: [],
  selectedCountry: "",
  selectedUserObj: {},
};

export const checkoutSlice = createSlice({
  name: "stock/checkoutList",
  initialState: initState,
  reducers: {
    setCurrentAddCartQueue: (state, action) => {
      state.currentAddCartQueue = action.payload;
    },
    addRow: (state, action) => {
      const newRow = action.payload;
      state.selectedRows.push(newRow);
    },
    removeRow: (state, action) => {
      const stockId = action?.payload?.stockId;
      state.selectedRows = state?.selectedRows?.filter(
        (x) => x.stockId !== stockId
      );
      state.checkedBoxes = state?.checkedBoxes?.filter((x) => x !== stockId);
      state.checkedPickUpBoxes = state?.checkedPickUpBoxes?.filter(
        (x) => x !== stockId
      );
      state.selectedLocPickUpFlag = state?.selectedLocPickUpFlag?.filter(
        (x) => x?.stockId !== stockId
      );
    },
    toggleWantBox: (state, action) => {
      state.checkedBoxes = action.payload;
    },
    togglePickUpBox: (state, action) => {
      state.checkedPickUpBoxes = action.payload;
    },
    toggleLocPickUpFlag: (state, action) => {
      console.log("action: ", action);
      state.selectedLocPickUpFlag = action.payload;
    },
    checkout: (state, action) => {
      state.checkedBoxes = [];
      state.selectedRows = [];
      state.currentCart = null;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    setCurrentRow: (state, action) => {
      state.currentCart = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setSelectedUserObj: (state, action) => {
      state.selectedUserObj = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create cart
    builder.addCase(createCart.pending, (state) => {
      state.isLoadingCart = true;
    });
    builder.addCase(createCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      state.currentCart = action.payload;
    });

    // Add product to cart
    builder.addCase(updateCart.pending, (state, action) => {
      state.isLoadingCart = true;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      state.currentCart = action.payload;
    });
    builder.addCase(updateCart.rejected, (state, action) => {
      state.isLoadingCart = false;
    });

    // Remove product form cart
    builder.addCase(removeProductFromCart.pending, (state, action) => {
      state.isLoadingCart = true;
    });
    builder.addCase(removeProductFromCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      state.currentCart = action.payload;
    });
    builder.addCase(removeProductFromCart.rejected, (state, action) => {
      state.isLoadingCart = false;
    });

    // Calculate Package
    builder.addCase(calPackageCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      state.currentCart = action.payload;
    });

    builder.addCase(calPackageCart.rejected, (state, action) => {
      // console.log(`errorrr:::${JSON.stringify(action)}`);
      state.isLoadingCart = false;
    });
    // builder.addCase(getStock.rejected, (state) => {
    //   state.isLoading = false;
    // });

    // Checkout Cart
    builder.addCase(checkoutCart.pending, (state, action) => {
      state.isLoadingCart = true;
    });
    builder.addCase(checkoutCart.fulfilled, (state, action) => {
      state.isLoadingCart = false;
      state.currentCart = action.payload;
    });
    builder.addCase(checkoutCart.rejected, (state, action) => {
      state.isLoadingCart = false;
    });
  },
});

export const {
  setCurrentAddCartQueue,
  addRow,
  removeRow,
  checkout,
  toggleWantBox,
  togglePickUpBox,
  toggleLocPickUpFlag,
  setSelectedRows,
  setCurrentRow,
  setSelectedCountry,
  setSelectedUserObj
} = checkoutSlice.actions;

export const selectedRows = (state: AppRootStateType) => {
  return state?.checkOut?.selectedRows;
};

export const selectedCountry = (state: AppRootStateType) => {
  return state?.checkOut?.selectedCountry;
};
export const selectedUserObj = (state: AppRootStateType) => {
  return state?.checkOut?.selectedUserObj;
};

export const selectCurrentAddCartQueue = (state: AppRootStateType) =>
  state?.checkOut?.currentAddCartQueue;

export const selectCheckedBoxes = (state: AppRootStateType) =>
  state?.checkOut?.checkedBoxes;

export const selectPickUpCheckedBoxes = (state: AppRootStateType) =>
  state?.checkOut?.checkedPickUpBoxes;

export const selectLocPickUpFlag = (state: AppRootStateType) =>
  state?.checkOut?.selectedLocPickUpFlag;

export const selectCurrentCart = (state: AppRootStateType) =>
  state?.checkOut?.currentCart;

export const selectCartState = (state: AppRootStateType) =>
  state?.checkOut?.isLoadingCart;

export type checkoutSliceType = typeof checkoutSlice;

export default checkoutSlice.reducer;
