import { ClickAwayListener, Tooltip, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { formatter } from "src/utils/coreFunction";
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from "react-router";

export const columns: any = [
  {
    field: "rows_id",
    headerName: "No.",
    width: 10,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // filterable: false,
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    renderCell: (params) => <div className="font-600">{params.value}</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  // {
  //   field: 'stockId',
  //   headerName: 'Stock',
  //   width: 60,
  //   // headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderCell: (params) => <div className='font-600'>{params.value}</div>
  // },
  {
    field: "brand",
    headerName: "Brand",
    width: 60,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  // {
  //   field: 'dial',
  //   headerName: 'Dial',
  //   width: 200,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderCell: (params) => <div className='font-600'>{params.value}</div>
  // },
  {
    field: "sold_count",
    headerName: "No. of Time Sold",
    width: 140,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    renderCell: (params) => <div className="font-600">{params.value}</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  {
    field: "profit",
    headerName: "Profit",
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    // renderCell: (params) => <div className=''>{formatter.format(params?.row?.avgProfit/params?.row?.sold_count)}</div>
    renderCell: (params) => (
      <div className="">
        {params?.row?.sold_count === 1
          ? params?.value
            ? formatter.format(params?.value)
            : ""
          : ""}
      </div>
    ),
  },

  // {
  //   field: 'note',
  //   headerName: 'Note',
  //   width: 200,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderCell: (params) => <div className='font-600'>{params.value}</div>
  // },

  // {
  //   field: 'collection',
  //   headerName: 'Collection/Family',
  //   headerAlign: 'center',
  //   align:'center',
  //   width: 300,
  //   editable: false,
  //   type: 'singleSelect',
  //   valueOptions: collectionDropdown,
  //   renderCell: (params) => <div className='font-500'>{params.value == "Blank" ? `` : params.value}</div>
  // },
  // {
  //   field: 'full_serial_number_not_in_link',
  //   headerName: 'Full Serial Number Not in Link', // Not in Link
  //   width: 180,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderHeader: (params) => <div className='font-600 text-center'>Full Serial Number <br /> Not in Link</div>
  // },
  // {
  //   field: 'serial_no',
  //   headerName: 'Serial No.',
  //   width: 150,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  // },
];

export const columnsNew: any = [
  {
    field: "rows_id",
    headerName: "No.",
    width: 10,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // filterable: false,
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    renderCell: (params) => <div className="font-600">{params.value}</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  // {
  //   field: 'stockId',
  //   headerName: 'Stock',
  //   width: 60,
  //   // headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderCell: (params) => <div className='font-600'>{params.value}</div>
  // },
  {
    field: "brand",
    headerName: "Brand",
    width: 60,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Model",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "dial",
    headerName: "Dial",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "strap_bracelet",
    headerName: "Strap Bracelet",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "paper",
    headerName: "Paper",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "sold_count",
    headerName: "No. of Time Sold",
    width: 140,
    // headerAlign: 'center',
    align: "center",
    editable: false,
    type: "number",
    // renderCell: (params) => <div className='font-600'>{console.log('params.row',params.row)}</div>
    renderCell: (params) => <div className="font-600">{params.value}</div>,
    // renderCell: (params) => <div className='font-600'>{console.log('params.value',params.value)}</div>
  },
  {
    field: "profit",
    headerName: "Profit",
    headerAlign: "center",
    align: "center",
    editable: false,
    type: "number",
    renderCell: (params) => (
      <div className={params?.row?.avgProfit < 0 ? "text-red" : "text-black"}>
        {typeof params?.row?.avgProfit === "number"
          ? formatter.format(params?.row?.avgProfit)
          : params?.row?.avgProfit}
      </div>
    ),
    // renderCell: (params) => <div className=''>{params?.row?.sold_count === 1 ? params?.value ? formatter.format(params?.value) : "" : ""}</div>
  },
  {
    field: "note_des",
    headerName: "Note",
    width: 320,
    headerAlign: "center",
    align: "center",
    editable: false,
    // renderCell: (params) => <NoteTooltip params={params} />,
    renderCell: (params) => <div className="font-500">{params.value}</div>,
  },

  {
    field: "item_in_stock",
    headerName: "Item In Stock",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => <div className="font-600">{params.value}</div>,
  },
  {
    field: "price_finder_link",
    headerName: "Price Finder Link",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      const navigate = useNavigate();
      return <div onClick={() => navigate("/price-finder" , {state : params?.row})} className="font-600 cursor-pointer"><LaunchIcon className="text-[#4f46e5]" /></div>;
    },
  },
  // {
  //   field: 'collection',
  //   headerName: 'Collection/Family',
  //   headerAlign: 'center',
  //   align:'center',
  //   width: 300,
  //   editable: false,
  //   type: 'singleSelect',
  //   valueOptions: collectionDropdown,
  //   renderCell: (params) => <div className='font-500'>{params.value == "Blank" ? `` : params.value}</div>
  // },
  // {
  //   field: 'full_serial_number_not_in_link',
  //   headerName: 'Full Serial Number Not in Link', // Not in Link
  //   width: 180,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  //   renderHeader: (params) => <div className='font-600 text-center'>Full Serial Number <br /> Not in Link</div>
  // },
  // {
  //   field: 'serial_no',
  //   headerName: 'Serial No.',
  //   width: 150,
  //   headerAlign: 'center',
  //   align:'center',
  //   editable: false,
  // },
];
