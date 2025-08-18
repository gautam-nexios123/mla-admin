import { useThemeMediaQuery } from "@fuse/hooks";
import CloseIcon from "@mui/icons-material/Close";
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
import { unstable_debounce as debounce } from "@mui/utils";
import { DataGridPro, DataGridProProps } from "@mui/x-data-grid-pro";
import {
  getStock,
  selectStock,
  selectStockListDirection,
  selectStockListSort,
  setStockListDirection,
  setStockListSort,
} from "app/store/stockSlice";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { ConvertShortLink, generateShareLink } from "src/utils/share";
import { GetGridColDef, ShareData } from "./gridColumn";
import { ShareDialog } from "./ShareDialog";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const columnConfig: any = {
  sortable: false,
  filterable: false,
  pinnable: false,
  hideable: false,
  disableColumnMenu: true,
  resizable: false,
};
const columnWidth_SSSS = 70;
const columnFlex_SS = 0.5;

export default function StockDisplayContainer({
  selectedUser,
  selectedNewCusCountryName,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stock: any = useSelector(selectStock);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(20);
  const user: any = useSelector(selectUser);
  const sortParameters = useSelector(selectStockListSort);
  const directionParameters = useSelector(selectStockListDirection);
  const [sortValue, setSortValue] = useState<string>(sortParameters);
  const [directionValue, setDirectionValue] =
    useState<string>(directionParameters);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const handleLoadData = useCallback(
    (
      pageNumber,
      search,
      sort,
      direct,
      brandFilter,
      collectionFilter,
      productTypeFilter,
      conditionFilter,
      boxFilter,
      locationFilter,
      warrantyFilter,
      selectedUser,
      selectedNewCusCountryName
    ) => {
      if (selectedUser?.id || selectedNewCusCountryName) {
        setIsLoading(true);
        dispatch(
          getStock({
            page: pageNumber || 1,
            limit: 200,
            search: search || "",
            sort: sort || "",
            direct: direct || "",
            brands: brandFilter || "",
            collections: collectionFilter || "",
            productType: productTypeFilter || "",
            conditions: conditionFilter || "",
            box: boxFilter || "",
            location: locationFilter || "",
            warranty: warrantyFilter || "",
            customerId: selectedUser?.id || "",
            country:
              selectedUser?.country == "new_customer"
                ? selectedNewCusCountryName
                : selectedUser?.country,
          })
        ).then((res) => {
          setIsLoading(false);
          const { data, pagination } = res?.payload;
          if (pagination?.page == 1) {
            // console.log(`setPage 1 firstID::: ${data[0].id}`);
            setRows(data);
          } else {
            // console.log(`setPage::: ${pagination.page} firstID::: ${data[0].id}`);
            setRows((prevRows) => _.uniqBy(prevRows?.concat(data), "id"));
          }
          setRowCount(pagination?.total);
        });
      } else {
        setRows([]);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    setRows([]);
    setPage(1);
    handleLoadData(
      1,
      stock?.searchText,
      stock?.orderText,
      stock?.directionText,
      stock?.brandFilter,
      stock?.collectionFilter,
      stock?.productTypeFilter,
      stock?.conditionFilter,
      stock?.boxFilter,
      stock?.locationFilter,
      stock?.warrantyFilter,
      selectedUser,
      selectedNewCusCountryName
    );
  }, [
    handleLoadData,
    stock?.searchText,
    stock?.orderText,
    stock?.directionText,
    stock?.brandFilter,
    stock?.collectionFilter,
    stock?.productTypeFilter,
    stock?.conditionFilter,
    stock?.boxFilter,
    stock?.locationFilter,
    stock?.warrantyFilter,
    selectedNewCusCountryName,
    selectedUser,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setStockListSort(sortValue));
      dispatch(setStockListDirection(directionValue));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [sortValue, directionValue, dispatch]);

  const handleSortModelChange = (sortModel) => {
    if (sortModel?.length > 0) {
      setSortValue(sortModel[0]?.field);
      setDirectionValue(sortModel[0]?.sort);
    } else {
      setSortValue("");
      setDirectionValue("");
    }
  };

  const handleOnRowsScrollEnd = useCallback<
    NonNullable<DataGridProProps["onRowsScrollEnd"]>
  >(() => {
    if (!isLoading && !isFinished) {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        handleLoadData(
          newPage,
          stock?.searchText,
          stock?.orderText,
          stock?.directionText,
          stock?.brandFilter,
          stock?.collectionFilter,
          stock?.productTypeFilter,
          stock?.conditionFilter,
          stock?.boxFilter,
          stock?.locationFilter,
          stock?.warrantyFilter,
          selectedUser,
          selectedNewCusCountryName
        );
        return newPage;
      });
    }
  }, [
    handleLoadData,
    page,
    isLoading,
    isFinished,
    stock?.searchText,
    stock?.orderText,
    stock?.directionText,
    stock?.brandFilter,
    stock?.collectionFilter,
    stock?.productTypeFilter,
    stock?.conditionFilter,
    stock?.boxFilter,
    stock?.locationFilter,
    stock?.warrantyFilter,
    selectedNewCusCountryName,
    selectedUser,
  ]);

  useEffect(() => {
    if (stock) {
      const newRows = stock?.stockList?.data;
      if (newRows?.length < 20) {
        setIsFinished(true);
      } else {
        setIsFinished(false);
      }
    }
  }, [stock, page]);

  const debouncedHandleFetchRows = useMemo(
    () => debounce(handleOnRowsScrollEnd, 100),
    [handleOnRowsScrollEnd]
  );

  const [open, setOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("wholeSalePrice");
  const [withInfo, setWithInfo] = React.useState(false);
  const [currentRowData, setCurrentRowData] = React.useState(null); // For passing data to the dialog
  const [shortLinkSet, setShortLinkSet] = useState("");

  const handleClickOpen = (rowData: any) => {
    setCurrentRowData(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareWatchLink = async () => {
    const shareLink = await generateShareLink(
      currentRowData,
      user,
      selectedOption,
      withInfo
    );
    const getShortLink = await ConvertShortLink(shareLink);
    setShortLinkSet(getShortLink);
    setOpen(false);
    setWithInfo(false);

    const isMac = /Mac/.test(navigator.platform);
    const canUseWebShare = navigator?.share;

    setShareOpen(true);

    // if (isMac || !canUseWebShare) {
    //   setShareOpen(true);
    // } else {
    //   ShareData(getShortLink);
    // }
  };

  const newColumns = useMemo(() => {
    const baseColumns = GetGridColDef(selectedUser); // Get base columns
    const shareColumn = {
      field: "shareAction", // Corrected field name
      headerName: "Share",
      ...columnConfig,
      headerAlign: "center",
      minWidth: columnWidth_SSSS,
      flex: columnFlex_SS,
      renderCell: (params) => {
        const { status } = params.row;
        // if (status === "Sold") {
        //   return null;
        // }
        return (
          <div>
            <IconButton
              // aria-label="share"
              className="bg-transparent"
              style={{ backgroundColor: "transparent" }}
              key={`share${params.row.stockId}`}
              onClick={async () => {
                handleClickOpen(params?.row);
              }}
            >
              <ShareIcon />
            </IconButton>
          </div>
        );
      },
    };
    if (!user || !user?.id) {
      return [...baseColumns];
    } else {
      return [...baseColumns, shareColumn];
    }
  }, [handleClickOpen]);

  return (
    <div className="h-full w-full relative flex flex-col gap-4">
      <div className={`overflow-auto border border-gray-300`}>
        <DataGridPro
          rows={rows}
          columns={newColumns}
          onRowsScrollEnd={debouncedHandleFetchRows}
          scrollEndThreshold={200}
          getRowHeight={() => "auto"}
          hideFooterPagination
          rowCount={rowCount}
          loading={isLoading}
          sortingMode="server"
          hideFooter
          filterMode="client"
          rowsLoadingMode="client"
          onSortModelChange={handleSortModelChange}
          sx={{
            border: 0,
            color: "black",
            minHeight: "400px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e8effd",
              color: "black",
            },
            "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton": {
              color: "black",
            },
            "& .MuiDataGrid-columnHeader": {
              borderRight: 1,
              borderColor: "lightgray",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              backgroundColor: "#fdfffe",
              borderRight: 1,
              borderTop: 1,
              borderColor: "lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        />
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
}
