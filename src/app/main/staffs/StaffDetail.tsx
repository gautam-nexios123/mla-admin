import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import StaffDetailHeader from "./StaffDetailHeader";
import { useParams } from "react-router";
import StaffContent from "./StaffContent";

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

function StaffDetail() {
  const { t } = useTranslation("StaffDetailPage");
  const routeParams = useParams();
  const { staffId } = routeParams;

  return (
    <div className="flex flex-col w-full">
      <div>
        <StaffDetailHeader staffId={staffId} />
      </div>
      <div className="m-20">
        <StaffContent staffId={staffId} />
      </div>
    </div>
  );
}

export default StaffDetail;
