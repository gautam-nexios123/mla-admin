import { useState, useEffect } from "react";

const STORAGE_KEY = "filterOptionListState";

interface FilterItem {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  subItems?: FilterItem[];
}

interface FilterSection {
  id: string;
  title: string;
  isExpanded: boolean;
  items: FilterItem[];
}

interface FilterState {
  filterSections: FilterSection[];
}

const defaultFilterState: FilterState = {
  filterSections: [
    {
      id: "brand",
      title: "Brand",
      isExpanded: true,
      items: [
        {
          id: "rolex",
          label: "Rolex",
          count: 503,
          checked: false,
          hasSubItems: true,
          isExpanded: false,
          subItems: [
            { id: "air-king", label: "Air-King", count: 10, checked: false },
            { id: "cellini", label: "Cellini", count: 2, checked: false },
            { id: "daytona", label: "Daytona", count: 66, checked: false },
            { id: "datejust", label: "Datejust", count: 160, checked: false },
            { id: "day-date", label: "Day-Date", count: 32, checked: false },
            { id: "explorer", label: "Explorer", count: 13, checked: false },
            {
              id: "explorer-ii",
              label: "Explorer II",
              count: 12,
              checked: false,
            },
            { id: "gmt-master", label: "GMT-Master", count: 6, checked: false },
            {
              id: "gmt-master-ii",
              label: "GMT-Master II",
              count: 40,
              checked: false,
            },
            { id: "milgauss", label: "Milgauss", count: 6, checked: false },
            {
              id: "oyster-perpetual",
              label: "Oyster Perpetual",
              count: 30,
              checked: false,
            },
            {
              id: "pearlmaster",
              label: "Pearlmaster",
              count: 2,
              checked: false,
            },
            {
              id: "sea-dweller",
              label: "Sea-Dweller",
              count: 26,
              checked: false,
            },
            {
              id: "sky-dweller",
              label: "Sky-Dweller",
              count: 17,
              checked: false,
            },
            {
              id: "submariner",
              label: "Submariner",
              count: 44,
              checked: false,
            },
            {
              id: "yacht-master",
              label: "Yacht-Master",
              count: 29,
              checked: false,
            },
            {
              id: "yacht-master-ii",
              label: "Yacht-Master II",
              count: 6,
              checked: false,
            },
          ],
        },
        { id: "tissot", label: "Tissot", count: 2, checked: false },
        {
          id: "audemars-piguet",
          label: "Audemars Piguet",
          count: 43,
          checked: false,
        },
        {
          id: "patek-philippe",
          label: "Patek Philippe",
          count: 94,
          checked: false,
        },
        { id: "breguet", label: "Breguet", count: 1, checked: false },
        { id: "blancpain", label: "Blancpain", count: 4, checked: false },
        { id: "breitling", label: "Breitling", count: 5, checked: false },
        { id: "undefined", label: "undefined", count: 1, checked: false },
        { id: "chopard", label: "Chopard", count: 7, checked: false },
        { id: "cartier", label: "Cartier", count: 96, checked: false },
        { id: "hublot", label: "Hublot", count: 57, checked: false },
        {
          id: "iwc-schaffhausen",
          label: "IWC Schaffhausen",
          count: 26,
          checked: false,
        },
        {
          id: "jaeger-lecoultre",
          label: "Jaeger-LeCoultre",
          count: 4,
          checked: false,
        },
        { id: "longines", label: "Longines", count: 25, checked: false },
        {
          id: "a-lange-sohne",
          label: "A. Lange & Söhne",
          count: 22,
          checked: false,
        },
        { id: "omega", label: "Omega", count: 43, checked: false },
        { id: "panerai", label: "Panerai", count: 8, checked: false },
        { id: "piaget", label: "Piaget", count: 15, checked: false },
        { id: "tudor", label: "Tudor", count: 57, checked: false },
        {
          id: "vacheron-constantin",
          label: "Vacheron Constantin",
          count: 2,
          checked: false,
        },
      ],
    },
    {
      id: "product-type",
      title: "Product Type",
      isExpanded: false,
      items: [
        { id: "WATCH", label: "Watches", count: 1247, checked: false },
        { id: "BAG", label: "Handbags", count: 89, checked: false },
      ],
    },
    {
      id: "condition",
      title: "Condition",
      isExpanded: false,
      items: [
        { id: "NEW", label: "New", count: 456, checked: false },
        { id: "NEW SPECIAL", label: "New Special", count: 456, checked: false },
        { id: "PRE OWNED", label: "Pre-owned", count: 789, checked: false },
        { id: "VINTAGE", label: "Vintage", count: 123, checked: false },
      ],
    },
    {
      id: "paper",
      title: "Warranty",
      isExpanded: false,
      items: [
        { id: "CARD PAPER", label: "Card/Paper", count: 234, checked: false },
        { id: "ARCHIVE", label: "Archive", count: 156, checked: false },
        { id: "N/A", label: "No warranty", count: 67, checked: false },
      ],
    },
    {
      id: "box",
      title: "Box",
      isExpanded: false,
      items: [
        { id: "Y", label: "With Box", count: 567, checked: false },
        { id: "N/A", label: "No Box", count: 234, checked: false },
      ],
    },
    {
      id: "location",
      title: "Location",
      isExpanded: false,
      items: [
        { id: "United States", label: "US", count: 0, checked: false },
        { id: "JAPAN", label: "JP", count: 0, checked: false },
        { id: "Thailand", label: "TH", count: 0, checked: false },
        { id: "Hong Kong S.A.R", label: "HK", count: 0, checked: false },
        { id: "Switzerland", label: "ZH", count: 0, checked: false },
      ],
    },
  ],
};

export const useFilterLocalStorage = () => {
  const [filterValueState, setFilterValueState] =
    useState<FilterState>(defaultFilterState);

  // Load state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setFilterValueState(parsedState);
      }
    } catch (error) {
      console.error("Error loading filter state from localStorage:", error);
      // If there's an error, use default state
      setFilterValueState(defaultFilterState);
    }
  }, []);

  // Save state to localStorage whenever it changes
  const updateFilterState = (
    newState: FilterState | ((prev: FilterState) => FilterState)
  ) => {
    setFilterValueState((prevState) => {
      const updatedState =
        typeof newState === "function" ? newState(prevState) : newState;

      // Ensure Rolex subitems state is properly preserved
      if (updatedState.filterSections[0]?.items) {
        const rolexItem = updatedState.filterSections[0].items.find(
          (item) => item.id.toUpperCase() === "RX"
        );
        if (rolexItem && rolexItem.subItems) {
          // Ensure all subitems have proper checked state
          rolexItem.subItems = rolexItem.subItems.map((subItem) => ({
            ...subItem,
            checked: subItem.checked || false,
          }));
        }
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      } catch (error) {
        console.error("Error saving filter state to localStorage:", error);
      }

      return updatedState;
    });
  };

  // Clear localStorage and reset to default state
  const resetFilterState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing filter state from localStorage:", error);
    }
    setFilterValueState(defaultFilterState);
  };

  return {
    filterValueState,
    setFilterValueState: updateFilterState,
    resetFilterState,
    // Additional utility functions
    clearAllFilters: () => {
      const clearedState = {
        ...filterValueState,
        filterSections: filterValueState.filterSections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({
            ...item,
            checked: false,
            subItems: item.subItems
              ? item.subItems.map((subItem) => ({
                  ...subItem,
                  checked: false,
                }))
              : undefined,
          })),
        })),
      };
      updateFilterState(clearedState);
    },
    // Get all currently checked items
    getCheckedItems: () => {
      const checkedItems = {
        brands:
          filterValueState.filterSections[0]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
        collections:
          filterValueState.filterSections[0]?.items.flatMap(
            (item) =>
              item.subItems
                ?.filter((subItem) => subItem.checked)
                .map((subItem) => subItem.id) || []
          ) || [],
        productTypes:
          filterValueState.filterSections[1]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
        conditions:
          filterValueState.filterSections[2]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
        warranties:
          filterValueState.filterSections[3]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
        boxes:
          filterValueState.filterSections[4]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
        locations:
          filterValueState.filterSections[5]?.items
            .filter((item) => item.checked)
            .map((item) => item.id) || [],
      };
      return checkedItems;
    },
  };
};
