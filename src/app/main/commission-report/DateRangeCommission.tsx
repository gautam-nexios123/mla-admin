import { Button, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Controller, useForm, FieldValues } from "react-hook-form";
import { formatDateAnyFormat } from "src/utils/coreFunction";

interface FormValues extends FieldValues {
  startDate: Date | null;
  endDate: Date | null;
}

const DateRangeCommission = ({ setCommissionData, setIsShow }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (formData: any) => {
    // const utcStartDate = moment(formData.startDate).utc().toISOString();
    const utcStartDate = formatDateAnyFormat(formData.startDate);
    const utcEndDate = formatDateAnyFormat(formData.endDate);
    // const utcEndDate = moment(formData.endDate).utc().toISOString();

    const payload = {
      startDate: utcStartDate,
      endDate: utcEndDate,
    };
    setLoading(true);
    try {
      await axios
        .post(
          `https://api-dev.mlawatches.com/api/admin/stock/staffCommission`,
          payload
        )
        .then((res) => {
          console.log("ress", res);
          if (res?.data?.statusCode === 200) {
            setCommissionData(res?.data?.results);
            setIsShow(true);
            setLoading(false);
            // enqueueSnackbar("submit successfully!", {
            //   variant: "success",
            // });
          }
        })
        .catch((error) => setLoading(false));
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-[18px]">
      <div>
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please select start date*",
            },
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              className="w-full"
              label="Select Start Date"
            />
          )}
        />
        {errors?.startDate?.message && (
          <p className="text-red-500 text-[14px]">
            {errors?.startDate?.message}
          </p>
        )}
      </div>
      <div>
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please select end date*",
            },
          }}
          render={({ field }) => (
            <DatePicker {...field} className="w-full" label="Select End Date" />
          )}
        />
        {errors?.endDate?.message && (
          <p className="text-red-500 text-[14px]">{errors?.endDate?.message}</p>
        )}
      </div>
      <Button
        className="whitespace-nowrap mx-[18px] mt-[7px]"
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
  );
};

export default DateRangeCommission;
