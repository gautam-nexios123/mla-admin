import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import CustomVideoPlayerImageSlider from "./CustomVideoPlayerImageSlider";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    margin: 0,
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    overflowY: "hidden",
    borderRadius: "0px",
  },
}));

export default function ImageSliderDialog({
  selectedRow,
  isGridView,
  isStockViewPanel,
}) {
  const [open, setOpen] = React.useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* Button when the dialog is closed */}
      {isStockViewPanel ? (
        <div
          onClick={handleClickOpen}
          className="relative w-full cursor-pointer text-blue-600 hover:text-blue-800 underline"
        >
          {selectedRow?.stockId}
        </div>
      ) : (
        <div className="relative w-full">
          <img
            src={selectedRow.thumbnailUrl}
            alt=""
            onClick={handleClickOpen}
            style={
              isGridView
                ? { width: "250px", height: "250px", objectFit: "cover" }
                : { width: "105px", height: "105px", objectFit: "cover" }
            }
            className="lg:max-w-full object-contain mx-auto cursor-pointer"
          />
          <div
            className={`absolute text-white text-[9px] sm:text-[11px] ${isGridView ? "right-[10px] top-[6px]" : "right-[-10px] top-0"} bg-[#999999] px-[6px] py-[2px]`}
          >
            1 /{" "}
            {selectedRow?.total_images +
              (selectedRow?.have_video === "MOV" ||
              selectedRow?.have_video === "MP4"
                ? 1
                : 0)}
          </div>
          {/* <ThumbnailSlider selectedRow={selectedRow} onClick={handleClickOpen} isGridView={isGridView} /> */}
        </div>
      )}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={true}
      >
        {/* This is the title */}
        {!isClicked && (
          <DialogTitle
            display="flex"
            justifyContent="end"
            sx={{ m: 0, p: 1 }}
            id="customized-dialog-title"
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </DialogTitle>
        )}

        {/* This is content when the dialog is open */}
        <DialogContent
          dividers
          className={`overflow-y-hidden flex  items-center ${isClicked ? "!p-[0] !bg-[black]" : ""} `}
        >
          <ImageSlider
            selectedRow={selectedRow}
            open={open}
            isClicked={isClicked}
            setIsClicked={setIsClicked}
          />
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export function ImageSlider({ selectedRow, open, isClicked, setIsClicked }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stockId = selectedRow.stockId;
  const totalImages = selectedRow.total_images;
  const haveVideo = selectedRow.have_video;

  //Getting the images and video URL
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = GenerateUrl(
    stockId,
    totalImages,
    haveVideo,
    false,
    isClicked,
    setIsClicked,
    isFullScreen,
    setIsFullScreen
  );

    const [filteredImages, setFilteredImages] = useState(images);

  // Function to check if images are valid
  useEffect(() => {
    let isMounted = true;
    async function checkImages() {
      const results = await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.type !== "image") return resolve(img);  
              const tester = new window.Image();
              tester.onload = () => resolve(img);
              tester.onerror = () => resolve(null);
              tester.src = img.original;
            })
        )
      );
      if (isMounted) setFilteredImages(results.filter(Boolean));
    }
    checkImages();
    return () => {
      isMounted = false;
    };
  }, [stockId, totalImages, haveVideo, isClicked, isFullScreen]);

  useEffect(() => {
    if (isClicked || isFullScreen) {
      const videoIndex = images?.findIndex((item) => item?.type === "video");
      if (videoIndex >= 0) {
        setCurrentIndex(videoIndex);
      }
    }
  }, [isClicked, isFullScreen]);

  return (
    <div className="w-full">
      <ImageGallery
        startIndex={currentIndex}
        onSlide={(index) => setCurrentIndex(index)}
        showIndex
        showFullscreenButton={false}
        useBrowserFullscreen={false}
        showPlayButton={false}
        items={filteredImages}
        renderItem={(item) => _renderItem(item, open, isMobile)}
        disableSwipe={isClicked}
      />
    </div>
  );
}

export function ThumbnailSlider({ selectedRow, onClick, isGridView }) {
  const stockId = selectedRow.stockId;
  const totalImages = selectedRow.total_images;
  const haveVideo = selectedRow.have_video;

  //Getting the images and video URL
  const [isClicked, setIsClicked] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const images = GenerateUrl(
    stockId,
    totalImages,
    haveVideo,
    true,
    isClicked,
    setIsClicked,
    isFullScreen,
    setIsFullScreen
  );

  function _renderData(item) {
    if (item.type === "video") {
      return null;
    }

    // Render image if it's not a video
    return (
      <div className="flex items-center justify-center">
        <img
          src={item.original}
          alt=""
          onClick={onClick}
          style={
            isGridView
              ? { width: "250px", height: "250px", objectFit: "cover" }
              : {}
          }
          className="w-[80%] lg:max-w-full h-[97px] object-contain mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ImageGallery
        renderLeftNav={(onClick, disabled) => (
          <IconButton
            aria-label="close"
            onClick={() => {
              console.log("testleft");
              onClick();
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
            className={"leftArrow"}
            disabled={disabled}
          >
            <FaChevronLeft />
          </IconButton>
        )}
        renderRightNav={(onClick, disabled) => (
          <IconButton
            aria-label="close"
            onClick={() => {
              console.log("testRight");
              onClick();
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
            className={"rigthArrow"}
            disabled={disabled}
          >
            <FaChevronRight />
          </IconButton>
        )}
        showFullscreenButton={false}
        showPlayButton={false}
        items={images}
        renderItem={_renderData}
      />
    </div>
  );
}

function GenerateUrl(
  stockId,
  totalImages,
  haveVideo,
  isThumbnail,
  isClicked,
  setIsClicked,
  isFullScreen,
  setIsFullScreen
) {
  const items = [];

  // Looping through the image count and adding into the items array
  for (let i = 1; i <= totalImages; i++) {
    const stockIdBuffer = `${stockId}${i === 1 ? "" : `-${i}`}`;
    const image = {
      original: `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${stockIdBuffer}.jpg`,
      type: "image",
    };
    items.push(image);
  }

  if (!isThumbnail) {
    // Adding the video to the items array if available
    if (haveVideo === "MOV" || haveVideo === "MP4") {
      const videoUrl = `https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/${stockId}-VDO.${haveVideo === "MP4" ? "mp4" : haveVideo}`;
      items.push({
        original: videoUrl,
        renderItem: () => (
          <div className={`relative`}>
            {/* <div className={`${stockId !== "53387" && "hide-soundBtn"} relative`}> */}
            {/* <ReactPlayer
              url={videoUrl}
              controls
              playing={false}
              muted={true}
              width="100%"
              height="550px"
              className="max-w-full sm:max-w-[400px] md:max-w-[600px] w-full object-contain flex items-center justify-center h-full m-auto py-[10px]"
              config={{
                file: {
                  attributes: {
                    controlsList: "fullscreen",
                  },
                },
              }}
            /> */}

            <CustomVideoPlayerImageSlider
              videoUrl={videoUrl}
              stockId={stockId}
              setIsClicked={setIsClicked}
              isClicked={isClicked}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
            />
          </div>
        ),
        type: "video",
      });
    }
  }
  return items;
}

function _renderItem(item, open, isMobile) {
  if (item.type === "video") {
    return item.renderItem();
  }

  // Render image if it's not a video
  return (
    <div className="flex items-center justify-center h-full">
      {isMobile ? (
        <div className="flex items-center justify-center h-full">
          <img
            src={item.original}
            alt=""
            className={
              open
                ? "max-w-full sm:max-w-[400px] md:max-w-[calc(100vh-90px)]"
                : "w-full h-auto object-contain"
            }
          />
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <img
            src={item.original}
            alt=""
            className={
              open
                ? "max-w-full sm:max-w-[400px] md:max-w-[calc(100vh-90px)] transition-transform duration-200"
                : "w-full h-auto object-contain transition-transform duration-200"
            }
            style={{
              transformOrigin: "var(--mouse-x) var(--mouse-y)",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
              e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
              e.currentTarget.style.transform = "scale(1.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
      )}
    </div>
  );
}
