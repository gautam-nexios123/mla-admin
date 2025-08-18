import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import _ from "@lodash";
import Paper from "@mui/material/Paper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";

/**
 * Form Validation Schema
 */
const schema = z.object({
  code: z.string().min(6).max(6),
});

type FormType = {
  code: string;
};

const defaultValues = {
  code: "",
};

/**
 * The classic Verify Code page.
 */
function VerifyCodePage() {
  const [loading, setLoading] = useState(false);
  const { control, formState, handleSubmit } = useForm<FormType>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let location = useLocation();
  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(formData: FormType) {
    const { code } = formData;
    setLoading(true);
    const response = axios.post(
      `https://api-dev.mlawatches.com/api/admin/auth/verify_otp`,
      { email: location.state.email, otp: code }
    );

    response
      .then(
        (res: AxiosResponse<any>) => {
          if (res.data.results.success) {
            enqueueSnackbar("Password is successfully send to your email!", {
              variant: "success",
            });
            navigate("/sign-in");
          } else {
            enqueueSnackbar(res?.data?.results?.message, { variant: "error" });
          }
        },
        (error) => {
          const axiosError = error as AxiosError;
          enqueueSnackbar("Something went wrong!", { variant: "error" });
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
            Verify code
          </Typography>
          <div className="mt-2 flex items-baseline font-medium">
            <form
              name="resetForm"
              noValidate
              className="mt-32 flex w-full flex-col justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Code"
                    autoFocus
                    type="text"
                    error={!!errors.code}
                    helperText={errors?.code?.message}
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
                Verify Code
              </Button>
            </form>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default VerifyCodePage;
