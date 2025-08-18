import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import _ from "@lodash";
import Paper from "@mui/material/Paper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

/**
 * Form Validation Schema
 */
const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email"),
});

type FormType = {
  email: string;
};

const defaultValues = {
  email: "",
};

/**
 * The classic sign in page.
 */
function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { control, formState, handleSubmit } = useForm<FormType>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(formData: FormType) {
    const { email } = formData;
    setLoading(true);
    const response = axios.post(
      `https://api-dev.mlawatches.com/api/admin/auth/forgot_password`,
      { email }
    );

    response
      .then(
        (res: AxiosResponse<any>) => {
          if (res?.data?.results?.success) {
            enqueueSnackbar("Code is successfully send to your email!", {
              variant: "success",
            });
            navigate("/verify-code", { state: { email } });
          } else {
            enqueueSnackbar(res.data.message, { variant: "error" });
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
          console.log(axiosError);
          return axiosError;
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
      <Paper className="min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow">
        <div className="mx-auto w-full max-w-400 sm:mx-0 sm:w-400">
          <img
            className="h-80 text-center m-auto"
            src="assets/images/logo/mla.svg"
            alt="logo"
          />
          <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
            Forgot password
          </Typography>
          <div className="mt-2 flex items-baseline font-medium">
            <form
              name="resetForm"
              noValidate
              className="mt-32 flex w-full flex-col justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Email"
                    autoFocus
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Button
                variant="contained"
                color="secondary"
                className=" mt-16 w-full"
                aria-label="Sign in"
                disabled={loading || _.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
              >
                Reset password
              </Button>
            </form>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default ResetPasswordPage;
