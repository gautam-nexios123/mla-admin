import FilterListIcon from "@mui/icons-material/FilterList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import * as React from "react";
// import FilterOptionList from "./FilterOptionList";
import { RxCross1 } from "react-icons/rx";
// import { store } from './store/store';
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterOptionList from "./FilterOptionList";

export default function DrawerFilter({
  rows,
  setFilter,
  apiRef,
  muiFilterModel,
  muiFilteredRows,
}: any) {
  const [isOpen, setIsOpen] = React.useState(false);

  //   const filterOptionList = React.useMemo(() => <FilterOptionList />, []);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const handleDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      (event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Escape") ||
      (event.type === "click" &&
        event.target !== document.querySelector(".theDrawer"))
    ) {
      setIsOpen(false);
    }
  };

  const list = (
    <Box className="w-full">
      {/* <List className="flex flex-col w-full pt-0"> */}
      <ListItem disablePadding>
        <div className="w-full flex justify-between items-center pl-14 pr-14 pb-3">
          <h1>Filter</h1>
          <RxCross1
            className="icon-size-32 p-5 cursor-pointer hover:text-white hover:bg-gray-500 rounded-full"
            onClick={toggleDrawer(false)}
          />
        </div>
      </ListItem>
      {/* <ListItem disablePadding> */}
      <div className="flex w-full">
        {/* {filterOptionList} */}
        <FilterOptionList
          rows={rows}
          setFilter={setFilter}
          apiRef={apiRef}
          muiFilterModel={muiFilterModel}
          muiFilteredRows={muiFilteredRows}
        />
      </div>
      {/* </ListItem> */}
      {/* </List> */}
    </Box>
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));
  const is420px = useMediaQuery("(max-width:420px)");
  const is320px = useMediaQuery("(max-width:320px)");
  const drawerWidth = is420px
    ? "90%"
    : isMobile
      ? "75%"
      : isMd
        ? "60%"
        : isLg
          ? "25%"
          : isXl
            ? "20%"
            : "25%";
  const finalDrawerWidth = is320px ? "100%" : drawerWidth;

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size={`${isMobile ? `small` : `medium`}`}
        startIcon={<FilterListIcon />}
        onClick={toggleDrawer(true)}
      >
        Filter
      </Button>

      {/* <Provider store={store}> */}
      <React.Fragment>
        <Drawer
          PaperProps={{
            sx: {
              maxWidth: finalDrawerWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              position: "relative",
            },
          }}
          className="theDrawer"
          anchor={"left"}
          open={isOpen}
          onClose={handleDrawerClose}
        >
          {list}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
