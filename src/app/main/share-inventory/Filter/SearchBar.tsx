import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import {
  selectStock,
  selectStockListSearchText,
  setStockListboxFilter,
  setStockListbrandFilter,
  setStockListcollectionFilter,
  setStockListconditionFilter,
  setStockListProductTypeFilter,
  setStockListSearchText,
  setStockListwarrantyFilter,
} from "app/store/stockSlice";
import { useAppDispatch } from "app/store/store";
import { useThemeMediaQuery } from "@fuse/hooks";
import { setfilterList } from "app/store/Filter/filterSlice";
// import { CloseOutlined } from "@mui/icons-material";

export default function SearchBar() {
  const searchParameters = useSelector(selectStockListSearchText);
  const [searchFields, setSearchFields] = useState(searchParameters);
  const [searchValue, setSearchParameters] = useState<string>(searchParameters);
  const dispatch = useAppDispatch();

  // const handleClearAll = () => {
  //   const clearedFilters = {
  //     brands: [],
  //     collections: [],
  //     productType: [],
  //     conditions: [],
  //     box: [],
  //     warranty: [],
  //   };
  //   dispatch(setfilterList(clearedFilters));
  //   dispatch(setStockListProductTypeFilter(""));
  //   dispatch(setStockListbrandFilter(""));
  //   dispatch(setStockListcollectionFilter(""));
  //   dispatch(setStockListconditionFilter(""));
  //   dispatch(setStockListboxFilter(""));
  //   dispatch(setStockListwarrantyFilter(""));
  //   // setCurrentFilters([]);
  // };

  const handleSearchInputChanged = async (value, type = "text") => {
    const newValue = type === "datetime" ? new Date(value) : value.target.value;
    setSearchFields(newValue);
    // console.log('newValue', newValue);

    if (newValue != "") {
      setSearchParameters(newValue);
    } else {
      handleResetSearchInput();
    }
    // if (newValue?.length === 1) {
    //   await handleClearAll();
    // }
  };

  const handleSearchInputSubmit = (e: any) => {
    e.preventDefault();

    // if (searchFields != '') {
    //   setSearchParameters(searchFields);

    // } else {
    //   handleResetSearchInput();
    // }
  };

  const handleResetSearchInput = () => {
    setSearchFields("");
    setSearchParameters("");
  };

  useEffect(() => {
    setSearchFields(searchParameters);
    setSearchParameters(searchParameters);
  }, [searchParameters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setStockListSearchText(searchValue));
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);
  // console.log('stockkk',stock?.stockList?.pagination.total)

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <Paper
      component="form"
      onSubmit={handleSearchInputSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: isMobile ? "100%" : 280,
        height: isMobile ? 31 : 40,
        maxHeight: 40,
        backgroundColor: "transparent",
        boxShadow: "none",
        borderBottom: 1,
        borderColor: "lightgray",
        borderRadius: "0px", // Here you set the border radius
      }}
    >
      <InputBase
        // startAdornment={<SearchIcon fontSize="14" style={{color: '#9B9EA6'}} />}
        sx={{ ml: 1, flex: 1 }}
        variant="standard"
        placeholder="Search.."
        inputProps={{ "aria-label": "search" }}
        name="search"
        value={searchFields || ""}
        onChange={(newValue) => handleSearchInputChanged(newValue)}
      />
      {searchFields != "" && (
        <IconButton
          type="button"
          onClick={handleResetSearchInput}
          sx={{ p: "10px" }}
          aria-label="search"
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* {(!openGridView && stock?.searchText != '') && (
        <>({stock?.stockList?.pagination.total} Found)</>
      )} */}

      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
