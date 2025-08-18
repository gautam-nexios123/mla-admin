import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import moment from "moment";
import { currencyFormatter } from "src/utils/coreFunction";

const InvoiceTHToHK = ({ detailRows, setDetailRows }) => {
  const invoiceRef = useRef();
  const currentDate = new Date();

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.3,
      filename: "proforma-invoiceTHToHK.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();

    setDetailRows([]); // Clear detailRows after download
  };

  const getWatchCaseMaterial = {
    RG: "R. Gold Watch",
    BZ: "R. Gold Watch",
    WG: "W.Gold Watch",
    SS: "W.Gold Watch",
    PL: "W.Gold Watch",
    CE: "W.Gold Watch",
    CF: "W.Gold Watch",
    TI: "W.Gold Watch",
    "SS/PL": "W.Gold Watch",
    "SS/WG": "W.Gold Watch",
    YG: "Y.Gold Watch",
    "SS/RG": "W.R.Gold Watch",
    "WG/RG": "W.R.Gold Watch",
    "SS/YG": "W.Y.Gold Watch",
  };

  const getBraceletTypeByValue = {
    "Strap(Rubber/Leather/Fabric)": 0,
    "Bracelet for PO": 900,
    "Bracelet for NEW": 1800,
  };

  function getSizeCategory(thbValue: number): string {
    if (thbValue < 500000) return "Small Size";
    if (thbValue >= 500000 && thbValue < 1000000) return "Medium Size";
    return "Large Size"; // thbValue >= 1000000
  }

  const groupAndCalculate = (data: any[]) => {
    // Step 3: Final formatting
    return data?.map((entry: any) => {
      const bracelet = getBraceletTypeByValue[entry?.strapBracelet];
      const casePrice =
        entry?.manualAmount - entry?.manualAmount * 0.8 - bracelet;

      return {
        brand: entry?.brand,
        serialNo: entry?.serialNo,
        weightGrams: entry?.weightGrams,
        material: entry?.material,
        strapBracelet: entry?.strapBracelet,
        description:
          getWatchCaseMaterial[entry?.material] +
          " " +
          getSizeCategory(entry?.manualAmount),
        qty: entry?.qty,
        bracelet: getBraceletTypeByValue[entry?.strapBracelet],
        unitPrice: parseFloat(entry?.manualAmount.toFixed(2)),
        movement: parseFloat((entry?.manualAmount * 0.8).toFixed(2)),
        case: parseFloat(casePrice.toFixed(2)),
        totalValue: parseFloat(entry?.manualAmount.toFixed(2)),
      };
    });
  };

  const groupedData = groupAndCalculate(detailRows || []);

  const totals = groupedData?.reduce(
    (acc, item) => {
      acc.totalQty += Number(item?.qty); // convert string to number
      acc.totalAmountConverted += Number(item?.totalValue); // ensure number
      acc.toatalWeightGrams += Number(item?.weightGrams); // ensure number
      return acc;
    },
    { totalQty: 0, totalAmountConverted: 0, toatalWeightGrams: 0 }
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
                บริษัท เอ็มแอลเอ ไทย จำกัด
              </div>
              <div className="pl-[18px]" style={{ fontSize: "12px" }}>
                MLA THAI CO., LTD.
              </div>
              <div className="mt-[15px] pl-[18px]" style={{ fontSize: "12px" }}>
                Unit 707/3, 7th Floor, Athenee Tower,
                <br />
                63 Wireless Road (Witthayu), Lumphini Pathumwan,
                <br />
                Bangkok 10330 Thailand
                <br />
                Tel: +66 61 023 3701
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "12px" }}>
              <div>
                <span style={{ marginRight: "5px" }}>Date:</span>
                <span>{moment(currentDate).format("DD-MMM-YY")}</span>
              </div>
              <div>
                Invoice no:{" "}
                <span className="text-red font-700">
                  {Math.floor(1000 + Math.random() * 9000)}
                </span>
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
                MLA Trading Co., Ltd.
                <br />
                6B Gold Swan Commercial Building,
                <br />
                438-444 Hennessy Road,
                <br />
                Causeway Bay, Hong Kong,
                <br />
                Phone (852) 3996 9162
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
                  Brand
                </th>
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
                  Serial no
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    paddingBottom: "14px",
                    textAlign: "center",
                  }}
                >
                  Weight <br /> (grams)
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
                  Total <br /> (THB)
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedData?.map((item: any, i) => (
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
                    {item?.brand || "-"}
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
                    {item?.serialNo || "-"}
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
                    {item?.weightGrams || "-"}
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
                    {item?.movement?.toLocaleString("en-IN") || "-"}
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
                    {item?.case?.toLocaleString("en-IN") || "-"}
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
                    {item?.bracelet}
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
                    {item?.unitPrice?.toLocaleString("en-IN") || "-"}
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
                    {item?.totalValue?.toLocaleString("en-IN") || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}></td>
                <td style={{ border: "1px solid black" }}></td>
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
                  {totals?.toatalWeightGrams}
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
                  Total Value THB
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
                  {totals?.totalAmountConverted?.toLocaleString("en-IN") || "-"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTHToHK;
