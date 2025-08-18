import * as React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react-draft-wysiwyg";
import PriceFinderForm from "./PriceFinderForm";
import ImportCsv from "./ImportCsv";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import GetPriceTab from "./GetPriceTab";

function PriceFinderTab({ setTabValue, tabValue }) {
  const [dialData, setDialData] = React.useState([]);
  const user: any = useSelector(selectUser);
  const [showImportCsv, setIsShoeImportCsv] = React.useState<boolean>(false);

  const ShowImportCsvTab = () => {
    const findData = user?.modulesPermissions?.find(
      (item) => item?.moduleName === "price-finder"
    );
    if (user?.role === "SUPER_ADMIN") {
      setIsShoeImportCsv(true);
    } else {
      setIsShoeImportCsv(findData?.isEdit);
    }
  };

  React.useEffect(() => {
    ShowImportCsvTab();
  }, [user]);

  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }

  const getDialData = async () => {
    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/stock/getDials"
      );
      const data = await response.json();
      const keepOnTop = "Any Dial";
      const sortedData = data?.results
        .filter((item) => item !== keepOnTop)
        .sort((a, b) => a.localeCompare(b));
      sortedData?.unshift(keepOnTop);
      setDialData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  React.useEffect(() => {
    getDialData();
  }, []);

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
        // classes={{ root: 'w-full h-42' }}
      >
        <Tab className="font-600" label="Price Finder" />
        {showImportCsv && <Tab className="font-600" label="Import CSV" />}
        {showImportCsv && <Tab className="font-600" label="Get Price" />}
      </Tabs>
      {tabValue === 0 && (
        <div className={tabValue !== 0 ? "hidden" : ""}>
          <PriceFinderForm dialData={dialData} />
        </div>
      )}
      {tabValue === 1 && showImportCsv && (
        <div className={tabValue !== 1 ? "hidden" : ""}>
          <ImportCsv />
        </div>
      )}
      {tabValue === 2 && showImportCsv && (
        <div className={tabValue !== 2 ? "hidden" : ""}>
          <GetPriceTab />
        </div>
      )}
    </>
  );
}

export default PriceFinderTab;
