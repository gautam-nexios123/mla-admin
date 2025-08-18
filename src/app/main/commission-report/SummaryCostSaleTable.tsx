import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatter } from "src/utils/coreFunction";
import useWindowHeight from "src/utils/useWindowHeight ";

const SummaryCostSaleTable = ({ commissionData }) => {
  const height = useWindowHeight();

  const columnsCommisssion = [
    { id: "commission_field", label: "Commission Field", minWidth: 170 },
    { id: "value", label: "", minWidth: 170 },
  ];

  const rowCommissionData = [
    {
      id: "commission_buy",
      label: "Commission (BUY)",
      value: `${commissionData?.commissionConfig?.commission_buy?.toFixed(2)}%`,
      minWidth: 170,
    },
    {
      id: "commission_sale",
      label: "Commission (SALE)",
      value: `${commissionData?.commissionConfig?.commission_sale?.toFixed(2)}%`,
      minWidth: 170,
    },
    {
      id: "commission_net_profit",
      label: "Commission (Net Profit)",
      value: `${commissionData?.commissionConfig?.commission_netprofit?.toFixed(2)}%`,
      minWidth: 170,
    },
    {
      id: "commission_senirioty",
      label: "Commission (Senirioty)",
      value: `${commissionData?.commissionConfig?.commission_seniority?.toFixed(2)}%`,
      minWidth: 170,
    },
    {
      id: "weekly_deduction",
      label: "Weekly Deduction",
      value: `${commissionData?.commissionConfig?.weekly_deduction?.toFixed(2)}%`,
      minWidth: 170,
    },
  ];
  const columnsCommisssionUSD = [
    { id: "commission_field", label: "Commission Field", minWidth: 170 },
    { id: "value", label: "", minWidth: 170 },
  ];

  const rowCommissionUSDData = [
    {
      id: "buy_commission",
      label: "Buy Commission (USD)",
      value: `${formatter.format(commissionData?.buyCommission?.toFixed(2))}`,
      minWidth: 170,
    },
    {
      id: "sale_commission",
      label: "Sale Commission (USD)",
      value: `${formatter.format(commissionData?.sellCommission?.toFixed(2))}`,
      minWidth: 170,
    },
    {
      id: "net_profit_commission",
      label: "Net Profit Commission (USD)",
      value: `${formatter.format(commissionData?.netProfitCommission?.toFixed(2))}`,
      minWidth: 170,
    },
    {
      id: "total_payable_commission",
      label: "Total Payable Commission (USD)",
      value: `${formatter.format(commissionData?.totalPayableCommission?.toFixed(2))}`,
      minWidth: 170,
    },
    {
      id: "number_staff",
      label: "Number of Staffs",
      value: commissionData?.staffCount,
      minWidth: 170,
    },
    {
      id: "max_payable_commission_per_staff",
      label: "Max Payable Commission per Staff (USD)",
      value: `${formatter.format(commissionData?.maxPayableCommissionPerStaff)}`,
      minWidth: 170,
    },
  ];

  return (
    <div>
      <Paper className="bg-white w-full rounded-[6px] shadow-lg border p-[12px] flex flex-col mt-[25px]">
        {/* <h2 className="text-black font-semibold text-[20px]  p-[10px]">
          Commission Sale and Cost
        </h2> */}
        <TableContainer sx={{ maxHeight: `${height - 250}px` }}>
          <Table stickyHeader aria-label="customer by country table">
            <TableHead>
              <TableRow>
                {columnsCommisssion?.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowCommissionData?.map((item, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    className="border"
                  >
                    <TableCell
                      className="flex items-center"
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.label}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.value}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className="my-[20px] w-full overflow-x-auto">
        <table className="w-full text-center shadow-3">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="border px-[25px] py-[12px]" rowSpan={2}></th>
              <th className="border px-[25px] py-[12px]" rowSpan={2}></th>
              <th className="border px-[25px] py-[12px]" rowSpan={2}></th>
              <th className="border px-[25px] py-[12px]" colSpan={2}>
                NY (NYC)
              </th>
              <th className="border px-[25px] py-[12px]" colSpan={2}>
                HK
              </th>
              <th className="border px-[25px] py-[12px]" colSpan={2}>
                BKK (BKK)
              </th>
              <th className="border px-[25px] py-[12px]" colSpan={2}>
                TK (JAPAN)
              </th>
            </tr>
            <tr className="bg-[#F1F5F9]">
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
              <th className="border px-[25px] py-[10px]"></th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr className="bg-white">
              <td className="border px-[25px] py-[12px] text-left">
                Total cost (USD)
              </td>
              <td className="border px-[25px] py-[12px] text-left">
                {formatter.format(commissionData?.totalCostPrice)}
              </td>
              <th className="border px-[25px] py-[12px] text-left">
                Cost from (USD)
              </th>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.nyOfficeData?.totalCostPrice)}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.nyOfficeData?.costFromPer?.toFixed(2)}
                {commissionData?.nyOfficeData?.costFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.HKOfficeData?.totalCostPrice)}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.HKOfficeData?.costFromPer?.toFixed(2)}
                {commissionData?.HKOfficeData?.costFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.BKOfficeData?.totalCostPrice)}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.BKOfficeData?.costFromPer?.toFixed(2)}
                {commissionData?.BKOfficeData?.costFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.TKOfficeData?.totalCostPrice)}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.TKOfficeData?.costFromPer?.toFixed(2)}
                {commissionData?.TKOfficeData?.costFromPer === null ? "0%" : ""}
              </td>
            </tr>
            {/* Row 2 */}
            <tr className="bg-white">
              <td className="border px-[25px] py-[12px] text-left">
                Total sale (USD)
              </td>
              <td className="border px-[25px] py-[12px] text-left">
                {formatter.format(commissionData?.totalSalesPrice)}
              </td>
              <th className="border px-[25px] py-[12px] text-left">
                Sale from (USD)
              </th>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(
                  commissionData?.nyOfficeData?.totalSalesPrice
                )}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.nyOfficeData?.saleFromPer?.toFixed(2)}
                {commissionData?.nyOfficeData?.saleFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(
                  commissionData?.HKOfficeData?.totalSalesPrice
                )}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.HKOfficeData?.saleFromPer?.toFixed(2)}
                {commissionData?.HKOfficeData?.saleFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(
                  commissionData?.BKOfficeData?.totalSalesPrice
                )}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.BKOfficeData?.saleFromPer?.toFixed(2)}
                {commissionData?.BKOfficeData?.saleFromPer === null ? "0%" : ""}
              </td>
              <td className="border px-[25px] py-[12px]">
                {formatter.format(
                  commissionData?.TKOfficeData?.totalSalesPrice
                )}
              </td>
              <td className="border px-[25px] py-[12px]">
                {commissionData?.TKOfficeData?.saleFromPer?.toFixed(2)}
                {commissionData?.TKOfficeData?.saleFromPer === null ? "0%" : ""}
              </td>
            </tr>
            {/* Row 3 */}
            <tr className="bg-white">
              <td className="border px-[25px] py-[12px] text-left">
                Total net profit (USD)
              </td>
              <td className="border px-[25px] py-[12px] text-left">
                {formatter.format(commissionData?.netProfit)}
              </td>
              <th className="border px-[25px] py-[12px] text-left"></th>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
              <td className="border px-[25px] py-[12px]"></td>
            </tr>
            {/* Row 4 */}
            <tr className="bg-white">
              <td className="border px-[25px] py-[12px] text-left font-bold">
                Total net profit after commission (USD)
              </td>
              <td className="border px-[25px] py-[12px] text-left">
                {formatter.format(
                  commissionData?.totalNetProfitAfterCommission
                )}
              </td>
              <th className="border px-[25px] py-[12px] text-left">Combined</th>
              <th className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.nyOfficeData?.combinedTotal)}
              </th>
              <th className="border px-[25px] py-[12px]">
                {commissionData?.nyOfficeData?.combinedPer?.toFixed(2)}
                {commissionData?.nyOfficeData?.combinedPer === null ? "0%" : ""}
              </th>
              <th className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.HKOfficeData?.combinedTotal)}
              </th>
              <th className="border px-[25px] py-[12px]">
                {commissionData?.HKOfficeData?.combinedPer?.toFixed(2)}
                {commissionData?.HKOfficeData?.combinedPer === null ? "0%" : ""}
              </th>
              <th className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.BKOfficeData?.combinedTotal)}
              </th>
              <th className="border px-[25px] py-[12px]">
                {commissionData?.BKOfficeData?.combinedPer?.toFixed(2)}
                {commissionData?.BKOfficeData?.combinedPer === null ? "0%" : ""}
              </th>
              <th className="border px-[25px] py-[12px]">
                {formatter.format(commissionData?.TKOfficeData?.combinedTotal)}
              </th>
              <th className="border px-[25px] py-[12px]">
                {commissionData?.TKOfficeData?.combinedPer?.toFixed(2)}
                {commissionData?.TKOfficeData?.combinedPer === null ? "0%" : ""}
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <Paper className="bg-white w-full rounded-[6px] shadow-lg border p-[12px] flex flex-col my-[25px]">
        {/* <h2 className="text-black font-semibold text-[20px]  p-[10px]">
          Commission Sale and Cost
        </h2> */}
        <TableContainer sx={{ maxHeight: `${height - 250}px` }}>
          <Table stickyHeader aria-label="customer by country table">
            <TableHead>
              <TableRow>
                {columnsCommisssionUSD?.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowCommissionUSDData?.map((item, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    className="border"
                  >
                    <TableCell
                      className="flex items-center"
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.label}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "10px",
                      }}
                    >
                      {item?.value}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default SummaryCostSaleTable;
