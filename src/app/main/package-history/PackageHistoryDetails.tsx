import * as React from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import { formatter } from "src/utils/coreFunction";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLocation, useNavigate } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon"

export default function PackageHistoryDetails() {
  const location = useLocation();
  const navigation = useNavigate();
  const rows = location.state?.row;

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
      id: "location",
      label: "Location",
      align: "center",
      isValue: false,
      className: "action-cell",
    },
    {
      id: "cost",
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
    <div  className="bg-white">
      <div
        onClick={() => navigation(-1)}
        className="border border-black cursor-pointer rounded-28 px-16 py-5 flex items-center justify-between mt-[20px] ml-[20px] w-fit"
      >
        <FuseSvgIcon >heroicons-outline:arrow-left</FuseSvgIcon>
        <p className="text-2xl">Go Back</p>
      </div>
      <Box sx={{ height: "95vh", width: "100%" }}>
        <div>
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
                        total: rows?.quantity ?? 0,
                        price: rows.price ?? 0,
                        netAmount: rows.net_amount ?? 0,
                        discount: rows.discount ?? 0,
                      },
                    ]?.map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
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
                    {rows.saleItems?.map((row) => (
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
                            {column?.isDate
                              ? row[column.id]
                                ? moment(row[column.id]).format("DD-MMM-YYYY")
                                : ""
                              : column?.isValue
                                ? formatter.format(row[column.id] ?? 0)
                                : row[column.id] || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </Box>
    </div>
  );
}
