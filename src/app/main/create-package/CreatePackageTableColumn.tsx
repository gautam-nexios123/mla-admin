import moment from "moment";
import { formatter } from "src/utils/coreFunction";

const ColoredStatus = ({ children, color }) => {

  var textColor = "text-" + color + "-700";
  var bgColor = "bg-" + color + "-50";

  return (
      <div className={`font-700 bg- text-sm ${textColor} ${bgColor} rounded-full px-14 py-7`}>
          {children}
      </div>
  );
}
const defaultColumnkey = {
  filterable: false,
    hideSortIcons: false,
    pinnable: false,
    resizable: false,
    sortable: false,
    headerAlign: "center",
}

export const columns = [
  {
    field: 'stockId',
    headerName: 'Stock',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => <div className='font-600'>{params.value}</div>
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 128,
   ...defaultColumnkey,
    renderCell: (params) => {
      let color;
      switch (params.value) {
        case 'Available':
          // color = 'red';
          params.value = ''
          break;
        case 'Sold':
          color = 'red';
          break;
        case 'Shipped':
          color = 'blue';
          break;
        case 'Archived':
          color = 'green';
          break;
        default:
          color = 'inherit'; // Use default color for other values
      }
      return (
        <div style={{ color }} className='font-600'>
          {params.value == `Move to Archive` ? `SOLD/ARCHIVED` : params.value == `Sold` ? `SOLD` : params.value == `To Ship` ? `SOLD/TO SHIP` : params.value == `Available` ? `` : params.value}
        </div>
      );
    }
  },
  {
    field: 'brand',
    headerName: 'Brand',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => <div className=''>{params.value}</div>
  },
  {
    field: 'model',
    headerName: 'Model',
    align:'center',
    minWidth: 160,
    resizable: true,
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => <div className=''>{params.value}</div>
  },
  {
    field: 'serial_no',
    headerName: 'Serial No.',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => <div className=''>{params.value}</div>
  },
  {
    field: 'paper',
    headerName: 'Paper',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => {

      var color = "";
      const value = params.value?.trim().toLowerCase();

      switch (value) {
          case "paper": {
              color = "green";
              break;
          }
          case "card": {
              color = "blue";
              break;
          }
          case "n/a": {
              color = "red";
              break;
          }
          case "archive": {
              color = "purple";
              break;
          }
      }
      return <ColoredStatus color={color}>{params.value}</ColoredStatus>
  }
  },
  {
    field: 'paper_date',
    headerName: 'Paper Date',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => {
      return <div className='font-500'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
  }
  },
  {
    field: 'box',
    headerName: 'Box',
    align:'center',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => {

      const value = params.value?.trim().toLowerCase();

      if (value && value.startsWith("+")) {
          return <ColoredStatus color={"purple"}>{params.value}</ColoredStatus>
      }

      var color = "";

      switch (value) {
          case "included": {
              color = "green";
              break;
          }
          case "n/a": {
              color = "red";
              break;
          }
      }

      return <ColoredStatus color={color}>{params.value}</ColoredStatus>
  }
  },
  {
    field: 'price',
    headerName: 'Wholesale Price (USD)',
    ...defaultColumnkey,
    minWidth: 130,
    editable: false,
    renderHeader: (params) => <div className='font-600 text-center'>Wholesale <br /> Price (USD)</div>,
    renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
  },
  {
    field: 'netAmount',
    headerName: 'Discounted Wholesale Price',
    ...defaultColumnkey,
    minWidth: 150,
    editable: false,
    renderHeader: (params) => <div className='font-600 text-center'>Discounted <br /> Wholesale Price</div>,
    renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
  },
  {
    field: 'discount',
    headerName: 'Saving',
    ...defaultColumnkey,
    editable: false,
    renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
  },
];

export const secondPart = [
  {
    field: 'location',
    headerName: 'Location',
    ...defaultColumnkey,
    renderCell: (params) => <div className='font-500'>{params.value == "Blank" ? "" : params.value}</div>
  },
  {
    field: 'cost',
    headerName: 'Cost',
    ...defaultColumnkey,
    renderCell: (params) => <div className='font-500'>{formatter.format(params.value)}</div>
  },
  {
    field: 'profit',
    headerName: 'Profit',
    ...defaultColumnkey,
    renderCell: (params) => <div className='font-500'>{formatter.format(params.value)}</div>
  },
]
export const totalTableColumn = [
  {
  field: 'total',
  ...defaultColumnkey,
  headerName: 'Total Wholesale Price (USD)',
  ...defaultColumnkey,
  minWidth: 130,
  editable: false,
  renderHeader: (params) => <div className='font-600 text-center'>Total <br /> Wholesale <br /> Price (USD)</div>,
  renderCell: (params) => <div className=''>{params.value}</div>
},
  {
  field: 'price',
  ...defaultColumnkey,
  headerName: 'Wholesale Price (USD)',
  ...defaultColumnkey,
  minWidth: 130,
  editable: false,
  renderHeader: (params) => <div className='font-600 text-center'>Total <br />  Wholesale <br /> Price (USD)</div>,
  renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
},
{
  field: 'netAmount',
  ...defaultColumnkey,
  headerName: 'Discounted Wholesale Price',
  ...defaultColumnkey,
  minWidth: 150,
  editable: false,
  renderHeader: (params) => <div className='font-600 text-center'>Discounted <br /> Wholesale <br /> Price (USD)</div>,
  renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
},
{
  field: 'discount',
  headerName: 'Saving',
  ...defaultColumnkey,
  ...defaultColumnkey,
  editable: false,
  renderHeader: (params) => <div className='font-600 text-center'>Total <br /> Savings <br /> (USD)</div>,
  renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
}]