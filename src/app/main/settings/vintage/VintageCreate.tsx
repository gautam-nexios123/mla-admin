import { FormProvider, useForm } from "react-hook-form";
import VintageCreateForm from "./VintageCreateForm";
import VintageCreateHeader from "./VintageCreateHeader";

function VintageCreate() {

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
    },
    // resolver: zodResolver(schema),
  });

  const { formState, handleSubmit } = methods;
  const { isValid, dirtyFields, errors } = formState;
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full">
        <div className="mb-20">
          <VintageCreateHeader handleSubmit={handleSubmit} />
        </div>
        <div className="m-20">
          <VintageCreateForm />
        </div>
      </div>
    </FormProvider>
  );
}

export default VintageCreate;
