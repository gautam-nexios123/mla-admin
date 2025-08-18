import FusePageCarded from "@fuse/core/FusePageCarded";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderTab from "./OrderTab";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

function Orders() {
  const { t } = useTranslation("OrdersPage");

  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <div className="flex w-full">
      <FusePageCarded
        header={null}
        // content={<OrdersProTable />}
        content={<OrderTab setTabValue={setTabValue} tabValue={tabValue} />}
      />
    </div>
    // <Root
    // 	header={
    // 		<div className="p-24">
    // 			<h4>{t('TITLE')}</h4>
    // 		</div>
    // 	}
    // 	content={
    // 		<div className="p-24">
    // 			<h4>Content</h4>
    // 			<br />
    // 			<DemoContent />
    // 		</div>
    // 	}
    // />
  );
}

export default Orders;
