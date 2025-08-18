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
    field: 'from',
    headerName: 'From (Days)',
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => <div className='font-normal pr-[4px]'>{params.value}</div>
  },
  {
    field: 'to',
    headerName: 'To (Days)',
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => <div className='pr-[4px]'>{params.value}</div>
  },
  {
    field: 'totalPieces',
    headerName: 'Total pieces',
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => <div className='pr-[4px]'>{params.value}</div>
  },
  {
    field: 'avrg_time_to_sell_watch',
    headerName: 'Avg days',
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => <div className='pr-[4px]'>{params.value}</div>
  },
  {
    field: 'average',
    headerName: '%',
    ...defaultColumnkey,
    width: 122,
    editable: false,
    renderCell: (params) => <div className='pr-[4px]'>{params.value}</div>
  },
];
