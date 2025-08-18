import { Button, useMediaQuery } from "@mui/material";
import {
  DataGridPro,
  GridToolbarContainer,
  useGridApiRef
} from "@mui/x-data-grid-pro";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { dialDataArrayRx } from "src/utils/dialAarryRX";
import { dialDropdown } from "src/utils/dropdownlist";
import { csvGetPriceDataListcolumns, getColorTextByColorGroup } from "./ImportCsvListColumn";

const colorDataArray = [
  {
    color: "#0A1172",
    text: "Sold in the last 90 days with a profit more than 4k usd, in stock Qty 4 or less",
    group : "Group A"
  },
  {
    color: "#283593",
    text: "Sold in the last 90 days with a profit more than 2.5k usd in less than 4k, in stock QTY 1 or less",
    group : "Group B"
  },
  {
    color: "#3949AB",
    text: "Sold 3 times in 90 days, Not in stock",
    group : "Group C"
  },
  {
    color: "#3F51B5",
    text: "Sold 4 times in the last 90 days, in stock QTY 1 or less",
    group : "Group D"
  },
  {
    color: "#5C6BC0",
    text: "Sold 5 times in the last 90 days, in stock QTY 2 or less",
    group : "Group E"
  },
  {
    color: "#7986CB",
    text: "Sold 6 times in the last 90 days, in stock QTY 3 or less",
    group : "Group F"
  },
  {
    color: "#9FA8DA",
    text: "Sold 7  times in the last 90 days, in stock QTY 4 or less",
    group : "Group G"
  },
  {
    color: "#BBDEFB",
    text: "Sold 2 time in the last 60 days, Not in stock",
    group : "Group I"
  },
  {
    color: "#E3F2FD",
    text: "Sold 1 time in the last 30 days, Not in stock",
    group : "Group H"
  },
  {
    color: "#FF0000",
    text: "Watch from vintage list",
    group : "GROUP VANTAGE"
  },
  {
    color: "#FFA500",
    text: "Items not in stock replacement and not in our stock",
    group : "ITEM NOT IN STOCK REPLACEMENT BUT IN OUR STOCK"
  },
  {
    color: "#00cc66",
    text: "Wtb requested but not in our stock",
    group : "WTB REQUESTED BUT NOT IN OUR STOCK"
  },
];

const colorMappings = {
  "Group A": "!bg-[#0A1172] hover:!bg-[#0A1172]",
  "Group B": "!bg-[#283593] hover:!bg-[#283593]",
  "Group C": "!bg-[#3949AB] hover:!bg-[#3949AB]",
  "Group D": "!bg-[#3F51B5] hover:!bg-[#3F51B5]",
  "Group E": "!bg-[#5C6BC0] hover:!bg-[#5C6BC0]",
  "Group F": "!bg-[#7986CB] hover:!bg-[#7986CB]",
  "Group G": "!bg-[#9FA8DA] hover:!bg-[#9FA8DA]",
  "Group I": "!bg-[#BBDEFB] hover:!bg-[#BBDEFB]",
  "Group H": "!bg-[#E3F2FD] hover:!bg-[#E3F2FD]",
  "GROUP VANTAGE": "!bg-[#FF0000] hover:!bg-[#FF0000]",
  "ITEM NOT IN STOCK REPLACEMENT BUT IN OUR STOCK": "!bg-[#FFA500] hover:!bg-[#FFA500]",
  "WTB REQUESTED BUT NOT IN OUR STOCK": "!bg-[#00cc66] hover:!bg-[#00cc66]",
};

const colorChoose = {
  "Group A": "0A1172",
  "Group B": "283593",
  "Group C": "3949AB",
  "Group D": "3F51B5",
  "Group E": "5C6BC0",
  "Group F": "7986CB",
  "Group G": "9FA8DA",
  "Group I": "BBDEFB",
  "Group H": "E3F2FD",
  "GROUP VANTAGE": "FF0000",
  "ITEM NOT IN STOCK REPLACEMENT BUT IN OUR STOCK": "FFA500",
  "WTB REQUESTED BUT NOT IN OUR STOCK": "00cc66",
};

const ImportGetPriceDataTable = ({
  csvDataRows,
  setCsvDataRows,
  loading,
  reorderedData,
  colorDivShow,
  headers
}) => {
  const gridApiRef = useGridApiRef();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [dialDropDownArray, setDialDropDownArray] = useState([]);
  const csvDataRows1 = csvDataRows?.map((item, index) => ({
    id: index + 1, // Add a unique id for each row
    ...item,
  }));

  const adjustedColumns = csvGetPriceDataListcolumns?.map((column: any) => ({
    ...column,
    minWidth: isMobile ? 100 : column.minWidth || 100,
    maxWidth: isMobile ? 250 : column.maxWidth || undefined,
    width: isMobile ? 250 : column.width || undefined,
    flex: isMobile ? 1 : column.flex || undefined,
    // hide: column.field === "color" ? true : column.hide,
    ...(column?.field === "dial" && { valueOptions: dialDropDownArray }),
  }));

  const handleExport = async () => {
    // Create a new workbook and a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [
      { header: headers[0], key: "" },
      { header: headers[1], key: "" },
      { header: headers[2], key: "" },
      { header: headers[3], key: "Winning_Bid_USD" },
      {
        header: headers[4],
        key: "note_des",
      },
      {
        header: headers[5],
        key: "box",
      },
      {
        header: headers[6],
        key: "lot",
      },
      {
        header: headers[7],
        key: "brand",
      },
      {
        header: headers[8],
        key: "model",
      },
      {
        header: headers[9],
        key: "dial",
      },
      {
        header: headers[10],
        key: "strap_bracelet",
      },
      {
        header: headers[11],
        key: "bw",
      },
      {
        header: headers[12],
        key: "warranty_year",
      },
      {
        header: headers[13],
        key: "",
      },
      {
        header: headers[14],
        key: "",
      },
      {
        header: headers[15],
        key: "",
      },
      {
        header: headers[16],
        key: "finalPrice",
      },
      {
        header: headers[17],
        key: "",
      },
      {
        header: headers[18],
        key: "",
      },
      {
        header: headers[19],
        key: "",
      },
      {
        header: headers[20],
        key: "",
      },
      {
        header: headers[21],
        key: "",
      },
      {
        header: headers[22],
        key: "",
      },
      {
        header: headers[23],
        key: "",
      },
      {
        header: "",
        key: "",
      },
      // {
      //   header: "MAL Data Price",
      //   key: "",
      // },
      // {
      //   header: "Market Data Price",
      //   key: "",
      // },
      // {
      //   header: "Combined Price",
      //   key: "",
      // },
    ];

    csvDataRows1?.forEach((row :any, index :number) => {
      const excelRow = worksheet.addRow(row);
      // Check if the row contains a 'color' property
      if (row.color) {
        // Apply background color to all cells in the row
        excelRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colorChoose[row.color] },
          };
          cell.font = {
            color: { argb: getColorTextByColorGroup(row?.color) ? "FFFFFF" : "000000" }, // Example: Red text
            // bold: true, // Optional: Make the text bold
          };
        });
      }
    });
    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Mal_Price_Finder.xlsx");
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer className="justify-end p-[12px]">
        {/* <GridToolbarExport
          csvOptions={{ disableToolbarButton: false }}
          printOptions={{ disableToolbarButton: true }}
        /> */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleExport}
          startIcon={<FiDownload />}
        >
          Export
        </Button>
      </GridToolbarContainer>
    );
  }

  const processRowUpdate = (newRow: any) => {
    const updatedRows = csvDataRows1?.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setCsvDataRows(updatedRows);
    return newRow;
  };

  const onCellEditStart = (value: any) => {
    const brandName = value?.row?.brand;
    let filterDialData: any;

    if (brandName === "RX") {
      filterDialData = dialDataArrayRx?.find(
        (item) => item.model === value?.row?.model
      )?.dials;
    } else {
      filterDialData = [];
    }

    if (filterDialData?.length > 0) {
      setDialDropDownArray(filterDialData);
    } else {
      setDialDropDownArray(dialDropdown);
    }
  };

  const getDynamicRowClassName = (params: any) => {
    return colorMappings[params?.row?.color] || "";
  };

  // const convertData = (data) => {
  //   return data.map((item) => {
  //     // Collect dial values into an array and filter out empty strings
  //     const dials = Object.keys(item)
  //       .filter((key) => key.startsWith("Dial") && item[key])
  //       .map((key) => item[key]);

  //     // Return the new structure with "model" and "dials"
  //     return {
  //       model: item.Reference.toString(),
  //       dials,
  //     };
  //   });
  // };

  // const transformedData = convertData(dialConvertDataArray);
  // console.log("transformedData: ", transformedData, transformedData?.length);

  return (
    <div className="mt-[20px] px-[16px]">
      {colorDivShow && (
        <div className="grid md:grid-cols-4 gap-8 my-[20px]">
          {colorDataArray?.map((item, index) => (
            <div key={index} className="flex items-center gap-[10px]">
              <div
                className="w-[20px] h-[12px]"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="text-black text-[12px] font-600">{item.text}</div>
            </div>
          ))}
        </div>
      )}
      <div
        className={
          csvDataRows1?.length > 0 ? `h-[60vh] overflow-y-scroll` : `h-[400px]`
        }
        style={{ overflowY: "auto" }}
      >
        <DataGridPro
          loading={loading}
          rows={csvDataRows1}
          apiRef={gridApiRef}
          columns={adjustedColumns}
          getRowHeight={() => "auto"}
          pagination={false}
          hideFooter
          processRowUpdate={processRowUpdate}
          onCellEditStart={onCellEditStart}
          slots={{
            toolbar: CustomToolbar,
          }}
          disableRowSelectionOnClick
          getRowClassName={getDynamicRowClassName}
          sx={{
            border: 1,
            width: "100%",
            borderColor: "lightgray",
            color: "black",
            scrollbarWidth: "auto",
            scrollbarColor: "black",
            "& .MuiDataGrid-columnHeaders": {
              borderTop: 0,
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeader": {
              borderRight: 1,
              borderTop: 1,
              borderBottom: 0,
              borderRadius: 0,
              borderColor: "lightgray",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              borderColor: "lightgray",
              borderRight: 1,
              borderRightColor: "lightgray",
              borderTop: 1,
              borderTopColor: "lightgray",
              borderBottom: "lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "15px 0px",
            },
            "& .MuiDataGrid-row:last-child ": {
              borderBottom: "1px solid lightgray",
            },
          }}
          checkboxSelection={false}
        />
      </div>
    </div>
  );
};

export default ImportGetPriceDataTable;
