import { Typography } from "@mui/material";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import DigitDisplay from "src/utils/DigitDisplay";

const Statisticheader = () => {
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  return (
    <div className="flex flex-col sm:flex-row w-full mb-25 pt-24 md:pt-32 px-24 md:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Statistic DashBoard
          </Typography>
        </div>
      </div>

      {userActiveRole === "MLA" && user?.isCommissionAllow && (
        <div className="sm:mx-[15px] flex items-center mt-[10px] sm:mt-0">
          <DigitDisplay user={user} />
        </div>
      )}
    </div>
  );
};

export default Statisticheader;
