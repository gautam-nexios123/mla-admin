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

const ShppingModel = ({
  openModel,
  setOpenModel,
  shippingRowData,
  getShippingPackageList,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trakkingNo: "",
    currierCompanyName: "",
  });

  const handleClose = () => {
    setOpenModel(false);
  };

  const shippingSubmit = async () => {
    if (!formData?.trakkingNo || !formData?.currierCompanyName) {
      enqueueSnackbar("Please enter field", { variant: "error" });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/stock/updateShippingPackage`,
        {
          packageId: shippingRowData?.id,
          trackingNo: formData?.trakkingNo,
          courierCompanyName: formData?.currierCompanyName,
        }
      );
      if (response?.data?.statusCode == 200) {
        enqueueSnackbar("Shipping successfully", {
          variant: "success",
        });
        handleClose();
        getShippingPackageList();
      } else {
        enqueueSnackbar("Failed to create shipping package", {
          variant: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.statusCode === 403
          ? "Unauthorized access. You don't have permission to view or edit this content."
          : "Failed to add shipping",
        {
          variant: "error",
        }
      );
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openModel}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Add to Shipping
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
            <TextField
              className="w-full"
              name="trakkingNo"
              id=""
              label="Trakking No"
              type="text"
              variant="outlined"
              required
              onChange={(e) => handleChange(e)}
            />
            <TextField
              className="w-full"
              name="currierCompanyName"
              id=""
              label="Cuurier Company Name"
              type="text"
              variant="outlined"
              required
              onChange={(e) => handleChange(e)}
            />

            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              onClick={() => shippingSubmit()}
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

export default ShppingModel;
