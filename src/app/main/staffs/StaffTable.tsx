import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Navigate, useNavigate } from "react-router";
import { WithRouterProps } from "@fuse/core/withRouter/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import moment from "moment";
import { useSnackbar } from "notistack";
import { Button, Switch } from "@mui/material";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: string;
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170, align: "left" },
  // { id: 'surName', label: 'Surname', minWidth: 170, align: 'left' },
  { id: "email", label: "Email", minWidth: 170, align: "left" },
  { id: "role", label: "Role", minWidth: 100, align: "center" },
  { id: "createdAt", label: "Join Date", minWidth: 100, align: "center" },
  { id: "active", label: "Active", minWidth: 100, align: "center" },
  // { id: 'updateAt', label: 'Updated At', minWidth: 100, align: 'center' },
];

interface Data {
  name: string;
  // surname: string;
  email: string;
  role: string;
  createAt: string;
  // updateAt: string;
}

function createData(
  name: string,
  // surname: string,
  email: string,
  role: string,
  createAt: string
  // updateAt: string,
): Data {
  //   const density = population / size;
  return { name, email, role, createAt };
}

export default function StaffTable() {
  const { enqueueSnackbar } = useSnackbar();
  const session = localStorage.getItem(`jwt_access_token`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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
    navigate(`/staffs/${item}`);
  }

  const handleAddButtonClick = () => {
    navigate(`/staffs/create`);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api-dev.mlawatches.com/api/admin/staff/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.statusCode == 200) {
          setRows(data.results);
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
                {columns.map((column) => (
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  // console.log(row)
                  return (
                    <TableRow
                      className="cursor-pointer"
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => handleClick(row.id)}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className="p-12"
                            onClick={(e) => {
                              // Stop propagation only for the `active` column
                              if (column.id === "active") {
                                e.stopPropagation();
                              }
                            }}
                          >
                            {column.id === "active" ? (
                              <Switch
                                className="cursor-default"
                                disabled
                                checked={value as boolean}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  // handleSwitchChange(row.id, e.target.checked);
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : column.id === "createdAt" ? (
                              moment(value).format("YYYY-MM-DD")
                            ) : (
                              value
                            )}
                            {/* {console.log(typeof value)} */}
                            {/* {column.format && typeof value === "number"
                              ? column.format(value)
                              : column.id === "createdAt"
                                ? moment(value).format("YYYY-MM-DD")
                                : value} */}
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
    </div>
  );
}
