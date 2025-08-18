export function hideFullSerial(fullSerial) {
  if (fullSerial === "") {
    return "";
  } else {
    return fullSerial.slice(0, -4) + "XXXX";
  }
}

export const roundValue = (value) => {
  // Convert value to string and split it into integer and decimal parts
  const [integerPart, decimalPart] = value.toFixed(2).toString().split(".");
  const formattedValue = integerPart;

  return Number(formattedValue);
};

// BN Minimum Wholesale Price USD (only MLA)
export function calculateMinimumWhosalePriceFromCost(
  f_brand,
  v_cost,
  from,
  purchase_date,
  watch_from,
  user
) {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );
  const findHKWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "HK"
  );
  const findUSWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "US"
  );

  let calculate = 0;

  if (f_brand === "PP") {
    if (v_cost > 120000) {
      calculate = v_cost / (1 - 0.05);
    } else if (v_cost < 10000) {
      calculate = v_cost / (1 - 0.07);
    } else {
      calculate = v_cost / (1 - (0.07 - (0.02 / 120000) * v_cost));
    }
  } else if (f_brand === "AP" || f_brand === "LS") {
    if (v_cost > 120000) {
      calculate = v_cost / (1 - 0.04);
    } else if (v_cost < 10000) {
      calculate = v_cost / (1 - 0.06);
    } else {
      calculate = v_cost / (1 - (0.06 - (0.02 / 120000) * v_cost));
    }
  } else {
    if (v_cost > 60000) {
      calculate = v_cost / (1 - 0.025);
    } else if (v_cost < 2000) {
      calculate = v_cost / (1 - 0.045);
    } else {
      calculate = v_cost / (1 - (0.045 - (0.02 / 60000) * v_cost));
    }
  }

  // if (
  //   watch_from?.toLowerCase() === "bkk" ||
  //   watch_from?.toLowerCase() === "t/bkk"
  // ) {
  //   calculate =
  //     calculate + (calculate * findThilandWatchPrice?.basePriceModifier) / 100;
  // }

  if (
    watch_from?.toLowerCase() === "bkk" ||
    watch_from?.toLowerCase() === "t/bkk" ||
    watch_from?.toLowerCase() === "r/bkk"
  ) {
    calculate = calculate + calculate * 0.03;
  }

  // if (from?.toLowerCase() == "hk" || from?.toLowerCase() == "t/hk") {
  //   calculate =
  //     calculate + (calculate * findHKWatchPrice?.basePriceModifier) / 100;
  // }

  // if (
  //   (from?.toLowerCase() == "ny" ||
  //     from?.toLowerCase() == "t/ny" ||
  //     from?.toLowerCase() == "la") &&
  //   new Date(purchase_date) > new Date("2025-03-25")
  // ) {
  //   calculate =
  //     calculate + (calculate * findUSWatchPrice?.basePriceModifier) / 100;
  // }

  return calculate;
}

export function calculateMinimumWholesalePriceForBags(B_watchStatus, v_cost) {
  if (B_watchStatus > 0) {
    return B_watchStatus;
  } else if (v_cost > 60000) {
    return v_cost / (1 - 0.025);
  } else if (v_cost < 2000) {
    return v_cost / (1 - 0.05);
  } else {
    return v_cost / (1 - (0.05 - (0.025 / 60000) * v_cost));
  }
}

// ------- BO Manual Min Price
// input field (ex. $10,000)

// BP Suggested Wholesale Price USD (only MLA)

export function calculateSuggestWhosalePriceFromCost(
  f_brand,
  v_cost,
  from,
  purchase_date,
  watch_from,
  user,
  repair_cost_usd
) {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );
  const findHKWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "HK"
  );
  const findUSWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "US"
  );
  let calculate = 0;
  if (f_brand === "PP") {
    if (v_cost > 120000) {
      calculate = v_cost / (1 - 0.07);
    } else if (v_cost < 10000) {
      calculate = v_cost / (1 - 0.11);
    } else {
      calculate = v_cost / (1 - (0.11 - (0.04 / 120000) * v_cost));
    }
  } else if (f_brand === "AP" || f_brand === "LS") {
    if (v_cost > 120000) {
      calculate = v_cost / (1 - 0.06);
    } else if (v_cost < 10000) {
      calculate = v_cost / (1 - 0.1);
    } else {
      calculate = v_cost / (1 - (0.1 - (0.04 / 120000) * v_cost));
    }
  } else {
    if (v_cost > 60000) {
      calculate = v_cost / (1 - 0.04);
    } else if (v_cost < 2000) {
      calculate = v_cost / (1 - 0.08);
    } else {
      calculate = v_cost / (1 - (0.08 - (0.04 / 60000) * v_cost));
    }
  }

  if (
    watch_from?.toLowerCase() === "bkk" ||
    watch_from?.toLowerCase() === "t/bkk" ||
    watch_from?.toLowerCase() === "r/bkk"
  ) {
    calculate = calculate + calculate * 0.03;
  }

  // if (from?.toLowerCase() == "hk" || from?.toLowerCase() == "t/hk") {
  //   calculate =
  //     calculate + (calculate * findHKWatchPrice?.basePriceModifier) / 100;
  // }

  // if (
  //   (from?.toLowerCase() == "ny" ||
  //     from?.toLowerCase() == "t/ny" ||
  //     from?.toLowerCase() == "la") &&
  //   new Date(purchase_date) > new Date("2025-03-25")
  // ) {
  //   calculate =
  //     calculate + (calculate * findUSWatchPrice?.basePriceModifier) / 100;
  // }

  if (Math.abs(roundValue(calculate - v_cost)) < 200) {
    return v_cost + 200;
  }

  if (repair_cost_usd <= 50) {
    calculate = calculate;
  } else if (repair_cost_usd >= 1000) {
    calculate = calculate + calculate * 0.03;
  } else {
    let ratio = ((repair_cost_usd - 50) * 3) / 950;
    calculate = calculate + (calculate * ratio) / 100;
  }

  return calculate;
}

export const countShippingFeeAndNetCostUsd = (
  location,
  cost_usd,
  purchase_date,
  watch_from,
  user,
  new_type,
  extra_300_for_rx_where_wholesale_price_20
) => {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );
  const findUSWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "US"
  );
  const findZHWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "ZH"
  );
  let shipping_fee = 0;
  if (
    (new_type === "NEW SPECIAL" || new_type === "NEW") &&
    location?.toLowerCase() !== "ny" &&
    location?.toLowerCase() !== "t/ny" &&
    location?.toLowerCase() !== "r/ny" &&
    location?.toLowerCase() !== "la"
  ) {
    shipping_fee = 0;
    return { shipping_fee };
  } else if (
    (location?.toLowerCase() == "ny" ||
      location?.toLowerCase() == "t/ny" ||
      location?.toLowerCase() == "r/ny" ||
      location?.toLowerCase() == "la") &&
    findUSWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      (cost_usd + extra_300_for_rx_where_wholesale_price_20 || 0) *
        (findUSWatchPrice?.basePriceModifier / 100)
    );
  } else if (
    (location?.toLowerCase() == "bkk" ||
      location?.toLowerCase() == "t/bkk" ||
      location?.toLowerCase() == "r/bkk") &&
    findThilandWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      cost_usd * (findThilandWatchPrice?.basePriceModifier / 100)
    );
  } else if (
    (location?.toLowerCase() == "zh" ||
      location?.toLowerCase() == "t/zh" ||
      location?.toLowerCase() == "r/zh") &&
    findZHWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      cost_usd * (findZHWatchPrice?.basePriceModifier / 100)
    );
  } else {
    shipping_fee = 0;
  }
  return { shipping_fee };
};

export const countShippingFeeOnlyN = (
  location,
  manual_max_price,
  purchase_date,
  watch_from,
  user,
  new_type,
  extra_300_for_rx_where_wholesale_price_20
) => {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );
  const findUSWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "US"
  );
  const findZHWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "ZH"
  );
  let shipping_fee = 0;
  if (
    (location?.toLowerCase() == "ny" ||
      location?.toLowerCase() == "t/ny" ||
      location?.toLowerCase() == "r/ny" ||
      location?.toLowerCase() == "la") &&
    findUSWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      manual_max_price * (findUSWatchPrice?.basePriceModifier / 100)
    );
  } else if (
    (location?.toLowerCase() == "bkk" ||
      location?.toLowerCase() == "t/bkk" ||
      location?.toLowerCase() == "r/bkk") &&
    findThilandWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      manual_max_price * (findThilandWatchPrice?.basePriceModifier / 100)
    );
  } else if (
    (location?.toLowerCase() == "zh" ||
      location?.toLowerCase() == "t/zh" ||
      location?.toLowerCase() == "r/zh") &&
    findZHWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      manual_max_price * (findZHWatchPrice?.basePriceModifier / 100)
    );
  } else {
    shipping_fee = 0;
  }
  return { shipping_fee };
};

export const countReverseShippingFeeOnlyN = (
  location,
  manual_final_w_sale_max_price,
  purchase_date,
  watch_from,
  user,
  new_type,
  extra_300_for_rx_where_wholesale_price_20
) => {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );
  const findUSWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "US"
  );
  const findZHWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "ZH"
  );
  let shipping_fee = 0;
  if (
    (location?.toLowerCase() == "ny" ||
      location?.toLowerCase() == "t/ny" ||
      location?.toLowerCase() == "r/ny" ||
      location?.toLowerCase() == "la") &&
    findUSWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      (manual_final_w_sale_max_price * findUSWatchPrice?.basePriceModifier) /
        (100 + findUSWatchPrice?.basePriceModifier)
    );
  } else if (
    (location?.toLowerCase() == "bkk" ||
      location?.toLowerCase() == "t/bkk" ||
      location?.toLowerCase() == "r/bkk") &&
    findThilandWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      (manual_final_w_sale_max_price *
        findThilandWatchPrice?.basePriceModifier) /
        (100 + findThilandWatchPrice?.basePriceModifier)
    );
  } else if (
    (location?.toLowerCase() == "zh" ||
      location?.toLowerCase() == "t/zh" ||
      location?.toLowerCase() == "r/zh") &&
    findZHWatchPrice?.basePriceModifier
  ) {
    shipping_fee = Math.round(
      (manual_final_w_sale_max_price * findZHWatchPrice?.basePriceModifier) /
        (100 + findZHWatchPrice?.basePriceModifier)
    );
  } else {
    shipping_fee = 0;
  }
  return { shipping_fee };
};

export const countShipping3PerFeeAndNetCostUsd = (
  location,
  cost_usd,
  purchase_date,
  watch_from,
  user,
  new_type
) => {
  const findThilandWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "TH"
  );

  const findZHWatchPrice = user?.pricingBaseRule?.find(
    (item) => item?.watchLocation == "ZH"
  );

  let shipping_fee = 0;
  // net_cost_usd = 0;

  if (new_type === "NEW SPECIAL" || new_type === "NEW") {
    shipping_fee = 0;
    // net_cost_usd = cost_usd;
    return { shipping_fee };
  } else if (
    (location?.toLowerCase() == "ny" ||
      location?.toLowerCase() == "t/ny" ||
      location?.toLowerCase() == "r/ny" ||
      location?.toLowerCase() == "la") &&
    new Date(purchase_date) > new Date("2025-03-25") &&
    watch_from?.toLowerCase() != "nyc"
  ) {
    shipping_fee = Math.round(cost_usd * 0.03);
    // net_cost_usd = cost_usd + shipping_fee;
  } else if (
    (location?.toLowerCase() == "bkk" ||
      location?.toLowerCase() == "t/bkk" ||
      location?.toLowerCase() == "r/bkk") &&
    findThilandWatchPrice?.basePriceModifier &&
    watch_from?.toLowerCase() != "bkk"
  ) {
    shipping_fee = Math.round(
      cost_usd * (findThilandWatchPrice?.basePriceModifier / 100)
    );
    // net_cost_usd = cost_usd + shipping_fee;
  } else if (
    (location?.toLowerCase() == "zh" ||
      location?.toLowerCase() == "t/zh" ||
      location?.toLowerCase() == "r/zh") &&
    findZHWatchPrice?.basePriceModifier &&
    watch_from?.toLowerCase() != "zh"
  ) {
    shipping_fee = Math.round(
      cost_usd * (findZHWatchPrice?.basePriceModifier / 100)
    );
  } else {
    // net_cost_usd = cost_usd;
    shipping_fee = 0;
  }
  return { shipping_fee };
};

export function calculateSuggestedWholesalePriceForBags(v_cost) {
  if (v_cost > 60000) {
    return v_cost / (1 - 0.05);
  } else if (v_cost < 2000) {
    return v_cost / (1 - 0.2);
  } else {
    return v_cost / (1 - (0.2 - (0.05 / 60000) * v_cost));
  }
}

// BQ Column R (Min price)
export function calculateR_MinPrice(
  BO_manualMinPrice,
  BN_minWholesalePrice,
  V_cost,
  BU_totalAmountDecreased,
  CA_Extra
) {
  var result = 0;
  var condition =
    (BO_manualMinPrice > 0 ? BO_manualMinPrice : BN_minWholesalePrice) -
    BU_totalAmountDecreased;
  if (condition > V_cost * 0.87) {
    result = condition;
  } else {
    result = V_cost * 0.87;
  }
  return result + CA_Extra;
}

// BR Range
export function calculateRange(BN_minWholesalePrice, V_cost) {
  // console.log('BN_minWholesalePrice',BN_minWholesalePrice)
  // console.log('V_cost',V_cost)
  return BN_minWholesalePrice - V_cost;
}

// BS Column S (Wholesale price)
export function calculateColS_WhosalePrice(
  BZ_wholesalePriceDecreasedAfterXdaysFromPurchaseDate,
  V_cost,
  CA_Extra
) {
  var result =
    Math.ceil(
      Math.max(
        BZ_wholesalePriceDecreasedAfterXdaysFromPurchaseDate,
        V_cost * 0.9
      ) / 50
    ) * 50;
  return result + CA_Extra;
}

// ------- BT Manual Max Price
// input field (ex. $10,000)

// BU Total amount decreased from Wholesale price
export function calculateTotalAmountDecreasedFromWhosalePrice(
  BD_dayFromPurchaseDate,
  BY_HoldSoldDate,
  B_watchStatus,
  BT_manualMaxPrice,
  BP_SuggestWhosalePriceFromCost,
  v_cost,
  AM_purchaseDate
) {
  // Convert TODAY to a Date object
  var today = new Date();
  console.log(
    "daysBetweenToday(BY_HoldSoldDate, today)",
    daysBetweenToday(BY_HoldSoldDate, today)
  );
  if (BD_dayFromPurchaseDate > 80) {
    if (
      B_watchStatus === null ||
      B_watchStatus === "" ||
      B_watchStatus === "Available" ||
      (daysBetweenToday(BY_HoldSoldDate, today) > 2 && B_watchStatus === "")
    ) {
      // console.log('BY_HoldSoldDate',BY_HoldSoldDate)
      // console.log('B_watchStatus',B_watchStatus)
      console.log("xxx", B_watchStatus);
      return (
        Math.floor(
          ((((BT_manualMaxPrice > 0
            ? BT_manualMaxPrice
            : BP_SuggestWhosalePriceFromCost) -
            v_cost) /
            (200 - 80)) *
            (BD_dayFromPurchaseDate - 80)) /
            150
        ) * 150
      );
    } else {
      console.log("yyyy", B_watchStatus);

      return (
        Math.floor(
          ((((BT_manualMaxPrice > 0
            ? BT_manualMaxPrice
            : BP_SuggestWhosalePriceFromCost) -
            v_cost) /
            (200 - 80)) *
            (daysBetweenToday(BY_HoldSoldDate, today) - AM_purchaseDate - 80)) /
            150
        ) * 150
      );
    }
  } else {
    return 0;
  }
}

// export function calculateTotalAmountDecreasedFromWhosalePrice(BD_dayFromPurchaseDate, BY_HoldSoldDate, B_watchStatus, BT_manualMaxPrice, BP_SuggestWhosalePriceFromCost, v_cost, AM_purchaseDate) {
//     // Convert TODAY to a Date object
//     var today = new Date();
//     console.log('daysBetweenToday(BY_HoldSoldDate, today)',daysBetweenToday(BY_HoldSoldDate, today))
//     if (BD_dayFromPurchaseDate > 80) {
//         if ((BY_HoldSoldDate === "" && B_watchStatus === "") || (daysBetweenToday(BY_HoldSoldDate, today) > 2 && B_watchStatus === "")) {
//             // console.log('BY_HoldSoldDate',BY_HoldSoldDate)
//             // console.log('B_watchStatus',B_watchStatus)
//             return Math.floor(((BT_manualMaxPrice > 0 ? BT_manualMaxPrice : BP_SuggestWhosalePriceFromCost) - v_cost) / (200 - 80) * (BD_dayFromPurchaseDate - 80) / 150) * 150;
//         } else {
//             return Math.floor(((BT_manualMaxPrice > 0 ? BT_manualMaxPrice : BP_SuggestWhosalePriceFromCost) - v_cost) / (200 - 80) * (daysBetweenToday(BY_HoldSoldDate, today) - AM_purchaseDate - 80) / 150) * 150;
//         }
//     } else {
//         return 0;
//     }
// }

// Function to calculate days between two dates
function daysBetweenToday(date, today) {
  if (date === "") {
    return null;
  } else {
    var givenDate = new Date(date);
    var difference = Math.abs(today.getTime() - givenDate.getTime());
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  }
}

// BV W/S price decrease every N days (starting from day 50)
export function calculateDecreasePriceEveryNDays(
  BT_manualMaxPrice,
  BP_SuggestWhosalePriceFromCost,
  v_cost
) {
  var divisor =
    ((BT_manualMaxPrice > 0
      ? BT_manualMaxPrice
      : BP_SuggestWhosalePriceFromCost) -
      v_cost) /
    (200 - 80);
  return 150 / divisor;
}

// BW Wholesale price will decrease next (date)
export function calculateWholesalePriceWillDecreaseNext(
  BU_totalAmountDecreased,
  BV_decreaseEveryNDays,
  BD_dayFromPurchaseDate
) {
  var today = new Date();
  var result = Math.ceil(
    ((BU_totalAmountDecreased + 150) / 150) * BV_decreaseEveryNDays -
      (BD_dayFromPurchaseDate - 80)
  );
  console.log("result", result);
  // Add the result to today's date
  today.setDate(today.getDate() + result);
  console.log(today);
  return today;
}

// ------- BY Hold price (add 'Y' or leave empty)
// when status change to SOLD, replace with current date

// BZ Wholesale price decreased after X days from purchase date
export function calculateWholesalePriceDecreasedAfterDay(
  BT_manualMaxPrice,
  BP_SuggestWhosalePriceFromCost,
  BU_totalAmountDecreased
) {
  return (
    (BT_manualMaxPrice > 0
      ? BT_manualMaxPrice
      : BP_SuggestWhosalePriceFromCost) - BU_totalAmountDecreased
  );
}

// CA Extra $300 for RX where wholesale price > $20,000 and box INCLUDED
export function calculateCAExtra(f_brand, S_wholesalePrice, P_watchBox) {
  if (
    f_brand === "RX" &&
    S_wholesalePrice >= 20000 &&
    P_watchBox === "INCLUDED"
  ) {
    return 300;
  } else {
    return 0;
  }
}

// T retail price
export function calculateRetailPrice(final_w_sale_max_price_rounded) {
  var result;
  if (final_w_sale_max_price_rounded < 40000) {
    result = final_w_sale_max_price_rounded * 1.07;
  } else if (final_w_sale_max_price_rounded > 70000) {
    result = final_w_sale_max_price_rounded * 1.03;
  } else {
    result = final_w_sale_max_price_rounded * 1.04;
  }
  return Math.round(result / 5) * 5;
}

// AR ch24 USD+6%
export function calculateCH24Usd_6(
  BD_dayFromPurchaseDate,
  T_retailPrice,
  P_watchBox
) {
  var result;
  var valueToRound = T_retailPrice * 1.06;
  var roundedValue = Math.round(valueToRound / 5) * 5;

  if (BD_dayFromPurchaseDate >= 150) {
    result = Math.round(roundedValue * 1.02);
  } else {
    result = roundedValue;
  }

  var additionalValue = 0;
  if (
    P_watchBox !== "" &&
    P_watchBox !== "Blank" &&
    P_watchBox !== "N/A" &&
    P_watchBox !== "INCLUDED"
  ) {
    let cleanedStr = ``;
    if (typeof P_watchBox == "number") {
      cleanedStr = String(P_watchBox);
    } else {
      cleanedStr = P_watchBox.replace(/[^0-9]/g, "");
    }
    additionalValue = parseInt(cleanedStr, 10);
    // additionalValue = parseInt(P_watchBox.slice(-3)); // Extract last three characters and convert to integer
  }
  // console.log('result',result)
  // console.log('additionalValue',additionalValue)

  return result + additionalValue;
}

export function calculateDayFromPurchaseDate(date) {
  // Assuming AM6 contains a date string in ISO format (e.g., "2024-05-03")
  const AM6Date = new Date(date);
  const today = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = today.getTime() - AM6Date.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  console.log(`${differenceInDays} Days from purchase Date`); // Output: Number of days between today and the date in AM6
  return differenceInDays;
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// currency-convert

export const hkdFormatter = new Intl.NumberFormat("en-HK", {
  style: "currency",
  currency: "HKD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function getConvertedCurrency(amount = 0, currency = "USD", rate = 1) {
  if (typeof amount !== "number" || typeof rate !== "number" || rate <= 0) {
    throw new Error("Invalid amount or rate.");
  }
  if (currency === "HKD") {
    return hkdFormatter.format(Math.round((amount * rate) / 10) * 10);
  }
  return formatter.format(amount);
}

export function convertBoxValue(value = "+ $0", currency = "USD", rate = 1) {
  if (currency === "HKD") {
    const match = value.match(/[\d,\.]+/);
    if (!match) {
      throw new Error("Invalid format: unable to extract numeric value");
    }

    const usdValue = parseFloat(match[0].replace(/,/g, ""));
    return `+ ${getConvertedCurrency(usdValue, currency, rate)}`;
  }
  return value;
}

export const formatDate = (dateString) => {
  const [year, month, day] = dateString?.split("T")[0].split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${parseInt(day)}-${monthNames[parseInt(month) - 1]}-${year}`;
};

export const formatDateAnyFormat = (date) => {
  // If it's a string in YYYY-MM-DD format (e.g., "2001-12-16")
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date; // Return as is
  }
  // Check if it's a Date object
  if (date instanceof Date) {
    const year = date.getFullYear(); // Get the year (YYYY)
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (01-12)
    const day = date.getDate().toString().padStart(2, "0"); // Get day (01-31)
    return `${year}-${month}-${day}`;
  }
  // Check if it's an ISO 8601 string (contains 'T')
  if (typeof date === "string" && date.includes("T")) {
    return date.split("T")[0]; // Extract the date part from ISO string (YYYY-MM-DD)
  }
  // Fallback for unsupported formats
  return null;
};

// B=Status (SOLD/blank)
// F=Brand
// S=wholesale price
// T=retail price
// V=Cost USD
// AM=Purchase date
// P=BOX
// BQ=minimum sale price
// BS=wholesale price
// BD=Days from Purchase Date
// BT=Manual Max Price
// T=Retail Price
// AR=ch24 USD+6%

export const cityMapDisplayFlag = {
  ny: "US2",
  "t/ny": "US2",
  "r/ny": "US2",
  la: "US2",
  tky: "HK",
  "t/tky": "HK",
  "r/tky": "HK",
  bkk: "TH",
  "t/bkk": "TH",
  "r/bkk": "TH",
  hk: "HK",
  "t/hk": "HK",
  "r/hk": "HK",
  it: "HK",
  "t/it": "HK",
  "r/it": "HK",
  t: "HK",
  zh: "ZH",
  "t/zh": "ZH",
  "r/zh": "ZH",
};

export const cityMapDisplayFlagForShipping = {
  tky: "JP",
  "t/tky": "JP",
  "r/tky": "JP",
  hk: "HK",
  "t/hk": "HK",
  "r/hk": "HK",
  zh: "ZH",
  "t/zh": "ZH",
  "r/zh": "ZH",
  ny: "US2",
  th: "TH",
};

export const CITY_MAP_FLAG = {
  ny: "United States",
  "t/ny": "United States",
  "r/ny": "United States",
  la: "United States",
  tky: "Hong Kong S.A.R.",
  "t/tky": "Hong Kong S.A.R.",
  "r/tky": "Hong Kong S.A.R.",
  bkk: "Thailand",
  "t/bkk": "Thailand",
  "r/bkk": "Thailand",
  hk: "Hong Kong S.A.R.",
  "t/hk": "Hong Kong S.A.R.",
  "r/hk": "Hong Kong S.A.R.",
  it: "Hong Kong S.A.R.",
  "t/it": "Hong Kong S.A.R.",
  "r/it": "Hong Kong S.A.R.",
  t: "Hong Kong S.A.R.",
  zh: "Switzerland",
  "t/zh": "Switzerland",
  "r/zh": "Switzerland",
};

export const PICK_OPTION_COUNTRY = ["United States", "Thailand"];

export const CLIENT_COUNTRY_OBJ = {
  Thailand: "TH",
  "United States": "US",
};

export const CLIENT_COUNTRY_SHOWDROPDOWN = {
  "United States": "US",
  "Hong Kong S.A.R.": "HK",
  Thailand: "TH",
  Switzerland: "ZH",
};

export const WATCH_LOACTION = {
  ny: "US",
  "t/ny": "US",
  "r/ny": "US",
  la: "US",
  tky: "HK",
  "t/tky": "HK",
  "r/tky": "HK",
  bkk: "TH",
  "t/bkk": "TH",
  "r/bkk": "TH",
  hk: "HK",
  "t/hk": "HK",
  "r/hk": "HK",
  it: "HK",
  "t/it": "HK",
  "r/it": "HK",
  t: "HK",
  zh: "ZH",
  "t/zh": "ZH",
  "r/zh": "ZH",
};

export const myMultiPlyer = (user, newDisplayPriceModifier) => {
  return (100 + newDisplayPriceModifier) / 100;

  // if (user?.country === "United States") {
  //   return (100 + user?.usaShippingFeePercentage) / 100;
  // } else if (user?.country === "Thailand") {
  //   return (100 + user?.thaiShippingFeePercentage) / 100;
  // } else {
  //   return 1;
  // }
};

export const myDiscountPrice = (originalPrice, myDiscountPercentage) => {
  return originalPrice * ((100 + myDiscountPercentage) / 100);
};

export const OFFICE_LOC = {
  ny: "NYC",
  nyc: "NYC",
  "t/ny": "NYC",
  "r/ny": "NYC",
  la: "NYC",
  tky: "JAPAN",
  "t/tky": "JAPAN",
  "r/tky": "JAPAN",
  bkk: "BBK",
  "t/bkk": "BBK",
  "r/bkk": "BBK",
  hk: "HK",
  "t/hk": "HK",
  "r/hk": "HK",
  zh: "ZH",
};

export const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

export const brandNameMap = {
  RX: "Rolex",
  PP: "Patek Philippe",
  AP: "Audemars Piguet",
  CR: "Cartier",
  VC: "Vacheron Constantin",
  HE: "Hermès",
  LV: "Louis Vuitton",
  CH: "Chopard",
  BP: "Blancpain",
  BR: "Breitling",
  CP: "Corum",
  IWC: "IWC Schaffhausen",
  JLC: "Jaeger-LeCoultre",
  LS: "A. Lange & Söhne",
  LG: "Longines",
  OP: "Officine Panerai",
  OM: "Omega",
  PG: "Piaget",
  HU: "Hublot",
  TU: "Tudor",
  VF: "Van Cleef & Arpels",
  RJ: "RJ Watches",
  BV: "Bvlgari",
  TH: "Tissot",
};

export const locationDisplayFlag = {
  us: "US2",
  hk: "HK",
  th: "TH",
  zh: "ZH",
  tky: "JP",
  it: "IT",
};
