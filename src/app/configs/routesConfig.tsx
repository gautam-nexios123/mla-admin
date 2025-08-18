import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import { FuseRouteConfigsType, FuseRoutesType } from "@fuse/utils/FuseUtils";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import ExampleConfig from "../main/example/ExampleConfig";
import OrdersConfig from "../main/orders/OrdersConfig";
import StocksConfig from "../main/stocks/StocksConfig";
import SettingsConfig from "../main/settings/SettingsConfig";
import StaffsConfig from "../main/staffs/StaffsConfig";
import CustomersConfig from "../main/customers/CustomersConfig";
import AnalysisConfig from "../main/analysis/AnalysisConfig";
import InventoryInStockConfig from "../main/inventory-in-stock/InventoryInStockConfig";
import InventorySoldCompletedConfig from "../main/inventory-sold-completed/InventorySoldCompletedConfig";
import InventorySoldPendingConfig from "../main/inventory-sold-pending/InventorySoldPendingConfig";
import StockReplacementConfig from "../main/stock-replacement/StockReplacementConfig";
import CreatePackageConfig from "../main/create-package/CreatePackageConfig";
import PriceFinderConfig from "../main/price-finder/PriceFinderConfig";
import WishListConfig from "../main/wish-list/WishListConfig";
import StatisticConfig from "../main/statistic/StatisticConfig";
import LogFileConfig from "../main/log-file/LogFileConfig";
import BoxInventoryConfig from "../main/box-inventory/BoxInventoryConfig";
import ResetPasswordConfig from "../main/reset-password/ResetPasswordConfig";
import VerifyCodeConfig from "../main/verify-code/VerifyCodeConfig";
import PackageHistoryConfig from "../main/package-history/PackageHistoryConfig";
import VintageConfig from "../main/settings/vintage/VintageConfig";
import ShareInventoryConfig from "../main/share-inventory/ShareInventoryConfig";
import RetailInventoryInStockConfig from "../main/retail-inventory/RetailInventoryInStockConfig";
import DisplayPriceConfig from "../main/settings/displayPriceConfig/DisplayPriceConfig";
import ShippingpackageConfig from "../main/shipping-package/ShippingpackageConfig";

const routeConfigs: FuseRouteConfigsType = [
  ExampleConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ResetPasswordConfig,
  VerifyCodeConfig,
  OrdersConfig,
  InventoryInStockConfig,
  InventorySoldCompletedConfig,
  InventorySoldPendingConfig,
  StockReplacementConfig,
  // CreatePackageConfig,
  ShippingpackageConfig,
  WishListConfig,
  PriceFinderConfig,
  StatisticConfig,
  LogFileConfig,
  BoxInventoryConfig,
  //   PackageHistoryConfig,
  // StocksConfig,
  SettingsConfig,
  RetailInventoryInStockConfig,
  StaffsConfig,
  VintageConfig,
  DisplayPriceConfig,
  CustomersConfig,
  AnalysisConfig,
  ShareInventoryConfig,
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/inventory-in-stock" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "/stock",
    element: <Navigate to="/inventory-in-stock" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
