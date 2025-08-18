import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { boxDropdown, conditionDropdown, dialDropdown, fromDropdown, nyDropdown, nyLaDropdown, statusDropdown, strapDropdown } from 'src/utils/dropdownlist';

export default function StockActionRequireTable() {
  const [rowData, setRowData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
						// src="assets/images/logo/logo.svg"
        // const response = await fetch('assets/importjsondata.json');
        // console.log('response',response)
        // const data = await response.json();
        setRowData([]);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      headerAlign: 'center',
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: statusDropdown,
      renderCell: (params) => {
        let color;
        switch (params.value) {
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
            {params.value}
          </div>
        );
      }
    },
    {
      field: 'ny_la',
      headerName: 'NY/LA',
      width: 60,
      headerAlign: 'center',
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: nyLaDropdown,
      renderCell: (params) => <div className='font-600'>{params.value}</div>
    },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: false,
      renderCell: (params) => <img style={{ minWidth: '120%', maxHeight: '100%' }} src={params.value} alt="Image" />
    },
    { 
      field: 'id', 
      headerName: 'Stock', 
      width: 60,
      // headerAlign: 'center',
      align:'center',
      editable: false,
      renderCell: (params) => <div className='font-600'>{params.value}</div>
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 60,
      // headerAlign: 'center',
      align:'center',
      editable: true,
      renderCell: (params) => <div className='font-600'>{params.value}</div>
    },
    {
      field: 'model',
      headerName: 'Model',
      width: 200,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderCell: (params) => <div className='font-600'>{params.value}</div>
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      align:'center',
      width: 300,
      editable: true,
    },
    {
      field: 'full_serial_number_not_in_link',
      headerName: 'Full Serial Number Not in Link', // Not in Link
      width: 180,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Full Serial Number <br /> Not in Link</div>
    },
    {
      field: 'serial_no',
      headerName: 'Serial No.',
      width: 150,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'dial',
      headerName: 'Dial',
      width: 150,
      headerAlign: 'center',
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: dialDropdown,
    },
    {
      field: 'strap_bracelet',
      headerName: 'Strap / Bracelet',
      width: 180,
      headerAlign: 'center',
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: strapDropdown,
    },
    {
      field: 'num_of_links',
      headerName: '# of Links*',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'paper',
      headerName: 'Paper',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'paper_date',
      headerName: 'Paper Date',
      width: 120,
      // type: 'date',
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'watch_box',
      headerName: 'Box',
      width: 100,
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: boxDropdown,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: conditionDropdown,
    },
    {
      field: 'minimum_wholesale_price_usd',
      headerName: 'Minimum Wholesale Price',
      width: 90,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Minimum <br /> Wholesale <br /> Price</div>
    },
    {
      field: 'wholesale_price_usd',
      headerName: 'Wholesale Price',
      width: 90,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Wholesale <br /> Price </div>
    },
    {
      field: 'retail_price_usd',
      headerName: 'Retail Price',
      width: 90,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Retail <br /> Price </div>
    },
    {
      field: 'location',
      headerName: 'Loc',
      width: 35,
      align:'center',
      editable: true,
    },
    {
      field: 'cost_usd',
      headerName: 'Cost',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'qb',
      headerName: 'QB',
      width: 60,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'sold_price',
      headerName: 'Sold Price',
      width: 80,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Sold <br /> Price</div>
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'internal_notes',
      headerName: 'Internal Notes',
      width: 200,
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'watch_from',
      headerName: 'From',
      width: 80,
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: fromDropdown,
      renderCell: (params) => <div className='font-500'>{params.value}</div>
    },
    {
      field: 'auct',
      headerName: 'Auct',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
    },
    {
      field: 'japan_box',
      headerName: 'Japan Box#',
      width: 60,
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Japan <br /> Box#</div>
    },
    {
      field: 'lot',
      headerName: 'Lot',
      width: 40,
      align:'center',
      editable: true,
    },
    {
      field: 'have_link',
      headerName: 'Link ?',
      width: 60,
      align:'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: nyDropdown,
    },
    {
      field: 'purchase_date',
      headerName: 'Purchase Date',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Purchase <br /> Date </div>
    },
    {
      field: 'total_images',
      headerName: 'Total Images',
      width: 120,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Total <br /> Images </div>
    },
    {
      field: 'have_video',
      headerName: 'Have Video',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Have <br /> Video </div>
    },
    {
      field: 'manualmin_price',
      headerName: 'Manual Min Price',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Manual <br /> Min Price</div>
    },
    {
      field: 'manual_max_price',
      headerName: 'Manual Max Price',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Manual <br /> Max Price</div>
    },
    {
      field: 'hold_sold_on_date',
      headerName: 'Hold/Sold on (Date)',
      width: 100,
      headerAlign: 'center',
      align:'center',
      editable: true,
      renderHeader: (params) => <div className='font-600 text-center'>Hold/Sold on <br /> (Date)</div>
    }
  ];

  return (
    // <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
    <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }} square>
        <Box sx={{ height: '78vh', width: '100%' }}>
        <DataGrid
            rows={rowData}
            columns={columns}
            getRowHeight={() => 'auto'}
            stickyHeader
            pagination={false}
            hideFooter={true}
            
            sx={{ 
              // borderTop: 1,
              // borderRight: 1,
              // borderBottom: 1,
              border: 1,
              borderColor: 'lightgray',
              color: "black",
              scrollbarWidth: 'auto',
              scrollbarColor: 'black',
              "& .MuiDataGrid-columnHeaders": {
                border: 1,
                borderTop: 0,
                borderBottom: 1,
                borderRadius: 0,
                borderColor: 'lightgray',
              // backgroundColor: 'black',
                // fontWeight: 600
              },
              "& .MuiDataGrid-columnHeader": {
                // border: 1,
                // borderTop: 0,
                // // borderBottom: 1,
                // borderRadius: 0,
                // borderColor: 'lightgray',
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                // border: 1,
                borderColor: 'lightgray',
                borderRight: 1,
                borderRightColor: 'lightgray',
                borderTop: 1,
                borderTopColor: 'lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: 100
              },
            }}
            // initialState={{
            // pagination: {
            //     paginationModel: {
            //       pageSize: 1000,
            //     },
            // },
            // }}
            // pageSizeOptions={[1000]}
            checkboxSelection
            disableRowSelectionOnClick
        />
        </Box>
    </Paper>
    // </div>
    
  );
}
