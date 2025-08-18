import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    // maxWidth: "100%",
    width: "300px",
  },
}));

const ReceiveModel = ({
  openModel,
  setOpenModel,
  receiveRowData,
  getShippingPackageList,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenModel(false);
  };

  const receiveSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/stock/updateShippingPackage/received`,
        {
          packageId: receiveRowData?.id,
        }
      );
      if (response?.data?.statusCode == 200) {
        enqueueSnackbar("Receive successfully", {
          variant: "success",
        });
        handleClose();
        getShippingPackageList();
      } else {
        enqueueSnackbar("Failed to receive package", {
          variant: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.statusCode === 403
          ? "Unauthorized access. You don't have permission to view or edit this content."
          : error?.response?.data?.message || "Failed to receive package",
        {
          variant: "error",
        }
      );
      setLoading(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openModel}
    >
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
        <FormControl className="my-[10px] w-full">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <p className="text-black font-600 text-[16px] text-center pt-[20px]">
              Are you sure to receive this package ?
            </p>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              onClick={() => receiveSubmit()}
            >
              <div className="px-[10px] flex items-center">
                Submit{" "}
                {loading && (
                  <CircularProgress size={16} className="text-white ml-[8px]" />
                )}{" "}
              </div>
            </Button>
          </Box>
        </FormControl>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default ReceiveModel;
