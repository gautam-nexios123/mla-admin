import FusePageCarded from "@fuse/core/FusePageCarded";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import Statisticheader from "./Statisticheader";
import StatisticContent from "./StatisticContent";

const StatisticDashboard = () => {

    const methods = useForm({
		mode: 'onChange',
		defaultValues: {model: "", year: "", dial: ""},
		// resolver: zodResolver(schema)
	});
  return (
    <FormProvider {...methods}>
      <div className="flex w-full h-full">
        <FusePageCarded
          header={<Statisticheader />}
          content={<StatisticContent />}
        />
      </div>
    </FormProvider>
  );
};

export default StatisticDashboard;
