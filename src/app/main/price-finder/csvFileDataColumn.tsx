import moment from "moment"
import { formatter } from "src/utils/coreFunction"

const defaultColumnkey = {
    filterable: false,
    hideSortIcons: false,
    pinnable: false,
    resizable: false,
    sortable: false,
    headerAlign: "center",
    align: 'center',
}
  
export const csvDataColumns :any = [
    {
        field: 'Winning_Bid_USD',
        headerName: 'Winning Bid  USD',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{params.value}</div>
    },
    {
        field: 'cost_usd',
        headerName: 'Cost USD',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
    },
    {
        field: 'sold_price',
        headerName: 'Sale USD',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{formatter.format(params.value)}</div>
    },
    {
        field: 'paper_date',
        headerName: 'Warranty Year',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{moment(params.value).format('YYYY')}</div>
    },
    {
        field: 'stockId',
        headerName: 'Stock #',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{params.value}</div>
    },
    {
        field: 'model',
        headerName: 'Modal',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{params.value}</div>
    },
    {
        field: 'profit_margin_percentage',
        headerName: 'Net profit(%)',
        align: 'center',
        width: 122,
        editable: false,
        ...defaultColumnkey,
        renderCell: (params) => <div className=''>{`${parseFloat(params.value).toFixed(2)}%`}</div>
    },
    {
        field: 'sold_date',
        headerName: 'Sale Date',
        ...defaultColumnkey,
        align: 'center',
        width: 122,
        editable: false,
        renderCell: (params) => <div className=''>{moment(params.value).format('DD-MMM-YYYY')}</div>
    },
]