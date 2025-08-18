import * as React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react-draft-wysiwyg";
import SettingContent from "./SettingContent";
import StaffTable from "../staffs/StaffTable";
import StaffLogTable from "../staffs/StaffLogTable";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import CommissionTabPage from "../commission-report/CommissionTabPage";
import VintageTable from "./vintage/VintageTable";
import DisplayPriceConfigTable from "./displayPriceConfig/DisplayPriceConfigTable";

const TabValue = [
  { id: "general-setting", label: "General Setting", isShow: true },
  { id: "commision-report", label: "Commision report", isShow: true },
  { id: "staff", label: "Staff", isShow: true },
  { id: "activity-log", label: "Activity Log", isShow: true },
  { id: "vintage", label: "Vintage", isShow: true },
  { id: "price-display-config", label: "Display Price Config", isShow: true },
];

function SettingsTabs() {
  const [tabValue, setTabValue] = React.useState(0);
  const user = useSelector(selectUser);
  const subModulesData = user?.modulesPermissions?.find(
    (item) => item.subModules.length > 0
  );

  const access = (array) => {
    if (user.role == "SUPER_ADMIN") {
      return array;
    } else {
      const data = array.map((val) => {
        const permission = subModulesData?.subModules?.find(
          (module) => module.moduleName === val.id
        );

        let isShow = true;

        if (!permission) isShow = false;

        isShow =
          (permission?.isView || permission?.isEdit) &&
          !(permission?.isView === false && permission?.isEdit === false);

        return { ...val, isShow: isShow };
      });
      const filterData = data?.filter((item) => item?.isShow == true);
      return filterData;
    }
  };

  function handleTabChange(_: SyntheticEvent, value: number) {
    setTabValue(value);
  }

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        style={{ height: 45 }}
      >
        {access(TabValue).map((item) => (
          <Tab className="font-600" label={item.label} />
        ))}
      </Tabs>
      {tabValue === 0 && (
        <div className={tabValue !== 0 ? "hidden" : ""}>
          <SettingContent />
        </div>
      )}
      {tabValue === 1 && (
        <div className={tabValue !== 1 ? "hidden" : ""}>
          <CommissionTabPage />
        </div>
      )}
      {tabValue === 2 && (
        <div className={tabValue !== 2 ? "hidden" : ""}>
          <StaffTable />
        </div>
      )}
      {tabValue === 3 && (
        <div className={tabValue !== 3 ? "hidden" : ""}>
          <StaffLogTable />
        </div>
      )}
      {tabValue === 4 && (
        <div className={tabValue !== 4 ? "hidden" : ""}>
          <VintageTable />
        </div>
      )}
      {tabValue === 5 && (
        <div className={tabValue !== 5 ? "hidden" : ""}>
          <DisplayPriceConfigTable />
        </div>
      )}
    </>
  );
}

export default SettingsTabs;
