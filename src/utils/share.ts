import axios from "axios";
import { Buffer } from "buffer";
import { formatter } from "./coreFunction";
// Make Buffer globally available
window.Buffer = Buffer;

export const generateShareLink = (
  m: any,
  user: any,
  selectedOption: any,
  withInfo: boolean
) => {
  let priceObj = {};

  if (selectedOption === "wholeSalePrice") {
    priceObj = {
      price: formatter.format(m?.wholesale_price_usd),
    };
  } else if (selectedOption === "retailPrice") {
    priceObj = {
      price: formatter.format(m?.retail_price_usd),
    };
  } else if (selectedOption === "noPrice") {
    priceObj = {
      price: 0,
    };
  }

  const productItems = {
    stockId: `${m[`stockId`]}`,
    image: `${m[`thumbnailUrl`]}`,
    brand: `${m[`brand`]}`,
    model: `${m[`model`]}`,
    serial_no: `${m[`serial_no`]}`,
    num_of_links: `${m[`num_of_links`]}`,
    strap_bracelet: `${m[`strap_bracelet`]}`,
    paper: `${m[`paper`]}`,
    paper_date: `${m[`paper_date`]}`,
    watch_box: `${m[`watch_box`]}`,
    // wholesale_price_usd: m[`wholesale_price_usd`] || 0,
    notes: `${m[`notes`]}`,
    total: `${m[`total_images`]}`,
    video: `${m[`have_video`]}`,
    modelName: `${m[`modelName`]}`,
  };
  const productItems1 = { ...productItems, ...priceObj };

  const companyInfo = {
    companyLogo: withInfo
      ? `https://www.mlawatches.com/assets/images/logo/mla.svg`
      : "",
    companyName: withInfo ? `MLA Watches` : "",
    companyAddress1: `${user[`address`]}`,
    companyAddress2: `${user[`city`]} ${user[`country`]} ${user[`postalCode`]}`,
    companyPhone: `${user[`phone`]}`,
    companyEmail: `${user[`email`]}`,
    products: [productItems1],
    withInfo: withInfo,
    isIncludeYourDataInShareLink: `${user[`isIncludeYourDataInShareLink`]}`,
  };

  // Encode data
  let buff = Buffer.from(JSON.stringify(companyInfo));
  let base64data = encodeURI(buff.toString("base64"));

  const urlLanding = "http://watchesforums.s3-website-us-east-1.amazonaws.com/";
  const link = `${urlLanding}?quotation=${encodeURIComponent(base64data)}`;
  console.log("link: ", link);

  return link;
};

export const ConvertShortLink = async (shareLink) => {
  const response = await axios.get(
    `https://api-dev.mlawatches.com/api/customer/stock/shorty-url?url=${shareLink}`
  );
  if (response?.data?.statusCode === 200) {
    let shortenedUrl = response?.data?.results?.shortenedUrl;
    if (shortenedUrl?.startsWith("https://")) {
      shortenedUrl = shortenedUrl.replace("https://", "http://");
    }
    return shortenedUrl;
  }
};
