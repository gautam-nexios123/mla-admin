import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import React from "react";
// import "react-image-gallery/styles/css/image-gallery.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    margin: 0,
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    overflowY: "hidden",
    borderRadius: "0px",
  },
}));

export default function ImageSliderDialog({ selectedValue, isGridView }) {
  const [open, setOpen] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleClickOpen = () => {
    if (!hasError) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleError = (e: any) => {
    setHasError(true);
    e.currentTarget.src =
      "https://admin.mlawatches.com/assets/images/logo/mla.svg";
    // e.currentTarget.style.minWidth = "100%";
  };

  return (
    <React.Fragment>
      {/* Button when the dialog is closed */}
      <div className="relative w-full">
        <div className="h-[95px] flex items-center justify-center">
          <img
            onError={handleError}
            style={{
              maxWidth: "95px",
              maxHeight: "95px",
            }}
            src={
              selectedValue ??
              "https://admin.mlawatches.com/assets/images/logo/mla.svg"
            }
            alt=""
            onClick={handleClickOpen}
            className={`${hasError ? "cursor-default" : "cursor-pointer"}`}
          />
        </div>
        {/* <ThumbnailSlider selectedValue={selectedValue} onClick={handleClickOpen} isGridView={isGridView} /> */}
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={true}
      >
        {/* This is the title */}
        <DialogTitle
          display="flex"
          justifyContent="end"
          sx={{ m: 0, p: 1 }}
          id="customized-dialog-title"
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>

        {/* This is content when the dialog is open */}
        <DialogContent
          dividers
          className="overflow-y-hidden flex items-center justify-center"
        >
          <img
            src={selectedValue}
            alt=""
            className="cursor-pointer object-cover"
          />
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
