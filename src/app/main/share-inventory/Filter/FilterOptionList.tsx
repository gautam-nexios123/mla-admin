import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { Radio, RadioGroup } from "@mui/material";
import {
  setStockListboxFilter,
  setStockListwarrantyFilter,
  setStockListpriceFilter,
  setStockListbrandFilter,
  setStockListcollectionFilter,
  setStockListconditionFilter,
  setStockListProductTypeFilter,
  setStockListSearchText,
  setStockListLocationFilter,
} from "app/store/stockSlice";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import {
  getFilters,
  selectCurrentFilters,
  selectFilters,
  setfilterBrandList,
  setfilterCollectionList,
  setfilterConditionsList,
  setfilterBoxList,
  setfilterWarrantyList,
  setfilterProductTypeList,
  setfilterLocationList,
} from "app/store/Filter/filterSlice";
import { useDispatch } from "react-redux";
import { locationDisplayFlag } from "src/utils/coreFunction";
// import withReducer from "app/store/withReducer";
// import reducer from "./store";

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
  const allFilters: any = useSelector(selectFilters);
  const filters = useSelector(selectCurrentFilters);
  const [FilterData, setFilterData] = useState<any>(allFilters?.result || []);

  const [locationFilterData, setLocationFilterData] = useState(
    allFilters?.location || []
  );
  const [currentBrandFilter, setcurrentBrandFilter] = useState(
    filters?.brands || []
  );
  const [currentBrandPrefixFilter, setcurrentBrandPrefixFilter] = useState([]);
  const [currentCollectionFilter, setcurrentCollectionFilter] = useState(
    filters?.collections || []
  );
  const [currentConditionFilter, setcurrentConditionFilter] = useState(
    filters?.conditions || []
  );
  const [currentBoxFilter, setcurrentBoxFilter] = useState(filters?.box || []);
  const [currentProductTypeFilter, setcurrentProductTypeFilter] = useState(
    filters?.productType || []
  );
  const [currentWarrantyFilter, setcurrentWarrantyFilter] = useState(
    filters?.warranty || []
  );
  const [currentLocationFilter, setCurrentLocationFilter] = useState(
    filters.location || []
  );
  const [brandIsLoading, setBrandIsLoading] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();

  const mappingBrandPrefix = (fullBrandName: string, brandData) => {
    return brandData.find((f) => f.brand === fullBrandName)?.brand_prefix;
  };

  useEffect(() => {
    setBrandIsLoading(true);
    dispatch(getFilters({})).then(() => {
      setBrandIsLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    setcurrentBrandFilter(filters?.brands);
    setcurrentCollectionFilter(filters?.collections);
    setcurrentConditionFilter(filters?.conditions);
    setcurrentBoxFilter(filters?.box);
    setcurrentProductTypeFilter(filters?.productType);
    setcurrentWarrantyFilter(filters?.warranty);
  }, [filters]);

  useEffect(() => {
    if (allFilters?.result) {
      setFilterData(FilterData);
    }
    if (currentBrandFilter) {
      setcurrentBrandFilter(currentBrandFilter);
    }

    if (currentCollectionFilter) {
      setcurrentCollectionFilter(currentCollectionFilter);
    }

    if (currentConditionFilter) {
      setcurrentConditionFilter(currentConditionFilter);
    }

    if (currentBoxFilter) {
      setcurrentBoxFilter(currentBoxFilter);
    }

    if (currentProductTypeFilter) {
      setcurrentProductTypeFilter(currentProductTypeFilter);
    }

    if (currentWarrantyFilter) {
      setcurrentWarrantyFilter(currentWarrantyFilter);
    }

    if (FilterData && currentBrandFilter) {
      const allBrandsPrefix = currentBrandFilter.map((m) =>
        mappingBrandPrefix(m, FilterData)
      );
      // console.log('allBrandsPrefix',allBrandsPrefix)
      setcurrentBrandPrefixFilter(allBrandsPrefix);
    }
  }, [
    FilterData,
    currentBrandFilter,
    currentCollectionFilter,
    currentConditionFilter,
    currentBoxFilter,
    currentProductTypeFilter,
    currentWarrantyFilter,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setfilterBrandList(currentBrandFilter));
      dispatch(setfilterCollectionList(currentCollectionFilter));
      dispatch(setfilterProductTypeList(currentProductTypeFilter));
      dispatch(
        setStockListProductTypeFilter(currentProductTypeFilter.join(","))
      );
      dispatch(setfilterConditionsList(currentConditionFilter));
      dispatch(setfilterBoxList(currentBoxFilter));
      dispatch(setfilterLocationList(currentLocationFilter));
      dispatch(setfilterWarrantyList(currentWarrantyFilter));
      dispatch(setStockListboxFilter(currentBoxFilter.join(",")));
      dispatch(setStockListLocationFilter(currentLocationFilter.join(",")));
      dispatch(setStockListwarrantyFilter(currentWarrantyFilter.join(",")));
      dispatch(setStockListconditionFilter(currentConditionFilter.join(",")));
      dispatch(setStockListbrandFilter(currentBrandPrefixFilter.join(",")));
      dispatch(setStockListcollectionFilter(currentCollectionFilter.join(",")));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    currentBrandFilter,
    currentCollectionFilter,
    currentProductTypeFilter,
    currentConditionFilter,
    currentBoxFilter,
    currentBrandPrefixFilter,
    currentWarrantyFilter,
    currentLocationFilter,
  ]);

  // Function to handle brand toggle
  const handleAllChecked = (event) => {
    event.stopPropagation();
    if (
      [
        ...currentBrandFilter,
        ...currentCollectionFilter,
        ...currentProductTypeFilter,
        ...currentConditionFilter,
        ...currentBoxFilter,
        ...currentWarrantyFilter,
        ...currentLocationFilter,
      ].length > 0
    ) {
      handleResetFilter();
    }
  };

  const handleBrandToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    brand
  ) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentBrandFilter((prv) =>
      prv.includes(brand)
        ? prv.filter((item) => item !== brand)
        : [...prv, brand]
    );
  };

  const handleCollectionToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    collection
  ) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentCollectionFilter((prv) =>
      prv.includes(collection)
        ? prv.filter((item) => item !== collection)
        : [...prv, collection]
    );
  };

  const handleConditionToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    condition
  ) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentConditionFilter((prv) =>
      prv.includes(condition)
        ? prv.filter((item) => item !== condition)
        : [...prv, condition]
    );
  };

  const handleBoxToggle = (event: React.ChangeEvent<HTMLInputElement>, box) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentBoxFilter((prv) =>
      prv.includes(box) ? prv.filter((item) => item !== box) : [...prv, box]
    );
  };

  const handleProductTypeToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    productType
  ) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentProductTypeFilter((prv) =>
      prv.includes(productType)
        ? prv.filter((item) => item !== productType)
        : [...prv, productType]
    );
  };

  const handlePaperToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    warranty
  ) => {
    event.stopPropagation();
    // dispatch(setStockListSearchText(""));
    setcurrentWarrantyFilter((prv) =>
      prv.includes(warranty)
        ? prv.filter((item) => item !== warranty)
        : [...prv, warranty]
    );
  };

  const handleLocationToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    location
  ) => {
    event.stopPropagation();
    setCurrentLocationFilter((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const handleResetFilter = () => {
    setcurrentBrandFilter([]);
    setcurrentCollectionFilter([]);
    setcurrentConditionFilter([]);
    setcurrentBoxFilter([]);
    setcurrentProductTypeFilter([]);
    setcurrentWarrantyFilter([]);
    setcurrentBrandPrefixFilter([]);
    setCurrentLocationFilter([]);
  };

  const countCurrentFilter = [
    ...currentBrandFilter,
    ...currentCollectionFilter,
    ...currentConditionFilter,
    ...currentBoxFilter,
    ...currentWarrantyFilter,
    ...currentProductTypeFilter,
    ...currentLocationFilter,
  ].length;

  const getState = (key, value) => {
    switch (key) {
      case "brand":
        return currentBrandFilter.includes(value);

      case "collection":
        return currentCollectionFilter.includes(value);

      case "productType":
        return currentProductTypeFilter.includes(value);

      case "condition":
        return currentConditionFilter.includes(value);

      case "box":
        return currentBoxFilter.includes(value);

      case "warranty":
        return currentWarrantyFilter.includes(value);

      case "location":
        return currentLocationFilter.includes(value);

      case "all":
        return countCurrentFilter === 0;
      default:
        return false;
    }
  };

  if (brandIsLoading) {
    return (
      <CircularProgress
        size={24}
        sx={{
          color: "black",
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-12px",
          marginLeft: "-12px",
        }}
      />
    );
  }

  return (
    <div
      style={{ maxHeight: "calc(100vh - 130px)" }}
      className="flex flex-col w-full overflow-y-auto"
    >
      {/* Brand Filter */}
      <Accordion
        defaultExpanded
        sx={{ boxShadow: "none", marginBottom: "0px !important" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className={classes.expandedAccordionSummary}
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="font-semibold">Brand</h3>
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
          {FilterData?.map((brandItem, index) => (
            <div key={index}>
              {brandItem.brand_prefix === "RX" ? (
                <Accordion
                  {...(index === 0 ? { defaultExpanded: true } : {})}
                  sx={{ boxShadow: "none" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{
                      paddingTop: "4px", // Decrease the top padding
                      paddingBottom: "4px", // Decrease the bottom padding
                      minHeight: "48px !important", // Ensure minimum height does not override padding
                      "& .MuiAccordionSummary-content": {
                        margin: 0, // Remove default margin
                      },
                    }}
                  >
                    <div className="flex w-full items-center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            className="py-0"
                            checked={getState("brand", brandItem.brand)}
                            onChange={(event) =>
                              handleBrandToggle(event, brandItem.brand)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={`${brandItem.brand}`}
                        sx={{
                          marginRight: "5px",
                        }}
                      />
                      <p className="text-sm">({brandItem.count})</p>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="flex flex-col -mt-16 ml-16 pb-[10px]">
                    {brandItem.data.map((collectionItem, collectionIndex) => {
                      const label =
                        collectionItem.collection === "Cosmograph Daytona"
                          ? "Daytona"
                          : collectionItem.collection;
                      return (
                        <FormControlLabel
                          key={collectionIndex}
                          control={
                            <Checkbox
                              className="py-0"
                              checked={
                                getState("brand", brandItem.brand)
                                  ? true
                                  : getState(
                                      "collection",
                                      collectionItem.collection
                                    )
                              }
                              onChange={(event) =>
                                handleCollectionToggle(
                                  event,
                                  collectionItem.collection
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                          label={`${label}  (${collectionItem.count})`}
                        />
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <>
                  <AccordionSummary
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{
                      minHeight: "0px", // Ensure minimum height does not override padding
                      "& .MuiAccordionSummary-content": {
                        margin: 0, // Remove default margin
                      },
                    }}
                  >
                    <div className="flex w-full items-center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            className="py-0"
                            checked={getState("brand", brandItem.brand)}
                            onChange={(event) =>
                              handleBrandToggle(event, brandItem.brand)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={`${brandItem.brand}`}
                        sx={{
                          marginRight: "5px",
                        }}
                      />
                      <p className="text-sm">({brandItem.count})</p>
                    </div>
                  </AccordionSummary>

                  {/* {
                        GetDivider(index, FilterData)
                      } */}
                </>
              )}
            </div>
          ))}
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
          <FormControlLabel
            className="px-[16px]"
            key={`box_y`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("productType", "WATCH")}
                onChange={(event) => handleProductTypeToggle(event, "WATCH")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Watches`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`productType_n`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("productType", "BAG")}
                onChange={(event) => handleProductTypeToggle(event, "BAG")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Handbags`}
          />
        </AccordionDetails>
      </Accordion>

      {/* Condition filter */}
      <Accordion
        defaultExpanded
        sx={{ marginTop: "0px !important", marginBottom: "0px !important" }}
      >
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <h3 className="font-semibold">Condition</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          <FormControlLabel
            className="px-[16px]"
            key={`condition_new`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("condition", "NEW")}
                onChange={(event) => handleConditionToggle(event, "NEW")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`New`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`condition_preowned`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("condition", "PRE OWNED")}
                onChange={(event) => handleConditionToggle(event, "PRE OWNED")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Pre-owned`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`condition_preowned`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("condition", "VINTAGE")}
                onChange={(event) => handleConditionToggle(event, "VINTAGE")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Vintage`}
          />
          {/* <FormControlLabel
            key={`condition_newspecial`}
            control={
              <Checkbox
                checked={
                  getState("condition", "NEW SPECIAL")
                }
                onChange={(event) =>
                  handleConditionToggle(event, "NEW SPECIAL")
                }
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`New Special`}
          /> */}
        </AccordionDetails>
      </Accordion>

      {/* Warranty filter */}
      <Accordion
        defaultExpanded
        sx={{ marginTop: "0px !important", marginBottom: "0px !important" }}
      >
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <h3 className="font-semibold">Warranty</h3>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col -mt-16 pb-0">
          <FormControlLabel
            className="px-[16px]"
            key={`paper_y`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("warranty", "CARD,PAPER,E-WARRANTY")}
                onChange={(event) =>
                  handlePaperToggle(event, "CARD,PAPER,E-WARRANTY")
                }
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Card/Paper`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`paper_a`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("warranty", "ARCHIVE")}
                onChange={(event) => handlePaperToggle(event, "ARCHIVE")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`Archive`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`paper_n`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("warranty", "N/A")}
                onChange={(event) => handlePaperToggle(event, "N/A")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`No warranty`}
          />
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
          <FormControlLabel
            className="px-[16px]"
            key={`box_y`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("box", "Y")}
                onChange={(event) => handleBoxToggle(event, "Y")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`With Box`}
          />
          <FormControlLabel
            className="px-[16px]"
            key={`box_n`}
            control={
              <Checkbox
                className="py-0"
                checked={getState("box", "N/A")}
                onChange={(event) => handleBoxToggle(event, "N/A")}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={`No Box`}
          />
        </AccordionDetails>
      </Accordion>

      {/* location filter */}

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
          {locationFilterData?.map((locationItem, index) => {
            const city =
              locationDisplayFlag[locationItem?.toLowerCase()] || null;
            return (
              <FormControlLabel
                className="px-[16px]"
                key={`location_${locationItem}`}
                control={
                  <Checkbox
                    className="py-0"
                    checked={getState("location", locationItem)}
                    onChange={(event) =>
                      handleLocationToggle(event, locationItem)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                label={
                  <img
                    className="w-[30px] h-[30px]"
                    src={`assets/images/flags/${city}.svg`}
                    alt={"test"}
                  />
                }
              />
            );
          })}
        </AccordionDetails>
      </Accordion>

      <div className="h-40"></div>
    </div>
  );
}
// export default withReducer("filter", reducer)(FilterOptionList);
export default FilterOptionList;

function GetDivider(currentIndex, fullArray) {
  const vintageIndex = fullArray.findIndex((item) => item.brand === "VINTAGE");
  const divider = (
    <div className="h-20 w-full flex items-center justify-center px-10">
      {" "}
      <div className="w-full h-1 bg-grey-700 rounded-20"></div>{" "}
    </div>
  );

  if (vintageIndex !== -1) {
    if (currentIndex === vintageIndex - 1) {
      return divider;
    }
  } else {
    if (currentIndex === 2) {
      return divider;
    }
  }

  return null;
}
