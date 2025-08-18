import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Button,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { strapDropdown } from "src/utils/dropdownlist";
import { columns } from "./priceFinderColumn";
import Tabletab from "./TableTab";
import { useLocation } from "react-router";

function PriceValue({ title, input, isMoney = true }) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let formattedInput = input;

  if (isMoney) {
    formattedInput =
      !isNaN(input) && formattedInput != "N/A"
        ? formatter.format(Number(input))
        : "N/A";
  }

  return (
    <h1 className=" text-16 sm:text-xl w-fit">
      {title} :{" "}
      <span className="font-semibold">
        {formattedInput
          ? formattedInput === "$0"
            ? "N/A"
            : formattedInput
          : "N/A"}
      </span>
    </h1>
  );
}

function PriceFinderForm({ dialData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [csvDataRows, setCsvDataRows] = useState([]);
  const [suggestedPrice, setSuggestedPrice] = useState("N/A");
  const [marketSuggestedPrice, setMarketSuggestedPrice] = useState("N/A");
  const [finalPrice, setFinalPrice] = useState("N/A");
  const [mlaDataColor, setMLADataColor] = useState("");
  const [marketSuggestedColor, setMarketSuggestedColor] = useState("");
  const [withWarrantyCheck, setWithWarrantyCheck] = useState(true);
  const [isUsaChecked, setIsUsaChecked] = useState(false);
  const [newCheck, setNewCheck] = useState(false);
  const [stockImages, setStockImages] = useState([]);
  const location = useLocation();

  // const methods = useFormContext();
  // const { control, getValues, reset } = methods;

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      model: "",
      year: "",
      dial: "",
      strap_bracelet: "",
    },
  });
  const sortStrapDropDown = useMemo(() => {
    const keepOnTop = "Any Bracelet";
    const sortedData = [...strapDropdown, keepOnTop]?.sort((a, b) =>
      a.localeCompare(b)
    );
    // sortedData?.unshift(keepOnTop);
    return sortedData;
  }, []);

  useEffect(() => {
    if (
      location?.state?.model ||
      location?.state?.dial ||
      location?.state?.strap_bracelet
    ) {
      location?.state?.model && setValue("model", location?.state?.model || "");
      location?.state?.dial &&
        dialData?.length > 0 &&
        setValue("dial", location?.state?.dial?.toUpperCase() || "");
      location?.state?.strap_bracelet &&
        setValue("strap_bracelet", location?.state?.strap_bracelet || "");
    }
  }, [location, dialData]);

  // useEffect(() => {
  //   reset({
  //     model: "",
  //     year: "",
  //     dial: "",
  //     strap_bracelet: "",
  //   });
  // }, []);

  const handleSubmit = () => {
    const value = getValues();
    const data = {
      model: value.model,
      year: value.year,
      dial: value?.dial?.toUpperCase(),
      strap_bracelet: value?.strap_bracelet?.toUpperCase(),
      isWarranty: withWarrantyCheck,
      isUSA: isUsaChecked,
      isNew: newCheck,
    };
    if (value?.model || value?.year || value?.dial || value?.strap_bracelet) {
      setLoading(true);

      setTimeout(() => {
        const response = axios.post(
          `https://api-dev.mlawatches.com/api/admin/stock/priceFinder`,
          data
        );
        response
          .then(
            (res: AxiosResponse<any>) => {
              setFinalPrice(res?.data?.results?.finalPrice);
              if (res?.data?.results?.result?.length) {
                setRows(
                  res?.data?.results?.result?.map((item, i) => ({
                    ...item,
                    id: i,
                  }))
                );
                setSuggestedPrice(res?.data?.results.suggested_price);
                setMLADataColor(res?.data?.results?.suggested_price_color);
                setStockImages(res?.data?.results?.imageUrls);
                setLoading(false);
              } else {
                setRows([]);
                setSuggestedPrice("");
              }
              if (res?.data?.results?.marketData?.length) {
                setCsvDataRows(
                  res?.data?.results?.marketData?.map((item, i) => ({
                    ...item,
                    id: i,
                  }))
                );
                setMarketSuggestedPrice(
                  res?.data?.results?.marketSuggested_price
                );
                setMarketSuggestedColor(
                  res?.data?.results?.marketSuggested_price_color
                );
                setLoading(false);
              } else {
                setCsvDataRows([]);
                setMarketSuggestedPrice("");
              }
            },
            (error) => {
              if (error?.response?.status == 403) {
                enqueueSnackbar(
                  "Unauthorized access. You don't have permission to view or edit this content.",
                  { variant: "error" }
                );
                setLoading(false);
              } else {
                enqueueSnackbar("Failed to Please try again.", {
                  variant: "error",
                });
                setLoading(false);
                setCsvDataRows([]);
                setMarketSuggestedPrice("");
              }
              const axiosError = error as AxiosError;
              return axiosError;
            }
          )
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-col sm:flex-row w-full ">
            <CardContent
              sx={{
                pt: "16px",
                pb: "8px",
                px: { xs: "8px", sm: "16px" },
              }}
            >
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="w-full"
                    id="model"
                    label="Insert model"
                    autoFocus
                    type="text"
                    variant="outlined"
                    required
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }}
                  />
                )}
              />
              <div className="sm:pt-[3px] whitespace-nowrap">
                <FormControl
                  className="items-center"
                  // error={!!errors.acceptTermsConditions}
                >
                  <div className="flex items-center">
                    <FormControlLabel
                      label={
                        <img
                          src="assets/images/flags/US2.svg"
                          className="max-w-[25px] max-h-[25px]"
                        />
                      }
                      control={
                        <Checkbox
                          size="small"
                          checked={isUsaChecked}
                          onChange={() => setIsUsaChecked(!isUsaChecked)}
                        />
                      }
                    />
                  </div>
                  {/* <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText> */}
                </FormControl>
              </div>
            </CardContent>
            <CardContent
              className="flex flex-col sm:flex-row sm:items-center sm:block gap-5"
              sx={{
                pt: { xs: "8px", sm: "16px" },
                pb: "8px",
                px: { xs: "8px", sm: "16px" },
              }}
            >
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="sm:w-full"
                    id="year"
                    label="Insert Year"
                    type="text"
                    variant="outlined"
                    required
                  />
                )}
              />

              <div className="sm:pt-[3px] whitespace-nowrap">
                <FormControl
                  className="items-center"
                  // error={!!errors.acceptTermsConditions}
                >
                  <FormControlLabel
                    label="With Warranty"
                    control={
                      <Checkbox
                        size="small"
                        checked={withWarrantyCheck}
                        onChange={() =>
                          setWithWarrantyCheck(!withWarrantyCheck)
                        }
                      />
                    }
                  />
                  {/* <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText> */}
                </FormControl>
                <FormControl
                  className="items-center"
                  // error={!!errors.acceptTermsConditions}
                >
                  <FormControlLabel
                    label="New"
                    control={
                      <Checkbox
                        size="small"
                        checked={newCheck}
                        onChange={() => setNewCheck(!newCheck)}
                      />
                    }
                  />
                  {/* <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText> */}
                </FormControl>
              </div>
            </CardContent>

            <CardContent
              sx={{
                pt: { xs: "8px", sm: "16px" },
                pb: { xs: "16px !important", sm: "8px !important" },
                px: { xs: "8px", sm: "16px" },
              }}
            >
              <Controller
                name="dial"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      className="w-[200px] mr-[15px] mb-[15px] lg:mb-0"
                      id="dial"
                      // label="Select Dial"
                      variant="outlined"
                      required
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {dialData?.length > 0 &&
                        dialData?.map((item) => (
                          <MenuItem value={item == "Any Dial" ? "" : item}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                )}
              />
              <Controller
                name="strap_bracelet"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      className="w-[200px]"
                      id="strap_bracelet"
                      // label="Select strap_bracelet"
                      variant="outlined"
                      required
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {sortStrapDropDown?.length > 1 &&
                        sortStrapDropDown?.map((item) => (
                          <MenuItem value={item == "Any Bracelet" ? "" : item}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                )}
              />

              <Button
                className="whitespace-nowrap mx-[18px] mt-[7px]"
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
              >
                Submit{" "}
                {loading && (
                  <CircularProgress size={16} className="text-white ml-[8px]" />
                )}
              </Button>
            </CardContent>
          </div>
          <div className="flex flex-col lg:flex-row gap-[8px] lg:gap-[100px] lg:items-center pb-[20px] lg:pb-0">
            <div className="flex justify-start flex-col sm:flex-row gap-[16px] sm:gap-[34px] px-[8px] sm:px-[16px]">
              <div className="px-[16px] py-[14px] border border-[#C4C4C4] rounded-[4px] flex gap-6 items-center">
                <PriceValue title={"Combined Price"} input={finalPrice} />
                {marketSuggestedColor && mlaDataColor ? (
                  marketSuggestedColor === "green" &&
                  mlaDataColor === "green" ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color={"error"} />
                  )
                ) : (
                  ""
                )}
              </div>
              <div className="px-[16px] py-[14px] border border-[#C4C4C4] rounded-[4px] flex gap-6 items-center">
                <PriceValue title={"MLA Data Price"} input={suggestedPrice} />
                {mlaDataColor ? (
                  mlaDataColor === "green" ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color={"error"} />
                  )
                ) : (
                  ""
                )}
              </div>
              {/* <div className="flex flex-col rounded-12 px-[16px]">
          <PriceValue title={"MLA Data Price"} input={suggestedPrice} />
          <PriceValue
            title={"(From Stock #)"}
            input={suggestedPrice != "N/A" ? rows[0]?.stockId : null}
            isMoney={false}
          />
        </div> */}
              <div className="px-[16px] py-[14px] border border-[#C4C4C4] rounded-[4px] flex gap-6 items-center">
                <PriceValue
                  title={"Market Data Price"}
                  input={marketSuggestedPrice}
                />
                {marketSuggestedColor ? (
                  marketSuggestedColor === "green" ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color={"error"} />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {stockImages.length > 0 && (
          <div className="flex justify-center sm:justify-start gap-[10px] px-[8px]">
            {stockImages?.slice(0, 3)?.map((item, index) => (
              <div key={index}>
                <div className="w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] border rounded-4 flex items-center justify-center">
                  <img
                    src={item?.imageUrl}
                    alt=""
                    className="max-w-full max-h-full "
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "assets/images/logo/mla.svg";
                    }}
                  />
                </div>
                <p className="p-3">#{item?.stockId}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Tabletab
        rows={rows}
        csvDataRows={csvDataRows}
        loading={loading}
        columns={columns}
      />
    </>
  );
}

export default PriceFinderForm;
