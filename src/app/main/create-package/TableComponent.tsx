import React from "react";
import { formatter } from "src/utils/coreFunction";
import moment from "moment";

const TableComponent = ({ rows, total }) => {
  const styles = {
    container: {
      padding: "40px",
      marginTop: "40px",
    },
    tables: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      marginBottom: "20px",
      padding: "20px",
    },
    th1: {
      border: "1px solid #000",
      borderTop: "2px solid #000",
      paddingBottom: "15px",
      textAlign: "center",
      backgroundColor: "#f2f2f2",
      fontWeight: "bold",
      fontSize: "25px",
    },
    td: {
      border: "1px solid #000",
      paddingBottom: "15px",
      textAlign: "center",
      verticalAlign: "top",
      color: "#000",
      fontWeight: "500",
      fontSize: "23px",
    },
    td2: {
      border: "1px solid #000",
      borderBottom: "2px solid #000",
      paddingBottom: "15px",
      textAlign: "center",
      verticalAlign: "top",
      color: "#000",
      fontWeight: "500",
      fontSize: "23px",
    },
    td1: {
      padding: "8px",
      textAlign: "center",
    },
    evenRow: {
      backgroundColor: "#f9f9f9",
    },
    logoImage: {
      width: "330px",
      textAlign: "center",
    },
    title: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      marginBottom: "35px",
    },
    subTitle: {
      color: "#000",
      textAlign: "center",
      margin: "auto",
      fontSize: "35px",
    },
    lastRow: {
      borderBottom: "2px solid #000",
    },
    live: {
      fontSize: "38px",
    },
  };
  return (
    <div>
      <div style={styles.title}>
        <img style={styles.logoImage} src="assets/images/logo/mla.svg" />
        <h1 style={styles.live}>Live Wholesale</h1>
      </div>
      <h3 style={{ ...styles.subTitle, marginBottom: "2px" }}>
        Discounted package (Created on{" "}
        {moment(new Date()).format("DD-MMM-YYYY")})
      </h3>
      <h3 style={{ ...styles.subTitle, marginBottom: "50px" }}>
        The following package is valid for one day only
      </h3>

      <div style={styles.container}>
        <div style={styles.tables}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th colSpan="7"></th>
                <th style={{ ...styles.th1, borderLeft: "2px solid #000" }}>
                  Total Qty
                </th>
                <th style={styles.th1}>Total Wholesale Price (USD)</th>
                <th style={styles.th1}>Discounted Wholesale Price (USD)</th>
                <th style={{ ...styles.th1, borderRight: "2px solid #000" }}>
                  Total Savings (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7"></td>
                <td style={{ ...styles.td2, borderLeft: "2px solid #000" }}>
                  {rows?.length}
                </td>
                <td style={styles.td2}>
                  {formatter.format(total?.totalWholeSale)}
                </td>
                <td style={styles.td2}>
                  {formatter.format(total?.totalDiscountedWholeSale)}
                </td>
                <td style={{ ...styles.td2, borderRight: "2px solid #000" }}>
                  {formatter.format(total?.totalDiscount)}
                </td>
              </tr>
              <tr>
                <td colSpan="7"></td>
                <td style={styles.td1}></td>
                <td style={styles.td1}></td>
                <td style={styles.td1}></td>
                <td style={styles.td1}></td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th
                  style={{
                    ...styles.th1,
                    width: "6%",
                    borderLeft: "2px solid #000",
                  }}
                >
                  Stock
                </th>
                <th style={{ ...styles.th1, width: "5%" }}>Status</th>
                <th style={{ ...styles.th1, width: "5%" }}>Brand</th>
                <th style={{ ...styles.th1, width: "10%" }}>Model</th>
                <th style={{ ...styles.th1, width: "10%" }}>Serial No.</th>
                <th style={{ ...styles.th1, width: "6%" }}>Paper</th>
                <th style={{ ...styles.th1, width: "10%" }}>Paper Date</th>
                <th style={{ ...styles.th1, width: "5%" }}>Box</th>
                <th style={{ ...styles.th1, width: "10%" }}>
                  Wholesale Price (USD)
                </th>
                <th style={{ ...styles.th1, width: "10%" }}>
                  Discounted Wholesale Price
                </th>
                <th
                  style={{
                    ...styles.th1,
                    width: "5%",
                    borderRight: "2px solid #000",
                  }}
                >
                  Saving
                </th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((item, index) => (
                <tr
                  key={item.stockId}
                  style={
                    index === rows.length - 1
                      ? { ...styles.td, ...styles.lastRow }
                      : styles.td
                  }
                >
                  <td style={{ ...styles.td, borderLeft: "2px solid #000" }}>
                    {item.stockId}
                  </td>
                  <td style={styles.td}>{item.status}</td>
                  <td style={styles.td}>{item.brand}</td>
                  <td style={styles.td}>{item.model}</td>
                  <td style={styles.td}>{item.serial_no}</td>
                  <td style={styles.td}>
                    {item?.paper == "N/A" ? "-" : item?.paper}
                  </td>
                  <td style={styles.td}>
                    {item?.paper_date
                      ? moment(item.paper_date).format("DD-MMM-YYYY")
                      : "-"}
                  </td>
                  <td style={styles.td}>{item.box}</td>
                  <td style={styles.td}>{formatter.format(item.price)}</td>
                  <td style={styles.td}>{formatter.format(item.netAmount)}</td>
                  <td style={{ ...styles.td, borderRight: "2px solid #000" }}>
                    {formatter.format(item.discount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
