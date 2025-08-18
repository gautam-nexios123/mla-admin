import { lazy } from "react";
import ShippingPackageHistoryDetails from "./ShippingCalHistoryDetail/ShippingPackageHistoryDetails";

const ShippingPackage = lazy(() => import("./ShippingPackage"));

/**
 * The Example page config.
 */
const ShippingpackageConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "shipping-package",
      element: <ShippingPackage />,
    },
    {
      path: "shipping-history-details",
      element: <ShippingPackageHistoryDetails />,
    },
  ],
};

export default ShippingpackageConfig;
