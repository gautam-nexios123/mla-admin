import {
  Button,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios, { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ImportCSVDataTable from "./ImportCSVDataTable";
import { useSnackbar } from "notistack";

interface IFormInput {
  date: Date | null;
  name: string;
  file: File | null;
}

const ImportCsv = () => {
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
  const [shrinkActive, setShrinkActive] = useState<boolean>(false);
  const [csvDataRows, setCsvDataRows] = useState([]);
  const [loadingMarketList, setLoadingMarketList] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const getMarketSaleDataList = async () => {
    setLoadingMarketList(true);
    const response = axios.get(
      `https://api-dev.mlawatches.com/api/admin/stock/marketSaleDataList?page=${page}&search=${searchQuery}`
    );
    response
      .then(
        (res: AxiosResponse<any>) => {
          if (res?.data?.statusCode === 200) {
            setLoadingMarketList(false);
            if (searchQuery !== "") {
              setCsvDataRows(res?.data?.results?.data);
            } else {
              setCsvDataRows((prevRows) => [
                ...prevRows,
                ...res?.data?.results?.data,
              ]);
            }
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          setLoadingMarketList(false);
          return axiosError;
        }
      )
      .finally(() => {
        setLoadingMarketList(false);
      });
  };

  useEffect(() => {
    getMarketSaleDataList();
  }, [page, searchQuery]);

  const onSubmit = (data: any) => {
    const utcDate = moment(data?.date).utc().toISOString();

    const formdata = new FormData();
    formdata.append("file", selectedFile);
    formdata.append("date", utcDate);
    formdata.append("name", data?.name);

    setLoading(true);

    const response = axios.post(
      `https://api-dev.mlawatches.com/api/admin/stock/importSoldHistory`,
      formdata
    );
    response
      .then(
        async (res: AxiosResponse<any>) => {
          if (res?.data?.statusCode === 200) {
            setLoading(false);
            // enqueueSnackbar(res?.data?.results, {
            //   variant: "success",
            // });
            await setPage(1);
            getMarketSaleDataList();
            clearErrors();
            reset({
              name: "",
              date: null,
              file: null,
            });
            setShrinkActive(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
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
      <div className="flex sm:flex-row flex-col sm:items-center pb-[16px]">
        <CardContent className="relative">
          <Controller
            name="date"
            control={importCsvControl}
            rules={{
              required: { value: true, message: "Please select date*" },
            }}
            render={({ field }) => (
              <DatePicker {...field} className="w-full" label="Select Date" />
            )}
          />
          {errors?.date?.message && (
            <p className="text-red-500 text-[14px] absolute bottom-[-6px]">
              {errors?.date?.message}
            </p>
          )}
        </CardContent>
        <CardContent className="relative">
          <Controller
            name="name"
            control={importCsvControl}
            rules={{ required: { value: true, message: "Please enter name*" } }}
            render={({ field }) => (
              <TextField
                {...field}
                className="w-full"
                id="name"
                label="Name"
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: shrinkActive,
                }}
                onChange={(e) => {
                  field.onChange(e);
                  setShrinkActive(true);
                }}
              />
            )}
          />
          {errors?.name?.message && (
            <p className="text-red-500 text-[14px] absolute bottom-[-6px]">
              {errors?.name?.message}
            </p>
          )}
        </CardContent>
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
                  accept=".csv"
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
        <Button
          className="whitespace-nowrap ml-[16px] mt-[20px] sm:mt-0"
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
      <div className="mb-[40px]">
        <ImportCSVDataTable
          csvDataRows={csvDataRows}
          loading={loadingMarketList}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCsvDataRows={setCsvDataRows}
        />
      </div>
    </div>
  );
};

export default ImportCsv;
