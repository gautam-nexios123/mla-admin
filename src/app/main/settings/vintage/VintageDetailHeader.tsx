import Typography from "@mui/material/Typography";

/**
 * The Staff header.
 */
function VintageDetailHeader(props) {

  return (
    <div className="flex w-full">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Vintage Detail
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default VintageDetailHeader;
