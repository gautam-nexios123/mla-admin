import Typography from "@mui/material/Typography";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DigitDisplay from "src/utils/DigitDisplay";

function PriceFinderHeader({ tabValue }) {
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  const TabName = () => {
    if (tabValue === 0) {
      return "Price Finder";
    } else if (tabValue === 1) {
      return "Import CSV";
    }
  };
  return (
    <div className="flex flex-col sm:flex-row w-full mb-25">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            {TabName()}
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Manage Price of products
          </Typography>
        </div>
      </div>
      {/* {userActiveRole === "MLA" && user?.isCommissionAllow && (
        <div className="mx-[15px] flex items-center mt-[15px] sm:mt-0">
          <DigitDisplay user={user} />
        </div>
      )} */}
    </div>
  );
}

export default PriceFinderHeader;
