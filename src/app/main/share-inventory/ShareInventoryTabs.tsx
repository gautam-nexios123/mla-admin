import { useThemeMediaQuery } from "@fuse/hooks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Autocomplete,
  Badge,
  badgeClasses,
  Box,
  IconButton,
  Popper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { getAllCountry } from "app/shared-components/locationTransform";
import {
  checkout,
  selectedCountry,
  selectedRows,
  selectedUserObj,
  setSelectedCountry,
  setSelectedUserObj,
  togglePickUpBox,
  toggleWantBox,
} from "app/store/checkoutSlice";
import { selectCurrentFilters } from "app/store/Filter/filterSlice";
import { selectGridViewPanelState } from "app/store/stateSlice";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DisplayFilterTag from "./Filter/DisplayFilterTag";
import DrawerFilter from "./Filter/DrawerFilter";
import SearchBar from "./Filter/SearchBar";
import SortMenu from "./Filter/sort/SortMenu";
import StockDisplayContainer from "./StockDispalyContainer";
import StockGridView from "./ViewPanel/StockGridView";
import ViewPanel from "./ViewPanel/ViewPanel";
import DigitDisplay from "src/utils/DigitDisplay";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";

function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}

function CustomPopper(props) {
  return (
    <Popper
      {...props}
      style={{ width: 350, zIndex: 1300 }}
      placement="bottom-start"
    />
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const ShareInventoryTabs = () => {
  const user: any = useSelector(selectUser);
  const divRef = useRef(null);
  const checkoutDivRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openGridView = useSelector(selectGridViewPanelState);
  const session = localStorage.getItem(`jwt_access_token`);
  const { enqueueSnackbar } = useSnackbar();

  const [customerDataRows, setCustomerDataRows] = useState([]);
  const [divHeight, setDivHeight] = useState(0);
  const [checkoutDivHeight, setCheckoutDivHeight] = useState(0);
  // console.log("divHeight: ", divHeight, checkoutDivHeight);
  const selecteduserCountry = useSelector(selectedCountry);
  const selectedUserObjData = useSelector(selectedUserObj);

  const [selectedUser, setSelectedUser] = useState<any>(
    selectedUserObjData || {}
  );
  const [selectedNewCusCountryName, setSelectedNewCusCountryName] = useState(
    selecteduserCountry || ""
  );
  const [findCountrySelectedObj, setFindCountrySelectedObj] = useState<any>({});

  const countries = getAllCountry();

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const checkoutSelectedRows: any = useSelector(selectedRows);

  const filters = useSelector(selectCurrentFilters);
  const [currentFiltersSelected, setCurrentFiltersSelected] = useState(
    filters || []
  );
  const userActiveRole: any = useSelector(userActiveRoleState);

  useEffect(() => {
    if (filters) {
      let Arbox = [];
      Arbox =
        filters.box.length > 0
          ? filters.box.map((m) => (m == "N/A" ? "N" : m))
          : filters.box;
      setCurrentFiltersSelected([
        ...filters.brands.map((item) => ({ label: item, key: "brands" })),
        ...filters.collections.map((item) => ({
          label: item,
          key: "collections",
        })),
        ...filters.conditions.map((item) => ({
          label: item,
          key: "conditions",
        })),
        ...filters.productType.map((item) => ({
          label: item,
          key: "productType",
        })),
        ...Arbox.map((item) => ({ label: item, key: "box" })),
        ...filters.warranty.map((item) => ({ label: item, key: "warranty" })),
        ...filters.location?.map((item) => ({ label: item, key: "location" })),
      ]);
    }
  }, [filters]);

  useEffect(() => {
    if (countries?.length > 0) {
      const findCountry = countries?.find(
        (item) => item?.name == selectedNewCusCountryName
      );

      setFindCountrySelectedObj(findCountry);
    }
  }, [countries?.length, selectedNewCusCountryName]);

  const getCountryCode = (countryName) => {
    const country = countries.find((item) => item.name === countryName);
    return country ? country?.iso2?.toLowerCase() : null;
  };

  // const handleCalculatePackage = async () => {
  //   const response: any = await axios.get(
  //     `https://api-dev.mlawatches.com/api/admin/auth/me`,
  //     {
  //       headers: { Authorization: `Bearer ${session}` },
  //     }
  //   );
  //   if (response?.data.statusCode == 200) {
  //     const userData = response?.data.results;

  //     dispatch(updateUser(userData));
  //   } else {
  //     // TODO handle refreshToken
  //   }

  //   const payload = {
  //     params: {
  //       stockId: checkoutSelectedRows?.map((watch) => watch?.stockId),
  //     },
  //     customerId: selectedUser?.id,
  //   };
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(
  //       `https://api-dev.mlawatches.com/api/admin/order/calculate-package`,
  //       payload
  //     );
  //     if (res?.data?.statusCode == 200) {
  //       navigate("/share-inventory-checkout", {
  //         state: {
  //           ...res?.data?.results,
  //           selectedUser,
  //           selectedNewCusCountryName,
  //         },
  //       });
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // };

  const newUserObj = {
    name: "New Customer",
    country: "new_customer",
    isApproved: true,
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/customer/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        setCustomerDataRows([
          newUserObj,
          ...(data?.results?.filter((item) => item?.isApproved === true) || []),
        ]);
      } else {
        enqueueSnackbar("Failed to fetch data. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  React.useEffect(() => {
    fetchData();
  }, []);

  const resetCheckOutRedux = () => {
    dispatch(checkout([]));
    dispatch(toggleWantBox([]));
    dispatch(togglePickUpBox([]));
  };

  // useEffect(() => {
  //   dispatch(checkout([]));
  //   dispatch(toggleWantBox([]));
  //   dispatch(togglePickUpBox([]));
  // }, []);

  useEffect(() => {
    // if (!selectedUser?.country || !selectedNewCusCountryName) {
    //   dispatch(checkout([]));
    //   dispatch(toggleWantBox([]));
    //   dispatch(togglePickUpBox([]));
    // }
    let countryName = "";

    if (selectedUser?.country === "new_customer") {
      countryName = selectedNewCusCountryName;
    } else {
      countryName = selectedUser?.country;
    }

    dispatch(setSelectedCountry(countryName));
    dispatch(setSelectedUserObj(selectedUser));
  }, [selectedUser, selectedNewCusCountryName]);

  const sortedOptions = React.useMemo(() => {
    const newCustomer = customerDataRows.find(
      (item) => item.name === "New Customer"
    );
    const others = customerDataRows
      .filter((item) => item.name !== "New Customer")
      .sort((a, b) => a.name.localeCompare(b.name));

    return newCustomer ? [newCustomer, ...others] : others;
  }, [customerDataRows]);

  const height = useWindowHeight();
  const width = useWindowWidth();

  useEffect(() => {
    if (divRef.current) {
      setDivHeight(divRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (divRef.current) {
        setDivHeight(divRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;

  const topSectionRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (topSectionRef.current) {
        const topHeight = topSectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - topHeight;

        setContentHeight(availableHeight);
      }
    };

    // Initial call
    handleResize();

    // Attach resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedNewCusCountryName, selectedUser]);

  return (
    <div className="w-full">
      <div
        ref={topSectionRef}
        className="flex flex-1 flex-col lg:flex-row lg:items-center justify-start space-x-4 lg:w-auto gap-2 mt-[5px] lg:mt-[20px] px-[8px] lg:px-[20px]"
      >
        <div className="flex items-center gap-[8px]">
          {!openGridView && <DrawerFilter />}
          <div className="lg:hidden">{openGridView && <DrawerFilter />}</div>
          <SearchBar />
          <SortMenu />
          {!user || (user && user.id == "") ? <></> : <ViewPanel />}
        </div>

        <div className="flex items-center gap-[10px] mt-[10px] lg:mt-0">
          <div className="flex sm:items-center flex-col sm:flex-row gap-[10px]">
            <Autocomplete
              value={
                Object.keys(selectedUser || {})?.length ? selectedUser : null
              }
              options={sortedOptions}
              getOptionLabel={(option) => option?.name}
              isOptionEqualToValue={(option, value) => {
                return option?.name === value?.name;
              }}
              onChange={async (event, newValue) => {
                if (newValue) {
                  await resetCheckOutRedux();

                  setSelectedUser(newValue);
                  setSelectedNewCusCountryName("");
                } else {
                  await resetCheckOutRedux();

                  setSelectedUser({});
                  setSelectedNewCusCountryName("");
                  console.log("No selection");
                }
              }}
              filterOptions={(options, { inputValue }) =>
                options?.filter(
                  (opt) =>
                    opt?.name
                      ?.toLowerCase()
                      .includes(inputValue?.toLowerCase()) ||
                    opt?.company
                      ?.toLowerCase()
                      .includes(inputValue?.toLowerCase())
                )
              }
              PopperComponent={CustomPopper}
              renderOption={(props, option) => {
                const countryCode = getCountryCode(option?.country);
                const flagUrl = countryCode
                  ? `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`
                  : null;
                return (
                  <div className="">
                    <Box
                      component="li"
                      {...props}
                      className="flex items-start gap-[10px] py-[8px] px-[10px] cursor-pointer"
                    >
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          className="w-[28px] h-[25px] rounded-[4px] mt-[8px]"
                          alt={option?.country}
                        />
                      )}
                      <div className="flex flex-col">
                        <Typography>{option?.name}</Typography>
                        <Typography>
                          {" "}
                          {option?.company ? `(${option.company})` : ""}
                        </Typography>
                      </div>
                    </Box>
                  </div>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="custom-height-padding min-w-[200px]"
                  label="Select Customer"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            {selectedUser?.country === "new_customer" && (
              <Autocomplete
                value={
                  Object.keys(findCountrySelectedObj || {})?.length
                    ? findCountrySelectedObj
                    : null
                }
                options={countries}
                getOptionLabel={(option) => option?.name}
                onChange={async (event, newValue) => {
                  if (newValue) {
                    await resetCheckOutRedux();

                    setSelectedNewCusCountryName(newValue?.name);
                  } else {
                    await resetCheckOutRedux();

                    setSelectedNewCusCountryName("");
                    console.log("No selection");
                  }
                }}
                filterOptions={(options, state) =>
                  options?.filter((opt) =>
                    opt?.name
                      ?.toLowerCase()
                      .includes(state?.inputValue?.toLowerCase())
                  )
                }
                renderOption={(props, option) => {
                  const countryCode = getCountryCode(option?.name);
                  const flagUrl = countryCode
                    ? `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`
                    : null;
                  return (
                    <div className="">
                      <Box
                        component="li"
                        {...props}
                        className="flex items-start gap-[10px] py-[8px] px-[10px] cursor-pointer"
                      >
                        {flagUrl && (
                          <img
                            src={flagUrl}
                            className="w-[28px] h-[25px] rounded-[4px]"
                            alt={option?.name}
                          />
                        )}

                        <Typography>{option?.name} </Typography>
                      </Box>
                    </div>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="custom-height-padding min-w-[200px]"
                    label="Select Country"
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            )}
          </div>
          {/* <div className="w-full hidden md:flex lg:hidden lg:justify-end mt-[8px] lg:mt-0">
            {userActiveRole === "MLA" && user?.isCommissionAllow && (
              <div className="lg:mx-[15px] flex items-center">
                <DigitDisplay user={user} />
              </div>
            )}
          </div> */}
          <div className="flex items-center gap-[10px]">
            {checkoutSelectedRows?.length > 0 && (
              <IconButton
                onClick={() =>
                  navigate("/share-inventory-cart", {
                    state: {
                      selectedUser,
                      selectedNewCusCountryName,
                    },
                  })
                }
                className="!ml-auto block lg:hidden"
              >
                <ShoppingCartIcon className="!text-[28px]" />
                <CartBadge
                  badgeContent={checkoutSelectedRows?.length}
                  color="primary"
                  overlap="circular"
                />
              </IconButton>
            )}
          </div>
        </div>
        {/* <div className="w-full md:hidden lg:flex lg:justify-end mt-[8px] lg:mt-0">
          {userActiveRole === "MLA" && user?.isCommissionAllow && (
            <div className="lg:mx-[15px] flex items-center">
              <DigitDisplay user={user} />
            </div>
          )}
        </div> */}

        {checkoutSelectedRows?.length > 0 && (
          <IconButton
            onClick={() =>
              navigate("/share-inventory-cart", {
                state: {
                  selectedUser,
                  selectedNewCusCountryName,
                },
              })
            }
            className="!ml-auto hidden lg:block"
          >
            <ShoppingCartIcon className="!text-[28px]" />
            <CartBadge
              badgeContent={checkoutSelectedRows?.length}
              color="primary"
              overlap="circular"
            />
          </IconButton>
        )}
      </div>
      <div className="mt-[0px]" ref={divRef}>
        <DisplayFilterTag />
        <div
          // className={`${currentFiltersSelected?.length > 0 ? "h-[calc(100vh-395px)] sm:h-[calc(100vh-205px)]" : "h-[calc(100vh-0px)] sm:h-[calc(100vh-150px)]"}`}
          style={{
            overflowY: "auto",
            width: "100vw",
            height: `${contentHeight - 68 - (currentFiltersSelected?.length > 0 ? 45 : 0)}px`,
            // height: divHeight
            //   ? `${divHeight - (checkoutSelectedRows?.length > 0 ? (checkoutSelectedRows?.length < 4 ? checkoutSelectedRows?.length * (checkoutSelectedRows?.length > 1 ? 60 : 70) + 90 : 280) : 0)}px`
            //   : `${height - (width > 600 ? 150 : 250)}px`,
          }}
        >
          {openGridView ? (
            <StockGridView
              selectedUser={selectedUser}
              selectedNewCusCountryName={selectedNewCusCountryName}
            />
          ) : (
            <>
              <StockDisplayContainer
                selectedUser={selectedUser}
                selectedNewCusCountryName={selectedNewCusCountryName}
              />
            </>
          )}
        </div>

        {/* checout panel */}

        {/* {checkoutSelectedRows?.length > 0 && (
          <div
            style={{
              backgroundColor: "#e8effd",
              // width: "100vw",
              height: `${checkoutSelectedRows?.length < 4 ? checkoutSelectedRows?.length * (checkoutSelectedRows?.length > 1 ? 60 : 70) + 90 : 280}px`,
            }}
            ref={checkoutDivRef}
          >
            <div className=" overflow-auto border border-black">
              <DataGridPro
                rows={checkoutSelectedRows}
                columns={columns}
                columnHeaderHeight={40}
                getRowHeight={() => "auto"}
                hideFooterPagination
                rowCount={checkoutSelectedRows?.length}
                sortingMode="client"
                hideFooter
                filterMode="client"
                rowsLoadingMode="client"
                pinnedColumns={{
                  right: !isTableFullView
                    ? isMobile
                      ? ["deleteAction"]
                      : []
                    : [],
                }}
                sx={{
                  color: "black",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#e8effd",
                    color: "black",
                    // height: 20,
                  },
                  "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton": {
                    color: "black",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    borderRight: 1,
                    borderColor: "black",
                    // height: 20,
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-filler": { display: "none !important" },
                  "& .MuiDataGrid-cell": {
                    backgroundColor: "#fdfffe",
                    borderRight: 1,
                    borderTop: 1,
                    borderColor: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "4px 0px",
                  },
                  ...(isTableFullView && {
                    "& .MuiDataGrid-row .MuiDataGrid-cell .remove-button": {
                      padding: "0px !important",
                      maxWidth: "fit-content !important",
                      minWidth: "30px",
                    },
                  }),
                  ...(isMobile && {
                    "& .MuiDataGrid-pinnedColumns": {
                      "& .MuiDataGrid-row .MuiDataGrid-cell .remove-button": {
                        padding: "0px !important",
                        maxWidth: "fit-content !important",
                        minWidth: "30px",
                      },
                    },
                  }),
                }}
              />
            </div>
            <div className="flex items-center justify-center py-[10px]">
              <div className="flex justify-end items-center py-1">
                <Typography variant="h5" fontSize={14} fontWeight={600}>
                  Total Qty: <strong>{checkoutSelectedRows?.length}</strong>
                </Typography>
                <button
                  onClick={handleCalculatePackage}
                  // onClick={handleCalculatePackage}
                  className="bg-green-700 text-white px-32 py-8 rounded-32 ml-32 cursor-pointer flex items-center justify-center gap-[8px]"
                >
                  {checkoutSelectedRows?.length === 1
                    ? "Confirm"
                    : "Calculate Package Deal"}{" "}
                  {loading && (
                    <CircularProgress size={18} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ShareInventoryTabs;
