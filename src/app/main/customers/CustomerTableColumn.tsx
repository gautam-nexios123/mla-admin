import { Switch } from "@mui/material";
import { formatDate, formatter } from "src/utils/coreFunction";

const ColoredStatus = ({ children, color }) => {
  var textColor = "text-" + color + "-700";
  var bgColor = "bg-" + color + "-50";

  return (
    <div
      className={`font-700 bg-text-sm ${textColor} ${bgColor} rounded-full px-14 py-7`}
    >
      {children}
    </div>
  );
};

const defaultColumnkey = {
  headerAlign: "center",
  align: "center",
};

export const columns: any = [
  {
    field: "company",
    headerName: "Company Name",
    width: 200,
    ...defaultColumnkey,
  },
  { field: "name", headerName: "Name", width: 200, ...defaultColumnkey },
  { field: "email", headerName: "Email", width: 250, ...defaultColumnkey },
  {
    field: "totalOrder",
    headerName: "Buy Single/Package",
    width: 200,
    ...defaultColumnkey,
  },
  {
    field: "totalReward",
    headerName: "Rewards",
    width: 150,
    ...defaultColumnkey,
  },
  {
    field: "level",
    headerName: "Status",
    width: 210,
    ...defaultColumnkey,
    renderCell: (params) => {
      var color = "";
      const value = params?.value;
      let statusText = "";

      switch (value) {
        case "NORMAL": {
          color = "indigo";
          statusText = "Member";
          break;
        }
        case "VIP": {
          color = "blue";
          statusText = "MLA Premier Steel";
          break;
        }
        case "VVIP": {
          color = "purple";
          statusText = "MLA Premier Gold";
          break;
        }
        case "VVVIP": {
          color = "green";
          statusText = "MLA Premier Platinum";
          break;
        }
      }
      return <ColoredStatus color={color}>{statusText}</ColoredStatus>;
    },
  },
  {
    field: "country",
    headerName: "Country",
    width: 200,
    ...defaultColumnkey,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 250,
    ...defaultColumnkey,
  },
  {
    field: "newSpecialViewable",
    headerName: "New Special Viewable",
    width: 180,
    ...defaultColumnkey,
    renderCell: (params) => (
      <Switch
        disabled
        checked={params.row.newSpecialViewable}
        inputProps={{ "aria-label": "controlled" }}
      />
    ),
  },
  {
    field: "isApproved",
    headerName: "Approved",
    width: 150,
    ...defaultColumnkey,
    renderCell: (params) => (
      <Switch
        disabled
        checked={params.row.isApproved}
        inputProps={{ "aria-label": "controlled" }}
      />
    ),
  },
  {
    field: "isGoodStanding",
    headerName: "Good Standing",
    width: 150,
    ...defaultColumnkey,
    renderCell: (params) => (
      <Switch
        disabled
        checked={params.row.isGoodStanding}
        inputProps={{ "aria-label": "controlled" }}
      />
    ),
  },
];

const rewardDefaultColumnkey = {
  headerAlign: "center",
  align: "center",
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
};

export const rewardTableColumns: any = (totalItem) => {
  return [
    {
      field: "createdAt",
      headerName: "Date",
      ...rewardDefaultColumnkey,
      editable: false,
      width: 130,
      renderHeader: () => (
        <div className="">
          <p className="px-[10px] py-[10px] font-bold text-center">Date</p>
          <div className="bg-[#C0D8C1] w-[130px] px-[10px] py-[10px] mt-[8px]">
            <p className="font-bold text-center">Total</p>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full py-[8px]">
          {params?.value
            ? params?.value == "Total"
              ? "Total"
              : formatDate(params?.value)
            : ""}
        </div>
      ),
    },
    {
      field: "redeemedPoint",
      headerName: "Redeemed Point",
      ...rewardDefaultColumnkey,
      editable: false,
      width: 150,
      renderHeader: () => (
        <div className="">
          <p className="px-[10px] py-[10px] font-bold text-center">
            Redeemed Point
          </p>
          <div className="bg-[#C0D8C1] w-[150px] px-[10px] py-[10px] mt-[8px]">
            <p className="font-bold text-center">{totalItem?.redeemedPoint}</p>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full py-[8px]">{params.value}</div>
      ),
    },
    {
      field: "amountUsd",
      headerName: "Amount(USD)",
      ...rewardDefaultColumnkey,
      editable: false,
      width: 150,
      renderHeader: () => (
        <div className="">
          <p className="px-[10px] py-[10px] font-bold text-center">
            Amount(USD)
          </p>
          <div className="bg-[#C0D8C1] w-[150px] px-[10px] py-[10px] mt-[8px]">
            <p className="font-bold text-center">${totalItem?.amountUsd?.toFixed(2)}</p>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full py-[8px]">${params.value?.toFixed(2)}</div>
      ),
    },
    {
      field: "balancePoint",
      headerName: "Balance Point",
      ...rewardDefaultColumnkey,
      editable: false,
      width: 150,
      renderHeader: () => (
        <div className="">
          <p className="px-[10px] py-[10px] font-bold text-center">
            Balance Point
          </p>
          <div className="bg-[#C0D8C1] w-[150px] px-[10px] py-[10px] mt-[8px]">
            <p className="font-bold text-center">-</p>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full py-[8px]">{params.value}</div>
      ),
    },
    {
      field: "option",
      headerName: "Option",
      ...rewardDefaultColumnkey,
      editable: false,
      width: 160,
      renderHeader: () => (
        <div className="">
          <p className="px-[10px] py-[10px] font-bold text-center">Option</p>
          <div className="bg-[#C0D8C1] w-[160px] px-[10px] py-[10px] mt-[8px]">
            <p className="font-bold text-center">-</p>
          </div>
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full py-[8px]">
          {params.value === ""
            ? "-"
            : params.value == "1"
              ? "Cash Credit"
              : "Shipping Credit"}
        </div>
      ),
    },
  ];
};
