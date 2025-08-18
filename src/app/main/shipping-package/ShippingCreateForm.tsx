import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { cityMapDisplayFlagForShipping } from "src/utils/coreFunction";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const ShippingCreateForm = ({ getShippingPackageList }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, getValues, setValue, reset } = useForm({
    defaultValues: {
      from_location: "",
      // to_location: "",
      total_cost: "",
      // conversationPrice: "",
      // no_of_item: "",
    },
  });

  const handleSubmit = async () => {
    const value = getValues(); // assuming getValues() retrieves form data

    if (!value?.from_location || !value?.total_cost) {
      enqueueSnackbar("Please enter field", { variant: "error" });
      return;
    }

    const payload = {
      from_location: value?.from_location?.split("-")[0],
      to_location: value?.from_location?.split("-")[1],
      total_cost: Number(value?.total_cost),
      // conversationPrice: value?.conversationPrice,
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `https://api-dev.mlawatches.com/api/admin/stock/createShippingPackage`,
        payload
      );

      if (response?.data?.statusCode == 200) {
        enqueueSnackbar("Shipping package created successfully", {
          variant: "success",
        });
        reset({
          from_location: "",
          // to_location: "",
          total_cost: "",
          // no_of_item: "",
        });
        const row = response?.data?.results;
        navigate("/shipping-history-details", { state: { row } });
        getShippingPackageList();
      } else {
        enqueueSnackbar("Failed to create shipping package", {
          variant: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.statusCode === 403
          ? "Unauthorized access. You don't have permission to view or edit this content."
          : "Failed to create shipping package",
        {
          variant: "error",
        }
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full lg:w-[50%] gap-[15px] my-[15px]">
      <Controller
        name="from_location"
        control={control}
        render={({ field }) => (
          <>
            <FormControl fullWidth>
              <InputLabel id="from_location">Location</InputLabel>
              <Select
                {...field}
                className=""
                id="from_location"
                labelId="from_location"
                label="From location"
                required
                inputProps={{ "aria-label": "Without label" }}
              >
                {["TKY-HK","HK-NY","TH-HK","HK-ZH"]?.map((item) => (
                  <MenuItem value={item}>
                    {" "}
                    <div className="flex items-center gap-[10px]">
                      <img
                        className="w-[25px] h-[25px]"
                        src={`assets/images/flags/${cityMapDisplayFlagForShipping[item?.split("-")[0]?.toLocaleLowerCase()]}.svg`}
                        alt={"test"}
                      />
                      <span className="px-[4px]"><ArrowRightAltIcon /></span>
                      <img
                        className="w-[25px] h-[25px]"
                        src={`assets/images/flags/${cityMapDisplayFlagForShipping[item?.split("-")[1]?.toLocaleLowerCase()]}.svg`}
                        alt={"test"}
                      />
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      />

      {/* <Controller
        name="to_location"
        control={control}
        render={({ field }) => (
          <>
            <FormControl fullWidth>
              <InputLabel id="to_location">To location</InputLabel>
              <Select
                {...field}
                className=""
                id="to_location"
                labelId="to_location"
                label="To location"
                required
                inputProps={{ "aria-label": "Without label" }}
              >
                {["HK", "ZH"]?.map((item) => (
                  <MenuItem value={item}>
                    <img
                      className="w-[25px] h-[25px]"
                      src={`assets/images/flags/${cityMapDisplayFlagForShipping[item?.toLocaleLowerCase()]}.svg`}
                      alt={"test"}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      /> */}

      <Controller
        name="total_cost"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="w-full"
            id="total_cost"
            label="Insert Total Cost"
            type="text"
            variant="outlined"
          />
        )}
      />

      {/* <Controller
        name="conversationPrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="w-full"
            id="conversationPrice"
            label="Conversation Price"
            type="text"
            variant="outlined"
          />
        )}
      /> */}

      {/* <Controller
        name="no_of_item"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="w-full"
            id="no_of_item"
            label="Insert Number of Items"
            type="text"
            variant="outlined"
            required
          />
        )}
      /> */}

      <Button
        className="whitespace-nowrap px-[30px]"
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
      >
        <div className="px-[50px] flex items-center">
          Calculate{" "}
          {loading && (
            <CircularProgress size={16} className="text-white ml-[8px]" />
          )}{" "}
        </div>
      </Button>
    </div>
  );
};

export default ShippingCreateForm;
