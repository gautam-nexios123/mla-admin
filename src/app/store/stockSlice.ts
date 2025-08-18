import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootStateType } from "app/store/types";
import {
  StockDataQueriesRes,
  StockParamsGetDataTable,
} from "./types/StockTypes";
import { BaseResponse } from "src/utils/baseResponse";
import moment from "moment";
import CryptoJS from "crypto-js";

export type AppRootStateType = RootStateType<stockSliceType>;

// export const getStock: any = createAsyncThunk(
//   "stock/getStock",
//   async (params: StockParamsGetDataTable) => {
//     const response = await axios.get<BaseResponse<StockDataQueriesRes>>(
//       `https://api-dev.mlawatches.com/api/customer/stock`,
//       { params }
//     );
//     return response.data.results;
//   }
// );

export const getStock = createAsyncThunk(
  "stock/getStock",
  async (params: StockParamsGetDataTable) => {
    const getCurrentTimeUtc = moment().utc().format();
    const secretKey =
      "9f87cba218ac5048bf86dce30d76baceb3d527798c59d411528fa7681cc77c1e"; // Use a secure key
    const iv = "4a71bdf3c721f980ea2be2c80f4d8f0a"; // 16 bytes hex IV

    const encryptData = (data, secretKey, iv) => {
      const key = CryptoJS.enc.Hex.parse(secretKey); // Convert key to WordArray
      const ivWordArray = CryptoJS.enc.Hex.parse(iv); // Convert IV to WordArray

      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString(); // Encrypted data in Base64 format
    };

    const encryptedData = encryptData(getCurrentTimeUtc, secretKey, iv);

    const response = await axios.get<BaseResponse<StockDataQueriesRes>>(
      // `https://api-dev.mlawatches.com/api/customer/stock`,
      `https://api-dev.mlawatches.com/api/admin/stock/customer`,
      {
        params,
        headers: {
          "x-signature": encryptedData,
        },
      }
    );

    return response.data.results;
  }
);

type State = {
  isLoading: boolean;
  searchText: string;
  orderText: string;
  directionText: string;
  brandFilter: string;
  collectionFilter: string;
  conditionFilter: string;
  productTypeFilter: string;
  warrantyFilter: string;
  boxFilter: string;
  locationFilter: string;
  priceFilter: string;
  stockList: StockDataQueriesRes;
};

const initState: any = {
  isLoading: true,
  searchText: "",
  orderText: "",
  directionText: "",
  brandFilter: "",
  collectionFilter: "",
  productTypeFilter: "",
  conditionFilter: "",
  warrantyFilter: "",
  boxFilter: "",
  locationFilter: "",
  priceFilter: "",
  stockList: {
    data: [],
    pagination: {
      page: 0,
      total: 0,
    },
  },
};

export const stockSlice = createSlice({
  name: "stock/stockList",
  initialState: initState,
  reducers: {
    setStockListSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setStockListSort: (state, action) => {
      state.orderText = action.payload;
    },
    setStockListDirection: (state, action) => {
      state.directionText = action.payload;
    },
    setStockListbrandFilter: (state, action) => {
      state.brandFilter = action.payload;
    },
    setStockListcollectionFilter: (state, action) => {
      state.collectionFilter = action.payload;
    },
    setStockListProductTypeFilter: (state, action) => {
      state.productTypeFilter = action.payload;
    },
    setStockListconditionFilter: (state, action) => {
      state.conditionFilter = action.payload;
    },
    setStockListwarrantyFilter: (state, action) => {
      state.warrantyFilter = action.payload;
    },
    setStockListboxFilter: (state, action) => {
      state.boxFilter = action.payload;
    },
    setStockListLocationFilter: (state, action) => {
      state.locationFilter = action.payload;
    },
    setStockListpriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStock.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStock.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stockList = action.payload;
    });
    builder.addCase(getStock.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  setStockListSearchText,
  setStockListSort,
  setStockListDirection,
  setStockListbrandFilter,
  setStockListcollectionFilter,
  setStockListconditionFilter,
  setStockListwarrantyFilter,
  setStockListboxFilter,
  setStockListLocationFilter,
  setStockListpriceFilter,
  setStockListProductTypeFilter,
} = stockSlice.actions;

export const selectStock = (state: AppRootStateType) => state?.stock;
export const selectStockListSearchText = (state: any) => {
  return state.stock?.searchText || "";
};
export const selectStockListSort = (state: any) => state.stock?.orderText || "";
export const selectStockListDirection = (state: any) =>
  state.stock?.directionText || "";

export type stockSliceType = typeof stockSlice;

export default stockSlice.reducer;
