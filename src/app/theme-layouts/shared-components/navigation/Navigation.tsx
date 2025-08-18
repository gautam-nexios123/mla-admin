import FuseNavigation from "@fuse/core/FuseNavigation";
import clsx from "clsx";
import { useMemo } from "react";
import { useAppDispatch } from "app/store/store";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { FuseNavigationProps } from "@fuse/core/FuseNavigation/FuseNavigation";
import { useSelector } from "react-redux";
import withSlices from "app/store/withSlices";
import { navigationSlice, selectNavigation } from "./store/navigationSlice";
import { navbarCloseMobile } from "../navbar/store/navbarSlice";
import jwtDecode from "jwt-decode";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {
  setActiveRole,
  userActiveRoleState,
} from "app/store/userActiveRoleSlice";

/**
 * Navigation
 */

type NavigationProps = Partial<FuseNavigationProps>;

function Navigation(props: NavigationProps) {
  const { className = "", layout = "vertical", dense, active } = props;

  const navigation = useSelector(selectNavigation);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const dispatch = useAppDispatch();
  const userData: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const filterNavigationItems = (items) => {
    
    const {
      role,
      isMasterLuxury,
      isMla,
      modulesPermissions,
      modulesPermissionsMasterLuxury,
    } = userData;

    const getFilteredItems = (permissions) => {
      return items?.filter((item) => {
        const permission = permissions?.find(
          (module) => module.moduleName === item.id
        );
        return permission ? permission.isView || permission.isEdit : false;
      });
    };

    const getSuperAdminFilteredItems = (permissions) => {
      return items?.filter((item) => {
        const permission = permissions?.find(
          (module) => module?.moduleName === item.id
        );
        return permission;
      });
    };

    if (role === "SUPER_ADMIN") {
      if (userActiveRole === "ML") {
        return getSuperAdminFilteredItems(modulesPermissionsMasterLuxury);
      }
      if (userActiveRole === "MLA") {
        return getSuperAdminFilteredItems(modulesPermissions);
      }
      // return items;
    } else {
      if (isMasterLuxury && isMla) {
        if (userActiveRole === "ML") {
          return getFilteredItems(modulesPermissionsMasterLuxury);
        }
        if (userActiveRole === "MLA") {
          return getFilteredItems(modulesPermissions);
        }
      }

      if (isMasterLuxury) {
        dispatch(setActiveRole("ML"));
        return getFilteredItems(modulesPermissionsMasterLuxury);
      }

      if (isMla) {
        dispatch(setActiveRole("MLA"));
        return getFilteredItems(modulesPermissions);
      }

      return false;
    }
  };

  return useMemo(() => {
    function handleItemClick() {
      if (isMobile) {
        dispatch(navbarCloseMobile());
      }
    }

    return (
      <FuseNavigation
        className={clsx("navigation flex-1", className)}
        navigation={filterNavigationItems(navigation)}
        layout={layout}
        dense={dense}
        active={active}
        onItemClick={handleItemClick}
        checkPermission
      />
    );
  }, [
    dispatch,
    isMobile,
    navigation,
    active,
    className,
    dense,
    layout,
    userActiveRole,
  ]);
}

export default withSlices<NavigationProps>([navigationSlice])(Navigation);
