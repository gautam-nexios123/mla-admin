import * as React from "react";
import {
  DataGridPro,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router";
import FuseLoading from "@fuse/core/FuseLoading";
import { Switch } from "@mui/material";
import { useSnackbar } from "notistack";
import { columns } from "./CustomerTableColumn";
import RewardDialouge from "./RewardDialouge";

const style = (heigth) => {
  return {
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

export default function CustomersTable({
  setTotalCustomerRecords,
  searchValue,
  setSearchValue,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const [openRewardModel, setOpenRewardModel] = React.useState(false);
  const [rewardModelId, setRewardModelId] = React.useState(null);

  const handleSwitchChange = async (id, isApproved) => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/customer/updateCustomer/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved, isWholeProfileUpdate: false }),
        }
      );
      if (response.ok) {
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === id ? { ...row, isApproved } : row))
        );
      } else {
        enqueueSnackbar("Failed to update approval status.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating customer approval status:", error);
    }
  };

  React.useEffect(() => {
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
          setTotalCustomerRecords(data?.results?.length);
          setRows(data.results);
          setLoading(false);
        } else {
          enqueueSnackbar("Failed to fetch data. Please try again.", {
            variant: "error",
          });
          setLoading(false);
        }
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [setTotalCustomerRecords, enqueueSnackbar]);

  const CustomToolbar = () => (
    <div className="pb-4 pt-[10px]">
      <GridToolbarContainer className="flex justify-end">
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
          className="table-global-filter"
        />
      </GridToolbarContainer>
    </div>
  );

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      <div
        className="relative px-32 pb-[32px]"
        style={{ height: 700, width: "100%" }}
      >
        <DataGridPro
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[100, 150, 200]}
          getRowHeight={() => "auto"}
          slots={{
            toolbar: CustomToolbar,
          }}
          onCellClick={(params) => {
            if (params.field === "totalReward") {
              if (params?.row?.totalReward !== 0 || params?.row?.totalReward) {
                setRewardModelId(params?.row?.id);
                setOpenRewardModel(true);
              }
              // Perform action based on the clicked row data
            } else {
              navigate(`/customers/${params?.row?.id}`);
            }
          }}
          // onRowClick={(params) => navigate(`/customers/${params?.row?.id}`)}
          sx={style(50)}
        />
      </div>
      {openRewardModel && (
        <RewardDialouge
          openRewardModel={openRewardModel}
          setOpenRewardModel={setOpenRewardModel}
          rewardModelId={rewardModelId}
          setRewardModelId={setRewardModelId}
        />
      )}
    </>
  );
}
