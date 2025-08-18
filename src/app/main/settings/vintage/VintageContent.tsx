import FuseLoading from "@fuse/core/FuseLoading";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { SaveOutlined } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function VintageContent(props) {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const userData: any = jwtDecode(session);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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
        `https://api-dev.mlawatches.com/api/admin/stock/vintageWatch/detail?id=${props.vintageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.statusCode == 200) {
        setData(data?.results);
        setValue("brand", data?.results?.brand);
        setValue("model", data?.results?.model);
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
  }

  useEffect(() => {
    fetchData();
  }, [props.vintageId, session]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const value = getValues();

    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/vintageWatch/update?id=${props.vintageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: `${value.brand}`,
            model: `${value.model}`,
          }),
        }
      );
      const result = await response?.json();

      if (result.statusCode == 200) {
        enqueueSnackbar("Data updated successfully!", { variant: "success" });
        fetchData();
        setIsEditing(false);
        setLoading(false);
        navigate(-1);
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
                    Brand
                  </Typography>
                  {isEditing ? (
                    <>
                      <Controller
                        name="brand"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "You must enter a brand*",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="custom-height-padding"
                            id="brand"
                            // label="Firstname"
                            type="text"
                            // variant="outlined"
                            required
                            fullWidth
                            error={!!errors.brand}
                            // helperText={errors.brand?.message}
                          />
                        )}
                      />
                      {errors?.brand?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.brand?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>{data?.brand}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="font-semibold mb-4 text-15">
                    Model
                  </Typography>
                  {isEditing ? (
                    <>
                      <Controller
                        name="model"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "You must enter a model*",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="custom-height-padding"
                            id="model"
                            // label="Model"
                            type="text"
                            // variant="outlined"
                            required
                            fullWidth
                            error={!!errors.model}
                            // helperText={errors.model?.message}
                          />
                        )}
                      />
                      {errors?.model?.message && (
                        <p className="text-red-500 text-[14px]">
                          {errors?.model?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <Typography>{data?.model}</Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default VintageContent;
