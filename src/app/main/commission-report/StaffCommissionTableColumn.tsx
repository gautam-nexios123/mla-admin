import moment from "moment";
import { formatter } from "src/utils/coreFunction";

export const columns :any = [
    {
        field: 'staff_location',
        headerName: 'Office',
        width: 150,
        renderCell: (params) => <div className='font-600'>{params.value}</div>,
    },
    {
        field: 'name',
        headerName: 'Staff',
        width: 150,
        renderCell: (params) => <div className='font-600'>{params.value}</div>,
    },
    {
        field: 'join_date',
        headerName: 'Employment Date',
        width: 150,
        renderCell: (params) => <div>{moment(params.value).format('DD-MMM-YYYY')}</div>,
    },
    {
        field: 'seniority_year',
        headerName: 'Seniority (years)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{params.value}</div>,
    },
    {
        field: 'seniority_usd',
        headerName: 'Seniority (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'subTotalUsd',
        headerName: 'Subtotal (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'costOfLifePercentage',
        headerName: 'Cost of life (%)',
        width: 150,
        renderCell: (params) => <div>{params.value % 1 === 0 ? params.value : params.value.toFixed(2)}%</div>,
    },
    {
        field: 'costOfLifeUsd',
        headerName: 'Cost of life (USD)',
        width: 150,
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'performancePercentage',
        headerName: 'Performance (%)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{params.value % 1 === 0 ? params.value : params.value.toFixed(2)}%</div>,
    },
    {
        field: 'performanceUsd',
        headerName: 'Performance (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'watch_knowledge_level',
        headerName: 'Watch Knowledge Levels',
        width: 150,
        renderCell: (params) => <div>{params.value}</div>,
    },
    {
        field: 'non_watchLevel',
        headerName: 'Non Watch Levels',
        width: 150,
        renderCell: (params) => <div>{params.value}</div>,
    },
    {
        field: 'levelUsd',
        headerName: 'Level (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'presency',
        headerName: 'Presency (no. of weeks)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'presencyUsd',
        headerName: 'Presency (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'totalUsd',
        headerName: 'Total (USD)',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },
    {
        field: 'jackpot',
        headerName: '100M Jackpot',
        width: 150,
        type: 'number',
        renderCell: (params) => <div>{formatter.format(params.value)}</div>,
    },

];
