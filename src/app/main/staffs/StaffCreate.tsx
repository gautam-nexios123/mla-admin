import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import StaffCreateHeader from "./StaffCreateHeader";
import StaffCreateForm from "./StaffCreateForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  newMasterLuxuryModulesPermissions,
  newModulesPermissions,
  roleOptions,
  staffLocDropdown,
} from "src/utils/dropdownlist";
import { useState } from "react";

const schema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "You must enter a First name" })
    .min(5, "The First name must be at least 5 characters"),
  surName: z
    .string()
    .nonempty({ message: "You must enter a surname" })
    .min(5, "The surname must be at least 5 characters"),
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty({ message: "You must enter an email" }),
  role: z
    .string()
    .nonempty({ message: "You must select a role" })
    .refine((value) => roleOptions.includes(value), "Invalid role selected"),
  staff_location: z
    .string()
    .nonempty({ message: "You must select a location" })
    .refine(
      (value) => staffLocDropdown.includes(value),
      "Invalid location selected"
    ),
  join_date: z.string().nonempty({ message: "Date is required" }),
});

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

function StaffCreate() {
  const [rows, setRows] = useState(newModulesPermissions);
  const [rowsMasterLuxury, setRowsMasterLuxury] = useState<any>(
    newMasterLuxuryModulesPermissions
  );
  const { t } = useTranslation("StaffCreatePage");
  const [isCommissionAllow, setIsCommissionAllow] = useState<boolean>(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      surName: "",
      email: "",
      phone: "",
      role: "",
      staff_location: "",
      //   join_date: "",
    },
    // resolver: zodResolver(schema),
  });

  const { formState, handleSubmit } = methods;
  // const form = watch();
  const { isValid, dirtyFields, errors } = formState;
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full">
        <div className="mb-20">
          <StaffCreateHeader
            rows={rows}
            rowsMasterLuxury={rowsMasterLuxury}
            handleSubmit={handleSubmit}
            isCommissionAllow={isCommissionAllow}
          />
        </div>
        <div className="m-20">
          <StaffCreateForm
            setRows={setRows}
            rows={rows}
            rowsMasterLuxury={rowsMasterLuxury}
            setRowsMasterLuxury={setRowsMasterLuxury}
            setIsCommissionAllow={setIsCommissionAllow}
          />
        </div>
      </div>
    </FormProvider>
  );
}

export default StaffCreate;
