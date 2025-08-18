import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { SaveOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
/**
 * The Staff header.
 */
function VintageCreateHeader({ handleSubmit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const methods = useFormContext();
  const { formState, getValues } = methods;
  const { isValid } = formState;
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveVintage = async (formData) => {
    const value = getValues();

    const bodyParam = JSON.stringify({
      brand: `${value.brand}`,
      model: `${value.model}`,
    });

    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/vintageWatch`,
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
        enqueueSnackbar("Vintage created successfully!", {
          variant: "success",
        });
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
  return (
    <div className="flex w-full mb-25">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Vintage Create
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
            onClick={handleSubmit(handleSaveVintage)}
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

export default VintageCreateHeader;
