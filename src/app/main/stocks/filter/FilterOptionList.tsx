import { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import withReducer from "app/store/withReducer";
import { Button } from "@mui/material";
import { useFilterLocalStorage } from "./useFilterLocalStorage";
import { brandNameMap } from "src/utils/coreFunction";

const useStyles = makeStyles({
  expandedAccordionSummary: {
    minHeight: "40px !important",
    height: "40px !important",
    margin: "0px",
    "&.Mui-expanded": {
      minHeight: "0px",
    },
  },
});

function FilterOptionList(props) {
  const {
    filterValueState,
    setFilterValueState,
    resetFilterState,
    clearAllFilters,
  } = useFilterLocalStorage();
  const [currentBrandFilter, setcurrentBrandFilter] = useState([]);
  const [currentBrandPrefixFilter, setcurrentBrandPrefixFilter] = useState([]);
  const [currentCollectionFilter, setcurrentCollectionFilter] = useState([]);
  const [currentConditionFilter, setcurrentConditionFilter] = useState([]);
  const [currentBoxFilter, setcurrentBoxFilter] = useState([]);
  const [currentProductTypeFilter, setcurrentProductTypeFilter] = useState([]);
  const [currentWarrantyFilter, setcurrentWarrantyFilter] = useState([]);
  const [currentLocationFilter, setcurrentLocationFilter] = useState([]);
  const classes = useStyles();

  const mappingBrandPrefix = (fullBrandName: string, brandData) => {
    return brandData.find((f) => f.brand === fullBrandName)?.brand_prefix;
  };

  useEffect(() => {
    if (filterValueState) {
      // Only set checked items, not all items
      setcurrentBrandFilter(
        filterValueState?.filterSections[0]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
      setcurrentCollectionFilter(
        filterValueState?.filterSections[0]?.items?.flatMap(
          (item) =>
            item?.subItems
              ?.filter((subItem) => subItem?.checked)
              ?.map((subItem) => subItem?.id) || []
        ) || []
      );
      setcurrentConditionFilter(
        filterValueState?.filterSections[2]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
      setcurrentBoxFilter(
        filterValueState?.filterSections[4]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
      setcurrentProductTypeFilter(
        filterValueState?.filterSections[1]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
      setcurrentWarrantyFilter(
        filterValueState?.filterSections[3]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
      setcurrentLocationFilter(
        filterValueState?.filterSections[5]?.items
          ?.filter((item) => item?.checked)
          ?.map((item) => item?.id) || []
      );
    }
  }, [filterValueState]);

  // Update brand prefix filter when brand filter changes
  useEffect(() => {
    if (currentBrandFilter && currentBrandFilter.length > 0) {
      const allBrandsPrefix = currentBrandFilter?.map((m) =>
        mappingBrandPrefix(m, filterValueState?.filterSections[0]?.items)
      );
      setcurrentBrandPrefixFilter(allBrandsPrefix);
    } else {
      setcurrentBrandPrefixFilter([]);
    }
  }, [currentBrandFilter, filterValueState?.filterSections]);

  // Function to handle clear all filters
  const handleAllChecked = (event) => {
    event.stopPropagation();
    handleResetFilter();
  };

  const handleBrandToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    brandId
  ) => {
    event.stopPropagation();

    setFilterValueState((prevState) => {
      let newItems = prevState.filterSections[0].items.map((item) => {
        if (item.id === brandId) {
          // RX logic: toggle all subItems
          if (item.id.toLowerCase() === "rx" && item.subItems) {
            const checked = !item.checked;
            return {
              ...item,
              checked,
              subItems: item.subItems.map((sub) => ({
                ...sub,
                checked,
              })),
            };
          }
          // Other brands
          return { ...item, checked: !item.checked };
        }
        return item;
      });

      const updatedState = {
        ...prevState,
        filterSections: [
          {
            ...prevState.filterSections[0],
            items: newItems,
          },
          ...prevState.filterSections.slice(1),
        ],
      };

      // Update current filter arrays based on checked state
      const checkedBrands = newItems
        .filter((item) => item.checked)
        .map((item) => item.id);
      setcurrentBrandFilter(checkedBrands);

      // Handle RX subitems
      if (brandId.toLowerCase() === "rx") {
        const rxItem = newItems.find((item) => item.id.toLowerCase() === "rx");
        if (rxItem && rxItem.subItems) {
          const checkedSubItems = rxItem.subItems
            .filter((sub) => sub.checked)
            .map((sub) => sub.id);
          setcurrentCollectionFilter((prev) => {
            const otherCollections = prev.filter(
              (id) => !rxItem.subItems.some((sub) => sub.id === id)
            );
            return [...otherCollections, ...checkedSubItems];
          });
        }
      }

      return updatedState;
    });
  };

  const handleCollectionToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    collectionId
  ) => {
    event.stopPropagation();

    setFilterValueState((prevState) => {
      let newItems = prevState.filterSections[0].items.map((item) => {
        if (item.id.toLowerCase() === "rx" && item.subItems) {
          // Update checked state for subItems
          const newSubItems = item.subItems.map((sub) =>
            sub.id === collectionId ? { ...sub, checked: !sub.checked } : sub
          );
          // RX checked only if all subItems checked
          const allChecked = newSubItems.every((sub) => sub.checked);
          return {
            ...item,
            checked: allChecked,
            subItems: newSubItems,
          };
        }
        return item;
      });

      const updatedState = {
        ...prevState,
        filterSections: [
          {
            ...prevState.filterSections[0],
            items: newItems,
          },
          ...prevState.filterSections.slice(1),
        ],
      };

      // Update current filter arrays
      const checkedBrands = newItems
        .filter((item) => item.checked)
        .map((item) => item.id);
      setcurrentBrandFilter(checkedBrands);

      const allCheckedCollections = newItems.flatMap(
        (item) =>
          item.subItems?.filter((sub) => sub.checked).map((sub) => sub.id) || []
      );
      setcurrentCollectionFilter(allCheckedCollections);

      return updatedState;
    });
  };

  // Generic toggle handler for filter sections
  const handleSectionToggle = (sectionIndex, itemId) => {
    setFilterValueState((prevState) => {
      const section = prevState.filterSections[sectionIndex];
      const newItems = section.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      const newSections = prevState.filterSections.map((sec, idx) =>
        idx === sectionIndex ? { ...sec, items: newItems } : sec
      );

      const updatedState = { ...prevState, filterSections: newSections };

      // Update corresponding current filter array
      const checkedItems = newItems
        .filter((item) => item.checked)
        .map((item) => item.id);

      switch (sectionIndex) {
        case 1: // Product Type
          setcurrentProductTypeFilter(checkedItems);
          break;
        case 2: // Condition
          setcurrentConditionFilter(checkedItems);
          break;
        case 3: // Warranty
          setcurrentWarrantyFilter(checkedItems);
          break;
        case 4: // Box
          setcurrentBoxFilter(checkedItems);
          break;
        case 5: // Location
          setcurrentLocationFilter(checkedItems);
          break;
      }

      return updatedState;
    });
  };

  const handleProductTypeToggle = (event, productType) => {
    event.stopPropagation();
    handleSectionToggle(1, productType); // sectionIndex 1 for Product Type
  };

  const handleConditionToggle = (event, condition) => {
    event.stopPropagation();
    handleSectionToggle(2, condition); // sectionIndex 2 for Condition
  };

  const handleWarrantyToggle = (event, warranty) => {
    event.stopPropagation();
    handleSectionToggle(3, warranty); // sectionIndex 3 for Warranty
  };

  const handleBoxToggle = (event, box) => {
    event.stopPropagation();
    handleSectionToggle(4, box); // sectionIndex 4 for Box
  };

  const handleResetFilter = () => {
    clearAllFilters();
    setcurrentBrandFilter([]);
    setcurrentCollectionFilter([]);
    setcurrentConditionFilter([]);
    setcurrentBoxFilter([]);
    setcurrentProductTypeFilter([]);
    setcurrentWarrantyFilter([]);
    setcurrentBrandPrefixFilter([]);
    setcurrentLocationFilter([]);
  };

  // Calculate total number of active filters
  const countCurrentFilter = [
    ...currentBrandFilter,
    ...currentCollectionFilter,
    ...currentConditionFilter,
    ...currentBoxFilter,
    ...currentWarrantyFilter,
    ...currentProductTypeFilter,
    ...currentLocationFilter,
  ].length;

  function getUniqueBrandsObj(rows) {
    const brandMap = new Map();
    rows?.forEach((row) => {
      if (row?.brand) {
        const key = row?.brand;
        if (!brandMap.has(key)) {
          brandMap.set(key, {
            id: key,
            label: key,
            count: 1,
            checked: false,
          });
        } else {
          brandMap.get(key).count += 1;
        }
      }
    });
    return Array.from(brandMap.values());
  }

  function getUniqueRolexCollectionsObj(rows) {
    const collectionMap = new Map();
    rows?.forEach((row) => {
      if (row?.brand?.toLowerCase() === "rx" && row?.collection) {
        const key = row?.collection;
        if (!collectionMap.has(key)) {
          collectionMap.set(key, {
            id: key,
            label: key,
            count: 1,
            checked: false,
          });
        } else {
          collectionMap.get(key).count += 1;
        }
      }
    });
    return Array.from(collectionMap.values());
  }

  // Helper function to preserve Rolex subitems state
  function preserveRolexSubitemsState(newSubItems, prevSubItems) {
    return newSubItems.map((newSubItem) => {
      const prevSubItem = prevSubItems?.find((sub) => sub.id === newSubItem.id);
      return {
        ...newSubItem,
        checked: prevSubItem?.checked || false,
      };
    });
  }

  function normalizeProductType(type) {
    if (!type) return "";
    const watchTypes = [
      "WATCH",
      "WATCH (Vintage)",
      "WATCH (Old Stock)",
      "WATCH (Old Stock/Vintage)",
    ];
    return watchTypes.includes(type) ? "WATCH" : type;
  }

  useEffect(() => {
    // Get filtered rows based on current selections
    const getFilteredRows = () => {
      let filteredRows = props.rows || [];

      // --- Brand OR Collection filter ---
      if (currentBrandFilter.length > 0 || currentCollectionFilter.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          const brandMatch =
            currentBrandFilter.length > 0 &&
            currentBrandFilter.includes(row?.brand);
          const collectionMatch =
            currentCollectionFilter.length > 0 &&
            currentCollectionFilter.includes(row?.collection);

          return brandMatch || collectionMatch;
        });
      }

      // --- Product type filter ---
      if (currentProductTypeFilter.length > 0) {
        const normalizedFilter =
          currentProductTypeFilter.map(normalizeProductType);
        filteredRows = filteredRows.filter((row) =>
          normalizedFilter.includes(normalizeProductType(row?.product_type))
        );
      }

      // --- Condition filter ---
      if (currentConditionFilter.length > 0) {
        filteredRows = filteredRows.filter((row) =>
          currentConditionFilter.some((filterCond) => {
            if (filterCond === "NEW") {
              return row?.new_type === "NEW";
            }
            if (filterCond === "NEW SPECIAL") {
              return row?.new_type === "NEW SPECIAL";
            }
            if (filterCond === "PRE OWNED") {
              return row?.new_type === "PRE OWNED";
            }
            if (filterCond === "VINTAGE") {
              return (
                row?.product_type === "WATCH (Vintage)" ||
                row?.product_type === "WATCH (Old Stock/Vintage)"
              );
            }
            return false;
          })
        );
      }

      // --- Warranty filter ---
      if (currentWarrantyFilter.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          const paper = row?.paper;
          return currentWarrantyFilter.some((selected) => {
            if (selected === "CARD PAPER") {
              // "CARD PAPER" is a superset: include CARD, PAPER, E-WARRANTY, and CARD PAPER
              return (
                paper === "CARD" ||
                paper === "PAPER" ||
                paper === "E-WARRANTY" ||
                paper === "CARD PAPER"
              );
            }
            return paper === selected;
          });
        });
      }

      // --- Box filter ---
      if (currentBoxFilter.length > 0) {
        filteredRows = filteredRows.filter((row) =>
          currentBoxFilter.includes(row?.have_box)
        );
      }

      // --- Location filter ---
      if (currentLocationFilter.length > 0) {
        const locationMap = {
          "United States": ["NY", "T/NY", "R/NY", "LA"],
          JAPAN: ["TKY", "T/TKY", "R/TKY"],
          Thailand: ["BKK", "T/BKK", "R/BKK"],
          "Hong Kong S.A.R": ["HK", "T/HK", "R/HK", "IT", "T/IT", "R/IT", "T"],
          Switzerland: ["ZH", "T/ZH", "R/ZH"],
        };

        filteredRows = filteredRows.filter((row) => {
          if (!row?.location) return false;
          return currentLocationFilter.some((loc) =>
            locationMap[loc]?.includes(row?.location)
          );
        });
      }

      return filteredRows;
    };

    const filteredRows = getFilteredRows();

    // Get all available brands and collections from the original data (not filtered)
    const allBrandsObj = getUniqueBrandsObj(props.rows || []);
    const allRolexCollectionsObj = getUniqueRolexCollectionsObj(
      props.rows || []
    );

    // Create brands with subitems structure for all available brands
    const allBrandsWithSubItems = allBrandsObj.map((brand) => {
      if (brand.id.toUpperCase() === "RX") {
        return {
          ...brand,
          hasSubItems: true,
          isExpanded: false,
          subItems: allRolexCollectionsObj,
        };
      }
      return brand;
    });

    const sortedAllBrands = [
      ...allBrandsWithSubItems.filter((b) => b.id.toUpperCase() === "RX"),
      ...allBrandsWithSubItems.filter((b) => b.id.toUpperCase() !== "RX"),
    ];

    const allBrandsWithFullLabels = updateBrandLabels(sortedAllBrands);

    const activeRows =
      props.muiFilteredRows?.length > 0 &&
      props.muiFilteredRows?.length !== props.rows?.length
        ? props.muiFilteredRows
        : filteredRows;

    // Now calculate counts from the appropriate source
    const productTypeCounts = getProductTypeCounts(activeRows);
    const conditionCounts = getConditionCounts(activeRows);
    const warrantyCounts = getWarrantyCounts(activeRows);
    const boxCounts = getBoxCounts(activeRows);
    const locationCounts = getLocationCounts(activeRows);

    const brandCounts = getBrandCounts(activeRows);
    const collectionCounts = getCollectionCounts(activeRows);

    setFilterValueState((prevState) => {
      // Preserve checked states from previous state
      const preserveCheckedState = (newItems, prevItems) => {
        return newItems.map((newItem) => {
          const prevItem = prevItems?.find((item) => item.id === newItem.id);

          // Special handling for Rolex subitems
          if (newItem.id.toUpperCase() === "RX" && newItem.subItems) {
            const preservedSubItems = preserveRolexSubitemsState(
              newItem.subItems,
              prevItem?.subItems
            ).map((subItem) => ({
              ...subItem,
              count: collectionCounts[subItem.id] || 0,
            }));

            // Check if all subitems are checked to determine parent checked state
            const allSubItemsChecked =
              preservedSubItems.length > 0 &&
              preservedSubItems.every((sub) => sub.checked);

            return {
              ...newItem,
              checked: prevItem?.checked || allSubItemsChecked,
              count: brandCounts[newItem.id] || 0,
              subItems: preservedSubItems,
            };
          }

          // For other items
          return {
            ...newItem,
            checked: prevItem?.checked || false,
            count: brandCounts[newItem.id] || 0,
            subItems: newItem.subItems
              ? newItem.subItems.map((newSubItem) => {
                  const prevSubItem = prevItem?.subItems?.find(
                    (sub) => sub.id === newSubItem.id
                  );
                  return {
                    ...newSubItem,
                    checked: prevSubItem?.checked || false,
                    count: collectionCounts[newSubItem.id] || 0,
                  };
                })
              : undefined,
          };
        });
      };

      return {
        ...prevState,
        filterSections: [
          {
            ...prevState?.filterSections[0],
            items: preserveCheckedState(
              allBrandsWithFullLabels,
              prevState.filterSections[0]?.items
            ),
          },
          {
            ...prevState?.filterSections[1],
            items: prevState.filterSections[1]?.items?.map((item) => ({
              ...item,
              count: productTypeCounts[item.id] || 0,
            })),
          },
          {
            ...prevState?.filterSections[2],
            items: prevState.filterSections[2]?.items?.map((item) => ({
              ...item,
              count: conditionCounts[item.id] || 0,
            })),
          },
          {
            ...prevState?.filterSections[3],
            items: prevState.filterSections[3]?.items?.map((item) => ({
              ...item,
              count:
                item.id === "CARD PAPER"
                  ? warrantyCounts["CARD PAPER"]
                  : item.id === "CARD"
                    ? warrantyCounts["CARD"]
                    : item.id === "PAPER"
                      ? warrantyCounts["PAPER"]
                      : item.id === "E-WARRANTY"
                        ? warrantyCounts["E-WARRANTY"]
                        : item.id === "ARCHIVE"
                          ? warrantyCounts["ARCHIVE"]
                          : item.id === "N/A"
                            ? warrantyCounts["N/A"]
                            : 0,
            })),
          },
          {
            ...prevState?.filterSections[4],
            items: prevState.filterSections[4]?.items?.map((item) => ({
              ...item,
              count: boxCounts[item.id] || 0,
            })),
          },
          {
            ...prevState?.filterSections[5],
            items: prevState.filterSections[5]?.items?.map((item) => ({
              ...item,
              count: locationCounts[item.id] || 0,
            })),
          },
        ],
      };
    });
  }, [
    props.rows,
    currentBrandFilter,
    currentCollectionFilter,
    currentProductTypeFilter,
    currentConditionFilter,
    currentWarrantyFilter,
    currentBoxFilter,
    currentLocationFilter,
    props.muiFilteredRows,
  ]);

  function updateBrandLabels(items) {
    return items?.map((item) => ({
      ...item,
      label: brandNameMap[item.id] || item.label,
      subItems: item.subItems
        ? item.subItems.map((sub) => ({ ...sub }))
        : undefined,
    }));
  }

  useEffect(() => {
    // Update the filter whenever the rows or checked states change
    // Only update if there are no active MUI filters to prevent conflicts

    // Check if there are active MUI filters
    const hasActiveMuiFilters = props.muiFilterModel?.items?.length > 0;

    if (hasActiveMuiFilters) {
      // Don't update custom filter state when MUI filters are active
      return;
    }

    props?.setFilter((prev) => ({
      ...prev,
      brand:
        filterValueState.filterSections[0]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
      collection:
        filterValueState.filterSections[0]?.items.flatMap((item) =>
          item.subItems
            ? item.subItems.filter((sub) => sub.checked).map((sub) => sub.id)
            : []
        ) || [],
      product_type:
        filterValueState.filterSections[1]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
      condition:
        filterValueState.filterSections[2]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
      have_box:
        filterValueState.filterSections[4]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
      paper:
        filterValueState.filterSections[3]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
      location:
        filterValueState.filterSections[5]?.items
          .filter((item) => item.checked)
          .map((item) => item.id) || [],
    }));
  }, [filterValueState, props?.setFilter, props.muiFilterModel]);

  return (
    <div
      style={{ maxHeight: "calc(100vh - 130px)" }}
      className="flex flex-col w-full overflow-y-auto"
    >
      {/* Brand Filter */}
      <Accordion
        defaultExpanded={filterValueState?.filterSections[0]?.isExpanded}
        sx={{ boxShadow: "none", marginBottom: "0px !important" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className={classes.expandedAccordionSummary}
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="font-semibold">
              {filterValueState?.filterSections[0]?.title}
            </h3>
            {countCurrentFilter > 0 && (
              <FormControlLabel
                control={
                  <Button
                    size="small"
                    color="inherit"
                    role="button"
                    variant="contained"
                    onClick={(event) => handleAllChecked(event)}
                  >
                    Clear All Filter {`(${countCurrentFilter})`}
                  </Button>
                }
                label={``}
              />
            )}
          </div>
        </AccordionSummary>

        <AccordionDetails className="pb-0 pt-0">
          {filterValueState?.filterSections[0]?.items?.map(
            (brandItem, index) => (
              <div key={index}>
                {brandItem?.hasSubItems ? (
                  <Accordion
                    {...(index === 0 ? { defaultExpanded: true } : {})}
                    sx={{ boxShadow: "none" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                      sx={{
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        minHeight: "48px !important",
                        "& .MuiAccordionSummary-content": {
                          margin: 0,
                        },
                      }}
                    >
                      <div className="flex w-full items-center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              className="py-0"
                              checked={brandItem?.checked}
                              onChange={(event) =>
                                handleBrandToggle(event, brandItem?.id)
                              }
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  color: brandItem?.checked
                                    ? "#4f46e5"
                                    : "black",
                                },
                              }}
                            />
                          }
                          label={`${brandItem?.label}`}
                          sx={{
                            marginRight: "5px",
                            "& .MuiFormControlLabel-label": {
                              fontWeight: "600",
                            },
                          }}
                        />
                        <p className="text-sm font-600">({brandItem?.count})</p>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className="flex flex-col -mt-16 ml-16 pb-[10px]">
                      {brandItem?.subItems?.map(
                        (collectionItem, collectionIndex) => (
                          <FormControlLabel
                            key={collectionIndex}
                            control={
                              <Checkbox
                                className="py-0"
                                checked={collectionItem?.checked}
                                onChange={(event) =>
                                  handleCollectionToggle(
                                    event,
                                    collectionItem?.id
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            }
                            label={`${collectionItem?.label}  (${collectionItem?.count})`}
                          />
                        )
                      )}
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <AccordionSummary
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{
                      minHeight: "0px",
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <div className="flex w-full items-center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            className="py-0"
                            checked={brandItem?.checked}
                            onChange={(event) =>
                              handleBrandToggle(event, brandItem?.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              "& .MuiSvgIcon-root": {
                                color: brandItem?.checked
                                  ? "#4f46e5"
                                  : brandItem?.label == "Audemars Piguet" ||
                                      brandItem?.label == "Patek Philippe"
                                    ? "black"
                                    : "#6b7280",
                              },
                            }}
                          />
                        }
                        label={`${brandItem?.label}`}
                        sx={{
                          marginRight: "5px",
                          "& .MuiFormControlLabel-label": {
                            fontWeight:
                              brandItem?.label == "Audemars Piguet" ||
                              brandItem?.label == "Patek Philippe"
                                ? 600
                                : 400,
                          },
                        }}
                      />
                      <p
                        style={{
                          fontWeight:
                            brandItem?.label == "Audemars Piguet" ||
                            brandItem?.label == "Patek Philippe"
                              ? 600
                              : 400,
                        }}
                        className="text-sm"
                      >
                        ({brandItem?.count})
                      </p>
                    </div>
                  </AccordionSummary>
                )}
              </div>
            )
          )}
        </AccordionDetails>
      </Accordion>
      {/* <BrandFilter /> */}

      {/* Price filter */}

      {/* <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <h3>Price</h3>
        </AccordionSummary>
        <AccordionDetails>
          <PriceSlider />
        </AccordionDetails>
      </Accordion> */}

      {/* Product Type filter */}
      <Accordion
        defaultExpanded
        sx={{
          marginTop: "0px !important",
          marginBottom: "0px !important",
          boxShadow: "none",
        }}
      >
        <AccordionSummary aria-controls="panel5-content" id="panel5-header">
          <h3 className="font-semibold">Product Type</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          {filterValueState.filterSections[1]?.items?.map((item) => (
            <FormControlLabel
              className="px-[16px]"
              key={item.id}
              control={
                <Checkbox
                  className="py-0"
                  checked={item.checked}
                  onChange={(event) => handleProductTypeToggle(event, item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`${item.label} (${item.count})`}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Condition filter */}
      <Accordion
        defaultExpanded
        sx={{ marginTop: "0px !important", marginBottom: "0px !important" }}
      >
        <AccordionSummary aria-controls="panel2-content" id="panel2-header">
          <h3 className="font-semibold">Condition</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          {filterValueState.filterSections[2]?.items?.map((item) => (
            <FormControlLabel
              className="px-[16px]"
              key={item.id}
              control={
                <Checkbox
                  className="py-0"
                  checked={item.checked}
                  onChange={(event) => handleConditionToggle(event, item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`${item.label} (${item.count})`}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Warranty filter */}
      <Accordion
        defaultExpanded
        sx={{ marginTop: "0px !important", marginBottom: "0px !important" }}
      >
        <AccordionSummary aria-controls="panel5-content" id="panel5-header">
          <h3 className="font-semibold">Warranty</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          {filterValueState.filterSections[3]?.items?.map((item) => (
            <FormControlLabel
              className="px-[16px]"
              key={item.id}
              control={
                <Checkbox
                  className="py-0"
                  checked={item.checked}
                  onChange={(event) => handleWarrantyToggle(event, item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`${item.label} (${item.count})`}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Box filter */}
      <Accordion
        defaultExpanded
        sx={{
          marginTop: "0px !important",
          marginBottom: "0px !important",
          boxShadow: "none",
        }}
      >
        <AccordionSummary aria-controls="panel5-content" id="panel5-header">
          <h3 className="font-semibold">Box</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          {filterValueState.filterSections[4]?.items?.map((item) => (
            <FormControlLabel
              className="px-[16px]"
              key={item.id}
              control={
                <Checkbox
                  className="py-0"
                  checked={item.checked}
                  onChange={(event) => handleBoxToggle(event, item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`${item.label} (${item.count})`}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Location filter */}
      <Accordion
        defaultExpanded
        sx={{
          marginTop: "0px !important",
          marginBottom: "0px !important",
          boxShadow: "none",
        }}
      >
        <AccordionSummary aria-controls="panel6-content" id="panel6-header">
          <h3 className="font-semibold">Location</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          {filterValueState.filterSections[5]?.items?.map((item) => (
            <FormControlLabel
              className="px-[16px]"
              key={item.id}
              control={
                <Checkbox
                  className="py-0"
                  checked={item.checked}
                  onChange={(event) => handleSectionToggle(5, item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={`${item.label} (${item.count})`}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <div className="h-40"></div>
    </div>
  );
}

export default FilterOptionList;

function getProductTypeCounts(rows) {
  const counts = {};
  rows?.forEach((row) => {
    if (row?.product_type) {
      if (
        row?.product_type === "WATCH" ||
        row?.product_type === "WATCH (Vintage)" ||
        row?.product_type === "WATCH (Old Stock)" ||
        row?.product_type === "WATCH (Old Stock/Vintage)"
      ) {
        counts["WATCH"] = (counts["WATCH"] || 0) + 1;
      } else {
        counts[row?.product_type] = (counts[row?.product_type] || 0) + 1;
      }
    }
  });
  return counts;
}

function getConditionCounts(rows) {
  const counts = {};
  rows?.forEach((row) => {
    if (row?.new_type || row?.product_type) {
      if (row?.new_type === "NEW") {
        counts["NEW"] = (counts["NEW"] || 0) + 1;
      } else if (row?.new_type === "NEW SPECIAL") {
        counts["NEW SPECIAL"] = (counts["NEW SPECIAL"] || 0) + 1;
      } else if (row?.new_type === "PRE OWNED") {
        counts["PRE OWNED"] = (counts["PRE OWNED"] || 0) + 1;
      }

      if (
        row?.product_type === "WATCH (Vintage)" ||
        row?.product_type === "WATCH (Old Stock/Vintage)"
      ) {
        counts["VINTAGE"] = (counts["VINTAGE"] || 0) + 1;
      }
    }
  });
  return counts;
}

function getWarrantyCounts(rows) {
  const counts = {
    "CARD PAPER": 0,
    CARD: 0,
    PAPER: 0,
    "E-WARRANTY": 0,
    ARCHIVE: 0,
    "N/A": 0,
  };
  rows?.forEach((row) => {
    if (row?.paper) {
      if (row?.paper === "CARD PAPER") counts["CARD PAPER"] += 1;
      if (row?.paper === "CARD") {
        counts["CARD"] += 1;
        counts["CARD PAPER"] += 1;
      }
      if (row?.paper === "PAPER") {
        counts["PAPER"] += 1;
        counts["CARD PAPER"] += 1;
      }
      if (row?.paper === "E-WARRANTY") {
        counts["E-WARRANTY"] += 1;
        counts["CARD PAPER"] += 1;
      }
      if (row?.paper === "ARCHIVE") counts["ARCHIVE"] += 1;
      if (row?.paper === "N/A") counts["N/A"] += 1;
    }
  });
  return counts;
}

function getBoxCounts(rows) {
  let withBox = 0,
    noBox = 0;
  rows?.forEach((row) => {
    if (row?.have_box === "Y") withBox += 1;
    if (row?.have_box === "N/A") noBox += 1;
  });
  return { Y: withBox, "N/A": noBox };
}

function getLocationCounts(rows) {
  const locationMap = {
    "United States": ["NY", "T/NY", "R/NY", "LA"],
    JAPAN: ["TKY", "T/TKY", "R/TKY"],
    Thailand: ["BKK", "T/BKK", "R/BKK"],
    "Hong Kong S.A.R": ["HK", "T/HK", "R/HK", "IT", "T/IT", "R/IT", "T"],
    Switzerland: ["ZH", "T/ZH", "R/ZH"],
  };

  const counts = {
    "United States": 0,
    JAPAN: 0,
    Thailand: 0,
    "Hong Kong S.A.R": 0,
    Switzerland: 0,
  };

  rows?.forEach((row) => {
    if (row?.location) {
      Object.entries(locationMap).forEach(([mainLoc, subLocs]) => {
        if (subLocs.includes(row?.location)) {
          counts[mainLoc] = (counts[mainLoc] || 0) + 1;
        }
      });
    }
  });

  return counts;
}

function getBrandCounts(rows) {
  const counts = {};
  rows?.forEach((row) => {
    if (row?.brand) {
      counts[row.brand] = (counts[row.brand] || 0) + 1;
    }
  });
  return counts;
}

function getCollectionCounts(rows) {
  const counts = {};
  rows?.forEach((row) => {
    if (row?.collection) {
      counts[row.collection] = (counts[row.collection] || 0) + 1;
    }
  });
  return counts;
}
