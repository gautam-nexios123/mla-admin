import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import ImageSliderDialog from "../../ImageSlider";
import { TagBox, TagPaper, TagStatus } from "./TagChips";
import {
  cityMapDisplayFlag,
  getConvertedCurrency,
} from "src/utils/coreFunction";
import ActionButton from "./ActionButton";
import { addRow, removeRow, selectedRows } from "app/store/checkoutSlice";

export default function ProductCardView(props: any) {
  const { data } = props;
  console.log("data: ", data);
  const dispatch = useAppDispatch();
  const user: any = useSelector(selectUser);
  const [buyNowClick, setBuyNowClick] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const checkoutSelectedRows: any = useSelector(selectedRows);

  useEffect(() => {}, [buyNowClick]);

  const isSelected = checkoutSelectedRows?.some(
    (item) => item?.stockId === data?.stockId
  );
  const city = cityMapDisplayFlag[data?.location?.toLowerCase()] || null;

  return (
    <Card
      className={`flex flex-col gap-[20px] mt-[15px] h-full ${isMobile ? "w-[300px]" : "w-[280px]"}`} //lg:max-w-[280px] md:max-w-[280px] xl:max-w-[300px]
    >
      <div className="relative w-full flex items-center justify-center arrow-btn">
        {/* Image */}
        {/* <img
          onError={(e) => {
            e.currentTarget.src = "assets/images/logo/mla.svg";
          }}
          className=" w-full"
          src={data.thumbnailUrl}
          alt={"Product Thumbnail"}
          style={{ width: '250px', height: '250px', objectFit: 'cover' }}
        /> */}

        {/* Icon for images */}
        {/* <ImageSliderDialog
          // selectedRow={{ stockId: data.stockId, total_images: data.total_images, have_video: data.have_video }}
          selectedRow={data}
          isGridView={true}
        /> */}
        <div className="relative">
          {data?.status === "Sold" && (
            <p
              className="absolute top-[50%] left-[50%] z-[100] "
              style={{
                transform: "translate(-50%, -50%)",
                borderRadius: "3px",
              }}
            >
              <span
                className="py-[0px] px-[15px] text-[30px] font-semibold text-[red] bg-[#ffffff87] top-[-12px] left-[-50px]"
                style={{
                  transform: "rotateZ(-38deg)",
                  position: "absolute",
                  border: "1px solid red",
                }}
              >
                {" "}
                SOLD{" "}
              </span>
            </p>
          )}
          {/* Icon for images */}
          <ImageSliderDialog
            // selectedRow={{ stockId: data.stockId, total_images: data.total_images, have_video: data.have_video }}
            selectedRow={data}
            isGridView={true}
          />{" "}
        </div>
      </div>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Typography
          gutterBottom
          variant="body2"
          component="div"
          className="text-xl font-600 p-0"
        >
          {data.brand} {data.collection}
          {" - "}
          {data.model}
        </Typography>

        <div className="italic text-[13px] text-black text-center pb-[10px]">
          {data?.modelName}
        </div>

        <div className="flex flex-row gap-8">
          <TagStatus status={data.status} />
          {TagPaper(data.paper)}
          {TagBox(data.watch_box, user)}
        </div>

        <Divider
          className="pt-4 pb-4"
          orientation="horizontal"
          variant="fullWidth"
          flexItem
        />

        <div className="flex flex-col w-full items-start  space-y-6">
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Serial No.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.serial_no}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Dial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.dial}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Strap/Bracelet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.strap_bracelet}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              No. of links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.num_of_links}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Paper Date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.paper_date
                ? moment(data.paper_date).format("DD-MMM-YYYY")
                : "-"}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Stock ID
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.stockId}
            </Typography>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Wholesale Price
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getConvertedCurrency(
                data?.wholesale_price_usd,
                user?.currency,
                user?.exchangeRate
              )}
            </Typography>
          </div>

          <div className="flex flex-row justify-between items-center w-full">
            <Typography
              variant="body2"
              color="black"
              className="font-500 mr-10"
            >
              Notes
            </Typography>
            <div className="relative group">
              {/* The note will be trimmed to fit in one line / the full text can be viewed by hovering over the note with the mouse */}
              <Typography
                className="text-right text-sm"
                variant="body1"
                color="text.secondary"
              >
                {data.notes ? data.notes : "-"}
              </Typography>

              {/* This is the hovering text to display the full data */}
              {data.notes && (
                <div className="absolute right-0 bottom-full mb-2 hidden w-max max-w-xs rounded-md bg-gray-700 text-white text-xs px-10 py-3 group-hover:block">
                  {data.notes}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="body2" color="black" className="font-500">
              Location
            </Typography>
            <Typography
              className="max-w-[25px] max-h-[25px]"
              variant="body2"
              color="text.secondary"
            >
              <img
                className="w-full h-full"
                src={`assets/images/flags/${city}.svg`}
                alt={"flag"}
              />
            </Typography>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <div className="flex flex-row justify-between w-full gap-6">
          <ActionButton selectedRow={data} />
          {data?.status !== "Sold" && (
            <div>
              {isSelected ? (
                <button
                  role="button"
                  // variant="contained"
                  className={`w-auto text-white text-[14px] bg-[red] px-[8px] py-[4px] rounded-[4px] hover:bg-red] cursor-pointer  `}
                  onClick={() => dispatch(removeRow(data))}
                >
                  X
                </button>
              ) : (
                <button
                  role="button"
                  // variant="contained"
                  className={`w-auto text-white text-[14px] bg-[#2196f3] px-[8px] py-[4px] rounded-[4px] hover:bg-[#2196f3] cursor-pointer  `}
                  onClick={() => dispatch(addRow(data))}
                >
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>
      </CardActions>
    </Card>
  );
}
