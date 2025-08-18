import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import DisplayPriceForm from "./DisplayPriceForm";
import DisplayPriceHeader from "./DisplayPriceHeader";

const initialData = [
  {
    watchLocation: "",
    clientLocation: "",
    priceNote: "",
    basePriceModifier: "",
    displayPriceModifier: "",
    pickupAdjustments: [
      {
        pickupLocation: "",
        newDisplayPriceModifier: "",
      },
    ],
  },
];

function DisplayPriceConfigCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState(initialData);
  const [convertedData, setConvertedData] = useState([]);

  function reverseTransformData(groupedData) {
    return groupedData?.flatMap((group) => {
      return group.clientLocations.map((clientLocationData) => ({
        watchLocation: group.watchLocation,
        basePriceModifier: group.basePriceModifier,
        clientLocation: clientLocationData.clientLocation,
        displayPriceModifier: clientLocationData.displayPriceModifier,
        pickupAdjustments: clientLocationData.pickupAdjustments?.map(
          (pickup) => ({
            pickupLocation: pickup?.pickupLocation,
            newDisplayPriceModifier: pickup?.newDisplayPriceModifier,
          })
        ),
      }));
    });
  }

  useEffect(() => {
    if (location?.state) {
      setFormData(location?.state);
    } else {
      setFormData(initialData);
    }
  }, [location]);

  const handleSavePriceConfig = async () => {
    const bodyParam = {
      data: reverseTransformData(convertedData),
    };

    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/setting/updatePricingBaseRule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify(bodyParam),
        }
      );
      const result = await response.json();
      console.log("result: ", result);
      if (result.statusCode === 200) {
        enqueueSnackbar("Price Config created successfully!", {
          variant: "success",
        });
        setLoading(false);
        navigate(-1);
      } else if (result.statusCode === 400) {
        enqueueSnackbar(result.message, { variant: "error" });
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to update data. Please try again.", {
          variant: "error",
        });
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar("Error updating data", { variant: "error" });
      console.error("Error during staff creation:", error.message);
      setLoading(false);
    }
  };

  return (
    // <FormProvider {...methods}>
    <div className="flex flex-col w-full">
      <div className="mb-20">
        <DisplayPriceHeader
          handleSavePriceConfig={handleSavePriceConfig}
          loading={loading}
        />
      </div>
      <div className="m-20">
        <DisplayPriceForm
          formData={formData}
          setFormData={setFormData}
          convertedData={convertedData}
          setConvertedData={setConvertedData}
        />
      </div>
    </div>
    // </FormProvider>
  );
}

export default DisplayPriceConfigCreate;
