import i18next from "i18next";
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
// stocks  // Orders management // customers // analysis - internal and customers // general settings

let navigationConfig: FuseNavItemType[] = [
  // {
  // 	id: 'stock-component',
  // 	title: 'Stocks',
  // 	translate: 'STOCK',
  // 	type: 'item',
  // 	// icon: 'heroicons-outline:star',
  // 	url: 'stocks'
  // },
  {
    id: "inventory-in-stock",
    title: "Inventory In Stocks",
    translate: "INSTOCK",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "inventory-in-stock",
  },
  {
    id: "inventory-sold-pending",
    title: "Inventory SOLD Pending",
    translate: "SOLDSTOCKPENDING",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "inventory-sold-pending",
  },
  {
    id: "online-orders",
    title: "Orders",
    translate: "ORDER",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "orders",
  },
  {
    id: "inventory-sold-completed",
    title: "Inventory SOLD completed",
    translate: "SOLDSTOCK",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "inventory-sold-completed",
  },
  // {
  // 	id: 'staff-component',
  // 	title: 'Staffs',
  // 	translate: 'STAFF',
  // 	type: 'item',
  // 	// icon: 'heroicons-outline:star',
  // 	url: 'staffs'
  // },
  {
    id: "box-inventory",
    title: "Box inventory",
    translate: "BOXINVENTORY",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "box-inventory",
  },
  // Box inventory, Price finder, Stock replacement,Wish list, Create package,
  {
    id: "price-finder",
    title: "Price finder",
    translate: "PRICEFINDER",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "price-finder",
  },
  {
    id: "stock-replacement",
    title: "Stock replacement",
    translate: "STOCKREPLACEMENT",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "stock-replacement",
  },
  {
    id: "wish-list",
    title: "Wish list",
    translate: "WISHLIST",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "wish-list",
  },
  // {
  //   id: "create-package",
  //   title: "Create package",
  //   translate: "CREATEPACKAGE",
  //   type: "item",
  //   // icon: 'heroicons-outline:star',
  //   url: "create-package",
  // },
  // {
  //   id: "package-history",
  //   title: "Package history",
  //   translate: "HISTORYPACKAGE",
  //   type: "item",
  //   // icon: 'heroicons-outline:star',
  //   url: "package-history",
  // },
  {
    id: "shipping-package",
    title: "Shipping Package",
    translate: "SHIPPINGPACKAGE",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "shipping-package",
  },
  {
    id: "share-inventory",
    title: "Share inventory",
    translate: "SHAREINVENTORY",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "share-inventory",
  },
  {
    id: "analysis",
    title: "Analysis",
    translate: "ANALYSIS",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "analysis",
  },
  {
    id: "statistic",
    title: "Statistic",
    translate: "STATISTIC",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "statistic",
  },
  {
    id: "log-file",
    title: "Log file",
    translate: "LOGFILE",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "log-file",
  },
  {
    id: "customers",
    title: "Customers",
    translate: "CUSTOMER",
    type: "item",
    // icon: 'heroicons-outline:star',
    url: "customers",
  },
  // {
  //   id: "retail-inventory",
  //   title: "Retail Inventory",
  //   translate: "RETAILINVENTORY",
  //   type: "item",
  //   // icon: 'heroicons-outline:star',
  //   url: "retail-inventory",
  // },
  {
    id: "settings",
    title: "",
    translate: "",
    type: "item",
    icon: "heroicons-outline:cog",
    url: "settings",
  },
];

export default navigationConfig;
