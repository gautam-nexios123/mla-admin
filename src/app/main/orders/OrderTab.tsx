import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react-draft-wysiwyg";
import OrdersProTable from "./OrdersProTable";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import DigitDisplay from "src/utils/DigitDisplay";

function OrderTab({ setTabValue, tabValue }) {
  const user: any = useSelector(selectUser);
  const userActiveRole: any = useSelector(userActiveRoleState);

  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }

  return (
    <>
      <div className="flex sm:items-center flex-col sm:flex-row justify-between">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          style={{ height: 45 }}
          // classes={{ root: 'w-full h-42' }}
        >
          <Tab className="font-600" label="Online Order" />
          <Tab className="font-600" label="Offline Order" />
        </Tabs>
        {userActiveRole === "MLA" && user?.isCommissionAllow && (
          <div className="mx-[15px] flex items-center">
            <DigitDisplay user={user} />
          </div>
        )}
      </div>
      {tabValue === 0 && (
        <div className={tabValue !== 0 ? "hidden" : ""}>
          <OrdersProTable tabValue={tabValue} />
        </div>
      )}
      {tabValue === 1 && (
        <div className={tabValue !== 1 ? "hidden" : ""}>
          <OrdersProTable tabValue={tabValue} />
        </div>
      )}
    </>
  );
}

export default OrderTab;
