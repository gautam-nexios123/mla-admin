import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import moment from "moment";
import { currencyFormatter } from "src/utils/coreFunction";
import WatchHkToNYPdf from "./WatchHkToNYPdf";

const InvoiceHkToUs = ({ detailRows, setDetailRows }) => {
  const invoiceRef = useRef();
  const currentDate = new Date();

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.3,
      filename: "proforma-invoiceHKToUS.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();

    // setDetailRows([]); // Clear detailRows after download
  };

  const getSizeCategory = (amount: number): string => {
    if (amount < 15000) return "Small";
    if (amount < 30000) return "Medium";
    return "Large";
  };

  const getBraceletPrice = (type: string): number => {
    const normalized = type?.toLowerCase() ?? "";
    if (normalized.includes("bracelet for new")) return 30;
    if (normalized.includes("bracelet for po")) return 15;
    if (normalized.includes("strap(rubber/leather/fabric)")) return 0;
    return 0;
  };

  const materialGroupMap: Record<string, string> = {
    RG: "Rose Gold",
    BZ: "Rose Gold",
    WG: "White Gold",
    SS: "White Gold",
    PL: "White Gold",
    CE: "White Gold",
    CF: "White Gold",
    TI: "White Gold",
    "SS/PL": "White Gold",
    "SS/WG": "White Gold",
    YG: "Yellow Gold",
    "SS/RG": "White/Rose Gold",
    "WG/RG": "White/Rose Gold",
    "SS/YG": "White/Yellow Gold",
  };

  const groupAndCalculate = (data: any[]) => {
    const result: Record<string, any> = {};

    // Step 1: Normalize strap variations per material
    const materialStrapMap: Record<string, Set<string>> = {};
    data?.forEach((item) => {
      const material = item.material ?? "Unknown";
      const strap = item.strapBracelet ?? "NoStrap";
      if (!materialStrapMap[material]) {
        materialStrapMap[material] = new Set();
      }
      materialStrapMap[material].add(strap);
    });

    // Step 2: Main grouping
    data?.forEach((item) => {
      const qty = parseInt(item.qty || "0");
      if (isNaN(qty) || qty === 0) return;

      const material = item.material ?? "Unknown";
      const strapBracelet = item.strapBracelet ?? "NoStrap";
      const amount = item.amountConverted ?? 0;
      const size = getSizeCategory(amount);

      const materialGroup = materialGroupMap[material] || "Unknown Material";
      const unitPrice = amount / qty;
      const movement = unitPrice * 0.8;
      const bracelet = getBraceletPrice(strapBracelet);
      const casePrice = unitPrice - movement - bracelet;

      // 3-Level Group Key
      const groupKey = `${materialGroup}__${strapBracelet}__${size}`;

      const description = `${materialGroup} Watch ${size} Size`;

      if (!result[groupKey]) {
        result[groupKey] = {
          material,
          materialGroup,
          strapBracelet,
          size,
          description,
          qty: 0,
          bracelet: 0,
          unitPrice: 0,
          movement: 0,
          case: 0,
          totalValue: 0,
        };
      }

      result[groupKey].qty += qty;
      result[groupKey].bracelet = bracelet;
      result[groupKey].unitPrice += unitPrice * qty;
      result[groupKey].movement += movement * qty;
      result[groupKey].case += casePrice * qty;
      result[groupKey].totalValue += amount;
    });

    // Step 3: Final formatting
    return Object.values(result).map((entry: any) => {
      const avgUnitPrice = entry.unitPrice / entry.qty;
      const bracelet = entry.bracelet;
      const casePrice = avgUnitPrice - avgUnitPrice * 0.8 - bracelet;

      return {
        material: entry.material,
        materialGroup: entry.materialGroup,
        strapBracelet: entry.strapBracelet,
        size: entry.size,
        description: entry.description,
        qty: entry.qty,
        bracelet: parseFloat(bracelet.toFixed(2)),
        unitPrice: parseFloat(avgUnitPrice.toFixed(2)),
        movement: parseFloat((avgUnitPrice * 0.8).toFixed(2)),
        case: parseFloat(casePrice.toFixed(2)),
        totalValue: parseFloat(entry.totalValue.toFixed(2)),
      };
    });
  };

  const groupedData = groupAndCalculate(detailRows || [])?.sort(
    (a, b) => a?.bracelet - b?.bracelet
  );
  console.log("groupedData: ", groupedData);

  const totals = groupedData?.reduce(
    (acc, item) => {
      acc.totalQty += Number(item?.qty); // convert string to number
      acc.totalAmountConverted += Number(item?.totalValue); // ensure number
      return acc;
    },
    { totalQty: 0, totalAmountConverted: 0 }
  );

  useEffect(() => {
    if (groupedData?.length > 0) {
      setTimeout(() => {
        handleDownload();
      }, 250);
    }
  }, [groupedData?.length]);

  return (
    <div>
      <div className="hidden">
        <div
          ref={invoiceRef}
          style={{
            fontFamily: "Times New Roman, serif",
            backgroundColor: "#fff",
            color: "#000",
            maxWidth: "900px",
            margin: "auto",
            padding: "20px",
            fontSize: "11px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "220px",
                position: "relative",
                // textAlign: "center",
              }}
            >
              <img
                src="/assets/images/logo/mla.svg"
                alt="MLAJ Logo"
                style={{ width: "180px" }}
              />

              <div
                className="pl-[18px]"
                style={{ fontSize: "12px", fontWeight: "600" }}
              >
                MLA 貿易有限公司
              </div>
              <div className="pl-[18px]" style={{ fontSize: "12px" }}>
                MLA Trading Company Limited
              </div>
              <div className="mt-[15px] pl-[18px]" style={{ fontSize: "12px" }}>
                6B Gold Swan Commercial Building,
                <br />
                438-444 Hennessy Road,Causeway Bay,
                <br />
                Hong Kong
                <br />
                Phone +852 3996 9162
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "12px" }}>
              <div>
                <span style={{ marginRight: "5px" }}>Date:</span>
                <span>{moment(currentDate).format("DD-MMM-YY")}</span>
              </div>
            </div>
          </div>

          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "24px",
            }}
          >
            PROFORMA INVOICE
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div style={{ width: "45%" }}>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  paddingBottom: "8px",
                }}
              >
                Bill To:
              </p>
              <div
                style={{
                  border: "1px solid black",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  paddingBottom: "10px",
                }}
              >
                MLA USA LLC
                <br />
                581 5TH AVENUE, 6TH FLOOR,
                <br />
                NEW YORK, NY 10017,
                <br />
                USA,
                <br />
                Phone (212) 391-1000
              </div>
            </div>
            <div style={{ width: "45%" }}>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  paddingBottom: "8px",
                }}
              >
                Ship To:
              </p>
              <div
                style={{
                  border: "1px solid black",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  paddingBottom: "10px",
                }}
              >
                MLA USA LLC
                <br />
                581 5TH AVENUE, 6TH FLOOR
                <br />
                NEW YORK, NY 10017
                <br />
                USA
                <br />
                Phone (212) 391-1000
              </div>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Movement <br /> HTS:9101215010
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Case (including case back) <br /> HTS:9101215020
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Bracelet <br /> HTS:9101213000
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Unit <br /> Price
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Total <br /> Value
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedData?.map((item, i) => (
                <tr key={i}>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {item?.description || "-"}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {item?.qty || "-"}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {/* ${item?.movement?.toLocaleString("en-IN") || "-"} */}
                    {currencyFormatter.format(item?.movement)}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {/* ${item?.case?.toLocaleString("en-IN") || "-"} */}
                    {currencyFormatter.format(item?.case)}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {/* ${item?.bracelet} */}
                    {currencyFormatter.format(item?.bracelet)}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {/* ${item?.unitPrice?.toLocaleString("en-IN") || "-"} */}
                    {currencyFormatter.format(item?.unitPrice)}
                  </td>
                  <td
                    key={i}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {/* ${item?.totalValue?.toLocaleString("en-IN") || "-"} */}
                    {currencyFormatter.format(item?.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={1}
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  TOTAL pcs
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  {totals.totalQty}
                </td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}></td>
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  Total Value
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  {/* $ */}
                  {/* {totals?.totalAmountConverted?.toLocaleString("en-IN") || "-"} */}
                  {currencyFormatter.format(totals?.totalAmountConverted)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {detailRows?.length > 0 && groupedData?.length > 0 && (
          <WatchHkToNYPdf watches={detailRows} setDetailRows={setDetailRows} />
        )}
      </div>
    </div>
  );
};

export default InvoiceHkToUs;
