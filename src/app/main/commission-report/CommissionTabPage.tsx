import React, { useState } from "react";
import DateRangeCommission from "./DateRangeCommission";
import SummaryCostSaleTable from "./SummaryCostSaleTable";
import StaffCommissionTable from "./StaffCommissionTable";

const CommissionTabPage = () => {
  const [commissionData, setCommissionData] = useState<any>({});
  const [isShow, setIsShow] = useState<boolean>(false);
  console.log("commissionData", commissionData);

  return (
    <div className="px-[16px] pt-[22px] pb-[100px]">
      <div>
        <DateRangeCommission
          setCommissionData={setCommissionData}
          setIsShow={setIsShow}
        />
      </div>
      {isShow && (
        <div>
          <div>
            <SummaryCostSaleTable commissionData={commissionData} />
          </div>
          <div>
            <StaffCommissionTable commissionData={commissionData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionTabPage;
