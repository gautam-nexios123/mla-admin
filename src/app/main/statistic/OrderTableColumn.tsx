import moment from "moment";
import { formatter, getConvertedCurrency, hkdFormatter } from "src/utils/coreFunction";

const defaultColumnkey = {
    headerAlign: "center",
    align:'center',
}

export const columns :any = [
    {
      field: 'orderId',
      headerName: 'Order Id',
      ...defaultColumnkey,
      editable: false,
      minWidth: 200,
      renderCell: (params) => <div className='font-500'>{params.value}</div>
    },
    {
      field: 'status',
      headerName: 'Status',
      ...defaultColumnkey,
      editable: false,
      minWidth: 200,
      renderCell: (params) => <div className='font-500'>{params.value}</div>
    },
    {
      field: 'quantity',
      headerName: 'Total Items',
      ...defaultColumnkey,
      editable: false,
      minWidth: 160,
      renderCell: (params) => {
        return <div className='font-500'>{params?.row?.saleItems?.length}</div>
    }
    },
    {
      field: 'companyName',
      headerName: 'Company',
      ...defaultColumnkey,
      editable: false,
      minWidth: 160,
      renderCell: (params) => <div className='pr-[4px]'>{params?.row?.orderByCustomer?.company}</div>,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      ...defaultColumnkey,
      editable: false,
      minWidth: 160,
      renderCell: (params) => <div className='pr-[4px]'>{params?.row?.orderByCustomer?.name}</div>,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      ...defaultColumnkey,
      editable: false,
      minWidth: 120,
      renderCell: (params) => <div className='pr-[4px]'>{params.value}</div>
    },
    {
      field: 'price',
      headerName: 'Total Price (USD)',
      ...defaultColumnkey,
      minWidth: 180,
      editable: false,
      renderCell: (params) => {
        const originalPrice = getConvertedCurrency(params.value, 'USD', 1); // Show original value in USD
        const convertedPrice = params?.row?.currency !== 'USD'
        ? (params?.row?.currency === "USD"? formatter : hkdFormatter).format(params.row.HkPrice) // Converted value in non-USD currency
        : null;
  
        return (
          <div>
            {originalPrice}
            {convertedPrice ? ` (${convertedPrice})` : ''}
          </div>
        );
      }
    },
    {
      field: 'additionalShippingPrice',
      headerName: 'Shipping Price (USD)',
      ...defaultColumnkey,
      minWidth: 180,
      editable: false,
      renderCell: (params) => {
        const originalPrice = getConvertedCurrency(params.value, 'USD', 1); // Show original value in USD
        const convertedPrice = params?.row?.currency !== 'USD'
        ? (params?.row?.currency === "USD"? formatter : hkdFormatter).format(params.row.HkShippingPrice) // Converted value in non-USD currency
        : null;
  
        return (
          <div>
            {originalPrice}
            {convertedPrice ? ` (${convertedPrice})` : ''}
          </div>
        );
      }
    },
    {
      field: "discount",
      headerName: "Discount (USD)",
      ...defaultColumnkey,
      minWidth: 160,
      editable: false,
      renderCell: (params) => {
        const originalDiscount = getConvertedCurrency(params.value, 'USD', 1); // Show original value in USD
        const convertedDiscount = params?.row?.currency !== 'USD'
        ? (params?.row?.currency === "USD"? formatter : hkdFormatter).format(params.row.HkDiscount) // Converted value in non-USD currency
        : null;
  
        return (
          <div>
            {originalDiscount}
            {convertedDiscount ? ` (${convertedDiscount})` : ''}
          </div>
        );
      }
    },
    {
      field: 'netAmount',
      headerName: 'Discounted Price (USD)',
      ...defaultColumnkey,
      editable: false,
      minWidth: 220,
      renderCell: (params) => {
        const originalNet = getConvertedCurrency(params.value, 'USD', 1); // Show original value in USD
        const convertedNet = params?.row?.currency !== 'USD'
        ? (params?.row?.currency === "USD"? formatter : hkdFormatter).format(params.row.HkNetAmount) // Converted value in non-USD currency
        : null;
  
        return (
          <div>
            {originalNet}
            {convertedNet ? ` (${convertedNet})` : ''}
          </div>
        );
      }
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      ...defaultColumnkey,
      align: "center",
      minWidth: 140,
      editable: false,
      renderCell: (params) => <div className='pr-[4px]'>{params.value ? moment(params.value).format('DD-MMM-YYYY') : ''}</div>
    },
  ];