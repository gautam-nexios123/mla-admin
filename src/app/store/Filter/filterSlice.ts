import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootStateType } from "app/store/types";
import { BaseResponse } from "src/utils/baseResponse";
// import {DataStock, StockDataQueriesRes, StockParamsGetDataTable} from '../types/StockTypes';

export type AppRootStateType = RootStateType<filterSliceType>;

export const getFilters: any = createAsyncThunk(
  "filter/getFilters",
  async (params: any) => {
    const response = await axios.get<BaseResponse<any>>(
      `https://api-dev.mlawatches.com/api/customer/filter/collections`,
      { params }
    );
    return response.data.results;
  }
);

type State = {
  isLoading: boolean;
  searchText: string;
  orderText: string;
  directionText: string;
  filterList: any;
  currentFilterList: any;
};

const initState: State = {
  isLoading: true,
  searchText: "",
  orderText: "",
  directionText: "",
  filterList: {},
  currentFilterList: {
    brands: [],
    collections: [],
    productType: [],
    conditions: [],
    warranty: [],
    box: [],
    price: [],
    location: [],
  },
};

export const filterSlice = createSlice({
  name: "filter/filterList",
  initialState: initState,
  reducers: {
    setfilterBrandList: (state, action) => {
      state.currentFilterList.brands = action.payload;
    },
    setfilterList: (state, action) => {
      state.currentFilterList = action.payload;
    },
    setfilterCollectionList: (state, action) => {
      state.currentFilterList.collections = action.payload;
    },
    setfilterConditionsList: (state, action) => {
      state.currentFilterList.conditions = action.payload;
    },
    setfilterWarrantyList: (state, action) => {
      state.currentFilterList.warranty = action.payload;
    },
    setfilterLocationList: (state, action) => {
      state.currentFilterList.location = action.payload;
    },
    setfilterBoxList: (state, action) => {
      state.currentFilterList.box = action.payload;
    },
    setfilterProductTypeList: (state, action) => {
      state.currentFilterList.productType = action.payload;
    },
    setfilterPriceList: (state, action) => {
      state.currentFilterList.price = action.payload;
    },
    setfilterListSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setfilterListSort: (state, action) => {
      state.orderText = action.payload;
    },
    setfilterListDirection: (state, action) => {
      state.directionText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFilters.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFilters.fulfilled, (state, action) => {
      state.isLoading = false;
      state.filterList = action.payload;
    });
    builder.addCase(getFilters.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  setfilterBrandList,
  setfilterCollectionList,
  setfilterConditionsList,
  setfilterWarrantyList,
  setfilterBoxList,
  setfilterProductTypeList,
  setfilterPriceList,
  setfilterListSearchText,
  setfilterListSort,
  setfilterListDirection,
  setfilterList,
  setfilterLocationList,
} = filterSlice.actions;
export const selectFilters = (state: AppRootStateType) =>
  state.filter?.filterList;
export const selectCurrentFilters = (state: any) =>
  state.filter?.currentFilterList;
export const selectfilterListSearchText = (state: AppRootStateType) =>
  state.filter?.filterList?.searchText || "";
export const selectfilterListSort = (state: AppRootStateType) =>
  state.filter?.filterList?.orderText || "";
export const selectfilterListDirection = (state: AppRootStateType) =>
  state.filter?.filterList?.directionText || "";

export type filterSliceType = typeof filterSlice;

export default filterSlice.reducer;
