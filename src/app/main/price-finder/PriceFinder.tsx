import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import PriceFinderForm from "./PriceFinderForm";
import { FormProvider, useForm } from "react-hook-form";
import PriceFinderHeader from "./PriceFinderHeader";
import { useState } from "react";
import PriceFinderTab from "./PriceFinderTab";

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

function PriceFinder() {
  const methods = useForm({
    mode: "onChange",
    defaultValues: { model: "", year: "", dial: "" },
    // resolver: zodResolver(schema)
  });

  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <FormProvider {...methods}>
      <div className="flex w-full">
        <FusePageCarded
          header={<PriceFinderHeader tabValue={tabValue} />}
          content={
            <PriceFinderTab setTabValue={setTabValue} tabValue={tabValue} />
          }
        />
      </div>
    </FormProvider>
  );
}

export default PriceFinder;
