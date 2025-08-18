import { styled } from "@mui/material/styles";
import Button, { buttonClasses } from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useAuth } from "src/app/auth/AuthRouteProvider";
// import { ArrowDownward } from "@material-ui/icons";
import SouthIcon from "@mui/icons-material/South";
import {
  selectStockListDirection,
  selectStockListSort,
  setStockListDirection,
  setStockListSort,
} from "app/store/stockSlice";
import { useAppDispatch } from "app/store/store";
import { useThemeMediaQuery } from "@fuse/hooks";

const StyledButton = styled(Button)(({ theme }) => ({
  [`&.${buttonClasses.outlined}`]: {
    borderColor: "lightgray",
  },
}));
/**
 * The user menu.
 */
function SortMenu() {
  const sortParameters = useSelector(selectStockListSort);
  const directionParameters = useSelector(selectStockListDirection);
  const [sortValue, setSortParameters] = useState<string>(sortParameters);
  const [directionValue, setDirectionParameters] =
    useState<string>(directionParameters);
  const dispatch = useAppDispatch();

  const [SortMenu, setSortMenu] = useState<HTMLElement | null>(null);

  const SortMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenu(event.currentTarget);
  };

  const SortMenuClose = () => {
    setSortMenu(null);
  };

  const handleSortParams = (sort, direction) => {
    console.log(`sort:: ${sort} , direction:: ${direction}`);
    if (sort != "" && direction != "") {
      setSortParameters(sort);
      setDirectionParameters(direction);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setStockListSort(sortValue));
      dispatch(setStockListDirection(directionValue));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sortValue, directionValue]);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <>
      <div className="hidden sm:block cursor-pointer">
        <StyledButton
          // className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
          className={`${isMobile ? `w-64` : `w-92`}`}
          onClick={SortMenuClick}
          color="inherit"
          size={`${isMobile ? `small` : `medium`}`}
          variant="outlined"
          sx={{
            "& .MuiButton-startIcon": {
              marginRight: isMobile ? "1px" : "8px",
            },
          }}
          startIcon={<SouthIcon />}
        >
          <div className="mx-0 flex-col items-end md:flex">
            <Typography className="username whitespace-nowrap text-11 font-medium">
              Sort by
            </Typography>
          </div>
        </StyledButton>
      </div>

      <div onClick={SortMenuClick} className="block sm:hidden cursor-pointer bg-white shadow-1 rounded-[4px] p-[2px]">
        <SouthIcon className="!text-[18px]" />
      </div>

      <Popover
        open={Boolean(SortMenu)}
        anchorEl={SortMenu}
        onClose={SortMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        {/* <MenuItem>
          <ListItemIcon className="min-w-40">
            <FuseSvgIcon>heroicons-outline:cube</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Relevance"
            onClick={() => handleSortParams("totalClick", "desc")}
          />
        </MenuItem> */}
        <MenuItem>
          <ListItemIcon className="min-w-40">
            <FuseSvgIcon>heroicons-outline:currency-dollar</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Price (low to high)"
            onClick={() => handleSortParams("wholesale_price_usd", "asc")}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon className="min-w-40">
            <FuseSvgIcon>heroicons-outline:currency-dollar</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Price (high to low)"
            onClick={() => handleSortParams("wholesale_price_usd", "desc")}
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon className="min-w-40">
            <FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Date (most recent first)"
            onClick={() => handleSortParams("createdAt", "desc")}
          />
        </MenuItem>
      </Popover>
    </>
  );
}

export default SortMenu;
