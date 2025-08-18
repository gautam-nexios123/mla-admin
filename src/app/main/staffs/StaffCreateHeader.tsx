import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import { SaveOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import moment from "moment";

/**
 * The Staff header.
 */
function StaffCreateHeader({
  rows,
  rowsMasterLuxury,
  handleSubmit,
  isCommissionAllow,
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const methods = useFormContext();
  const { formState, getValues } = methods;
  const { isValid } = formState;
  const [loading, setLoading] = useState<boolean>(false);

  // isExpanded key remove

  const sanitizeRowsForApi = (rows) => {
    return rows?.map((row) => {
      const { isExpanded, ...sanitizedRow } = row;

      if (sanitizedRow.subModules) {
        sanitizedRow.subModules = sanitizeRowsForApi(sanitizedRow.subModules);
      }

      return sanitizedRow;
    });
  };

  const setPermissionsForSuperadmin = (modules) => {
    return modules?.map((module) => {
      module.isView = true;
      module.isEdit =
        module?.moduleName === "inventory-retail-price" ? false : true;
      // if (companyRole === "ML") {
      //   module.isPriceEdit = false;
      // }
      if (module?.subModules?.length > 0) {
        module.subModules = setPermissionsForSuperadmin(module.subModules);
      }
      return module;
    });
  };

  // Function to get the updated permissions based on the role
  const getModulesWithPermissions = (role, sanitizedRows) => {
    if (role === "SUPER_ADMIN") {
      return setPermissionsForSuperadmin(sanitizedRows);
    } else {
      // Return the original sanitizedRows if the role is not "superadmin"
      return sanitizedRows;
    }
  };

  const handleSaveStaff = async (formData) => {
    const value = getValues();

    const sanitizedRows = sanitizeRowsForApi(rows);
    const updatedModules =
      value?.role &&
      sanitizedRows &&
      getModulesWithPermissions(value?.role, sanitizedRows);

    const sanitizedRowsMaster = sanitizeRowsForApi(rowsMasterLuxury);
    const updatedModulesMaster =
      value?.role &&
      sanitizedRowsMaster &&
      getModulesWithPermissions(value?.role, sanitizedRowsMaster);

    const utcJoinDate = moment(value.join_date).utc().toISOString();
    const utcCommissionDate = moment(value.commission_start_date)
      .utc()
      .toISOString();

    const bodyParam = JSON.stringify({
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
      modulesPermissions: updatedModules,
      modulesPermissionsMasterLuxury: updatedModulesMaster,
      isMla: value.isMla,
      isMasterLuxury: value.isMasterLuxury,
    });

    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/staff/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: bodyParam,
        }
      );
      const result = await response.json();
      if (result.statusCode === 200) {
        enqueueSnackbar("Crated staff successfully!", { variant: "success" });
        setLoading(false);
        navigate(-1);
      } else if (result.statusCode === 400) {
        enqueueSnackbar(result.message, { variant: "error" });
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to update data. Please try again.", {
          variant: "error",
        });
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar("Error updating data", { variant: "error" });
      console.error("Error during staff creation:", error.message);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     // dispatch(resetSearchText());
  //   };
  // }, []);

  return (
    <div className="flex w-full mb-25">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Create Staff
          </Typography>
        </div>
        <motion.div initial={{ x: 0, opacity: 1 }}>
          <Typography
            className="flex items-center  pt-4"
            component={Link}
            role="button"
            to="/settings"
            color="inherit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-left</FuseSvgIcon>
            <span className="flex mx-4 font-medium">Back</span>
          </Typography>
        </motion.div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            onClick={handleSubmit(handleSaveStaff)}
            type="submit"
            color="secondary"
            variant="contained"
            startIcon={<SaveOutlined />}
          >
            Save{" "}
            {loading && (
              <CircularProgress size={20} className="ml-[4px] text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StaffCreateHeader;
