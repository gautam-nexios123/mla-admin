import * as React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react-draft-wysiwyg";
import MatchResultTable from "./MatchResultTable/MatchResultTable";
import MLASaleDataTable from "./MLASaleDataTable/MLASaleDataTable";
import MarketSaleDataTable from "./MarketSaleDataTable/MarketSaleDataTable";

function Tabletab({ rows, csvDataRows, loading, columns }) {
  const [tabValue, setTabValue] = React.useState<number>(0);

  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }

  return (
    <>
      <div className="w-fit px-[16px]">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          style={{ height: 45 }}
          classes={{ root: "w-fit" }}
        >
          <Tab className={`font-600`} label="Combined Result" />
          <Tab className={`font-600`} label="MLA Sale Data" />
          <Tab className={`font-600`} label="Market Sale Data" />
        </Tabs>
      </div>
      {tabValue === 0 && (
        <div className={tabValue !== 0 ? "hidden" : ""}>
          <MatchResultTable
            rows={rows}
            csvDataRows={csvDataRows}
            loading={loading}
            columns={columns}
          />
        </div>
      )}
      {tabValue === 1 && (
        <div className={tabValue !== 1 ? "hidden" : ""}>
          <MLASaleDataTable
            rows={rows}
            loading={loading}
            columns={columns}
          />
        </div>
      )}
      {tabValue === 2 && (
        <div className={tabValue !== 2 ? "hidden" : ""}>
          <MarketSaleDataTable
            rows={rows}
            csvDataRows={csvDataRows}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}

export default Tabletab;
