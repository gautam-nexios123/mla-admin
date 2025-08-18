import {
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { selectFullViewPanelState } from "app/store/stateSlice";
import axios from "axios";
import { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "src/app/auth/user/store/userSlice";
import { selectedRows } from "../../store/checkoutSlice";
import { GetCheckOutSummaryColDef } from "./gridColumn";

export default function ShareInventoryCart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkoutSelectedRows = useSelector(selectedRows);
  const checkoutDivRef = useRef(null);
  const columns = GetCheckOutSummaryColDef();
  const isTableFullView = useSelector(selectFullViewPanelState);
  const session = localStorage.getItem(`jwt_access_token`);
  const location = useLocation();
  const { selectedUser, selectedNewCusCountryName } = location?.state;

  const [loading, setLoading] = useState(false);

  const handleCalculatePackage = async () => {
    const response: any = await axios.get(
      `https://api-dev.mlawatches.com/api/admin/auth/me`,
      {
        headers: { Authorization: `Bearer ${session}` },
      }
    );
    if (response?.data.statusCode == 200) {
      const userData = response?.data.results;

      dispatch(updateUser(userData));
    } else {
      // TODO handle refreshToken
    }

    const payload = {
      params: {
        stockId: checkoutSelectedRows?.map((watch) => watch?.stockId),
      },
      customerId: selectedUser?.id,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/order/calculate-package`,
        payload
      );
      if (res?.data?.statusCode == 200) {
        navigate("/share-inventory-checkout", {
          state: {
            ...res?.data?.results,
            selectedUser,
            selectedNewCusCountryName,
          },
        });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="px-[10px]">
      <div className="w-full rounded-28 flex items-start justify-between my-[15px]">
        <Button
          color="inherit"
          variant="outlined"
          sx={{ borderColor: "lightgray" }}
          onClick={() => {
            navigate("/share-inventory");
          }}
          className="font-500 flex items-center justify-between"
        >
          <IoArrowBack className="icon-size-20 mr-5" />
          <p className="">Go Back</p>
        </Button>
      </div>
      <div>
        {checkoutSelectedRows?.length > 0 && (
          <div
            style={{
              backgroundColor: "#e8effd",
              // width: "100vw",
              //   height: `${checkoutSelectedRows?.length < 4 ? checkoutSelectedRows?.length * (checkoutSelectedRows?.length > 1 ? 60 : 70) + 90 : 280}px`,
            }}
            ref={checkoutDivRef}
          >
            <div className="overflow-auto border border-black">
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
        )}
      </div>
    </div>
  );
}
