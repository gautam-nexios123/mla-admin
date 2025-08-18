import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { Controller, useFormContext } from "react-hook-form";
import PermissionsTable from "./PermissionsTable";
import { roleOptions, staffLocDropdown } from "src/utils/dropdownlist";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { List, ListItem, ListItemText, Switch } from "@mui/material";
import MasterLuxuryPermissionTable from "./MasterLuxuryPermissionTable";

function StaffCreateForm({
  setRows,
  rows,
  rowsMasterLuxury,
  setRowsMasterLuxury,
  setIsCommissionAllow,
}) {
  const methods = useFormContext();
  const { control, formState, watch } = methods;
  const { errors }: any = formState;
  const [staffRole, setStaffRole] = useState<string>("");

  const isMlaValue = watch("isMla");
  const isMasterLuxuryValue = watch("isMasterLuxury");

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="px-32 pt-24">
              <Typography className="text-2xl font-semibold leading-tight">
                General Information
              </Typography>
            </div>
            <CardContent className="flex flex-col px-32 py-24">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must enter a First name*",
                      },
                      minLength: {
                        value: 5, // Set the minimum number of characters you want
                        message: "The First name must be at least 5 characters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="firstName"
                        label="Firstname"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.firstName}
                        // helperText={errors.firstName?.message}
                      />
                    )}
                  />
                  {errors?.firstName?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.firstName?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="surName"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must enter a last name*",
                      },
                      minLength: {
                        value: 5, // Set the minimum number of characters you want
                        message: "The last name must be at least 5 characters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="surName"
                        label="Surname"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.surName}
                        // helperText={errors.surName?.message}
                      />
                    )}
                  />
                  {errors?.surName?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.surName?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must enter an email*",
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "You must enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="email"
                        label="Email"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.email}
                        // helperText={errors.email?.message}
                        onChange={(e) => {
                          const lowercaseValue = e.target.value.toLowerCase(); // Convert to lowercase
                          field.onChange(lowercaseValue); // Update the field value
                        }}
                      />
                    )}
                  />
                  {errors?.email?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.email?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    // rules={{
                    //   validate: (value) => {
                    //     if (isNaN(value)) {
                    //       return "Please enter a valid number";
                    //     }
                    //     return true;
                    //   },
                    // }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="phone"
                        label="Phone"
                        type="text"
                        variant="outlined"
                        // required
                        fullWidth
                        // error={!!errors.phone}
                        // helperText={errors.phone?.phone}
                      />
                    )}
                  />
                  {/* {errors?.phone?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.phone?.message}
                    </p>
                  )} */}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="join_date"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please select join date*",
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="w-full"
                        label="Select Join Date"
                      />
                    )}
                  />
                  {errors?.join_date?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.join_date?.message}
                    </p>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="commission_start_date"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please select commission start date*",
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="w-full"
                        label="Select Commission Start Date"
                      />
                    )}
                  />
                  {errors?.commission_start_date?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.commission_start_date?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="staff_location"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must select location*",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          fullWidth
                          id="staff_location"
                          variant="outlined"
                          required
                          displayEmpty
                          className="custom-height-padding"
                          inputProps={{ "aria-label": "Without label" }}
                          error={!!errors.staff_location}
                          // onChange={(event) => {
                          //   field.onChange(event);
                          //   setStaffRole(event.target.value);
                          // }}
                          // defaultValue="Select"
                        >
                          <MenuItem value={""} disabled>
                            Select Location
                          </MenuItem>
                          {staffLocDropdown?.map((staff_location) => (
                            <MenuItem
                              key={staff_location}
                              value={staff_location}
                            >
                              {staff_location}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.staff_location && (
                    <Typography variant="body2" color="error">
                      {errors.staff_location.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="non_watchLevel"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must enter a non watch level*",
                      },
                      validate: (value) => {
                        if (isNaN(value)) {
                          return "Please enter a valid number";
                        }
                        if (Number(value) < 0) {
                          return "The number must be positive";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="non_watchLevel"
                        label="Non Watch Level"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.non_watchLevel}
                        // helperText={errors.non_watchLevel?.message}
                      />
                    )}
                  />
                  {errors?.non_watchLevel?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.non_watchLevel?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="watch_knowledge_level"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "You must enter a watch knowledge level*",
                      },
                      validate: (value) => {
                        if (isNaN(value)) {
                          return "Please enter a valid number";
                        }
                        if (Number(value) < 0) {
                          return "The number must be positive";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="custom-height-padding"
                        id="watch_knowledge_level"
                        label="Watch Knowledge Level"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.watch_knowledge_level}
                        // helperText={errors.watch_knowledge_level?.message}
                      />
                    )}
                  />
                  {errors?.watch_knowledge_level?.message && (
                    <p className="text-red-500 text-[14px]">
                      {errors?.watch_knowledge_level?.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense={true} style={{ width: `100%` }}>
                    <ListItem
                      secondaryAction={
                        <Typography>
                          {" "}
                          <Switch
                            className="cursor-default"
                            // disabled={isEditing ? false : true}
                            // checked={staffActiveSwitch as boolean}
                            onChange={(e) => {
                              e.stopPropagation();
                              setIsCommissionAllow(e.target.checked);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Typography>
                      }
                    >
                      <ListItemText
                        primary={
                          <div className="font-600">Commission Eligible</div>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:w-480 ">
          <Card component={motion.div} variants={item} className="w-full mb-32">
            <div className="flex items-center px-32 pt-24">
              <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                Setting
              </Typography>
            </div>
            <CardContent className="flex flex-wrap  justify-between">
              <div className="flex flex-col w-full items-start justify-between">
                <Typography className="font-semibold mb-4 text-15">
                  Role
                </Typography>
                <Controller
                  name="role"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "You must select role*",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        fullWidth
                        id="name"
                        variant="outlined"
                        required
                        className="custom-height-padding"
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        error={!!errors.role}
                        onChange={(event) => {
                          field.onChange(event);
                          setStaffRole(event.target.value);
                        }}
                      >
                        <MenuItem value={""} disabled>
                          Select Role
                        </MenuItem>
                        {roleOptions?.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
                {errors.role && (
                  <Typography variant="body2" color="error">
                    {errors.role.message}
                  </Typography>
                )}

                {staffRole !== "SUPER_ADMIN" && (
                  <Controller
                    name="isMla"
                    control={control}
                    render={({ field }) => (
                      <>
                        <List dense={true} style={{ width: `100%` }}>
                          <ListItem
                            secondaryAction={
                              <Typography>
                                {" "}
                                <Switch
                                  {...field}
                                  className="cursor-default"
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </Typography>
                            }
                          >
                            <ListItemText
                              primary={<div className="font-600">MLA</div>}
                            />
                          </ListItem>
                        </List>
                      </>
                    )}
                  />
                )}

                {staffRole !== "SUPER_ADMIN" && (
                  <Controller
                    name="isMasterLuxury"
                    control={control}
                    render={({ field }) => (
                      <>
                        <List dense={true} style={{ width: `100%` }}>
                          <ListItem
                            secondaryAction={
                              <Typography>
                                {" "}
                                <Switch
                                  {...field}
                                  className="cursor-default"
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </Typography>
                            }
                          >
                            <ListItemText
                              primary={
                                <div className="font-600">Master Luxury</div>
                              }
                            />
                          </ListItem>
                        </List>
                      </>
                    )}
                  />
                )}
              </div>
            </CardContent>
            {staffRole !== "SUPER_ADMIN" && (
              <PermissionsTable editMode={true} rows={rows} setRows={setRows} isMlaValue={isMlaValue} />
            )}
            {staffRole !== "SUPER_ADMIN" && (
              <MasterLuxuryPermissionTable
                editMode={true}
                rows={rowsMasterLuxury}
                setRows={setRowsMasterLuxury}
                isMasterLuxuryValue={isMasterLuxuryValue}
              />
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default StaffCreateForm;
