import { formatter } from "src/utils/coreFunction";
import { getColor } from "../utils";

const getValue = (params, index) => {
  return (
    <>
      <span
        // style={{ color: getColor(params?.row?._id) }}
        className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5"
      >
        {params?.row?.monthlyData[index]?.qty_bought}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {params?.row?.monthlyData[index]?.qty_sold}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {formatter.format(params?.row?.monthlyData[index]?.amount_bought)}
      </span>
      <span className="MuiDataGrid-cell--textEnd py-0.5">
        {formatter.format(params?.row?.monthlyData[index]?.amount_sold)}
      </span>
    </>
  );
};

const getValueMasterWebsite = (params) => {
  const getOfflineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "offlineSale"
  );
  const getOnlineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "onlineSale"
  );

  return (
    <>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOnlineObj?.totalWebSite}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOfflineObj?.totalWebSite}
      </span>
    </>
  );
};

const getValueMasterYoutube = (params) => {
  const getOfflineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "offlineSale"
  );
  const getOnlineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "onlineSale"
  );

  return (
    <>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOnlineObj?.totalYoutube}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOfflineObj?.totalYoutube}
      </span>
    </>
  );
};

const getValueMasterFacebook = (params) => {
  const getOfflineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "offlineSale"
  );
  const getOnlineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "onlineSale"
  );

  return (
    <>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOnlineObj?.totalFacebook}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOfflineObj?.totalFacebook}
      </span>
    </>
  );
};

const getValueMasterInsta = (params) => {
  const getOfflineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "offlineSale"
  );
  const getOnlineObj = params?.row?.salesData?.find(
    (item) => item?.saleType === "onlineSale"
  );

  return (
    <>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOnlineObj?.totalInstagram}
      </span>
      <span className="w-full flex justify-center border-b-[1.5px] border-lightgray MuiDataGrid-cell--textEnd py-0.5">
        {getOfflineObj?.totalInstagram}
      </span>
    </>
  );
};

// const cellClassName = (params: GridCellParams<any, number>) => {
//   if (params.id == 9) {
//     return "last-column";
//   }
// };

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "end",
  // cellClassName,
};
export const columns = [
  {
    field: "_id",
    headerName: "Brand",
    ...defaultColumnkey,
    editable: false,
    align: "center",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "Brand",
    headerName: "",
    ...defaultColumnkey,
    minWidth: 120,
    editable: false,
    align: "center",
    renderCell: (params) => (
      <div className="w-full">
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Qty Bought
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Qty Sold
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Amt Bought
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Amt Sold
        </span>
      </div>
    ),
  },
  {
    field: "monthlyData[0]",
    headerName: "Jan",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 0)}</div>,
  },
  {
    field: "monthlyData[1]",
    headerName: "Feb",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 1)}</div>,
  },
  {
    field: "monthlyData[2]",
    headerName: "Mar",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 2)}</div>,
  },
  {
    field: "monthlyData[3]",
    headerName: "Apr",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 3)}</div>,
  },
  {
    field: "monthlyData[4]",
    headerName: "May",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 4)}</div>,
  },
  {
    field: "monthlyData[5]",
    headerName: "Jun",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 5)}</div>,
  },
  {
    field: "monthlyData[6]",
    headerName: "Jul",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 6)}</div>,
  },
  {
    field: "monthlyData[7]",
    headerName: "Aug",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 7)}</div>,
  },
  {
    field: "monthlyData[8]",
    headerName: "Sep",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 8)}</div>,
  },
  {
    field: "monthlyData[9]",
    headerName: "Oct",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => <div className="w-full">{getValue(params, 9)}</div>,
  },
  {
    field: "monthlyData[10]",
    headerName: "Nov",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValue(params, 10)}</div>
    ),
  },
  {
    field: "monthlyData[11]",
    headerName: "Dec",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValue(params, 11)}</div>
    ),
  },
  {
    field: "monthlyData[12]",
    headerName: "Total",
    ...defaultColumnkey,
    editable: false,
    headerClassName: "last-column",
    cellClassName: "last-column",
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValue(params, 12)}</div>
    ),
  },
];

export const masterLuxuryColumns = [
  {
    field: "_id",
    headerName: "Brand",
    ...defaultColumnkey,
    editable: false,
    align: "center",
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "Brand",
    headerName: "",
    ...defaultColumnkey,
    minWidth: 120,
    editable: false,
    align: "center",
    renderCell: (params) => (
      <div className="w-full">
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Online
        </span>
        <span className="w-full flex justify-center border-b-[1.5px] border-lightgray py-0.5">
          Offline
        </span>
      </div>
    ),
  },
  {
    field: "salesData[0]",
    headerName: "Website",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => {
      return <div className="w-full">{getValueMasterWebsite(params)}</div>;
    },
  },
  {
    field: "salesData[1]",
    headerName: "Youtube",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => {
      return <div className="w-full">{getValueMasterYoutube(params)}</div>;
    },
  },
  {
    field: "salesData[2]",
    headerName: "Facebook",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValueMasterFacebook(params)}</div>
    ),
  },
  {
    field: "salesData[3]",
    headerName: "Instagram",
    ...defaultColumnkey,
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className="w-full">{getValueMasterInsta(params)}</div>
    ),
  },
];
