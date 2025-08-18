import { styled } from "@mui/material/styles";
import Hidden from "@mui/material/Hidden";
import { useState } from "react";
import { MenuItem, Popover } from "@mui/material";
import { useSelector } from "react-redux";
import {
  setActiveRole,
  userActiveRoleState,
} from "app/store/userActiveRoleSlice";
import { useAppDispatch } from "app/store/store";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useNavigate } from "react-router";

const Root = styled("div")(({ theme }) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

/**
 * The logo component.
 */
function Logo() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const userData: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (
      (userData?.isMasterLuxury && userData?.isMla) ||
      userData?.role === "SUPER_ADMIN"
    ) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const menuClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Root className="flex items-center w-[60px]">
      {userActiveRole === "MLA" ? (
        <img
          onClick={handleClick}
          className="logo-icon h-32 cursor-pointer"
          src="assets/images/logo/mla.svg"
          alt="logo"
        />
      ) : (
        <img
          onClick={handleClick}
          className="logo-icon h-32 cursor-pointer"
          src="assets/images/logo/master-luxury-logo.png"
          alt="logo"
        />
      )}
      {/* <Hidden lgDown>
        <div className="flex space-x-8 items-center">
          <h3 className="mx-10">MLA Group Administration</h3>
        </div>
      </Hidden> */}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={menuClose}
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
        <MenuItem
          onClick={() => {
            menuClose();
            dispatch(setActiveRole("MLA"));
            navigate("/");
          }}
          role="button"
          className={`px-10 ${userActiveRole === "MLA" && "bg-grey-400 hover:bg-grey-400"}`}
        >
          <div className="flex items-center w-full">
            <img
              className="logo-icon h-[25px] cursor-pointer"
              src="assets/images/logo/mla.svg"
              alt="logo"
            />
            {/* MLA */}
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            menuClose();
            dispatch(setActiveRole("ML"));
            navigate("/");
          }}
          role="button"
          className={`px-10 ${userActiveRole === "ML" && "bg-grey-400 hover:bg-grey-400"}`}
        >
          <div className="flex items-center w-full">
            <img
              className="logo-icon h-[28px] cursor-pointer"
              src="assets/images/logo/master-luxury-logo.png"
              alt="logo"
            />
            {/* Master Luxury */}
          </div>
        </MenuItem>
      </Popover>
    </Root>
  );
}

export default Logo;
