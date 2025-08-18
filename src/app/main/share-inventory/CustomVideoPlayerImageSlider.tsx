import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEffect, useRef, useState } from "react";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomVideoPlayerImageSlider = ({
  videoUrl,
  stockId,
  setIsClicked,
  isClicked,
  isFullScreen,
  setIsFullScreen,
}: any) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(stockId === "53387");

  const [progress, setProgress] = useState<number>(0); // % progress
  const [duration, setDuration] = useState<number>(0); // total seconds
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isIOS) {
      togglePlayPause();
    }
  }, [isIOS]);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  // const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (isIOS) {
      setIsClicked(!isClicked);
    } else {
      if (videoContainerRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullScreen(false);
        } else {
          videoContainerRef.current.requestFullscreen();
          setIsFullScreen(true);
        }
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsClicked(false);
      setIsFullScreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        const current = video.currentTime;
        const total = video.duration || 0;

        const countProgress = (current / total) * 100;
        setProgress(countProgress);

        if (countProgress == 100) {
          setIsPlaying(false);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (videoRef.current && duration) {
      videoRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={videoContainerRef}
      className="hide-soundBtn relative w-full flex items-center justify-center flex-col h-full m-auto py-[10px]"
      style={{ background: isClicked ? "black" : "" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p
        style={{ color: isFullScreen || isClicked ? "white" : "black" }}
        className="absolute top-[50%] text-black font-600 text-[16px]"
      >
        Tap to watch video
      </p>
      <video
        ref={videoRef}
        style={{
          maxHeight:
            isFullScreen || isClicked
              ? isMobile
                ? "72vh"
                : "85vh"
              : isMobile
                ? "400px"
                : "calc(100vh - 150px)",
          maxWidth: isFullScreen ? (isMobile ? "72vh" : "85vh") : "100%",
        }}
        className="pt-[20px] z-10"
        src={videoUrl}
        // onClick={togglePlayPause}
        onLoadedData={handleLoadedData}
        playsInline
        preload="auto"
        muted={stockId === "53387" ? isMuted : true}
      />

      {isLoaded && (
        <div className="w-full px-4 pb-2 flex flex-col gap-2 z-30">
          {/* Progress Bar */}

          <div className="w-full flex justify-center mt-[10px]">
            <div className={`w-[70%] sm:w-[30%]`}>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSliderChange}
                className="w-full cursor-pointer accent-blue-500 "
              />

              <div
                style={{ color: isFullScreen || isClicked ? "white" : "black" }}
                className="flex justify-between text-xs mt-[2px] px-[6px]"
              >
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="px-4 py-2"
            >
              {isPlaying ? (
                <PauseCircleIcon
                  sx={{
                    fontSize: "35px !important",
                    color: isFullScreen || isClicked ? "white" : "black",
                  }}
                />
              ) : (
                <PlayCircleIcon
                  sx={{
                    fontSize: "35px !important",
                    color: isFullScreen || isClicked ? "white" : "black",
                  }}
                />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen();
              }}
              className="px-4 py-2"
            >
              {isFullScreen || isClicked ? (
                <FullscreenExitIcon
                  sx={{
                    fontSize: "35px !important",
                    color: "white",
                  }}
                />
              ) : (
                <FullscreenIcon
                  sx={{
                    fontSize: "35px !important",
                    color: "black",
                  }}
                />
              )}
            </button>

            {stockId === "53387" && (
              <button className="px-4 py-2" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeOffIcon
                    sx={{
                      fontSize: "35px !important",
                      color: isFullScreen || isClicked ? "white" : "black",
                    }}
                  />
                ) : (
                  <VolumeUpIcon
                    sx={{
                      fontSize: "35px !important",
                      color: isFullScreen || isClicked ? "white" : "black",
                    }}
                  />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayerImageSlider;
