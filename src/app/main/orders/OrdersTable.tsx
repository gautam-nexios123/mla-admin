import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: string;
  format?: (value: number) => string;
}


const columns: readonly Column[] = [
  { id: 'collapse', label: '', minWidth: 10, align: 'left' },
  { id: 'orderId', label: 'Order Id', minWidth: 100, align: 'left' },
  { id: 'status', label: 'Status', minWidth: 20, align: 'center' },
  { id: 'totalItem', label: 'Total Items', minWidth: 20, align: 'center' },
  { id: 'customer', label: 'Customer', minWidth: 200, align: 'left' },
  { id: 'total', label: 'Total (USD)', minWidth: 40, align: 'center' },
  { id: 'createAt', label: 'Created At', minWidth: 100, align: 'center' },
  { id: 'updateAt', label: 'Updated At', minWidth: 100, align: 'center' },
];

interface Data {
  orderId: string;
  status: string;
  customer: string;
  totalItem: number;
  total: string;
  createAt: string;
  updateAt: string;
}

// function createData(
//   orderId: string,
//   status: string,
//   customer: string,
//   total: string,
//   createAt: string,
//   updateAt: string,
// ): Data {
// //   const density = population / size;
//   return { orderId, status, customer, total, createAt, updateAt };
// }

const rows = [
  {
    orderId: '2002403201807001',
    status: 'Ordered',
    customer: 'nopparat.wtnp@gmail.com', 
    total: 90000,
    details: [
      {
        stock: '1234',
        image: "https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/24332.jpg",
        brand: 'AP',
        model: '15202ST.OO.0944ST.01',
        price: 45000,
        discount: 0,
      },
      {
        stock: '1235',
        image: "https://mlagroup.s3.ap-southeast-1.amazonaws.com/saved%20for%20web/24332.jpg",
        brand: 'AP',
        model: '15202ST.OO.0944ST.01',
        price: 45000,
        discount: 0,
      }
    ],
    createAt: '2024-03-20 03:16',
    updateAt: '2024-03-20 03:16'
  }
    // createData('2002403201807001','Ordered','nopparat.wtnp@gmail.com', 45000,'2024-03-20 03:16','2024-03-20 03:16'),
];

export default function OrdersTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
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
                return (
                  <>
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary"
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                      endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}>
                      View
                    </Button>
                      {/* <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                      >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton> */}
                    </TableCell>
                    <TableCell key={'orderId'} align={'left'} className="font-600">{row.orderId}</TableCell>
                    <TableCell key={'orderId'} align={'center'}>
                      <Chip label={`${row.status}`} color="warning" className="font-600"/>
                      
                    </TableCell>
                    <TableCell key={'orderId'} align={'center'}>{row.details.length}</TableCell>
                    <TableCell key={'orderId'} align={'left'}>{row.customer}</TableCell>
                    <TableCell key={'orderId'} align={'center'}>{row.total}</TableCell>
                    <TableCell key={'orderId'} align={'center'}>{row.createAt}</TableCell>
                    <TableCell key={'orderId'} align={'center'}>{row.updateAt}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Order Details
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell align="left">Stock Id</TableCell>
                                <TableCell align="left">Image</TableCell>
                                <TableCell align="left">Brand</TableCell>
                                <TableCell align="left">Model</TableCell>
                                <TableCell align="right">Price ($)</TableCell>
                                <TableCell align="right">Discount ($)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.details.map((orderRow) => (
                                <TableRow key={orderRow.stock}>
                                  <TableCell align="left" component="th" scope="row" className="font-600">
                                    {orderRow.stock}
                                  </TableCell>
                                  <TableCell align="left">
                                    <img className="h-60 text-center" src={`${orderRow.image}`} />
                                  </TableCell>
                                  <TableCell align="left">{orderRow.brand}</TableCell>
                                  <TableCell align="left">{orderRow.model}</TableCell>
                                  <TableCell align="right">
                                  {orderRow.price}
                                    {/* {Math.round(orderRow.amount * row.price * 100) / 100} */}
                                  </TableCell>
                                  <TableCell align="right">{orderRow.discount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
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