import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DigitDisplay from "src/utils/DigitDisplay";

/**
 * The Staff header.
 */
function SettingsHeader() {
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const userActiveRole = useSelector(userActiveRoleState);
  const user: any = useSelector(selectUser);

  // const handleSaveSetting = () => {
  // 	console.log(`saveee`)
  // 	console.log(getValues())
  // }

  useEffect(() => {
    return () => {
      // dispatch(resetSearchText());
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row w-full mb-25">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Settings
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Setting website and manage data
          </Typography>
        </div>
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						onClick={handleSaveSetting}
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Save
					</Button>
				</div> */}
      </div>

      {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
        <div className="sm:mx-[15px] flex items-center mt-[10px] sm:mt-0">
          <DigitDisplay user={user} />
        </div>
      )} */}
    </div>
  );
}

export default SettingsHeader;
