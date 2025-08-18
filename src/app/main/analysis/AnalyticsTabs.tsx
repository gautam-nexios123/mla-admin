import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { userActiveRoleState } from "app/store/userActiveRoleSlice";
import { Tab, Tabs, MenuItem, Select } from "@mui/material";
import ReportOneTable from "./report-one/ReportOne";
import ReportTwoTable from "./report-two/ReportTwo";
import ReportThreeTable from "./report-three/ReportThree";
import ReportFourTable from "./report-four/ReportFour";
import ReportFiveTable from "./report-five/ReportFive";
import ReportSixTable from "./report-six/ReportSix";
import ReportSevenTable from "./report-seven/ReportSevenTable";
import ReportEightTable from "./report-eight/ReportEight";
import DigitDisplay from "src/utils/DigitDisplay";
import { selectUser } from "src/app/auth/user/store/userSlice";

function AnalyticsTabs() {
  const currentYear = new Date().getFullYear();
  const [tabValue, setTabValue] = useState(0);
  const [selectYear, setSelectYear] = useState(currentYear);

  const userActiveRole = useSelector(userActiveRoleState);
  const user: any = useSelector(selectUser);

  const getYears = () => {
    const years = [];
    for (let year = 2024; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    if (userActiveRole) setTabValue(0);
  }, [userActiveRole]);

  const handleTabChange = (_event, value) => setTabValue(value);

  const YearSelector = () => (
    <Select
      id="year"
      variant="outlined"
      required
      className="custom-height-padding"
      inputProps={{ "aria-label": "Year Selector" }}
      value={selectYear}
      onChange={(e: any) => setSelectYear(e.target.value)}
    >
      <MenuItem value={null} disabled>
        Select Year
      </MenuItem>
      {getYears().map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  );

  const tabs = [
    { label: userActiveRole === "MLA" ? "Purchase & Sales" : "Current Stock" },
    { label: "Sales & Profit" },
    ...(userActiveRole === "MLA"
      ? [
          { label: "Stock Value" },
          { label: "Average selling days (Month)" },
          { label: "Stock aging" },
          { label: "Negative growth" },
          { label: "Average selling days (Model)" },
          { label: "Inventory Report" },
        ]
      : [{ label: "Negative growth" }]),
  ];

  const tabComponents = [
    <ReportOneTable key={0} isChangeTab={tabValue} selectYear={selectYear} />,
    <ReportTwoTable key={1} isChangeTab={tabValue} selectYear={selectYear} />,
    ...(userActiveRole === "MLA"
      ? [
          <ReportThreeTable
            key={2}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
          <ReportFourTable
            key={3}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
          <ReportFiveTable
            key={4}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
          <ReportSixTable
            key={5}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
          <ReportSevenTable
            key={6}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
          <ReportEightTable
            key={7}
            isChangeTab={tabValue}
            selectYear={selectYear}
            tabOptions={["th", "zh", "hk", "us", "jp"]}
          />,
        ]
      : [
          <ReportSixTable
            key={2}
            isChangeTab={tabValue}
            selectYear={selectYear}
          />,
        ]),
  ];

  const yearSelectorWrapperRef = useRef(null);

  useEffect(() => {
    const handleArrowKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const el = yearSelectorWrapperRef.current;
        if (el) {
          el.focus();

          // Ensure div is in view
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          const scrollAmount = 50; // px per key press

          switch (e.key) {
            case "ArrowUp":
              window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
              break;
            case "ArrowDown":
              window.scrollBy({ top: scrollAmount, behavior: "smooth" });
              break;
            case "ArrowLeft":
              window.scrollBy({ left: -scrollAmount, behavior: "smooth" });
              break;
            case "ArrowRight":
              window.scrollBy({ left: scrollAmount, behavior: "smooth" });
              break;
          }

          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleArrowKey);
    return () => window.removeEventListener("keydown", handleArrowKey);
  }, []);

  return (
    <>
      <div>
        <div className="flex items-center flex-wrap">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            style={{ height: 45 }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} className="font-600" label={tab.label} />
            ))}
          </Tabs>
          {userActiveRole === "MLA" && user?.isCommissionAllow && (
            <div className="mx-[15px] flex items-center ml-auto mt-[10px] sm:mt-0">
              <DigitDisplay user={user} />
            </div>
          )}
        </div>

        <div
          ref={yearSelectorWrapperRef}
          className="m-[10px] flex flex-col sm:flex-row sm:justify-between sm:items-center"
        >
          {(userActiveRole === "MLA" || tabValue !== 0) && tabValue !== 7 && (
            <YearSelector />
          )}
        </div>

        <div>{tabComponents[tabValue]}</div>
      </div>
    </>
  );
}

export default AnalyticsTabs;
