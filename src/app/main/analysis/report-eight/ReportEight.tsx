import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import ReportEightDataGrid from "./ReportEightDataGrid";

interface ReportEightProps {
  isChangeTab: number;
  selectYear: number;
  tabOptions: string[];
}

export const cityMapDisplayFlag = {
  USA: "US2",
  "Hong Kong": "HK",
  Thailand: "TH",
  Switzerland: "ZH",
  Japan: "JP",
  Others: "",
};

const ReportEightTable: React.FC<ReportEightProps> = ({
  isChangeTab,
  selectYear,
}) => {
  const session = localStorage.getItem(`jwt_access_token`);
  const [innerTabValue, setInnerTabValue] = useState(0);
  const [tabOptions, setTabOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleInnerTabChange = (_event, value) => setInnerTabValue(value);

  async function fetchData() {
    try {
      const response = await fetch(
        "https://api-dev.mlawatches.com/api/admin/stock/stockReportEight",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.statusCode == 200) {
        setTabOptions(data?.results?.locationCounts);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Tabs
        value={innerTabValue}
        onChange={handleInnerTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons={false}
        style={{ height: 45, marginBottom: 10 }}
      >
        {tabOptions
          ?.sort((a, b) =>
            a?._id === "Others" ? 1 : b?._id === "Others" ? -1 : 0
          )
          .map((option, index) => {
            const city = cityMapDisplayFlag[option?._id] || null;

            return (
              <Tab
                key={index}
                className="font-600"
                label={
                  <div className="flex gap-[12px] items-center justify-center">
                    {city && (
                      <img
                        className="w-[25px] h-[25px]"
                        src={`assets/images/flags/${city}.svg`}
                        alt={"test"}
                      />
                    )}

                    <div className="text-[14px] font-600">
                      {option?._id} <span>({option?.count})</span>
                    </div>
                  </div>
                }
              />
            );
          })}
      </Tabs>
      <div>
        <ReportEightDataGrid tabName={tabOptions[innerTabValue]} />
      </div>
    </div>
  );
};

export default ReportEightTable;
