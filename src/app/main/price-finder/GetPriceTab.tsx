import { Button, CardContent, CircularProgress } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ImportGetPriceDataTable from "./ImportGetPriceDataTable";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface IFormInput {
  date: Date | null;
  name: string;
  file: File | null;
}

const GetPriceTab = () => {
  const {
    control: importCsvControl,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IFormInput>();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [csvDataRows, setCsvDataRows] = useState([]);
  const [colorDivShow, setColorDivShow] = useState<boolean>(false);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;
  //   Papa.parse(file, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const val = result?.data?.map((item: any, index: number) => {
  //         const formattedItem = Object.keys(item).reduce((acc, key) => {
  //           let formattedKey = key.toLowerCase().replace(/\s+/g, "_");
  //           if (formattedKey === "bracelet") {
  //             formattedKey = "strap_bracelet";
  //           }
  //           if (formattedKey === "note") {
  //             formattedKey = "note_des";
  //           }
  //           acc[formattedKey] = item[key];
  //           return acc;
  //         }, {});
  //         return { ...formattedItem, id: index + 2 };
  //       });
  //       setCsvDataRows(val);
  //     },
  //   });
  //   setSelectedFile(file);
  // }

  const [headers, setHeaders] = useState([]);
  const [reorderedData, setReorderedData] = useState([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const workbook = XLSX.read(content, { type: "binary" });
        // Get the first sheet and its data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Get headers (first row)
        const headers: any = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]; // First row defines headers
        // Parse the sheet data into JSON
        const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        // Reorder rows based on headers
        const reordered = parsedData?.map((row) => {
          const reorderedRow = {};
          headers.forEach((header) => {
            reorderedRow[header] = row[header] !== undefined ? row[header] : ""; // Set empty string if missing
          });
          return reorderedRow;
        });
        setHeaders(headers);
        setReorderedData(reordered); // Save the reordered data to state

        const data = reordered?.map((item: any, index) => {
          const WinningBidUSDVal = Object.values(item)[3];
          const NoteVal: any = Object.values(item)[4];
          const BoxVal = Object.values(item)[5];
          const LotVal = Object.values(item)[6];
          const BrandVal: any = Object.values(item)[7];
          const ModalVal: any = Object.values(item)[8];
          const DialVal: any = Object.values(item)[9];
          const StapeBarcelateVal: any = Object.values(item)[10];
          const BwVal: any = Object.values(item)[11];
          const WarrentyYearVal: any = Object.values(item)[12];
          const CombinedVal = Object.values(item)[16];
          const YenRateVal = Object.values(item)[23];

          return {
            createdAt: new Date(),
            Winning_Bid_USD: WinningBidUSDVal ? `$${WinningBidUSDVal}` : "",
            brand: BrandVal?.toString()?.trim(),
            model: ModalVal?.toString()?.trim(),
            dial: DialVal,
            strap_bracelet: StapeBarcelateVal,
            bw: BwVal,
            warranty_year: WarrentyYearVal,
            //  "suggested_price":"",
            //  "marketSuggested_price":"",
            finalPrice: CombinedVal,
            box: BoxVal,
            lot: LotVal,
            note_des: NoteVal,
            Yen_Rate: YenRateVal,
          };
        });
        setCsvDataRows(data);
      };
      reader.readAsBinaryString(file);
    }
    setSelectedFile(file);
  };

  const arrayToCsv = (array) => {
    return Papa.unparse(array); // Convert array of objects to CSV
  };

  const replaceNullValues = (data: any): any => {
    if (Array.isArray(data)) {
      return data?.map((item) => replaceNullValues(item));
    } else if (data && typeof data === "object") {
      return Object.fromEntries(
        Object.entries(data)?.map(([key, value]) => [
          key,
          value === null ? "" : replaceNullValues(value),
        ])
      );
    }
    return data;
  };

  // console.log("data", data);
  const onSubmit = async (data: any) => {
    const csvString = arrayToCsv(csvDataRows);
    const blob = new Blob([csvString], { type: "text/csv" });
    const file = new File([blob], "data.csv");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    // Post the form data to the server
    const response = axios.post(
      `https://api-dev.mlawatches.com/api/admin/stock/importPrice`,
      formData
    );

    response
      .then(
        async (res: any) => {
          if (res?.data?.statusCode === 200) {
            setLoading(false);
            const processedData = replaceNullValues(res?.data?.results?.data);
            setCsvDataRows(processedData);
            setColorDivShow(true);
            clearErrors();
            // reset({
            //   file: null,
            // });
            // setSelectedFile(null);
            // if (fileInputRef.current) {
            //   fileInputRef.current.value = null;
            // }
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          setLoading(false);
          return axiosError;
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="flex sm:flex-row flex-col sm:items-center">
        <CardContent className="relative">
          <Controller
            name="file"
            control={importCsvControl}
            rules={{
              required: { value: true, message: "Please select file*" },
            }}
            render={({ field }) => (
              <Button
                {...field}
                component="label"
                role={undefined}
                variant="contained"
                color="secondary"
                tabIndex={-1}
                className="whitespace-nowrap"
              >
                Upload file
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  // accept={[".csv", ".xlsx"]}
                  onChange={(e) => {
                    field.onChange(e); // To set value for react-hook-form
                    handleFileChange(e); // To update local state
                  }}
                />
              </Button>
            )}
          />
          {errors?.file?.message ? (
            <p className="text-red-500 text-[14px] absolute bottom-[-6px]">
              {errors?.file?.message}
            </p>
          ) : (
            <p className="text-black text-[14px] font-600 absolute bottom-[-6px] whitespace-nowrap">
              {selectedFile?.name}
            </p>
          )}
        </CardContent>
        {/* <Button
          className="whitespace-nowrap ml-[16px] mt-[20px] sm:mt-0"
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
        >
          Submit{" "}
          {loading && (
            <CircularProgress size={16} className="text-white ml-[8px]" />
          )}
        </Button> */}
      </div>
      <div className="mb-[40px]">
        <ImportGetPriceDataTable
          csvDataRows={csvDataRows}
          setCsvDataRows={setCsvDataRows}
          loading={loading}
          colorDivShow={colorDivShow}
          reorderedData={reorderedData}
          headers={headers}
        />
      </div>
      <div className="w-full flex justify-center mb-[40px] px-[30px]">
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
        >
          Submit{" "}
          {loading && (
            <CircularProgress size={16} className="text-white ml-[8px]" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default GetPriceTab;
