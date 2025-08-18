import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { SaveOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

/**
 * The Staff header.
 */
function StaffDetailHeader(props) {
  // const dispatch = useAppDispatch();
  // const searchText = useSelector(selectSearchText);

  // useEffect(() => {
  //   return () => {
  //     // dispatch(resetSearchText());
  //   };
  // }, []);

  return (
    <div className="flex w-full">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Staff Detail
          </Typography>
        </div>
        {/* <motion.div initial={{ x: 0, opacity: 1 }}>
          <Typography
            className="flex items-center  pt-4"
            component={Link}
            role="button"
            to="/settings"
            color="inherit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-left</FuseSvgIcon>
            <span className="flex mx-4 font-medium">Back</span>
          </Typography>
        </motion.div> */}
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            // className="whitespace-nowrap mx-4"
            // variant="contained"
            // color="secondary"
            // disabled={_.isEmpty(dirtyFields) || !isValid}
            // onClick={handleSaveProduct}
            disabled
            color="primary"
            variant="contained"
            startIcon={<SaveOutlined />}
          >
            Save
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default StaffDetailHeader;
