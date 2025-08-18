import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Controller, useFormContext } from "react-hook-form";

function VintageCreateForm({ }) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors }: any = formState;

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
                        label="Brand"
                        type="text"
                        variant="outlined"
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
                </Grid>
                <Grid item xs={12} md={6}>
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
                        label="Model"
                        type="text"
                        variant="outlined"
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default VintageCreateForm;
