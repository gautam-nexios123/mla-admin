import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useEffect, useState } from "react";
import moment from "moment";
import PermissionsTable from "./PermissionsTable";
import StaffLogTable from "./StaffLogTable";
import { useSnackbar } from "notistack";
import jwtDecode from "jwt-decode";
import {
  newMasterLuxuryModulesPermissions,
  newModulesPermissions,
  roleOptions,
  staffLocDropdown,
} from "src/utils/dropdownlist";
import { SaveOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import MasterLuxuryPermissionTable from "./MasterLuxuryPermissionTable";

function StaffContent(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const userData: any = jwtDecode(session);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsMasterLuxury, setRowsMasterLuxury] = useState<any>([]);
  const [staffActiveSwitch, setStaffActiveSwitch] = useState<boolean>(false);
  const [staffMLASwitch, setStaffMLASwitch] = useState<boolean>(false);
  const [staffMasterLuxurySwitch, setStaffMasterLuxurySwitch] =
    useState<boolean>(false);
  const [staffRole, setStaffRole] = useState<string>("");
  const [isCommissionAllow, setIsCommissionAllow] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>();

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/staff/${props.staffId}`,
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
        setData(data?.results);
        setValue("firstName", data?.results?.firstName);
        setValue("surName", data?.results?.surName);
        setValue("email", data?.results?.email);
        setValue("phone", data?.results?.phone);
        const initialJoimDate = new Date(data?.results?.join_date);
        const initialCommissionDate = new Date(
          data?.results?.commission_start_date
        );
        setValue("join_date", initialJoimDate);
        setValue("commission_start_date", initialCommissionDate);
        setValue("staff_location", data?.results?.staff_location);
        setValue("non_watchLevel", data?.results?.non_watchLevel);
        setValue("watch_knowledge_level", data?.results?.watch_knowledge_level);
        setValue("role", data?.results?.role);
        setStaffRole(data?.results?.role);

        setStaffActiveSwitch(data?.results?.active);
        setStaffMLASwitch(data?.results?.isMla);
        setStaffMasterLuxurySwitch(data?.results?.isMasterLuxury);
        setIsCommissionAllow(data?.results?.isCommissionAllow);
        setRows(
          data?.results?.modulesPermissions?.length
            ? data?.results?.modulesPermissions
            : newModulesPermissions
        );
        setRowsMasterLuxury(
          data?.results?.modulesPermissionsMasterLuxury?.length
            ? data?.results?.modulesPermissionsMasterLuxury
            : newMasterLuxuryModulesPermissions
        );
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
      setError("Error fetching data");
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [props.staffId, session]);

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

  // isExpanded key remove

  const sanitizeRowsForApi = (rows) => {
    return rows.map((row) => {
      const { isExpanded, ...sanitizedRow } = row;

      if (sanitizedRow.subModules) {
        sanitizedRow.subModules = sanitizeRowsForApi(sanitizedRow.subModules);
      }

      return sanitizedRow;
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const setPermissionsForSuperadmin = (modules, companyRole) => {
    return modules?.map((module) => {
      if (companyRole === "MLA") {
        module.isView = true;
        module.isEdit = true;
      }
      if (module?.subModules?.length > 0) {
        module.subModules = setPermissionsForSuperadmin(
          module.subModules,
          companyRole
        );
      }
      return module;
    });
  };

  // Function to get the updated permissions based on the role
  const getModulesWithPermissions = (role, sanitizedRows, companyRole) => {
    if (role === "SUPER_ADMIN") {
      return setPermissionsForSuperadmin(sanitizedRows, companyRole);
    } else {
      // Return the original sanitizedRows if the role is not "superadmin"
      return sanitizedRows;
    }
  };

  const handleSaveClick = async () => {
    const value = getValues();

    const sanitizedRows = sanitizeRowsForApi(rows);
    const updatedModules =
      value?.role &&
      sanitizedRows &&
      getModulesWithPermissions(value?.role, sanitizedRows, "MLA");

    const sanitizedRowsMaster = sanitizeRowsForApi(rowsMasterLuxury);
    const updatedModulesMaster =
      value?.role &&
      sanitizedRowsMaster &&
      getModulesWithPermissions(value?.role, sanitizedRowsMaster, "ML");

    const utcJoinDate = moment(value.join_date).utc().toISOString();
    const utcCommissionDate = moment(value.commission_start_date)
      .utc()
      .toISOString();
    setLoading(true);

    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/staff/${props.staffId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: `${value.firstName}`,
            surName: `${value.surName}`,
            email: `${value.email}`,
            phone: `${value.phone}`,
            role: `${value.role}`,
            join_date: utcJoinDate,
            commission_start_date: utcCommissionDate,
            staff_location: `${value.staff_location}`,
            non_watchLevel: `${value.non_watchLevel}`,
            watch_knowledge_level: `${value.watch_knowledge_level}`,
            isCommissionAllow: isCommissionAllow,
            active: data?.role === "SUPER_ADMIN" ? true : staffActiveSwitch,
            isMla: data?.role === "SUPER_ADMIN" ? true : staffMLASwitch,
            isMasterLuxury:
              data?.role === "SUPER_ADMIN" ? true : staffMasterLuxurySwitch,
          }),
        }
      );
      const result = await response.json();

      const payload = {
        id: data?.id,
        modulesPermissions: updatedModules,
        modulesPermissionsMasterLuxury: updatedModulesMaster,
      };

      try {
        const response = await fetch(
          "https://api-dev.mlawatches.com/api/admin/auth/updateRolesAndPermissions",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
      } catch (error) {
        console.error("Error updating permissions:", error);
      }

      if (result.statusCode == 200) {
        enqueueSnackbar("Data updated successfully!", { variant: "success" });
        fetchData();
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

  // const handleInputChange = (e) => {
  //   setData({ ...data, [e.target.name]: e.target.value });
  // };

  // const handleRoleChange = (event) => {
  //   setData({ ...data, role: event.target.value });
  // };

  const handleSwitchChange = async (isApproved: boolean) => {
    setStaffActiveSwitch(isApproved);
  };

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="text-end mb-[15px] flex flex-auto justify-end gap-5">
        <Typography
          className="flex items-center pt-4"
          component={Link}
          role="button"
          to="/settings"
          color="inherit"
        >
          <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-left</FuseSvgIcon>
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
                  <Typography className="font-semibold mb-4 text-15">
                    First Name
                  </Typography>
                  {isEditing ? (
                    // <TextField
                    //   fullWidth
                    //   name="firstName"
                    //   value={data?.firstName}
                    //   onChange={handleInputChange}
                    //   disabled={!isEditing}
                    // />
                    <>
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
                            message:
                              "The First name must be at least 5 characters",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="custom-height-padding"
                            id="firstName"
                            // label="Firstname"
                            type="text"
                            // variant="outlined"
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
                    </>
                  ) : (
                    <Typography>{data?.firstName}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Last Name
                  </Typography>
                  {isEditing ? (
                    // <TextField
                    //   fullWidth
                    //   name="surName"
                    //   value={data?.surName}
                    //   onChange={handleInputChange}
                    //   disabled={!isEditing}
                    // />
                    <>
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
                            message:
                              "The last name must be at least 5 characters",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="custom-height-padding"
                            id="surName"
                            // label="Surname"
                            type="text"
                            // variant="outlined"
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
                    </>
                  ) : (
                    <Typography>{data?.surName}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Email
                  </Typography>
                  {isEditing ? (
                    // <TextField
                    //   fullWidth
                    //   name="email"
                    //   value={data?.email}
                    //   onChange={handleInputChange}
                    //   disabled={!isEditing}
                    // />
                    <>
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
                            // label="Email"
                            type="text"
                            // variant="outlined"
                            required
                            fullWidth
                            error={!!errors.email}
                            onChange={(e) => {
                              const lowercaseValue =
                                e.target.value.toLowerCase(); // Convert to lowercase
                              field.onChange(lowercaseValue); // Update the field value
                            }}
                            // helperText={errors.email?.message}
                          />
                        )}
                      />
                      {errors?.email?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.email?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>{data?.email}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Phone
                  </Typography>
                  {isEditing ? (
                    // <TextField
                    //   fullWidth
                    //   name="phone"
                    //   value={data?.phone}
                    //   onChange={handleInputChange}
                    //   disabled={!isEditing}
                    // />
                    <>
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
                            // label="Phone"
                            type="text"
                            // variant="outlined"
                            // required
                            fullWidth
                            // error={!!errors.phone}
                            // helperText={errors.phone?.phone}
                          />
                        )}
                      />
                      {errors?.phone?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.phone?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>{data?.phone}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Join Date
                  </Typography>
                  {isEditing ? (
                    <>
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
                            // label="Select Join Date"
                          />
                        )}
                      />
                      {errors?.join_date?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.join_date?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>
                      {" "}
                      {moment(data?.join_date).format(`YYYY-MM-DD`)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Commission Start Date
                  </Typography>
                  {isEditing ? (
                    <>
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
                            // label="Select Commission Start Date"
                          />
                        )}
                      />
                      {errors?.commission_start_date?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.commission_start_date?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>
                      {" "}
                      {moment(data?.commission_start_date).format(`YYYY-MM-DD`)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Location
                  </Typography>
                  {isEditing ? (
                    <>
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
                    </>
                  ) : (
                    <Typography> {data?.staff_location}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Non Watch Level
                  </Typography>
                  {isEditing ? (
                    <>
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
                            // label="Firstname"
                            type="text"
                            // variant="outlined"
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
                    </>
                  ) : (
                    <Typography>{data?.non_watchLevel}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Watch Knowledge Level
                  </Typography>
                  {isEditing ? (
                    <>
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
                            // label="Firstname"
                            type="text"
                            // variant="outlined"
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
                    </>
                  ) : (
                    <Typography>{data?.watch_knowledge_level}</Typography>
                  )}
                </Grid>
                {isEditing && (
                  <Grid item xs={12} md={6}>
                    <Typography className="font-semibold mb-4 text-15">
                      Role
                    </Typography>
                    {/* <Select
                      name="role"
                      value={data?.role}
                      onChange={handleRoleChange}
                      disabled={!isEditing}
                      fullWidth
                      size="small"
                    >
                      {roleOptions?.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select> */}
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
                            disabled={userData?.email === data?.email}
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
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <List dense={true} style={{ width: `100%` }}>
                    <ListItem
                      className="!px-0"
                      secondaryAction={
                        <Typography>
                          {" "}
                          <Switch
                            className="cursor-default"
                            disabled={isEditing ? false : true}
                            checked={isCommissionAllow as boolean}
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
          <Card className="w-full mb-32">
            <StaffLogTable staffId={props.staffId} />
          </Card>
        </div>

        <div className="flex flex-col md:w-480 ">
          <Card component={motion.div} variants={item} className="w-full">
            <div className="flex items-center px-32 pt-24">
              <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                Setting
              </Typography>
            </div>
            <CardContent className="flex flex-wrap  justify-between">
              <div className="flex flex-col w-full items-start justify-between">
                <List dense={true} style={{ width: `100%` }}>
                  <ListItem
                    secondaryAction={<Typography>{data?.role}</Typography>}
                  >
                    <ListItemText
                      primary={<div className="font-600">Role</div>}
                    />
                  </ListItem>
                </List>
                {staffRole !== "SUPER_ADMIN" &&
                  userData?.email !== data?.email && (
                    <List dense={true} style={{ width: `100%` }}>
                      <ListItem
                        secondaryAction={
                          <Typography>
                            {" "}
                            <Switch
                              className="cursor-default"
                              disabled={isEditing ? false : true}
                              checked={staffActiveSwitch as boolean}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSwitchChange(e.target.checked);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </Typography>
                        }
                      >
                        <ListItemText
                          primary={<div className="font-600">Active</div>}
                        />
                      </ListItem>
                    </List>
                  )}
                {staffRole !== "SUPER_ADMIN" &&
                  userData?.email !== data?.email && (
                    <List dense={true} style={{ width: `100%` }}>
                      <ListItem
                        secondaryAction={
                          <Typography>
                            {" "}
                            <Switch
                              className="cursor-default"
                              disabled={isEditing ? false : true}
                              checked={staffMLASwitch as boolean}
                              onChange={(e) => {
                                e.stopPropagation();
                                setStaffMLASwitch(e.target.checked);
                              }}
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
                  )}
                {staffRole !== "SUPER_ADMIN" &&
                  userData?.email !== data?.email && (
                    <List dense={true} style={{ width: `100%` }}>
                      <ListItem
                        secondaryAction={
                          <Typography>
                            {" "}
                            <Switch
                              className="cursor-default"
                              disabled={isEditing ? false : true}
                              checked={staffMasterLuxurySwitch as boolean}
                              onChange={(e) => {
                                e.stopPropagation();
                                setStaffMasterLuxurySwitch(e.target.checked);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </Typography>
                        }
                      >
                        <ListItemText
                          primary={
                            <div className="font-600">Master luxury</div>
                          }
                        />
                      </ListItem>
                    </List>
                  )}
              </div>
            </CardContent>
            {staffRole !== "SUPER_ADMIN" && userData?.email !== data?.email && (
              <PermissionsTable
                editMode={isEditing}
                rows={rows}
                setRows={setRows}
                isMlaValue={staffMLASwitch}
              />
            )}
            {staffRole !== "SUPER_ADMIN" && userData?.email !== data?.email && (
              <MasterLuxuryPermissionTable
                editMode={isEditing}
                rows={rowsMasterLuxury}
                setRows={setRowsMasterLuxury}
                isMasterLuxuryValue={staffMasterLuxurySwitch}
              />
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default StaffContent;
