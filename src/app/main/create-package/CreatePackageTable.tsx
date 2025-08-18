import * as React from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { CardContent, TextField, Button } from "@mui/material";
import { formatter } from "src/utils/coreFunction";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { HandleDownload } from "./XlsxDownload";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useSnackbar } from "notistack";
import ConfirmationDialog from "app/shared-components/ConfirmationDialog";
import TableComponent from "./TableComponent";

export default function CreatePackageTable() {
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, getValues, reset } = useForm({
    mode: "onSubmit",
  });

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [stockId, setstockId] = React.useState([
    ...(JSON.parse(localStorage.getItem("stockIdList")) ?? []),
  ]);

  const [total, setTotal] = React.useState({
    totalDiscount: 0,
    totalWholeSale: 0,
    totalDiscountedWholeSale: 0,
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    const value = getValues();
    if (stockId.filter((item) => item === value.StockId).length === 0) {
      localStorage.setItem(
        "stockIdList",
        JSON.stringify([...stockId, value.StockId])
      );
      setstockId((prevStockId) => [...prevStockId, value.StockId]);
    }
    reset({ StockId: "" });
  };

  const getListValue = () => {
    setLoading(true);
    const response = axios.post(
      `https://api-dev.mlawatches.com/api/admin/order/calculate-package`,
      {
        params: {
          stockId,
        },
      }
    );
    response
      .then(
        (res: AxiosResponse<any>) => {
          if (res?.data?.results) {
            setRows(
              res?.data?.results?.saleItems.map((item, i) => ({
                ...item,
                id: i,
              }))
            );
            setTotal({
              totalDiscount: res?.data?.results.discount,
              totalWholeSale: res?.data?.results.price,
              totalDiscountedWholeSale: res?.data?.results.net_amount,
            });
            setLoading(false);
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          if (axiosError.response.status == 403) {
            enqueueSnackbar(
              "Unauthorized access. You don't have permission to view or edit this content.",
              { variant: "error" }
            );
            setLoading(false);
          } else {
            enqueueSnackbar("Failed to save package. Please try again.", {
              variant: "error",
            });
            setLoading(false);
          }
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  // const handlePDFDownload = async () => {
  //   const element = document.getElementById("hidden-table-to-pdf");
  //   if (element) {
  //     const canvas = await html2canvas(element);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //     const today = new Date();
  //     const date = today.toISOString().split("T")[0];
  //     pdf.save(`package-${date}.pdf`);
  //   }
  // };

  const handlePDFDownload = async () => {
    const element = document.getElementById("hidden-table-to-pdf");
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait", // Change to "landscape" if needed
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Page break logic
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if necessary
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date();
      const date = today.toISOString().split("T")[0];
      pdf.save(`package-${date}.pdf`);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/order/save-calculated-package`,
        {
          params: {
            stockId,
          },
        }
      );
      if (response.status == 200) {
        enqueueSnackbar("Package saved successfully!", { variant: "success" });
        handleClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response.status == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to save package. Please try again.", {
          variant: "error",
        });
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    stockId.length ? getListValue() : setRows([]);
  }, [stockId]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  const columns = [
    { id: "stockId", label: "Stock", align: "center", isValue: false },
    { id: "status", label: "Status", align: "center", isValue: false },
    { id: "brand", label: "Brand", align: "center", isValue: false },
    { id: "model", label: "Model", align: "center", isValue: false },
    { id: "serial_no", label: "Serial No.", align: "center", isValue: false },
    { id: "paper", label: "Paper", align: "center", isValue: false },
    {
      id: "paper_date",
      label: "Paper Date",
      align: "center",
      isValue: false,
      isDate: true,
    },
    { id: "box", label: "Box", align: "center", isValue: false },
    {
      id: "price",
      label: "Wholesale Price (USD)",
      className: "w-[115px]",
      align: "center",
      isValue: true,
    },
    {
      id: "netAmount",
      label: "Discounted Wholesale Price",
      className: "w-[115px]",
      align: "center",
      isValue: true,
    },
    { id: "discount", label: "Saving", align: "center", isValue: true },
    {
      id: "action",
      label: "Action",
      align: "center",
      isValue: false,
      className: "action-cell",
    },
    {
      id: "location",
      label: "Location",
      align: "center",
      isValue: false,
      className: "action-cell",
    },
    {
      id: "net_cost_usd",
      label: "Cost",
      align: "center",
      isValue: true,
      className: "action-cell",
    },
    {
      id: "profit",
      label: "Profit",
      align: "center",
      isValue: true,
      className: "action-cell",
    },
  ];
  const columns2 = [
    {
      id: "total",
      label: "Total Qty",
      align: "center",
    },
    {
      id: "price",
      label: "Total Wholesale Price (USD)",
      align: "center",
      isValue: true,
    },
    {
      id: "netAmount",
      label: "Discounted Wholesale Price (USD)",
      align: "center",
      isValue: true,
    },
    {
      id: "discount",
      label: "Total Savings (USD)",
      align: "center",
      isValue: true,
    },
  ];

  return (
    <Box sx={{ height: "95vh", width: "100%", backgroundColor: "white" }}>
      <div className="flex flex-col justify-between items-center gap-6 p-10 sm:flex-row">
        <form
          className="flex items-center gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="StockId"
            control={control || ""}
            render={({ field }) => (
              <TextField
                {...field}
                className="w-full"
                id="model"
                label="Insert StockId"
                autoFocus
                type="text"
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Calculate
          </Button>
        </form>
        <div className="flex justify-end gap-6 pr-32">
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              HandleDownload(
                rows.map((data) => ({
                  Stock: data.stockId,
                  Status: data.status,
                  Brand: data.brand,
                  Model: data.model,
                  "Serial No.": data.serial_no,
                  Paper: data.paper,
                  "Paper Date": data.paper_date
                    ? moment(data.paper_date).format("DD-MMM-YYYY")
                    : "",
                  Box: data.box,
                  "Wholesale Price (USD)": formatter.format(data.price),
                  "Discounted Wholesale Price": formatter.format(
                    data.netAmount
                  ),
                  Saving: formatter.format(data.discount),
                  Location: data.location,
                  Cost: formatter.format(data.cost),
                  Profit: formatter.format(data.profit),
                }))
              )
            }
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePDFDownload}
          >
            PDF
          </Button>
        </div>
      </div>
      <div
        className={rows.length > 0 ? `h-auto overflow-y-scroll` : `h-[400px]`}
        style={{ overflowY: "auto" }}
      >
        <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "0px",
              boxShadow: "none",
            }}
          >
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table" id="table-to-pdf">
                <TableHead>
                  <TableRow>
                    <TableCell className="bg-white" colSpan={7} />
                    {columns2.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          border: 1,
                          borderColor: "lightgray",
                          color: "black",
                          fontWeight: "600",
                          padding: "0px",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    {
                      id: 1,
                      total: rows.length,
                      price: total.totalWholeSale ?? 0,
                      netAmount: total.totalDiscountedWholeSale ?? 0,
                      discount: total.totalDiscount ?? 0,
                    },
                  ]?.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell className="bg-white" colSpan={7} />
                      {columns2.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            border: 1,
                            borderColor: "lightgray",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {column?.isValue
                            ? formatter.format(row[column.id])
                            : row[column.id] || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        sx={{
                          border: 1,
                          borderColor: "lightgray",
                          color: "black",
                          fontWeight: "600",
                          padding: "3px",
                        }}
                        key={column.id}
                        align={column.align}
                        className={column.className ?? ""}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.orderId}
                    >
                      {columns.map((column) => (
                        <TableCell
                          sx={{
                            border: 1,
                            borderColor: "lightgray",
                            color: "black",
                          }}
                          key={column.id}
                          align={column.align}
                          className={column.className ?? ""}
                        >
                          {column.id === "action" ? (
                            <FuseSvgIcon
                              onClick={() => {
                                localStorage.setItem(
                                  "stockIdList",
                                  JSON.stringify([
                                    ...stockId.filter(
                                      (item) => item !== row["stockId"]
                                    ),
                                  ])
                                );
                                setstockId((prevStockId) =>
                                  prevStockId.filter(
                                    (item) => item !== row["stockId"]
                                  )
                                );
                              }}
                            >
                              heroicons-outline:trash
                            </FuseSvgIcon>
                          ) : column?.isDate ? (
                            row[column.id] ? (
                              moment(row[column.id]).format("DD-MMM-YYYY")
                            ) : (
                              ""
                            )
                          ) : column?.isValue ? (
                            formatter.format(row[column.id] ?? 0)
                          ) : (
                            row[column.id] || ""
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <div
          id="hidden-table-to-pdf"
          className="absolute left-[-9999px] top-0 z-[-5]"
        >
          <TableComponent rows={rows} total={total} />
        </div>
      </div>
      <ConfirmationDialog
        isDelete={false}
        title={"Save Packages"}
        open={open}
        handleDelete={handleSave}
        handleClose={handleClose}
      />
    </Box>
  );
}
