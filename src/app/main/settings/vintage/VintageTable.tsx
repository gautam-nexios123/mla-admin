import FuseLoading from "@fuse/core/FuseLoading";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Modal } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router";
import { FaEdit } from "react-icons/fa";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: string;
  format?: (value: number) => string;
}

const columns: any = [
  { id: "brand", label: "Brand", minWidth: 170, align: "left" },
  { id: "model", label: "Model", minWidth: 170, align: "left" },
  { id: "action", label: "Action", minWidth: 170, align: "left" },
];

export default function VintageTable() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [openDelModel, setOpenDelModel] = React.useState<boolean>(false);
  const [delDataID, setDelDataID] = React.useState<any>(null);

  const handleClose = () => setOpenDelModel(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleClick(item) {
    navigate(`/vintage/${item}`);
  }

  const handleAddButtonClick = () => {
    navigate(`/vintage/create`);
  };

  const handleClickDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/vintageWatch?id=${delDataID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response?.json();
      console.log("data: ", data);
      if (data?.statusCode == 200) {
        setLoading(false);
        enqueueSnackbar("Data deleted successfully!", { variant: "success" });
        fetchData();
        handleClose();
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api-dev.mlawatches.com/api/admin/stock/vintageWatch`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.statusCode == 200) {
        setRows(data?.results);
        setLoading(false);
      } else if (data.statusCode == 403) {
        enqueueSnackbar(
          "Unauthorized access. You don't have permission to view or edit this content.",
          { variant: "error" }
        );
        setLoading(false);
      } else {
        enqueueSnackbar("Failed to Please try again.", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAddButtonClick}
        className="w-fit ml-auto mb-[15px]"
      >
        + Add
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <TableCell
                    className="font-600"
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => {
                  return (
                    <TableRow
                      className="cursor-pointer"
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => handleClick(row.id)}
                    >
                      {columns?.map((column: any) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className="p-12"
                            onClick={(e) => {
                              // Stop propagation only for the `active` column
                              if (column?.id === "action") {
                                e.stopPropagation();
                              }
                            }}
                          >
                            {column?.id === "action" ? (
                              <div className="flex gap-8 items-center">
                                <div
                                  className=""
                                  onClick={() => handleClick(row.id)}
                                >
                                  <FaEdit className="text-[#4F46E5] text-[22px]" />
                                </div>
                                <div
                                  className=""
                                  onClick={() => {
                                    setOpenDelModel(true);
                                    setDelDataID(row?.id);
                                  }}
                                >
                                  <DeleteIcon className="text-red-500 text-[26px]" />
                                </div>
                              </div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        open={openDelModel}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-center text-black text-[20px] font-600">
            Delete Vintage
          </h2>
          <p className="text-center text-black text-[18px] font-500 pt-[8px]">
            Are you sure to delete vintage ?
          </p>
          <div className="flex justify-center gap-[20px] mt-[25px]">
            <button
              onClick={() => handleClose()}
              className="py-[6px] px-[15px] border border-black rounded-4 text-black text-[16px] font-500"
            >
              Cancel
            </button>
            <button
              onClick={() => handleClickDelete()}
              className="py-[6px] px-[15px] border border-none rounded-4 text-white bg-red-500 text-[16px] font-500"
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
