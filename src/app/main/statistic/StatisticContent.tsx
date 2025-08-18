import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useEffect, useState } from "react";
import useWindowHeight from "src/utils/useWindowHeight ";
import countryListJson from "../../../app/shared-components/countryJson.json";
import DateRangePickerComponent from "./DateRangePickerComponent";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Calendar Icon
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { columns } from "./OrderTableColumn";
import moment from "moment";
import _ from "lodash";

const style = (heigth) => {
  return {
    border: 1,
    borderColor: "lightgray",
    color: "black",
    scrollbarWidth: "auto",
    scrollbarColor: "black",
    "& .MuiDataGrid-columnHeaders": {
      borderTop: 0,
      borderRadius: 0,
    },
    "& .MuiDataGrid-columnHeader": {
      borderRight: 1,
      borderTop: 1,
      borderBottom: 0,
      borderRadius: 0,
      borderColor: "lightgray",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600,
    },
    "& .MuiDataGrid-cell": {
      borderColor: "lightgray",
      borderRight: 1,
      borderRightColor: "lightgray",
      borderTop: 1,
      borderTopColor: "lightgray",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      height: heigth,
    },
  };
};

const getCountryCode = (countryName) => {
  const country = countryListJson.find((item) => item.name === countryName);
  return country ? country.iso2.toLowerCase() : null;
};

const columnsCountry = [
  { id: "country", label: "Country", minWidth: 170 },
  { id: "count", label: "Count", minWidth: 100 },
];

const columnsWatches = [
  { id: "image", label: "Images & Videos", minWidth: 65 },
  { id: "brand", label: "Brand", minWidth: 100 },
  { id: "model", label: "Model", minWidth: 100 },
  { id: "viewCount", label: "View Count", minWidth: 100 },
];

const StatisticContent = () => {
  const [customerByCountry, setCustomerByCountry] = useState([]);
  const [topWatchesList, setTopWatchesList] = useState([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
  const [isLoadingTopWatches, setIsLoadingTopWatches] = useState(true);
  const session = localStorage.getItem(`jwt_access_token`);
  const [countData, setCountData] = useState<any>({});
  const height = useWindowHeight();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [dateError, setDateError] = useState<boolean>(false);
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);

  const toggleDatePicker = () => {
    setOpen(!open);
  };

  const customerByCountryFetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-dev.mlawatches.com/api/admin/statistic/getCountryCount"
      );
      setIsLoadingCustomer(false);
      const data = response?.data?.results?.data || [];
      setCustomerByCountry(data);
    } catch (err) {
      setIsLoadingCustomer(false);
      console.error("Error fetching data:", err);
    }
  };

  const topWatchesFetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-dev.mlawatches.com/api/admin/statistic/getProductCount"
      );
      setIsLoadingTopWatches(false);
      const data = response?.data?.results?.data || [];
      setTopWatchesList(data);
    } catch (err) {
      setIsLoadingTopWatches(false);
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    customerByCountryFetchData();
    topWatchesFetchData();
  }, []);

  const getAllCounts = async () => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/customer/allCounts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCountData(data?.results);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = () => {
    if (!dateRange?.startDate && !dateRange?.endDate) {
      setDateError(true);
    } else {
      setDateError(false);
      getOrderReport(
        moment(dateRange?.startDate).utc().toISOString(),
        moment(dateRange?.endDate).utc().toISOString()
      );
    }
  };

  const getConverteData = (item, exchangeRate) => {
    const data = {
      HkDiscount: Math.round((item.discount * exchangeRate) / 10) * 10,
      HkNetAmount: Math.round((item.netAmount * exchangeRate) / 10) * 10,
      HkPrice: Math.round((item.price * exchangeRate) / 10) * 10,
      HkShippingPrice:
        Math.round((item.additionalShippingPrice * exchangeRate) / 10) * 10,
    };
    return data;
  };

  const getSaleItemsData = (item) => {
    const data = item.saleItems.map((ele) => ({
      ...ele,
      ...getConverteData(ele, item.exchangeRate),
    }));
    const Hkdata = {
      saleItems: data,
      HkDiscount: _.sum(data?.map((m) => m.HkDiscount)),
      HkNetAmount: _.sum(data?.map((m) => m.HkNetAmount)),
      HkPrice: _.sum(data?.map((m) => m.HkPrice)),
      HkShippingPrice: _.sum(data?.map((m) => m.HkShippingPrice)),
    };
    return Hkdata;
  };

  const getOrderReport = async (startDate: any, endDate: any) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api-dev.mlawatches.com/api/admin/order/get-orders-by-date?startDate=${startDate}&endDate=${endDate}`
      );
      setLoading(false);
      const data = response?.data;
      setRows(
        data?.results?.map((item: any) =>
          item?.currency === "USD"
            ? { ...item }
            : { ...item, ...getSaleItemsData(item) }
        )
      );
    } catch (err) {
      setLoading(false);
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const EndDate = new Date();
    const EndUtc = moment(EndDate).utc().toISOString();
    const last7DaysDate = moment(EndDate)
      .subtract(7, "days")
      .utc()
      .toISOString();

    setDateRange({
      startDate: last7DaysDate,
      endDate: EndUtc,
    });

    getOrderReport(last7DaysDate, EndUtc);
  }, []);

  useEffect(() => {
    getAllCounts();
  }, []);

  return (
    <div className="flex flex-col items-start p-[32px]">
      <div className="pb-[50px] sm:pb-0 w-full flex flex-col lg:flex-row gap-[50px] ">
        <Paper className="bg-white flex-1 rounded-[6px] shadow-lg border p-[12px] flex flex-col">
          <h2 className="text-black font-semibold text-[20px]  p-[10px]">
            Customer By Country
          </h2>
          <TableContainer sx={{ maxHeight: `450px` }}>
            <Table stickyHeader aria-label="customer by country table">
              <TableHead>
                <TableRow>
                  {columnsCountry.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingCustomer ? (
                  <p className="text-center pl-[122px] py-[100px]">
                    Loading...{" "}
                  </p>
                ) : customerByCountry?.length > 0 ? (
                  ""
                ) : (
                  <p className="text-center pl-[122px] py-[100px]"> No Data </p>
                )}

                {customerByCountry.map((item, index) => {
                  const countryCode = getCountryCode(item?.country);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      className="border"
                    >
                      <TableCell
                        className="flex items-center"
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          padding: "10px",
                        }}
                      >
                        {countryCode ? (
                          <div>
                            <img
                              src={`https://flagcdn.com/w320/${countryCode}.png`}
                              alt={`${item?.country} flag`}
                              style={{
                                width: "25px",
                                height: "auto",
                                marginRight: "10px",
                              }}
                            />
                          </div>
                        ) : (
                          <span
                            className="w-8 h-6 bg-gray-200"
                            style={{ marginRight: "10px" }}
                          ></span>
                        )}
                        {item?.country}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #e2e8f0",
                          padding: "10px",
                        }}
                      >
                        {item?._count?.country}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper className="bg-white flex-[1.5] rounded-[6px] shadow-lg border p-[12px] flex flex-col  ">
          <h2 className="text-black font-semibold text-[20px]  p-[10px]">
            Top Watches
          </h2>
          <TableContainer sx={{ maxHeight: `450px` }}>
            <Table stickyHeader aria-label="top watches table">
              <TableHead>
                <TableRow>
                  {columnsWatches.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingTopWatches ? (
                  <p className="text-center pl-[130px] sm:pl-[300px] py-[100px] whitespace-nowrap">
                    {" "}
                    Loading...{" "}
                  </p>
                ) : topWatchesList?.length > 0 ? (
                  ""
                ) : (
                  <p className="text-center pl-[130px] sm:pl-[300px] py-[100px] whitespace-nowrap">
                    {" "}
                    No Data{" "}
                  </p>
                )}

                {topWatchesList.map((item, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      <div className="w-[67px] h-[67px] border">
                        <img
                          src={item?.imageUrl}
                          alt=""
                          style={{ maxWidth: "65px", maxHeight: "65px" }}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.brand}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.model}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.viewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <div className="flex-[1.5]">
          <div className="w-full flex flex-col sm:flex-row gap-[30px] items-center text-center mb-[25px]">
            <div className="w-full bg-white shadow-2 whitespace-nowrap px-[10px] py-[10px]  rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Total Customers
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.allCustomer}
              </p>
            </div>
            <div className="w-full bg-white shadow-2 whitespace-nowrap px-[10px] py-[10px] rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Online Customer
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.onlineCustomer}{" "}
                {countData?.onlineCustomerPercentage >= 0
                  ? `(${countData?.onlineCustomerPercentage}%)`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-[30px] items-center text-center mb-[25px]">
            <div className="w-full bg-white shadow-2 whitespace-nowrap px-[10px] py-[10px] rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px] ">
                {" "}
                Signup 1 Day
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.signUpOneDay}
              </p>
            </div>
            <div className="w-full bg-white shadow-2 whitespace-nowrap px-[10px] py-[10px]  rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Signup 7 Days
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.signUpSevenDay}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-[30px] items-center text-center ">
            <div className="w-full bg-white shadow-2 whitespace-nowrap px-[10px] py-[10px] rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Active Customer
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.activeCustomer}{" "}
                {countData?.activeCustomerPercentage >= 0
                  ? `(${countData?.activeCustomerPercentage}%)`
                  : ""}
              </p>
            </div>
            <div className="w-full px-[10px] py-[10px]"></div>
          </div>
        </div>
      </div>

      <Paper className="bg-white mt-20 w-full rounded-[6px] shadow-lg border p-[12px] flex flex-col">
        <h2 className="text-black font-semibold text-[20px]  p-[10px]">
          Order Report
        </h2>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-[18px] p-[10px]">
            <div>
              <TextField
                className="custom-height-padding sm:w-[300px] w-full"
                type="text"
                sx={{
                  "& .MuiInputBase-input": {
                    paddingY: "10px",
                  },
                }}
                // label="Select Date"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
                value={
                  dateRange?.startDate && dateRange?.endDate
                    ? `${moment(dateRange?.startDate).format("DD-MM-YYYY")} - ${moment(dateRange?.endDate).format("DD-MM-YYYY")}`
                    : "Select Date"
                }
                onClick={() => toggleDatePicker()}
              />
            </div>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Submit{" "}
              {loading && (
                <CircularProgress size={16} className="text-white ml-[8px]" />
              )}
            </Button>
          </div>
          {dateError && (
            <span>
              <p className="text-red-500 text-[14px] px-[10px]">
                Please Select Date
              </p>
            </span>
          )}
          {open && (
            <div className="absolute left-[10px]">
              <DateRangePickerComponent
                open={open}
                toggle={toggleDatePicker}
                setDateRange={setDateRange}
                setOpen={setOpen}
                setDateError={setDateError}
              />
            </div>
          )}
        </div>

        <Box
          className="heightyy my-[18px]"
          sx={{ height: "40vh", width: "100%", px: 1 }}
        >
          <DataGridPro
            loading={loading}
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            getRowHeight={() => "auto"}
            pagination={false}
            hideFooter
            // slots={{
            //   toolbar: CustomToolbar,
            // }}
            // processRowUpdate={processRowUpdate}
            sx={style(50)}
            checkboxSelection={false}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default StatisticContent;
