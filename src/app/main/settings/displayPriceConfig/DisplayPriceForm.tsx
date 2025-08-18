import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import {
  clientLocationDropdown,
  pickupLocationDropdown,
  watchLocationDropdown,
} from "src/utils/dropdownlist";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/base";
import DeleteIcon from "@mui/icons-material/Delete";

function DisplayPriceForm({
  formData,
  setFormData,
  convertedData,
  setConvertedData,
}) {
  console.log("formData: ", convertedData);

  const handlePickupChange = (i, j, field, value) => {
    const newData = [...formData];
    newData[i].pickupAdjustments[j][field] = value;
    setFormData(newData);
  };

  const validateForm = () => {
    const errors = [];
    formData?.forEach((item, i) => {
      if (!item.watchLocation)
        errors.push(`Watch Location is required for row ${i + 1}`);
      if (!item.basePriceModifier)
        errors.push(`Base Price Modifier is required for row ${i + 1}`);
      if (!item.clientLocation)
        errors.push(`Client Location is required for row ${i + 1}`);
      item.pickupAdjustments.forEach((sub, j) => {
        if (!sub.pickupLocation)
          errors.push(
            `Pickup Location is required for row ${i + 1}, sub ${j + 1}`
          );
        if (!sub.newDisplayPriceModifier)
          errors.push(
            `Action Required is required for row ${i + 1}, sub ${j + 1}`
          );
      });
    });
    if (errors.length > 0) {
      alert(errors.join("\n"));
    } else {
      console.log("Form submitted successfully:", formData);
    }
  };

  const getDisabledClientLocations = (currentIndex) => {
    const currentWatchLocation = formData[currentIndex].watchLocation;

    if (!currentWatchLocation) return [];

    return formData
      .filter(
        (_, i) =>
          i !== currentIndex &&
          formData[i].watchLocation === currentWatchLocation
      )
      .map((item) => item.clientLocation)
      .filter(Boolean);
  };

  const getDisabledPickupLocations = (mainIndex, subIndex) => {
    const currentAdjustments = formData[mainIndex].pickupAdjustments;

    return currentAdjustments
      .filter((_, idx) => idx !== subIndex)
      .map((adj) => adj.pickupLocation)
      .filter(Boolean);
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  function transformData(data) {
    const groupedData = data?.reduce((acc, item) => {
      const existing = acc?.find(
        (entry) => entry.watchLocation === item.watchLocation
      );
      const clientLocationData = {
        clientLocation: item?.clientLocation,
        displayPriceModifier: item?.displayPriceModifier,
        pickupAdjustments: item?.pickupAdjustments?.map((pickup) => ({
          pickupLocation: pickup?.pickupLocation,
          newDisplayPriceModifier: pickup?.newDisplayPriceModifier,
        })),
      };
      if (existing) {
        existing.clientLocations.push(clientLocationData);
      } else {
        acc.push({
          watchLocation: item?.watchLocation,
          basePriceModifier: item?.basePriceModifier,
          clientLocations: [clientLocationData],
        });
      }
      return acc;
    }, []);
    return groupedData;
  }

  useEffect(() => {
    const transformedData = transformData(formData);
    setConvertedData(transformedData);
  }, [formData]);

  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="md:flex">
        <div className="flex flex-col flex-1  ">
          <TableContainer
            style={{
              height: "calc(100vh - 170px)",
              backgroundColor: "#fff",
              borderTop: "1px solid lightgrey",
            }}
          >
            <Table
              sx={{
                border: "1px solid lightgrey",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      borderLeft: "2px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
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
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  >
                    Client Registered Location
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  >
                    Display Price
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  >
                    Pickup/Delivery Location
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  >
                    New Displayed Price
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid lightgrey",
                      backgroundColor: "#F1F5F9",
                      fontWeight: "600",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap !important",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {convertedData?.map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      <TableRow sx={{}}>
                        <TableCell
                          rowSpan={item?.clientLocations?.length + 1}
                          sx={{ border: "1px solid lightgrey" }}
                        >
                          <Select
                            labelId={`watch-location-label-${i}`}
                            label="Watch Location"
                            value={item?.watchLocation}
                            onChange={(e) => {
                              const updatedData = [...convertedData];
                              updatedData[i].watchLocation = e.target.value;
                              setConvertedData(updatedData);
                            }}
                            displayEmpty
                            variant="filled"
                            inputProps={{ "aria-label": "Watch Location" }}
                            className="w-full bg-transparent"
                          >
                            {watchLocationDropdown?.map((watch_location) => (
                              <MenuItem
                                key={watch_location}
                                value={watch_location}
                                disabled={convertedData.some(
                                  (item, index) =>
                                    item.watchLocation === watch_location &&
                                    index !== i
                                )}
                              >
                                {watch_location}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell
                          rowSpan={item?.clientLocations?.length + 1}
                          sx={{ border: "1px solid lightgrey" }}
                        >
                          <TextField
                            className="!bg-transparent"
                            variant="filled"
                            value={item.basePriceModifier}
                            onChange={(e) => {
                              const updatedData = [...convertedData];
                              updatedData[i].basePriceModifier = e.target.value;
                              setConvertedData(updatedData);
                            }}
                            fullWidth
                            required
                            sx={{
                              "& .MuiFilledInput-root": {
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {item?.clientLocations?.map((client, clientIndex) => (
                        <TableRow key={clientIndex}>
                          <TableCell sx={{ border: "1px solid lightgrey" }}>
                            <Select
                              value={client?.clientLocation}
                              onChange={(e) => {
                                const updatedData = [...convertedData];
                                updatedData[i].clientLocations[
                                  clientIndex
                                ].clientLocation = e.target.value;
                                setConvertedData(updatedData);
                              }}
                              displayEmpty
                              variant="filled"
                              inputProps={{ "aria-label": "Client Location" }}
                              className="w-full bg-transparent"
                            >
                              {clientLocationDropdown.map((location) => (
                                <MenuItem
                                  key={location}
                                  value={location}
                                  disabled={item.clientLocations.some(
                                    (clientItem, idx) =>
                                      clientItem.clientLocation === location &&
                                      idx !== clientIndex
                                  )}
                                >
                                  {location}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell sx={{ border: "1px solid lightgrey" }}>
                            <TextField
                              className="!bg-transparent"
                              variant="filled"
                              value={client?.displayPriceModifier}
                              onChange={(e) => {
                                const updatedData = [...convertedData];
                                updatedData[i].clientLocations[
                                  clientIndex
                                ].displayPriceModifier = e.target.value;
                                setConvertedData(updatedData);
                              }}
                              fullWidth
                              required
                              sx={{
                                "& .MuiFilledInput-root": {
                                  backgroundColor: "transparent",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgrey", padding: 0 }}
                          >
                            {client?.pickupAdjustments?.map(
                              (pickup, pickupIndex) => (
                                <div
                                  key={pickupIndex}
                                  className="pb-[10px] px-[10px] h-[55px]"
                                  style={{
                                    borderBottom:
                                      client?.pickupAdjustments.length - 1 ===
                                        pickupIndex
                                        ? ""
                                        : "1px solid lightgrey",
                                  }}
                                >
                                  <Select
                                    value={pickup.pickupLocation}
                                    onChange={(e) => {
                                      const updatedData = [...convertedData];
                                      updatedData[i].clientLocations[
                                        clientIndex
                                      ].pickupAdjustments[
                                        pickupIndex
                                      ].pickupLocation = e.target.value;
                                      setConvertedData(updatedData);
                                    }}
                                    displayEmpty
                                    variant="filled"
                                    inputProps={{
                                      "aria-label": "Pickup Location",
                                    }}
                                    className="w-full bg-transparent"
                                  >
                                    {pickupLocationDropdown.map((location) => (
                                      <MenuItem
                                        key={location}
                                        value={location}
                                        disabled={client.pickupAdjustments.some(
                                          (adjustment, idx) =>
                                            adjustment.pickupLocation ===
                                            location && idx !== pickupIndex
                                        )}
                                      >
                                        {location}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </div>
                              )
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid lightgrey", padding: 0 }}
                          >
                            {client?.pickupAdjustments?.map(
                              (pickup, pickupIndex) => (
                                <div
                                  key={pickupIndex}
                                  className="pb-[10px] px-[10px] h-[55px]"
                                  style={{
                                    borderBottom:
                                      client?.pickupAdjustments.length - 1 ===
                                        pickupIndex
                                        ? ""
                                        : "1px solid lightgrey",
                                  }}
                                >
                                  <TextField
                                    className="!bg-transparent"
                                    variant="filled"
                                    value={pickup?.newDisplayPriceModifier}
                                    onChange={(e) => {
                                      const updatedData = [...convertedData];
                                      updatedData[i].clientLocations[
                                        clientIndex
                                      ].pickupAdjustments[
                                        pickupIndex
                                      ].newDisplayPriceModifier =
                                        e.target.value;
                                      setConvertedData(updatedData);
                                    }}
                                    fullWidth
                                    required
                                    sx={{
                                      "& .MuiFilledInput-root": {
                                        backgroundColor: "transparent",
                                      },
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </TableCell>

                          <TableCell
                            sx={{ border: "1px solid lightgrey", padding: 0 }}
                          >
                            {client?.pickupAdjustments?.map(
                              (pickup, pickupIndex) => (
                                <div
                                  key={pickupIndex}
                                  className="py-[10px] px-[10px] h-[55px] flex justify-start gap-[10px] items-center"
                                  style={{
                                    borderBottom:
                                      client?.pickupAdjustments.length - 1 ===
                                        pickupIndex
                                        ? ""
                                        : "1px solid lightgrey",
                                  }}
                                >
                                  {client?.pickupAdjustments.length !== 1 && (
                                    <button
                                      className="bg-red-500 text-white px-2 py-1 rounded w-[25px] h-[25px] flex items-center justify-center"
                                      onClick={() => {
                                        const updatedData = [...convertedData];
                                        updatedData[i].clientLocations[
                                          clientIndex
                                        ].pickupAdjustments = updatedData[
                                          i
                                        ].clientLocations[
                                          clientIndex
                                        ].pickupAdjustments.filter(
                                          (_, idx) => idx !== pickupIndex
                                        );
                                        setConvertedData(updatedData);
                                      }}
                                    >
                                      <CloseIcon />
                                    </button>
                                  )}
                                  {pickupIndex ===
                                    client?.pickupAdjustments.length - 1 &&
                                    client?.pickupAdjustments.length <
                                    pickupLocationDropdown.length && (
                                      <button
                                        className="bg-[#4f46e5] text-white px-2 py-1 rounded w-[25px] h-[25px] flex items-center justify-center"
                                        onClick={() => {
                                          const updatedData = [
                                            ...convertedData,
                                          ];
                                          updatedData[i].clientLocations[
                                            clientIndex
                                          ].pickupAdjustments.push({
                                            pickupLocation: "",
                                            newDisplayPriceModifier: "",
                                          });
                                          setConvertedData(updatedData);
                                        }}
                                        disabled={client?.pickupAdjustments.some(
                                          (adjustment) =>
                                            !adjustment.pickupLocation
                                        )}
                                      >
                                        <AddIcon />
                                      </button>
                                    )}
                                </div>
                              )
                            )}
                          </TableCell>

                          <TableCell
                            className="pl-[12px]"
                            sx={{ border: "1px solid lightgrey", padding: 0 }}
                          >
                            {item?.clientLocations.length !== 1 && (
                              <button
                                className="py-[3px] px-[7px] text-[red] rounded-[7px] mr-[10px]"
                                style={{ border: "1px solid red" }}
                                onClick={() => {
                                  const updatedData = [...convertedData];
                                  updatedData[i].clientLocations = updatedData[
                                    i
                                  ].clientLocations.filter(
                                    (_, idx) => idx !== clientIndex
                                  );
                                  setConvertedData(updatedData);
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: "20px" }} />
                              </button>
                            )}
                            {clientIndex === item?.clientLocations.length - 1 &&
                              item?.clientLocations.length <
                              clientLocationDropdown?.length && (
                                <button
                                  className="py-[3px] px-[7px] text-[#4f46e5] rounded-[7px]"
                                  style={{ border: "1px solid #4f46e5" }}
                                  onClick={() => {
                                    const updatedData = [...convertedData];
                                    updatedData[i].clientLocations.push({
                                      clientLocation: "",
                                      displayPriceModifier: "",
                                      pickupAdjustments: [
                                        {
                                          pickupLocation: "",
                                          newDisplayPriceModifier: "",
                                        },
                                      ],
                                    });
                                    setConvertedData(updatedData);
                                  }}
                                  disabled={item?.clientLocations.some(
                                    (item) => !item.clientLocation
                                  )}
                                >
                                  <AddIcon sx={{ fontSize: "20px" }} />
                                </button>
                              )}
                          </TableCell>

                          {clientIndex == 0 ? (
                            <TableCell
                              className="flex items-center gap-[15px] flex-col mt-[20px] pb-[5px]"
                              sx={{ padding: 0 }}
                            >
                              {convertedData.length !== 1 && (
                                <button
                                  className="py-[5px] px-[20px] text-[red] rounded-[10px]"
                                  style={{ border: "1px solid red" }}
                                  onClick={() => {
                                    const updatedData = [...convertedData];
                                    updatedData.splice(i, 1);
                                    setConvertedData(updatedData);
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                              {i === convertedData.length - 1 &&
                                convertedData.length <
                                watchLocationDropdown?.length && (
                                  <button
                                    className="py-[5px] px-[20px] text-[#4f46e5] rounded-[10px]"
                                    style={{ border: "1px solid #4f46e5" }}
                                    onClick={() => {
                                      const newItem = {
                                        watchLocation: "",
                                        basePriceModifier: "",
                                        clientLocations: [
                                          {
                                            clientLocation: "",
                                            displayPriceModifier: "",
                                            pickupAdjustments: [
                                              {
                                                pickupLocation: "",
                                                newDisplayPriceModifier: "",
                                              },
                                            ],
                                          },
                                        ],
                                      };
                                      const updatedData = [
                                        ...convertedData,
                                        newItem,
                                      ];
                                      setConvertedData(updatedData);
                                    }}
                                    disabled={convertedData.some(
                                      (item) => !item.watchLocation
                                    )}
                                  >
                                    Add
                                  </button>
                                )}
                            </TableCell>
                          ) : (
                            <TableCell />
                          )}
                        </TableRow>
                      ))}

                      <Box
                        sx={{
                          width: "100%",
                          height: "0px",
                          backgroundColor: "lightgrey",
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default DisplayPriceForm;
