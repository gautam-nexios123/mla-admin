import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { rewardTableColumns } from "./CustomerTableColumn";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "100%",
  },
}));

const RewardDialogue = ({
  openRewardModel,
  setOpenRewardModel,
  rewardModelId,
  setRewardModelId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const gridApiRef = useGridApiRef();
  const [rowData, setRowData] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const getRewardData = async () => {
    setIsPending(true);
    try {
      const response = await axios.get(
        `https://api-dev.mlawatches.com/api/admin/customer/redeemReward?id=${rewardModelId}`
      );
      if (response?.data?.statusCode === 200) {
        setRowData(response?.data?.results);
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (rewardModelId) {
      getRewardData();
    }
  }, [rewardModelId]);

  const handleClose = () => {
    setOpenRewardModel(false);
    setRewardModelId(null);
    setRowData([]);
  };

  // Calculate total row
  const totalValues = useMemo(() => {
    return rowData?.reduce(
      (acc, row) => {
        acc.redeemedPoint += row.redeemedPoint || 0;
        acc.amountUsd += row.amountUsd || 0;
        acc.balancePoint = "-";
        return acc;
      },
      {
        id: "total-row",
        createdAt: "Total",
        redeemedPoint: 0,
        amountUsd: 0,
        balancePoint: 0,
        option: "",
      }
    );
  }, [rowData]);

  // Ensure total row is at index 1 (below the headers)
  // const rowsWithTotal = rowData?.length > 0 ? [totalValues, ...rowData] : [];

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openRewardModel}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Total Reward
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <FormControl>
          <Box sx={{ width: "100%" }}>
            <DataGridPro
              rows={rowData}
              loading={isPending}
              apiRef={gridApiRef}
              columns={rewardTableColumns(totalValues)}
              pagination={false}
              hideFooter
              sx={{
                border: 1,
                borderColor: "lightgray",
                color: "black",
                minHeight: 200,
                // height: 500,
                "& .MuiDataGrid-columnHeader": {
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: 0,
                  borderRadius: 0,
                  borderColor: "lightgray",
                  background: "#F1F5F9",
                  padding: 0,
                  height: "100px !important",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  display: "block !important",
                },
                "& .MuiDataGrid-filler": {
                  display: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderColor: "lightgray",
                  textAlign: "center",
                  height: 55,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
                "& .MuiDataGrid-virtualScroller": {
                  maxHeight: "500px",
                },
                // "& .total-row": {
                //   backgroundColor: "rgb(192, 216, 193)",
                //   fontWeight: "bold",
                //   position: "sticky",
                //   top: "55px !important",
                //   zIndex: 10,
                // },
                // "& .MuiDataGrid-row:hover:not(.total-row)": {
                //   backgroundColor: "#f5f5f5",
                // },
              }}
              disableColumnMenu
              checkboxSelection={false}
              getRowClassName={(params) =>
                params.id === "total-row" ? "total-row" : ""
              }
            />
          </Box>
        </FormControl>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default RewardDialogue;
