import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Button, Divider, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Controller, useFormContext } from "react-hook-form";
import { useSnackbar } from "notistack";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  flexGrow: 1,
}));

export default function SettingContent() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [rows, setRows] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const methods = useFormContext();
  const { control, reset, formState, getValues } = methods;
  const { errors } = formState;

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api-dev.mlawatches.com/api/admin/setting/all",
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
          setRows(data.results);
          reset({
            notification_enable:
              data.results.notificationConfig[0]?.isEnableNotification || true,
            id: data.results?.id || "",
            notification_only_send_superadmin:
              data.results.notificationConfig[0]?.isSendOnlySuperAdmin || false,
            notification_send_customer: data.results.isSendToCustomer || false,
            notification_superadmin_email:
              data?.results?.notificationConfig[0]?.superAdminEmail ||
              "nopparat.wtnp@gmail.com",
            notification_secondary_email:
              data?.results?.notificationConfig[0]?.secondaryEmail ||
              "admin@email.com",
            web_setting_email_contact:
              data?.results?.webConfigs[0]?.emailContact ||
              "nopparat.wtnp@gmail.com",
            web_setting_phone_contact:
              data?.results?.webConfigs[0]?.phoneContact || "+66 12345 6789",
            mantainance_mode:
              data?.results?.webConfigs[0]?.isMantainance || false,
            purchase_system: data.results.purchaseConfig[0]?.enable || false,
            purchase_system_guest:
              data.results.purchaseConfig[0]?.isGuestCanPurchase || false,
            purchase_system_package:
              data.results.purchaseConfig[0]?.isCustomerCanBuildPackage ||
              false,
            purchase_system_max_discount:
              data.results.purchaseConfig[0]?.maximumDiscountPrice || "0",
            purchase_system_max_amount_discount:
              data.results.purchaseConfig[0]?.maximumAmountForDiscount ||
              "600000",
            limitCalculatedPackageTimesPerDay:
              data.results.purchaseConfig[0]
                ?.limitCalculatedPackageTimesPerDay || "0",
            "THB-USD":
              data?.results?.exchangeRateConfigs?.find(
                (da) => da?.from === "THB" && da?.to === "USD"
              )?.exchangeRate || "0.95",
            "HKD-USD":
              data?.results?.exchangeRateConfigs?.find(
                (da) => da?.from === "HKD" && da?.to === "USD"
              )?.exchangeRate || "35",
            "EUR-USD":
              data?.results?.exchangeRateConfigs?.find(
                (da) => da?.from === "EUR" && da?.to === "USD"
              )?.exchangeRate || "7.9",
            commission_buy:
              data?.results?.commissionConfig[0]?.commission_buy || "0",
            commission_sale:
              data?.results?.commissionConfig[0]?.commission_sale || "0",
            commission_netprofit:
              data?.results?.commissionConfig[0]?.commission_netprofit || "0",
            commission_seniority:
              data?.results?.commissionConfig[0]?.commission_seniority || "0",
            weekly_deduction:
              data?.results?.commissionConfig[0]?.weekly_deduction || "0",
            hong_kong_cost_of_life_per:
              data?.results?.commissionConfig[0]?.hong_kong_cost_of_life_per ||
              "0",
            new_york_cost_of_life_per:
              data?.results?.commissionConfig[0]?.new_york_cost_of_life_per ||
              "0",
            thailand_cost_of_life_per:
              data?.results?.commissionConfig[0]?.thailand_cost_of_life_per ||
              "0",
            japan_cost_of_life_per:
              data?.results?.commissionConfig[0]?.japan_cost_of_life_per || "0",
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
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [reset]);

  const handleSaveSetting = async () => {
    const allData = getValues();

    const fieldsToConvert = [
      "hong_kong_cost_of_life_per",
      "new_york_cost_of_life_per",
      "thailand_cost_of_life_per",
      "japan_cost_of_life_per",
    ];

    fieldsToConvert.forEach((field) => {
      if (allData[field]) {
        allData[field] = Number(allData[field]);
      }
    });

    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/setting/updateAllConfig",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...allData, id: rows?.id }), // Pass all data to the API
        }
      );

      const result = await response.json();

      if (result.statusCode === 200) {
        enqueueSnackbar("Settings updated successfully.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to update settings. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(
        "An error occurred while updating settings. Please try again.",
        { variant: "error" }
      );
      console.error("Error updating settings:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl mt-24">
      <div className="flex items-center justify-between pb-20">
        <Typography className="text-2xl font-semibold tracking-tight leading-8">
          General Setting
        </Typography>
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={handleSaveSetting}
          startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
        >
          Save
        </Button>
      </div>
      <div className="flex flex-row items-start pb-24">
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Notification
                </Typography>
              </CardContent>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="notification_enable"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="notification_enable"
                          value={field.value || true}
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">Enable Notification</div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="notification_only_send_superadmin"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="notification_only_send_superadmin"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">
                        Send Only to Super Admin Email
                      </div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="notification_send_customer"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="notification_send_customer"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">
                        Send Notification to Customer
                      </div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <CardContent>
                <Controller
                  name="notification_superadmin_email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="notification_superadmin_email"
                      label="Super Admin Email"
                      type="text"
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="notification_secondary_email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="notification_secondary_email"
                      label="Secondary Email"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>
          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Web Setting
                </Typography>
              </CardContent>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="mantainance_mode"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="mantainance_mode"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={<div className="font-600">Mantainance Mode</div>}
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>

              <CardContent>
                <Controller
                  name="web_setting_email_contact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="web_setting_email_contact"
                      label="Email Contact"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="web_setting_phone_contact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="web_setting_phone_contact"
                      label="Phone Contact"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>
        </Stack>
      </div>
      <Divider />
      <Typography className="text-2xl font-semibold tracking-tight leading-8 pt-20 pb-20">
        Config Setting
      </Typography>
      <div className="flex flex-row items-start pb-24">
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Purchase Setting
                </Typography>
              </CardContent>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="purchase_system"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="purchase_system"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">Enable Purchase system</div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="purchase_system_guest"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="purchase_system_guest"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">Guest user can purchase</div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <List dense={false}>
                <ListItem
                  secondaryAction={
                    <Controller
                      name="purchase_system_package"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          id="purchase_system_package"
                          //   color="primary"
                          checked={field.value}
                        />
                      )}
                    />
                  }
                >
                  <ListItemText
                    primary={
                      <div className="font-600">Customer can build package</div>
                    }
                    // secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              </List>
              <CardContent>
                <Controller
                  name="purchase_system_max_discount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="purchase_system_max_discount"
                      label="Maximum Whosale Discount Price"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="purchase_system_max_amount_discount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="purchase_system_max_amount_discount"
                      label="Maximum amount applicable for discount (USD)"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="limitCalculatedPackageTimesPerDay"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="limitCalculatedPackageTimesPerDay"
                      label="Total Calculated Package Count(Per day)"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>
          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Exchange Rate Setting
                </Typography>
                {/* <small>Latest updatedAt: {moment().format(`YYYY-MM-DD HH:mm`)}</small> */}
              </CardContent>
              <CardContent>
                <Controller
                  name="THB-USD"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="THB-USD"
                      label="THB to USD"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="HKD-USD"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="HKD-USD"
                      label="HKD to USD"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="EUR-USD"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="EUR-USD"
                      label="EUR to USD"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>
        </Stack>
      </div>
      <Divider />
      <Typography className="text-2xl font-semibold tracking-tight leading-8 pt-20 pb-18">
        Commission Setting
      </Typography>
      <div className="flex flex-row sm:flex-row items-start pb-20 pt-20">
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Commission Percentage
                </Typography>
              </CardContent>
              <CardContent>
                <Controller
                  name="commission_buy"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="commission_buy"
                      label="commission_buy"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="commission_sale"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="commission_sale"
                      label="commission_sale"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="commission_netprofit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="commission_netprofit"
                      label="commission_netprofit"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="commission_seniority"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="commission_seniority"
                      label="commission_seniority"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="weekly_deduction"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="weekly_deduction"
                      label="weekly_deduction"
                      type="text"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>

          <Item>
            <Box className="w-full sm:min-w-[400px]">
              <CardContent>
                <Typography className="text-xl font-semibold tracking-tight leading-8">
                  Cost of Life Percentage
                </Typography>
              </CardContent>
              <CardContent>
                <Controller
                  name="new_york_cost_of_life_per"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="new_york_cost_of_life_per"
                      label="New York"
                      type="number"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="hong_kong_cost_of_life_per"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="hong_kong_cost_of_life_per"
                      label="Hong Kong"
                      type="number"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="thailand_cost_of_life_per"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="thailand_cost_of_life_per"
                      label="Thailand"
                      type="number"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
              <CardContent>
                <Controller
                  name="japan_cost_of_life_per"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="w-full"
                      id="japan_cost_of_life_per"
                      label="Japan"
                      type="number"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </CardContent>
            </Box>
          </Item>
        </Stack>
      </div>
    </Paper>
  );
}
