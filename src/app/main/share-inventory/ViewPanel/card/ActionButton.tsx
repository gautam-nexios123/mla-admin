import React from "react";
import ShareIcon from "@mui/icons-material/Share";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  styled,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { ConvertShortLink, generateShareLink } from "src/utils/share";
import { ShareData } from "../../gridColumn";
import CloseIcon from "@mui/icons-material/Close";
import { ShareDialog } from "../../ShareDialog";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ActionButton = ({ selectedRow }: any) => {
  const user: any = useSelector(selectUser);
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("wholeSalePrice");
  const [withInfo, setWithInfo] = React.useState(false);
  const [shortLinkSet, setShortLinkSet] = React.useState("");
  const [shareOpen, setShareOpen] = React.useState(false);

  const handleClickOpen = () => {
    // setCurrentRowData(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareWatchLink = async () => {
    const shareLink = await generateShareLink(
      selectedRow,
      user,
      selectedOption,
      withInfo
    );
    const getShortLink = await ConvertShortLink(shareLink);
    setShortLinkSet(getShortLink);

    console.log("getShortLink:888", getShortLink);
    // ShareData(getShortLink);
    setOpen(false);
    setWithInfo(false);

    setShareOpen(true);
  };

  return (
    <div className="relative">
      <div
        onClick={() => handleClickOpen()}
        className="text-black cursor-pointer"
      >
        <ShareIcon />
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Share Link
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
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              className="min-w-[300px] border p-[10px]"
              value={selectedOption}
              onChange={(event) => setSelectedOption(event.target.value)}
            >
              <FormControlLabel
                value="wholeSalePrice"
                control={<Radio />}
                label="Whole Sale Price"
              />
              <FormControlLabel
                value="retailPrice"
                control={<Radio />}
                label="Retail Price"
              />
              <FormControlLabel
                value="noPrice"
                control={<Radio />}
                label="No Price"
              />
            </RadioGroup>
          </FormControl>

          <div className="border p-[10px]">
            <FormControlLabel
              value={withInfo}
              control={<Checkbox onChange={() => setWithInfo(!withInfo)} />}
              label="With Info"
              labelPlacement="end"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="whitespace-nowrap mx-[18px] mt-[7px]"
            variant="contained"
            color="secondary"
            onClick={() => handleShareWatchLink()}
          >
            Share
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareLink={shortLinkSet}
      />
    </div>
  );
};

export default ActionButton;
