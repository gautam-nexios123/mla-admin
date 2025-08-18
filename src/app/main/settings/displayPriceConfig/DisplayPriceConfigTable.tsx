import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function DisplayPriceConfigTable() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const [displayPriceData, setDisplayPriceData] = useState([]);

  const getPriceConfigApi = async () => {
    await axios
      .get(`https://api-dev.mlawatches.com/api/admin/setting/getPricingBaseRule`)
      .then((res) => {
        if (res?.data?.statusCode == 200) {
          setDisplayPriceData(res?.data?.results);
        } else {
          enqueueSnackbar("Failed to get data. Please try again.", {
            variant: "error",
          });
        }
      })
      .catch((err) => {
        console.log("err: ", err);
        enqueueSnackbar("Failed to get data. Please try again.", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    getPriceConfigApi();
  }, []);

  const handleAddButtonClick = () => {
    navigate(`/displayPriceConfig/create`, { state: displayPriceData });
  };

  function transformData(data) {
    const groupedData = data?.reduce((acc, item) => {
      const existing = acc?.find(
        (entry) => entry.watchLocation === item.watchLocation
      );
      const clientLocationData = {
        clientLocation: item?.clientLocation,
        displayPriceModifier:
          item?.displayPriceModifier < 0
            ? `Base Price ${item?.displayPriceModifier}%`
            : `Base Price +${item?.displayPriceModifier}%`,
        pickupAdjustments: item?.pickupAdjustments?.map((pickup) => ({
          pickupLocation:
            pickup?.pickupLocation == "OTHER"
              ? pickup?.pickupLocation
              : `Pickup in ${pickup?.pickupLocation}`,
          newDisplayPriceModifier:
            pickup?.newDisplayPriceModifier < 0
              ? `Display Price ${pickup?.newDisplayPriceModifier}%`
              : `Display Price +${pickup?.newDisplayPriceModifier}%`,
        })),
      };
      if (existing) {
        existing.clientLocations.push(clientLocationData);
      } else {
        acc.push({
          watchLocation: item?.watchLocation,
          basePriceModifier: `Price : ${item?.basePriceModifier}% across the board`,
          clientLocations: [clientLocationData],
        });
      }
      return acc;
    }, []);
    return groupedData;
  }

  const convertedData = transformData(displayPriceData);

  // const getRowBGColor = (watchLocation) => {
  //   if (watchLocation == "HK") {
  //     return "#fff2cc"
  //   } else if (watchLocation == "CH") {
  //     return;
  //   } else if (watchLocation == "TH") {
  //     return;
  //   } else if (watchLocation == "US") {
  //     return "#c9daf8";
  //   }else{
  //     return ""
  //   }
  // };

  return (
    <div className="flex flex-col space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAddButtonClick}
        className="w-fit ml-auto mb-[15px]"
      >
        Edit
      </Button>

      <TableContainer>
        <Table sx={{ border: "1px solid lightgrey" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap !important",
                }}
              >
                Watch Location
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                Client Registered Location
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                Display Price
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                Pickup/Delivery Location
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid lightgrey",
                  backgroundColor: "#F1F5F9",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                New Displayed Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {convertedData?.map((data, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell
                    rowSpan={data?.clientLocations?.length + 1}
                    sx={{ border: "1px solid lightgrey" }}
                  >
                    {data?.watchLocation}
                  </TableCell>
                  <TableCell
                    rowSpan={data?.clientLocations?.length + 1}
                    sx={{ border: "1px solid lightgrey" }}
                  >
                    {data?.basePriceModifier}
                  </TableCell>
                </TableRow>
                {data?.clientLocations?.map((client, clientIndex) => (
                  <TableRow key={clientIndex}>
                    <TableCell sx={{ border: "1px solid lightgrey" }}>
                      {client?.clientLocation}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid lightgrey" }}>
                      {client?.displayPriceModifier}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid lightgrey", padding: 0 }}
                    >
                      {client?.pickupAdjustments?.map((pickup, pickupIndex) => (
                        <div key={pickupIndex} className="py-[7px] px-[10px]">
                          {pickup.pickupLocation}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid lightgrey", padding: 0 }}
                    >
                      {client?.pickupAdjustments?.map((pickup, pickupIndex) => (
                        <div key={pickupIndex} className="py-[7px] px-[10px]">
                          {pickup?.newDisplayPriceModifier}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
