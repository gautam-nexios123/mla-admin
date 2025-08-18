import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Button,
  CircularProgress,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ConfirmationDialog from "app/shared-components/ConfirmationDialog";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatter } from "src/utils/coreFunction";
import {
  braceletDropDownForShipCal,
  materialDropDown,
} from "src/utils/dropdownlist";

export default function ShippingPackageHistoryDetails() {
  const navigation = useNavigate();
  const location = useLocation();
  const session = localStorage.getItem(`jwt_access_token`);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [detailRows, setDetailRows] = useState([]);
  const [id, setId] = useState("");
  const [formSetStockId, setFormStockId] = useState("");
  const [loading, setLoading] = useState(false);
  const [materialISLoading, setMaterialISLoading] = useState(false);
  const [materialID, setMaterialID] = useState("");
  const [braceletISLoading, setBraceletISLoading] = useState(false);
  const [braceletID, setBraceletID] = useState("");
  const [amountJpyID, setAmountJpyID] = useState("");
  const [amountJpyValue, setAmountJpyValue] = useState(null);

  const getShippingPackageDetailList = async () => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/getShippingPackageItemList?packageId=${location?.state?.row?.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.statusCode == 200) {
        setDetailRows(data?.results || []);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getShippingPackageDetailList();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/deleteShippingPackageItem?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data?.statusCode == 200) {
        enqueueSnackbar("Data Delete successfully!", { variant: "success" });
        handleClose();
        getShippingPackageDetailList();
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        handleClose();
      } else {
        enqueueSnackbar(data?.message || "Failed to Please try again.", {
          variant: "error",
        });
        handleClose();
      }
    } catch (error) {
      enqueueSnackbar("Failed to Please try again.", { variant: "error" });
      handleClose();
    }
  };

  const handleClickOpen = (rowData: any) => {
    setId(rowData?.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let columns: any = [
    {
      id: "stockId",
      label: "Stock",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
    {
      id: "location",
      label: "Location",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
    {
      id: "brand",
      label: "Brand",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
    {
      id: "model",
      label: "Model",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
    {
      id: "material",
      label: "Material",
      align: "center",
      className: "w-[150px]",
      isMaterialDropdown: true, // use this flag to identify dropdown
    },
    {
      id: "costUsd",
      label: "Cost",
      align: "center",
      isValue: true,
      className: "w-[150px]",
    },
    {
      id: "purchaseDate",
      label: "Purchase Date",
      align: "center",
      isValue: false,
      className: "w-[150px]",
      isDate: true,
    },
    {
      id: "serialNo",
      label: "Serial No.",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      isValue: false,
      className: "w-[150px]",
    },
  ];

  const extraBraceletColumn = {
    id: "bracelet",
    label: "Bracelet",
    align: "center",
    className: "w-[150px]",
    isBraceletDropdown: true, // use this flag to identify dropdown
  };

  const extraAmountJpColumn = {
    id: "amount_jpy",
    label: "Amount",
    align: "center",
    className: "w-[150px]",
  };

  const extraWeightColumn = {
    id: "weightGrams",
    label: "Weight (Grams)",
    align: "center",
    className: "w-[150px]",
  };

  // Insert index — after "material" (which is at index 4), so insert at index 5

  let updatedColumns = [...columns];

  // Insert bracelet column if condition matches
  if (
    location?.state?.row?.fromLocation === "HK" &&
    location?.state?.row?.toLocation === "NY"
  ) {
    const insertBraceletIndex = 5; // after 'material'
    updatedColumns?.splice(insertBraceletIndex, 0, extraBraceletColumn);
  }

  // Insert amount_jpy column if condition matches
  if (
    location?.state?.row?.fromLocation === "TKY" &&
    location?.state?.row?.toLocation === "HK"
  ) {
    const insertJpyIndex = 5;
    updatedColumns?.splice(insertJpyIndex, 0, extraAmountJpColumn);
  }

  if (
    location?.state?.row?.fromLocation === "TH" &&
    location?.state?.row?.toLocation === "HK"
  ) {
    const insertBraceletIndex = 5; // after 'material'
    updatedColumns?.splice(insertBraceletIndex, 0, extraBraceletColumn);
    const insertJpyIndex = 6;
    updatedColumns?.splice(insertJpyIndex, 0, extraAmountJpColumn);
    const insertWeightIndex = 7;
    updatedColumns?.splice(insertWeightIndex, 0, extraWeightColumn);
  }

  if (
    location?.state?.row?.fromLocation === "HK" &&
    location?.state?.row?.toLocation === "ZH"
  ) {
    const insertBraceletIndex = 5; // after 'material'
    updatedColumns?.splice(insertBraceletIndex, 0, extraBraceletColumn);
  }

  // Use updatedColumns in your table
  columns = updatedColumns;

  const handleMaterialChange = async (rowId: any, value: any) => {
    setMaterialID(rowId);
    setMaterialISLoading(true);
    try {
      const response = await axios.post(
        "https://api-dev.mlawatches.com/api/admin/stock/updateItemInShippingPackage",
        {
          id: rowId,
          material: value,
        }
      );

      if (response?.data?.statusCode !== 200) {
        enqueueSnackbar("Failed to update shipping package", {
          variant: "error",
        });
        setMaterialISLoading(false);
        return;
      }

      enqueueSnackbar("Shipping package updated successfully", {
        variant: "success",
      });
      getShippingPackageDetailList();
      setMaterialISLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setMaterialISLoading(false);
    }
  };

  const handleBraceletChange = async (rowId: any, value: any) => {
    setBraceletID(rowId);
    setBraceletISLoading(true);
    try {
      const response = await axios.post(
        "https://api-dev.mlawatches.com/api/admin/stock/updateItemInShippingPackage",
        {
          id: rowId,
          strapBracelet: value,
        }
      );

      if (response?.data?.statusCode !== 200) {
        enqueueSnackbar("Failed to update shipping package", {
          variant: "error",
        });
        setBraceletISLoading(false);
        return;
      }

      enqueueSnackbar("Shipping package updated successfully", {
        variant: "success",
      });
      getShippingPackageDetailList();
      setBraceletISLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setBraceletISLoading(false);
    }
  };

  const handleAmountJPYChange = async (rowId: any, value: any) => {
    setAmountJpyID(rowId);
    setAmountJpyValue(value);
  };

  const handleAmountJpyApiUpdate = async (rowId: any) => {
    try {
      const response = await axios.post(
        "https://api-dev.mlawatches.com/api/admin/stock/updateItemInShippingPackage",
        {
          id: rowId,
          manualAmount: Number(amountJpyValue),
        }
      );

      if (response?.data?.statusCode !== 200) {
        enqueueSnackbar("Failed to update shipping package", {
          variant: "error",
        });
        return;
      }

      if (amountJpyValue) {
        enqueueSnackbar("Shipping package updated successfully", {
          variant: "success",
        });
      }
      setAmountJpyValue(null);
      getShippingPackageDetailList();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const [weightGramID, setWeightGramID] = useState("");
  const [weightValue, setWeightValue] = useState(null);

  const handleWeightGramChange = async (rowId: any, value: any) => {
    setWeightGramID(rowId);
    setWeightValue(value);
  };

  const handleWeightGramApiUpdate = async (rowId: any) => {
    try {
      const response = await axios.post(
        "https://api-dev.mlawatches.com/api/admin/stock/updateItemInShippingPackage",
        {
          id: rowId,
          weightGrams: Number(weightValue),
        }
      );

      if (response?.data?.statusCode !== 200) {
        enqueueSnackbar("Failed to update shipping package", {
          variant: "error",
        });
        return;
      }

      if (weightValue) {
        enqueueSnackbar("Shipping package updated successfully", {
          variant: "success",
        });
      }
      setWeightValue(null);
      getShippingPackageDetailList();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getRowBindingValue = (row: any, column: any, index: number) => {
    if (column?.id === "purchaseDate") {
      return row[column?.id]
        ? moment(row[column?.id]).format("DD-MMM-YYYY")
        : "";
    } else if (column?.id === "costUsd") {
      return formatter.format(row[column?.id] ?? 0);
    } else if (column?.id === "material" && column?.isMaterialDropdown) {
      // const value = materialSelections[row.id] || "";
      return (
        <div className="relative">
          <Select
            value={row?.material || ""}
            onChange={(e) => {
              handleMaterialChange(row?.id, e.target.value);
            }}
            variant="standard"
            displayEmpty
            sx={{ width: "100%" }}
          >
            <MenuItem value="">Select</MenuItem>
            {materialDropDown?.map((material) => {
              return (
                <MenuItem key={material} value={material}>
                  {material}
                </MenuItem>
              );
            })}
          </Select>
          {materialISLoading && row?.id == materialID && (
            <div className="absolute right-[20%] top-1/2 transform -translate-y-1/2">
              <CircularProgress size={18} />
            </div>
          )}
        </div>
      );
    } else if (column?.id === "bracelet" && column?.isBraceletDropdown) {
      // const value = materialSelections[row.id] || "";
      return (
        <div className="relative">
          <Select
            value={row?.strapBracelet || ""}
            onChange={(e) => {
              handleBraceletChange(row?.id, e.target.value);
            }}
            variant="standard"
            displayEmpty
            sx={{ width: "100%" }}
          >
            <MenuItem value="">Select</MenuItem>
            {braceletDropDownForShipCal?.map((bracelet) => {
              return (
                <MenuItem key={bracelet} value={bracelet}>
                  {bracelet}
                </MenuItem>
              );
            })}
          </Select>
          {braceletISLoading && row?.id == braceletID && (
            <div className="absolute right-[20%] top-1/2 transform -translate-y-1/2">
              <CircularProgress size={18} />
            </div>
          )}
        </div>
      );
    } else if (column?.id === "amount_jpy") {
      return (
        <div className="relative min-w-[150px]">
          <OutlinedInput
            value={
              row?.id === amountJpyID && amountJpyValue
                ? amountJpyValue
                : row?.manualAmount
            }
            onChange={(e) => {
              handleAmountJPYChange(row?.id, e.target.value);
            }}
            onBlur={() => {
              handleAmountJpyApiUpdate(row?.id);
            }}
            type="number"
            placeholder="Please enter amount"
          />
        </div>
      );
    } else if (column?.id === "weightGrams") {
      return (
        <div className="relative min-w-[150px]">
          <OutlinedInput
            value={
              row?.id === weightGramID && weightValue
                ? weightValue
                : row?.weightGrams
            }
            onChange={(e) => {
              handleWeightGramChange(row?.id, e.target.value);
            }}
            onBlur={() => {
              handleWeightGramApiUpdate(row?.id);
            }}
            type="number"
            placeholder="Please enter weight"
          />
        </div>
      );
    } else if (column?.id === "action") {
      return (
        <div className="flex items-center justify-center cursor-pointer">
          <FuseSvgIcon onClick={() => handleClickOpen(row)}>
            heroicons-outline:trash
          </FuseSvgIcon>
        </div>
      );
    } else {
      return row[column?.id] || "";
    }
  };

  const calculateTotals = () => {
    const totalQty = detailRows?.length;
    const totalCost = detailRows?.reduce(
      (sum, row) => sum + (row?.costUsd || 0),
      0
    );
    return { totalQty, totalCost };
  };

  const addStockByPackage = async () => {
    if (!formSetStockId) {
      enqueueSnackbar("Please enter stock ID", { variant: "error" });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/stock/addItemInShippingPackage`,
        {
          stockId: formSetStockId,
          packageId: location?.state?.row?.id,
        }
      );
      if (response?.data?.statusCode == 200) {
        enqueueSnackbar("Shipping package created successfully", {
          variant: "success",
        });
        getShippingPackageDetailList();
        setFormStockId("");
      } else {
        enqueueSnackbar("Failed to create shipping package", {
          variant: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.statusCode === 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar(
          error?.response?.data?.message || "Failed to create shipping package",
          {
            variant: "error",
          }
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div
        onClick={() => navigation(-1)}
        className="border border-black cursor-pointer rounded-28 px-16 py-5 flex items-center justify-between mt-[20px] ml-[20px] w-fit"
      >
        <FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
        <p className="text-2xl">Go Back</p>
      </div>
      <Box sx={{ height: "95vh", width: "100%" }}>
        <div>
          <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between pb-32 px-24 md:px-32">
            <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: "0px",
                boxShadow: "none",
              }}
            >
              <div className="w-full py-[20px] flex justify-end gap-[20px] items-center">
                <div className="text-[16px] font-500">
                  <span className="font-600">Ship From : </span>
                  {location?.state?.row?.fromLocation}
                </div>
                <div className="text-[16px] font-500">
                  <span className="font-600">Ship To : </span>
                  {location?.state?.row?.toLocation}
                </div>
                <TextField
                  className="w-full sm:w-[250px]"
                  id=""
                  label="Stock ID"
                  type="text"
                  variant="outlined"
                  required
                  value={formSetStockId}
                  onChange={(e) => setFormStockId(e.target.value)}
                />
                <Button
                  className="whitespace-nowrap  "
                  variant="contained"
                  color="secondary"
                  onClick={() => addStockByPackage()}
                >
                  <div className="px-[10px] flex items-center">
                    Add{" "}
                    {loading && (
                      <CircularProgress
                        size={16}
                        className="text-white ml-[8px]"
                      />
                    )}{" "}
                  </div>
                </Button>
              </div>
              <TableContainer sx={{ maxHeight: "100%" }}>
                <Table stickyHeader aria-label="sticky table" id="table-to-pdf">
                  <TableHead>
                    <TableRow>
                      {columns?.map((column) => (
                        <TableCell
                          sx={{
                            border: 1,
                            borderColor: "lightgray",
                            color: "black",
                            fontWeight: "600",
                            padding: "16px",
                            whiteSpace: "nowrap",
                          }}
                          key={column.id}
                          align={column.align}
                          className={column?.className ?? ""}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {detailRows?.map((row, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.orderId}
                      >
                        {columns?.map((column) => (
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "lightgray",
                              color: "black",
                              whiteSpace: "nowrap",
                            }}
                            key={column?.id}
                            align={column?.align}
                            className={column?.className ?? ""}
                          >
                            {getRowBindingValue(row, column, index)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    <TableRow
                      sx={{
                        backgroundColor: "#C0D8C1",
                        fontWeight: "bold",
                      }}
                    >
                      {columns?.map((column) => (
                        <TableCell
                          key={column?.id}
                          align={column?.align}
                          sx={{
                            border: 1,
                            borderColor: "lightgray",
                            color: "black",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {column?.id === "stockId"
                            ? `Qty: ${calculateTotals()?.totalQty}`
                            : column?.id === "costUsd"
                              ? formatter.format(calculateTotals()?.totalCost)
                              : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </Box>
      <ConfirmationDialog
        isDelete={true}
        title={"Delete Package Item"}
        open={open}
        handleDelete={handleDelete}
        handleClose={handleClose}
      />
    </div>
  );
}
