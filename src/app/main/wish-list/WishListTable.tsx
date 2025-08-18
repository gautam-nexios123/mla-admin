import { Box } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { useEffect, useState } from "react";
import { columns } from "./WishListColumn";
import ConfirmationDialog from "app/shared-components/ConfirmationDialog";
import { useSnackbar } from "notistack";
import axios, { AxiosError, AxiosResponse } from "axios";
import DigitDisplay from "src/utils/DigitDisplay";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";

function WishListTable() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  useEffect(() => {
    getDialData();
  }, []);

  const getDialData = async () => {
    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/order/wish-list",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode == 200) {
        setRows(data.results);
        setLoading(false);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://api-dev.mlawatches.com/api/admin/order/delete_wishlist/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.statusCode == 200) {
        enqueueSnackbar("Data Delete successfully!", { variant: "success" });
        getDialData();
        handleClose();
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      console.error("Error deleting row:", error);
    }
  };

  const handleClickOpen = (id: any) => {
    setId(id);
    setOpen(true);
  };

  const handleClickApprove = async (id: any) => {
    setLoadingApprove(true);
    const response = axios.put(
      `https://api-dev.mlawatches.com/api/admin/order/update_wishlist/${id}`
    );
    response
      .then(
        async (res: AxiosResponse<any>) => {
          if (res?.data?.statusCode === 200) {
            getDialData();
            setLoadingApprove(false);
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          setLoadingApprove(false);
          return axiosError;
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="w-full flex sm:justify-end">
        {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
          <div className="mx-[15px] mt-[15px] flex items-center">
            <DigitDisplay user={user} />
          </div>
        )} */}
      </div>
      <Box className="heightyy mt-10" sx={{ height: "83vh", width: "100%" }}>
        <div className="h-[100%]">
          <DataGridPro
            loading={loading}
            rows={rows}
            apiRef={gridApiRef}
            columns={columns({
              handleClickOpen,
              handleClickApprove,
              loadingApprove,
            })}
            getRowHeight={() => "auto"}
            // stickyHeader
            pagination={false}
            hideFooter
            sx={{
              border: 1,
              width: "100%",
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
                borderBottom: "lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "15px 0px",
              },
              "& .MuiDataGrid-row:last-child ": {
                borderBottom: "1px solid lightgray",
              },
            }}
            disableColumnMenu
            checkboxSelection={false}
          />
        </div>
        <ConfirmationDialog
          isDelete={true}
          title={"Delete Wishlist"}
          open={open}
          handleDelete={handleDelete}
          handleClose={handleClose}
        />
      </Box>
    </>
  );
}

export default WishListTable;
