import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
// import { useAppDispatch } from 'app/store/store';
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DigitDisplay from "src/utils/DigitDisplay";
// import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';

/**
 * The Staff header.
 */
function CustomersHeader({
  totalCustomerRecords,
  searchValue,
  setSearchValue,
}) {
  const session = localStorage.getItem(`jwt_access_token`);
  const [countData, setCountData] = useState<any>({});
  const userActiveRole = useSelector(userActiveRoleState);
  const user: any = useSelector(selectUser);
  // const dispatch = useAppDispatch();
  // const searchText = useSelector(selectSearchText);

  useEffect(() => {
    return () => {
      // dispatch(resetSearchText());
    };
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
  useEffect(() => {
    getAllCounts();
  }, []);

  return (
    <div className="flex flex-col w-full mb-25 ">
      <div className="flex flex-col lg:flex-row flex-auto gap-[20px] justify-between items-center sm:items-start min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex gap-[20px] flex-col md:flex-row items-center sm:items-start">
          <div className="flex flex-col items-center">
            <Typography className="text-3xl font-semibold tracking-tight leading-8 whitespace-nowrap">
              Customers{" "}
              {totalCustomerRecords > 0 ? `(${totalCustomerRecords})` : ""}
            </Typography>
            <Typography
              className="font-medium tracking-tight whitespace-nowrap"
              color="text.secondary"
            >
              Customers Management
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-4 gap-[20px] items-center justify-center text-center">
            <div className="w-full bg-white whitespace-nowrap px-[10px] py-[10px]  rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Online Customer
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData.onlineCustomer}{" "}
                {countData?.onlineCustomerPercentage >= 0
                  ? `(${countData?.onlineCustomerPercentage}%)`
                  : ""}
              </p>
            </div>
            <div className="w-full bg-white whitespace-nowrap px-[10px] py-[10px] rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px] ">
                {" "}
                Signup 1 Day
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.signUpOneDay}
              </p>
            </div>
            <div className="w-full bg-white whitespace-nowrap px-[10px] py-[10px]  rounded-xl">
              <p className="font-semibold text-[14px] lg:text-[16px]">
                {" "}
                Signup 7 Days
              </p>
              <p className="text-[12px] lg:text-[14px] font-normal pt-[4px]">
                {countData?.signUpSevenDay}
              </p>
            </div>
            <div className="w-full bg-white whitespace-nowrap px-[10px] py-[10px] rounded-xl">
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
          </div>
        </div>
        {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
          <div className="mx-[15px] flex items-center">
            <DigitDisplay user={user} />
          </div>
        )} */}
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <Input
              placeholder="Search Customers"
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchValue}
              inputProps={{
                "aria-label": "Search Customer",
              }}
              onChange={(e) => setSearchValue(e.target.value)}
              // onChange={(ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
            />
          </Paper>
        </div> */}
      </div>
    </div>
  );
}

export default CustomersHeader;
