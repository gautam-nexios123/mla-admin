import { GridColDef } from "@mui/x-data-grid-pro";

const ReportEightColumn = (): GridColDef[] => {
    return [
        {
            field: "stockId",
            headerName: "Stock",
            width: 150,
            headerAlign: "center",
            align: "center",
            editable: false,
            renderCell: (params) => (
                < div className="" > {params.value}</div>
            ),
        },
        {
            field: "brand",
            headerName: "Brand",
            width: 150,
            headerAlign: "center",
            align: "center",
            editable: false,
            renderCell: (params) => (
                <div className="">{params.value}</div>
            ),
        },
        {
            field: "model",
            headerName: "Model",
            width: 200,
            headerAlign: "center",
            align: "center",
            editable: false,
            renderCell: (params) => (
                <div className="">{params.value}</div>
            ),
        },
        {
            field: "serial_no",
            headerName: "Serial Number",
            width: 200,
            headerAlign: "center",
            align: "center",
            editable: false,
            renderCell: (params) => (
                <div className="">{params.value}</div>
            ),
        },
    ];
};

export default ReportEightColumn;
