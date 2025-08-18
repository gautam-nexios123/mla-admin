import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import moment from "moment";
import { yenFormatter } from "src/utils/coreFunction";

const ProformaInvoice = ({ detailRows, setDetailRows }) => {
  const invoiceRef = useRef();
  const currentDate = new Date();

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.3,
      filename: "proforma-invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();

    setDetailRows([]); // Clear detailRows after download
  };

  const totals = detailRows?.reduce(
    (acc, item) => {
      acc.totalQty += Number(item?.qty); // convert string to number
      acc.totalAmountConverted += Number(item?.manualAmount); // ensure number
      return acc;
    },
    { totalQty: 0, totalAmountConverted: 0 }
  );

  useEffect(() => {
    if (detailRows?.length > 0) {
      setTimeout(() => {
        handleDownload();
      }, 250);
    }
  }, [detailRows?.length]);

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
                width: "120px",
                position: "relative",
                textAlign: "center",
              }}
            >
              <img
                src="/assets/images/logo/mla.svg"
                alt="MLAJ Logo"
                style={{ width: "100%" }}
              />

              <div style={{ fontSize: "10px", fontWeight: "600" }}>
                MLAJ 合同会社
              </div>
              <div style={{ fontSize: "10px" }}>MLAJ GK</div>
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
                Shipper :
              </p>
              <div
                style={{
                  border: "1px solid black",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  paddingBottom: "10px",
                }}
              >
                MLAJ GK
                <br />
                3F New Ginza Building,
                <br />
                3-11-1 Ginza, Chuo-ku,
                <br />
                Tokyo 〒 104-0061,
                <br />
                Japan
                <br />
                Phone +81-3-4362-5425
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
                Consignee :
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
                6B Gold Swan Commercial Building
                <br />
                438-444 Hennessy Road,
                <br />
                Causeway Bay
                <br />
                Hong Kong
                <br />
                Phone +852 3996 9162
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
                {[
                  "Auction",
                  "Box",
                  "No.",
                  "Watch Brand",
                  "Model no.",
                  "Serial no.",
                  "Qty",
                  "Material",
                  "Catagories",
                  "Amount (JPY)",
                  "Origin",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      paddingBottom: "14px",
                      textAlign: "center",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailRows?.map((item, i) => (
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
                    {item?.auction || "-"}
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
                    {item?.box || "-"}
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
                    {item?.lot || "-"}
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
                    {item?.model || "-"}
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
                    {item?.material || "-"}
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
                    {item?.categories || "-"}
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
                    {yenFormatter.format(item?.manualAmount)}
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
                    {item?.origin || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={6}
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  TOTAL
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
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "4px",
                    paddingBottom: "14px",
                  }}
                >
                  {yenFormatter.format(totals?.totalAmountConverted)}
                  {/* ¥{totals?.totalAmountConverted?.toLocaleString("en-IN")} */}
                </td>
                <td style={{ border: "1px solid black" }}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoice;
