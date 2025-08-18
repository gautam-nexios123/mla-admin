import moment from "moment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, CircularProgress } from "@mui/material";

const defaultColumnkey = {
  filterable: false,
  hideSortIcons: false,
  pinnable: false,
  resizable: false,
  sortable: false,
  headerAlign: "center",
  align: "center",
};

export const columns: any = ({
  handleClickOpen,
  handleClickApprove,
  loadingApprove,
}) => [
  {
    field: "name",
    headerName: "Customer Name",
    align: "center",
    width: 200,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{params.row.customerData?.name}</div>
    ),
  },
  {
    field: "product_new_type",
    headerName: "Pre-Owned/New",
    ...defaultColumnkey,
    align: "center",
    width: 130,
    editable: false,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "brand",
    headerName: "Brand",
    ...defaultColumnkey,
    align: "center",
    width: 122,
    editable: false,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "model",
    headerName: "Reference Number",
    align: "center",
    width: 140,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "dial",
    headerName: "Dial",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "bracelet",
    headerName: "Strap/Bracelet",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "description",
    headerName: "Note",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => <div className="">{params.value}</div>,
  },
  {
    field: "createdAt",
    headerName: "Recevied Date",
    align: "center",
    width: 122,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <div className="">{moment(params.value).format("DD-MMM-YYYY")}</div>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",
    width: 180,
    editable: false,
    ...defaultColumnkey,
    renderCell: (params) => (
      <>
        <div className="flex items-center justify-center gap-[10px]">
          <FuseSvgIcon onClick={() => handleClickOpen(params.id)}>
            heroicons-outline:trash
          </FuseSvgIcon>
          {params?.row?.isApprovedBtnShow &&
            (params?.row?.isApproved ? (
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                disabled
              >
                Approved{" "}
              </Button>
            ) : (
              <Button
                className="whitespace-nowrap "
                variant="contained"
                color="secondary"
                onClick={() => handleClickApprove(params?.id)}
              >
                Approve{" "}
                {loadingApprove && (
                  <CircularProgress size={16} className="text-white ml-[8px]" />
                )}
              </Button>
            ))}
        </div>
      </>
    ),
  },
];
