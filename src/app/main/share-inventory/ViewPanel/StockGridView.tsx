import { useThemeMediaQuery } from "@fuse/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { getStock, selectStock } from "app/store/stockSlice";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayFilterTag from "../Filter/DisplayFilterTag";
import FilterOptionList from "../Filter/FilterOptionList";
import ProductCardView from "./card/ProductCardView";

function StockGridView({ selectedUser, selectedNewCusCountryName }) {
  const dispatch = useDispatch();
  const stock: any = useSelector(selectStock);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(100);
  const [totalData, setTotalData] = useState(0);
  const [searchText, setSearchText] = useState(null);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const handleLoadData = useCallback(
    (
      pageNumber,
      search,
      sort,
      direct,
      brandFilter,
      collectionFilter,
      productTypeFilter,
      conditionFilter,
      boxFilter,
      locationFilter,
      warrantyFilter,
      selectedUser,
      selectedNewCusCountryName
    ) => {
      if (selectedUser?.id || selectedNewCusCountryName) {
        setIsLoading(true);
        dispatch(
          getStock({
            page: pageNumber || 1,
            limit: 200,
            search: search || "",
            sort: sort || "",
            direct: direct || "",
            brands: brandFilter || "",
            collections: collectionFilter || "",
            productType: productTypeFilter || "",
            conditions: conditionFilter || "",
            box: boxFilter || "",
            location: locationFilter || "",
            warranty: warrantyFilter || "",
            customerId: selectedUser?.id || "",
            country:
              selectedUser?.country == "new_customer"
                ? selectedNewCusCountryName
                : selectedUser?.country,
          })
        )
          .then((res) => {
            setIsLoading(false);
            const { data, pagination } = res.payload;
            if (pagination.page == 1) {
              setRows(data);
            } else {
              setRows((prevRows) => _.uniqBy(prevRows.concat(data), "id"));
            }
            setTotalData(pagination.total);
          })
          .finally(() => setIsLoading(false));
      } else {
        setRows([]);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    setRows([]);
    setPage(1);
    handleLoadData(
      1,
      stock?.searchText,
      stock?.orderText,
      stock?.directionText,
      stock?.brandFilter,
      stock?.collectionFilter,
      stock?.productTypeFilter,
      stock?.conditionFilter,
      stock?.boxFilter,
      stock?.locationFilter,
      stock?.warrantyFilter,
      selectedNewCusCountryName,
      selectedUser
    );
  }, [
    handleLoadData,
    stock?.searchText,
    stock?.orderText,
    stock?.directionText,
    stock?.brandFilter,
    stock?.collectionFilter,
    stock?.productTypeFilter,
    stock?.conditionFilter,
    stock?.boxFilter,
    stock?.locationFilter,
    stock?.warrantyFilter,
    selectedUser,
    selectedNewCusCountryName,
  ]);

  useEffect(() => {
    if (stock) {
      if (stock.searchText !== "") {
        setSearchText(stock.searchText);
      } else {
        setSearchText(null);
      }
    }
  }, [stock]);

  const handlePageChange = (event, value) => {
    // console.log("clickpage", value);
    setPage(value);
    handleLoadData(
      value,
      stock?.searchText,
      stock?.orderText,
      stock?.directionText,
      stock?.brandFilter,
      stock?.collectionFilter,
      stock?.productTypeFilter,
      stock?.conditionFilter,
      stock?.boxFilter,
      stock?.locationFilter,
      stock?.warrantyFilter,
      selectedUser,
      selectedNewCusCountryName
    );
  };

  // console.log(`component::props.openCheckoutView ${props.openCheckoutView}`);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && rows.length < totalData) {
          handlePageChange(null, page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, rows.length, totalData, page, stock, handleLoadData]
  );
  return (
    <div
      className={`flex flex-col h-full !bg-[#F1F5F9] w-full overflow-y-hidden p-10`}
    >
      <div className="md:flex gap-14 overflow-y-hidden">
        <Hidden lgDown>
          <div className="flex flex-col md:w-[300px] gap-4 overflow-y-auto max-h-[75vh]">
            <Typography className="text-xl text-left leading-tight tracking-tight mb-8">
              Filter
            </Typography>
            <FilterOptionList />
          </div>
        </Hidden>

        {/* h-${props.openCheckoutView ? '[54vh]' : '[90vh]'} */}
        <div className={`flex flex-col flex-1 md:rtl:pl-32 gap-4`}>
          {isLoading && rows.length === 0 ? (
            <>
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
            </>
          ) : (
            <>
              <div className="flex flex-row justify-between items-center w-full mb-8">
                <div className="flex flex-row w-full justify-start items-center">
                  {/* {!isMobile && (
                    <div className="flex flex-row w-full">
                      <DisplayFilterTag />
                    </div>
                  )} */}
                </div>

                {/* <div className="flex h-40 lg:w-full lg:justify-end overflow-x-auto">
                  <div className="flex space-x-4 min-w-max">
                    <Pagination
                      page={page}
                      onChange={handlePageChange}
                      count={Math.ceil(totalData / 100)}
                      color="secondary"
                    />
                  </div>
                </div> */}
              </div>

              {/* {isMobile && (
                <div className="flex flex-row overflow-x-scroll">
                  <DisplayFilterTag />
                </div>
              )} */}

              <div
                style={{ maxHeight: "calc(100vh - 130px)" }}
                className="flex flex-col w-full flex-1 md:rtl:pl-32 gap-4 overflow-y-auto rounded-[2px]"
              >
                <Grid
                  container
                  justifyContent="center"
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  {rows?.map((data, index) => (
                    <Grid
                      key={`gridview_${data.stockId}`}
                      ref={index === rows.length - 50 ? lastRowRef : null}
                    >
                      <ProductCardView data={data} />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockGridView;
