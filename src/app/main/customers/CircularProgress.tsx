import CircularProgress, {
    CircularProgressProps,
  } from "@mui/material/CircularProgress";
  import Typography from "@mui/material/Typography";
  import Box from "@mui/material/Box";
  
  // Define the new props interface to include min, max, and current
  interface CircularProgressWithLabelProps extends CircularProgressProps {
    min: number;
    max: number;
    current: number;
  }

  function formatNumber(value: number): string {
    if (value >= 1_000_000_000) {
      const formattedValue = value / 1_000_000_000;
      return formattedValue % 1 === 0 ? `${formattedValue.toFixed(0)}B` : `${formattedValue.toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      const formattedValue = value / 1_000_000;
      return formattedValue % 1 === 0 ? `${formattedValue.toFixed(0)}M` : `${formattedValue.toFixed(1)}M`;
    }
    if (value >= 1_000) {
      const formattedValue = value / 1_000;
      return formattedValue % 1 === 0 ? `${formattedValue.toFixed(0)}K` : `${formattedValue.toFixed(1)}K`;
    }
    return value.toString();
  }
  
  function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
    const { min, max, current, ...other } = props;
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    // Calculate the percentage value
    const value = ((current - min) / (max - min)) * 100;
  
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          className="!w-[120px] !h-[120px]"
          variant="determinate"
          value={100}
          sx={{
            color: "#d6d6d6", // Grey color for the background
          }}
          {...other}
        />
        <CircularProgress
          className="!w-[120px] !h-[120px] circularProgress"
          variant="determinate"
          value={value}
          sx={{
            color: "#3e98c7", // Primary color for the progress
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1, // Ensure this is on top of the background circle
          }}
          {...other}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1, // Add padding to ensure text fits well
          }}
        >
          <div className="text-[16px] flex items-center justify-center flex-col">
            <Typography variant="h6">${current}</Typography>
            <Typography variant="body1">of {formatNumber(max)}</Typography>
          </div>
        </Box>
      </Box>
    );
  }
  
  export default function CircularWithValueLabel({ value, minValue, maxValue }) {
    return (
      <CircularProgressWithLabel min={minValue} max={maxValue} current={value} />
    );
  }
  