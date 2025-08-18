import React from "react";
import { DateRangePicker } from "mui-daterange-picker";
import moment from "moment";

const DateRangePickerComponent = ({ open, toggle, setDateRange, setOpen ,setDateError }) => {
  const ConvetDate = (range) => {
    const startDateNew = moment(range.startDate);
    const endDateNew = moment(range.endDate);
    setDateRange({
      startDate: startDateNew,
      endDate: endDateNew,
    });
    setOpen(false);
    setDateError(false);
  };

  return (
    <div className="w-fit">
      <DateRangePicker
        open={open}
        toggle={toggle}
        onChange={(range) => ConvetDate(range)}
      />
    </div>
  );
};

export default DateRangePickerComponent;
