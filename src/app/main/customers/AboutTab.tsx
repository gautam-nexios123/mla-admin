import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Switch,
  CircularProgress,
  Divider,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useSnackbar } from "notistack";
import { SaveOutlined } from "@mui/icons-material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import CircularWithValueLabel from "./CircularProgress";
import {
  getAllCityByState,
  getAllCountry,
  getAllStateByCountry,
} from "app/shared-components/locationTransform";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RewardDialouge from "./RewardDialouge";
// import { useGetProfileAboutQuery } from '../../ProfileApi';

/**
 * The about tab.
 */
function getBenefitsText(level) {
  switch (level) {
    case "VIP":
      return (
        <Typography
          variant="h6"
          className="text-[16px] sm:text-lg text-black tracking-tight leading-8"
        >
          - earning 0.75 points per $1 USD
        </Typography>
      );
    case "VVIP":
      return (
        <Typography
          variant="h6"
          className="text-[16px] sm:text-lg text-black tracking-tight leading-8"
        >
          - earning 1 point per $1 USD
        </Typography>
      );
    case "VVVIP":
      return (
        <Typography
          variant="h6"
          className="text-[16px] sm:text-lg text-black tracking-tight leading-8"
        >
          - earning 1.25 points per $1 USD
        </Typography>
      );
    default:
      return null;
  }
}

const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email"),
  phone: z.string().nonempty("You must enter your phone number"),
  company: z.string().nonempty("You must enter your company name"),
  firstName: z.string().nonempty("You must enter your first name"),
  surName: z.string().nonempty("You must enter your last name"),
  address: z.string().nonempty("You must enter a shipping address"),
  country: z.string().nonempty("You must enter a country"),
  state: z.string().nonempty("You must enter a state"),
  city: z.string().nonempty("You must enter a city"),
  postalCode: z.string().nonempty("You must enter a postal code"),
});

const AboutTab = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openRewardModel, setOpenRewardModel] = useState(false);
  const [rewardModelId, setRewardModelId] = useState(null);
  // State for switches
  const [switches, setSwitches] = useState<any>({
    active: false,
    isGoodStanding: false,
    isEnableBuildPackage: false,
    newSpecialViewable: false,
    isWholeProfileUpdate: true,
  });

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const [rows, setRows] = useState<any>({});
  const [membershipTiers, setMembershipTiers] = useState([]);

  const currentUserStatus = membershipTiers?.find(
    (item) => rows?.level === item?.level
  );

  // const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  // const [selectedState, setSelectedState] = useState<string | null>("");
  // const [cities, setCities] = useState<any>([]);

  const countries = getAllCountry();
  // const states = selectedCountry ? getAllStateByCountry(selectedCountry) : [];

  const defaultValues = {
    email: "",
    phone: "",
    company: "",
    firstName: "",
    surName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  };

  const {
    control,
    formState,
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors, touchedFields }: any = formState;

  const handleCountryChange = (value: string) => {
    // setSelectedCountry(value);
    // setSelectedState(null);
    setValue("state", "");
    // setCities([]);
    setValue("city", "");
  };

  // const handleStateChange = (value: string) => {
  //   setSelectedState(value);
  //   setCities([]);
  //   setValue("city", "");
  // };

  // const onChangeCityHandler = (value: any) => {
  //   setValue("city", value.target.value);
  //   setError("city", null);
  // };

  // const getCityFun = async () => {
  //   const getCity = await getAllCityByState(selectedCountry, selectedState);
  //   setCities(getCity);
  // };

  // useEffect(() => {
  //   if (selectedCountry && selectedState) {
  //     getCityFun();
  //   }
  // }, [selectedCountry, selectedState]);

  const fetchDataCustomer = async () => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/customer/${props.customerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode == 200) {
        setData(data.results);
        setValue("email", data.results.email);
        setValue("phone", data.results.phone);
        setValue("company", data.results.company);
        setValue("firstName", data.results.firstName);
        setValue("surName", data.results.surName);
        setValue("address", data.results.address);
        setValue("country", data.results.country);
        setValue("state", data.results.state);
        setValue("city", data.results.city);
        setValue("postalCode", data.results.postalCode);
        // setSelectedCountry(data?.results?.country);
        // setSelectedState(data?.results?.state);
        setSwitches({
          active: data.results.isApproved,
          isGoodStanding: data?.results?.isGoodStanding,
          isEnableBuildPackage: data.results.isEnableBuildPackage,
          newSpecialViewable: data.results.newSpecialViewable,
        });
        setLoading(false);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/customer/updateCustomer/${props.customerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...switches,
            ...formData,
            limitCalculatedPackageTimesPerDay:
              data?.limitCalculatedPackageTimesPerDay,
            isWholeProfileUpdate: true,
            isApproved: switches.active,
          }),
        }
      );
      const result = await response.json();
      if (result.statusCode == 200) {
        enqueueSnackbar("Data updated successfully!", { variant: "success" });
        fetchDataCustomer();
        setIsEditing(false);
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to update data. Please try again.", {
          variant: "error",
        });
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar("Error updating data", { variant: "error" });
      console.error("Error updating data:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue = name === "email" ? value.toLowerCase() : value;

    setData({ ...data, [name]: updatedValue });
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setSwitches((prevSwitches) => ({
      ...prevSwitches,
      [name]: checked,
    }));
  };

  // const { data: profile, isLoading } = useGetProfileAboutQuery();

  // if (isLoading) {
  // 	return <FuseLoading />;
  // }

  // const { general, work, contact, groups, friends } = profile;

  const fetchDataReward = async () => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/customer/reward?id=${props?.customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );
      const responseData = await response.json();
      setRows(responseData.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/customer/reward/membershipTiers`
      );
      const responseData = await response.json();
      setMembershipTiers(
        responseData?.results?.yearRewardConfig.sort(
          (a, b) => a.spending - b.spending
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataReward();
    fetchData();
    fetchDataCustomer();
  }, []);

  const toReachTiyer = useMemo(() => {
    const lastIndex = membershipTiers?.length - 1;
    const index = membershipTiers.findIndex(
      (item) => rows?.level === item.level
    );
    if (rows?.level === membershipTiers[lastIndex]?.level) {
      return membershipTiers[index];
    } else {
      return membershipTiers[index + 1];
    }
  }, [rows, membershipTiers]);

  useEffect(() => {
    if (props.customerId) {
      setRewardModelId(props.customerId);
    }
  }, [props?.customerId]);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <div className="flex flex-row mb-[15px]  flex-auto justify-between">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Customer Detail
          </Typography>
          <div className="text-end flex flex-auto justify-end gap-5">
            <Typography
              className="flex items-center pt-4"
              component={Link}
              role="button"
              to="/customers"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                heroicons-outline:arrow-sm-left
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Back</span>
            </Typography>
            {!isEditing && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit(handleSaveClick)}
                startIcon={<SaveOutlined />}
              >
                Save{" "}
                {loading && (
                  <CircularProgress size={20} className="ml-[4px] text-white" />
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">
                Business Profile
              </Typography>
            </div>

            <CardContent className="flex flex-col px-32 py-24">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    First Name
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.firstName}
                          helperText={
                            errors.firstName ? errors.firstName.message : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.firstName}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Last Name
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="surName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.surName}
                          helperText={
                            errors.surName ? errors.surName.message : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.surName}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Email
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.email}
                          helperText={errors.email ? errors.email.message : ""}
                          onChange={(e) => {
                            const lowercaseValue = e.target.value.toLowerCase(); // Convert to lowercase
                            field.onChange(lowercaseValue); // Update the field value
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.email}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Phone
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.phone}
                          helperText={errors.phone ? errors.phone.message : ""}
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.phone}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Company
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          // label="Company"
                          type="text"
                          error={!!errors.company}
                          helperText={
                            errors.company ? errors.company.message : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.company}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Address
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          // label="Company"
                          type="text"
                          error={!!errors.address}
                          helperText={
                            errors.address ? errors.address.message : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.address}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Country
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={countries?.map((country) => country.name)}
                          onChange={(event, newValue) => {
                            handleCountryChange(newValue);
                            field.onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.country}
                              helperText={
                                errors?.country?.message
                                  ? "You must enter a country"
                                  : ""
                              }
                              required
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.country}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    State
                  </Typography>
                  {isEditing ? (
                    // <Controller
                    //   name="state"
                    //   control={control}
                    //   render={({ field }) => (
                    //     <Autocomplete
                    //       {...field}
                    //       options={states?.map((state) => state.name)}
                    //       onChange={(event, newValue) => {
                    //         handleStateChange(newValue);
                    //         field.onChange(newValue);
                    //       }}
                    //       renderInput={(params) => (
                    //         <TextField
                    //           {...params}
                    //           error={!!errors.state}
                    //           helperText={
                    //             errors?.state?.message
                    //               ? "You must enter a state"
                    //               : ""
                    //           }
                    //           required
                    //           fullWidth
                    //           size="small"
                    //         />
                    //       )}
                    //     />
                    //   )}
                    // />
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.state}
                          helperText={errors.state ? errors.state.message : ""}
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.state}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    City
                  </Typography>
                  {isEditing ? (
                    // <Controller
                    //   name="city"
                    //   control={control}
                    //   render={({ field }) => (
                    //     <Autocomplete
                    //       {...field}
                    //       options={cities?.map((city) => city?.name)}
                    //       onChange={(event, newValue) => {
                    //         field.onChange(newValue);
                    //       }}
                    //       freeSolo
                    //       renderInput={(params) => (
                    //         <TextField
                    //           {...params}
                    //           error={
                    //             getValues("city") ? false : Boolean(errors.city)
                    //           }
                    //           helperText={
                    //             errors?.city?.message
                    //               ? "You must enter a city"
                    //               : ""
                    //           }
                    //           onChange={onChangeCityHandler}
                    //           required
                    //           fullWidth
                    //           size="small"
                    //         />
                    //       )}
                    //     />
                    //   )}
                    // />
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          type="text"
                          error={!!errors.city}
                          helperText={errors.city ? errors.city.message : ""}
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.city}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Typography className="font-semibold mb-4 text-15">
                    Zip/Postal Code
                  </Typography>
                  {isEditing ? (
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          // className="mb-[14px] custom-height-padding"
                          // label="Company"
                          type="text"
                          error={!!errors.postalCode}
                          helperText={
                            errors.postalCode ? errors.postalCode.message : ""
                          }
                          sx={{
                            "& .MuiInputBase-input": {
                              paddingY: "10px",
                            },
                          }}
                          fullWidth
                          required
                          disabled={!isEditing}
                        />
                      )}
                    />
                  ) : (
                    <Typography>{data?.postalCode}</Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <Typography
                    className={`font-semibold mb-4 ${isEditing ? "pt-10" : ""} text-15`}
                  >
                    Join Date
                  </Typography>
                  <Typography>
                    {moment(data?.createdAt).format(`YYYY-MM-DD`)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col w-full">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="flex items-center px-32 pt-24">
              <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                Setting
              </Typography>
            </div>
            <CardContent className="flex flex-wrap justify-between md:w-[50%]">
              <div className="flex flex-col w-full items-start justify-between">
                <List dense={true} style={{ width: `100%` }}>
                  <ListItem>
                    <ListItemText
                      primary={<div className="font-600">Active</div>}
                    />
                    <Switch
                      className="cursor-default"
                      checked={switches.active}
                      onChange={handleSwitchChange}
                      disabled={!isEditing}
                      inputProps={{ "aria-label": "controlled" }}
                      name="active"
                    />
                  </ListItem>
                </List>
                <List dense={true} style={{ width: `100%` }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <div className="font-600">Enable Build Package</div>
                      }
                    />
                    <Switch
                      className="cursor-default"
                      checked={switches.isEnableBuildPackage}
                      onChange={handleSwitchChange}
                      disabled={!isEditing}
                      inputProps={{ "aria-label": "controlled" }}
                      name="isEnableBuildPackage"
                    />
                  </ListItem>
                </List>
                <List dense={true} style={{ width: `100%` }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <div className="font-600">"New Special" viewable</div>
                      }
                    />
                    <Switch
                      className="cursor-default"
                      checked={switches.newSpecialViewable}
                      onChange={handleSwitchChange}
                      disabled={!isEditing}
                      inputProps={{ "aria-label": "controlled" }}
                      name="newSpecialViewable"
                    />
                  </ListItem>
                </List>

                <List dense={true} style={{ width: `100%` }}>
                  <ListItem>
                    <ListItemText
                      primary={<div className="font-600">Good Standing</div>}
                    />
                    <Switch
                      className="cursor-default"
                      checked={switches.isGoodStanding}
                      onChange={handleSwitchChange}
                      disabled={!isEditing}
                      inputProps={{ "aria-label": "controlled" }}
                      name="isGoodStanding"
                    />
                  </ListItem>
                </List>

                <List style={{ width: `100%` }}>
                  <ListItem className="flex flex-col sm:flex-row items-start justify-between gap-[2px] sm:gap-[25px]">
                    <Typography className="font-semibold mb-4 text-15 whitespace-nowrap">
                      Total Calculated Package Count
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="limitCalculatedPackageTimesPerDay"
                        value={data?.limitCalculatedPackageTimesPerDay}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        sx={{
                          "& .MuiInputBase-input": {
                            paddingY: "10px",
                          },
                        }}
                      />
                    ) : (
                      <Typography>
                        {data?.limitCalculatedPackageTimesPerDay}
                      </Typography>
                    )}
                  </ListItem>
                </List>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card component={motion.div} variants={item} className="w-full mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">
              Purchases Info
            </Typography>
          </div>

          <CardContent className="flex flex-col lg:flex-row lg:gap-[45px] px-32 py-24">
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-32 shadow-xl"
              style={{ boxShadow: "0 4px 8px #bcb8f5" }}
            >
              <CardContent className="px-32 py-24">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Typography className="font-semibold mb-5 text-[18px]">
                      This Month
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Orders
                    </Typography>
                    <Typography>{data?.thisMonth?.totalOrder}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Packages
                    </Typography>
                    <Typography>{data?.thisMonth?.totalPackages}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Bought (USD)
                    </Typography>
                    <Typography>$ {data?.thisMonth?.totalBought}</Typography>
                  </Grid>
                  {/* <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Rewards
                    </Typography>
                    <Typography>-</Typography>
                  </Grid> */}
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Pending Payment
                    </Typography>
                    <Typography>
                      $ {data?.thisMonth?.totalPandingPayment}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-32 shadow-xl"
              style={{ boxShadow: "0 4px 8px #bcb8f5" }}
            >
              <CardContent className="px-32 py-24">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Typography className="font-semibold mb-5 text-[18px]">
                      This Year
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Orders
                    </Typography>
                    <Typography>{data?.thisYear?.totalOrder}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Packages
                    </Typography>
                    <Typography>{data?.thisYear?.totalPackages}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Bought (USD)
                    </Typography>
                    <Typography>$ {data?.thisYear?.totalBought}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Rewards
                    </Typography>
                    <Typography>{data?.thisYear?.thisYearReward}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Pending Payment
                    </Typography>
                    <Typography>
                      $ {data?.thisYear?.totalPandingPayment}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-32 shadow-xl"
              style={{ boxShadow: "0 4px 8px #bcb8f5" }}
            >
              <CardContent className="px-32 py-24">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Typography className="font-semibold mb-5 text-[18px]">
                      Total
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Orders
                    </Typography>
                    <Typography>{data?.totalOrder}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Packages
                    </Typography>
                    <Typography>{data?.totalPackages}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Bought (USD)
                    </Typography>
                    <Typography>$ {data?.totalBought}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Rewards
                    </Typography>
                    <Typography>{data?.totalReward}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Total Pending Payment
                    </Typography>
                    <Typography>$ {data?.totalPandingPayment}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card component={motion.div} variants={item} className="w-full mb-32">
          <div className="px-32 pt-24">
            <Typography className="text-2xl font-semibold leading-tight">
              MLA Reward Plus
            </Typography>
          </div>

          <div className="px-32 pt-[6px] text-[14px] sm:text-[15px] text-[#4f46e5] font-600">
            <span className="font-semibold text-black">Current Status :</span>{" "}
            {currentUserStatus?.title}
          </div>

          <CardContent className="px-32 py-24">
            <Grid container spacing={5} mb={3}>
              <Grid className="pt-[30px] pl-[40px]" xs={12} md={6}>
                <Box my={2} className="h-full m-auto">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex flex-row justify-between align-middle">
                      <Typography
                        variant="h6"
                        className="text-[16px] sm:text-[20px] font-semibold text-justify"
                      >
                        Your Premier Progress
                      </Typography>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-[6px] lg:gap-[30px] mt-[4px]">
                      <div className="flex items-center gap-[10px] whitespace-nowrap">
                        <div className="text-[16px] sm:text-lg font-semibold">
                          Total Points :
                        </div>
                        <div
                          onClick={() => {
                            if (rows?.totalReward !== 0 || rows?.totalReward) {
                              setRewardModelId(props.customerId);
                              setOpenRewardModel(true);
                            }
                          }}
                          className="text-[16px] sm:text-lg  tracking-tight cursor-pointer"
                          style={{
                            color:
                              rows?.totalReward !== 0 || rows?.totalReward
                                ? "#4f46e5"
                                : "black",
                          }}
                        >
                          {rows?.totalReward || 0}
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-[10px] whitespace-nowrap">
                        <div className="text-[16px] sm:text-lg font-semibold">
                          Current Year Points :
                        </div>
                        <div className="text-[16px] sm:text-lg text-black tracking-tight">
                          {rows?.currentYearReward || 0}
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-[10px] whitespace-nowrap">
                        <div className="text-[16px] sm:text-lg font-semibold">
                          Remaining Points :
                        </div>
                        <div className="text-[16px] sm:text-lg text-black tracking-tight">
                          {rows?.remainingRewardPoint || 0}
                        </div>
                      </div>
                    </div>
                    <Divider className="my-[15px]" />
                    <Typography
                      variant="h6"
                      className="text-[16px] sm:text-lg font-semibold"
                    >
                      Earned in {moment(new Date()).format(`YYYY`)}
                    </Typography>
                    <Typography
                      className="text-[16px] sm:text-lg text-black tracking-tight"
                      variant="body2"
                      color="textSecondary"
                    >
                      To reach {toReachTiyer?.title || ""}
                    </Typography>

                    <div className="flex justify-center items-center mt-[15px] lg:mt-0">
                      <CircularWithValueLabel
                        value={
                          toReachTiyer?.spending < rows?.currantYearSpending
                            ? toReachTiyer?.spending
                            : rows?.currantYearSpending || 0
                        }
                        minValue={0}
                        maxValue={toReachTiyer?.spending || 100}
                      />
                    </div>
                  </div>
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={6}>
              <Card
                component={motion.div}
                variants={item}
                className="w-full"
                style={{ height: 250 }}
              >
                <CardContent className="px-24 h-full">
                  <Box my={2} className="h-full m-auto">
                    <div className="flex flex-col h-full justify-between">
                      {rows?.level !== "NORMAL" && (
                        <div>
                          <Typography
                            variant="h6"
                            className="text-[16px] sm:text-[20px] font-semibold text-justify"
                          >
                            Your Current Benefits
                          </Typography>
                          {getBenefitsText(rows?.level)}
                        </div>
                      )}
                      <div>
                        <Typography
                          variant="h6"
                          className="text-[16px] sm:text-[20px] font-semibold text-justify"
                        >
                          Your Benefits When you Reach{" "}
                          {toReachTiyer?.title || ""}
                        </Typography>
                        {getBenefitsText(toReachTiyer?.level)}
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid> */}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
      {openRewardModel && (
        <RewardDialouge
          openRewardModel={openRewardModel}
          setOpenRewardModel={setOpenRewardModel}
          rewardModelId={rewardModelId}
          setRewardModelId={setRewardModelId}
        />
      )}
    </>
  );
};

export default AboutTab;
