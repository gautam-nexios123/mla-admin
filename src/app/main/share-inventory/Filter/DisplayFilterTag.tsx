import { useThemeMediaQuery } from "@fuse/hooks";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setStockListboxFilter,
  setStockListbrandFilter,
  setStockListcollectionFilter,
  setStockListconditionFilter,
  setStockListLocationFilter,
  setStockListProductTypeFilter,
  setStockListwarrantyFilter,
} from "app/store/stockSlice";
import {
  getFilters,
  selectCurrentFilters,
  setfilterList,
} from "app/store/Filter/filterSlice";

function DisplayFilterTag(props) {
  //   const { allFilters } = props;

  //   const allFilters = useSelector(selectFilters);
  const filters = useSelector(selectCurrentFilters);

  const [currentFilters, setCurrentFilters] = useState(filters || []);
  const dispatch = useDispatch();

  const [brandIsLoading, setBrandIsLoading] = useState(false);

  useEffect(() => {
    setBrandIsLoading(true);
    dispatch(getFilters({})).then(() => {
      setBrandIsLoading(false);
    });
  }, [dispatch]);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    if (filters) {
      let Arbox = [];
      Arbox =
        filters.box.length > 0
          ? filters.box.map((m) => (m == "N/A" ? "N" : m))
          : filters.box;
      setCurrentFilters([
        ...filters.brands.map((item) => ({ label: item, key: "brands" })),
        ...filters.collections.map((item) => ({
          label: item,
          key: "collections",
        })),
        ...filters.conditions.map((item) => ({
          label: item,
          key: "conditions",
        })),
        ...filters.productType.map((item) => ({
          label: item,
          key: "productType",
        })),
        ...Arbox.map((item) => ({ label: item, key: "box" })),
        ...filters.warranty.map((item) => ({ label: item, key: "warranty" })),
        ...filters.location?.map((item) => ({ label: item, key: "location" })),
      ]);
    }
  }, [filters]);

  const handleDelete = (value) => {
    const newData = {
      ...filters,
      [value.key]: [
        ...filters?.[value.key]?.filter(
          (item) =>
            item !==
            (value.key === "box"
              ? value.label == "N"
                ? "N/A"
                : value.label
              : value.label)
        ),
      ],
    };
    dispatch(setfilterList(newData));
    if (value.key === "brands") {
      dispatch(setStockListbrandFilter(newData.brands.join(",")));
    } else if (value.key === "collections") {
      dispatch(setStockListcollectionFilter(newData.collections.join(",")));
    } else if (value.key === "conditions") {
      dispatch(setStockListconditionFilter(newData.conditions.join(",")));
    } else if (value.key === "productType") {
      dispatch(setStockListProductTypeFilter(newData.productType.join(",")));
    } else if (value.key === "box") {
      dispatch(setStockListboxFilter(newData.box.join(",")));
    } else if (value.key === "warranty") {
      dispatch(setStockListwarrantyFilter(newData.warranty.join(",")));
    } else if (value.key === "location") {
      dispatch(setStockListLocationFilter(newData.location.join(",")));
    }
  };

  useEffect(() => {}, [currentFilters]);

  const handleClearAll = () => {
    const clearedFilters = {
      brands: [],
      collections: [],
      productType: [],
      conditions: [],
      box: [],
      location: [],
      warranty: [],
    };
    dispatch(setfilterList(clearedFilters));
    dispatch(setStockListProductTypeFilter(""));
    dispatch(setStockListbrandFilter(""));
    dispatch(setStockListcollectionFilter(""));
    dispatch(setStockListconditionFilter(""));
    dispatch(setStockListboxFilter(""));
    dispatch(setStockListLocationFilter(""));
    dispatch(setStockListwarrantyFilter(""));
    setCurrentFilters([]);
  };

  if (brandIsLoading) {
    return <></>;
  }
  //   console.log('allFilters::DisplayFilterTag::',allFilters)

  const stringLabel = (stringLabel: string) => {
    let label = stringLabel;
    if (label == "CARD,PAPER,E-WARRANTY") label = "Card/Paper";
    if (label == "N/A") label = "No Warranty";
    if (label == "Y") label = "With Box";
    if (label == "N") label = "No Box";
    if (label === "BAG") label = "HANDBAG";

    return label;
  };

  return (
    <span className="flex my-[5px] mx-[15px]">
      {currentFilters.length > 0 && (
        <>
          {isMobile ? (
            <div className="flex px-0 w-full overflow-x-scroll max-h-112 gap-2">
              <Stack
                spacing={{ xs: 1, sm: 4 }}
                direction="row"
                useFlexGap
                className="gap-3"
              >
                {currentFilters.map((v) => (
                  <Chip
                    key={`checked_${v.label}`}
                    label={stringLabel(v.label)}
                    onDelete={() => handleDelete(v)}
                  />
                ))}
              </Stack>
              <div className="">
                <Button
                  className="ml-3 w-max"
                  size="small"
                  color="inherit"
                  role="button"
                  variant="contained"
                  onClick={handleClearAll}
                >
                  Clear All Filter
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row p-2 w-full overflow-auto max-h-112 align-middle gap-2">
              <Stack
                spacing={{ xs: 1, sm: 1 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {/* {"Filters:"}{" "}{currentFilters.length} */}
                {currentFilters.map((v) => (
                  <Chip
                    key={`checked_${v.label}`}
                    label={stringLabel(v.label)}
                    onDelete={() => handleDelete(v)}
                  />
                ))}
              </Stack>
              <Button
                className="ml-3 w-fit"
                size="small"
                color="inherit"
                role="button"
                variant="contained"
                onClick={handleClearAll}
              >
                Clear All Filter{" "}
              </Button>
            </div>
          )}
        </>
      )}
    </span>
  );
}

// export default withReducer("filter", reducer)(DisplayFilterTag);
export default DisplayFilterTag;
