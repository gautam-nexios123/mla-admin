import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { Divider } from '@mui/material';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    flexGrow: 1,
  }));

export default function CustomerContent() {
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden mt-24">
        <Typography className="text-2xl font-semibold tracking-tight leading-8 pb-20">
            Profile
        </Typography>
        
        <div className="flex flex-row sm:flex-row items-start pb-24">
            <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                <Item>
                    <Box sx={{ minWidth: 400 }}>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Active</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked />
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Enable Build Package</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        {/* <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Send Notification to Customer</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List> */}
                        {/* <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Super-Admin-Email"
                                label="Super Admin Email"
                                defaultValue="nopparat.wtnp@gmail.com"
                            />
                            
                        </CardContent>
                        <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Secondary-Email"
                                label="Secondary Email"
                                defaultValue="admin@email.com"
                            />
                        </CardContent> */}
                    </Box>
                </Item>
                {/* <Item>
                    <Box sx={{ minWidth: 400 }}>
                        <CardContent>
                        <Typography className="text-xl font-semibold tracking-tight leading-8">
                            Web Setting
                        </Typography>
                        </CardContent>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary"/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Mantainance Mode</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        
                        <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Email-Contact"
                                label="Email Contact"
                                defaultValue="nopparat.wtnp@gmail.com"
                            />
                        </CardContent>
                        <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Phone-Contact"
                                label="Phone Contact"
                                defaultValue="+66 12345 6789"
                            />
                            
                        </CardContent>
                    </Box>
                </Item> */}
            </Stack>
            
        </div>
        <Divider />
        {/* <Typography className="text-2xl font-semibold tracking-tight leading-8 pt-20 pb-20">
            Config Setting
        </Typography> */}
        {/* <div className="flex flex-row sm:flex-row items-start pb-24">
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                <Item>
                    <Box sx={{ minWidth: 400 }}>
                        <CardContent>
                        <Typography className="text-xl font-semibold tracking-tight leading-8">
                            Purchase Setting
                        </Typography>
                        </CardContent>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Enable Purchase system</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Guest user can purchase</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        <List dense={false}>
                            <ListItem
                                secondaryAction={
                                    <Switch color="primary" checked/>
                                }
                            >
                                <ListItemText
                                    primary={<div className='font-600'>Customer can build package</div>}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        </List>
                        <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Maximum-Whosale"
                                label="Maximum Whosale Discount Price"
                                defaultValue="0"
                            />
                        </CardContent>
                        <CardContent>
                            <TextField
                                className='w-full'
                                required
                                id="Minimum-Purchase"
                                label="Minimum Purchase for Discount (USD)"
                                defaultValue="600000"
                            />
                            
                        </CardContent>
                    </Box>
                </Item>
            </Stack>
        </div> */}
        {/* <div className="flex flex-col sm:flex-row items-start justify-between">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                Github Issues Summary
            </Typography>
            <div className="mt-12 sm:mt-0 sm:ml-8">
                <Tabs
                    value={tabValue}
                    onChange={(ev, value: number) => setTabValue(value)}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons={false}
                    className="-mx-4 min-h-40"
                    classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                    TabIndicatorProps={{
                        children: (
                            <Box
                                sx={{ bgcolor: 'text.disabled' }}
                                className="w-full h-full rounded-full opacity-20"
                            />
                        )
                    }}
                >
                    {Object.entries(ranges).map(([key, label]) => (
                        <Tab
                            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                            disableRipple
                            key={key}
                            label={label}
                        />
                    ))}
                </Tabs>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-24 w-full mt-32 sm:mt-16">
            <div className="flex flex-col flex-auto">
                <Typography
                    className="font-medium"
                    color="text.secondary"
                >
                    New vs. Closed
                </Typography>
                <div className="flex flex-col flex-auto">
                    <ReactApexChart
                        className="flex-auto w-full"
                        options={chartOptions}
                        series={series[currentRange]}
                        height={320}
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <Typography
                    className="font-medium"
                    color="text.secondary"
                >
                    Overview
                </Typography>
                <div className="flex-auto grid grid-cols-4 gap-16 mt-24">
                    <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-indigo-50 text-indigo-800">
                        <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                            {overview[currentRange]['new-issues']}
                        </Typography>
                        <Typography className="mt-4 text-sm sm:text-lg font-medium">New Issues</Typography>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-green-50 text-green-800">
                        <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                            {overview[currentRange]['closed-issues']}
                        </Typography>
                        <Typography className="mt-4 text-sm sm:text-lg font-medium">Closed</Typography>
                    </div>
                    <Box
                        sx={{
                            backgroundColor: (_theme) =>
                                _theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02)
                        }}
                        className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
                    >
                        <Typography className="text-5xl font-semibold leading-none tracking-tight">
                            {overview[currentRange].fixed}
                        </Typography>
                        <Typography className="mt-4 text-sm font-medium text-center">Fixed</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: (_theme) =>
                                _theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02)
                        }}
                        className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
                    >
                        <Typography className="text-5xl font-semibold leading-none tracking-tight">
                            {overview[currentRange]['wont-fix']}
                        </Typography>
                        <Typography className="mt-4 text-sm font-medium text-center">Won't Fix</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: (_theme) =>
                                _theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02)
                        }}
                        className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
                    >
                        <Typography className="text-5xl font-semibold leading-none tracking-tight">
                            {overview[currentRange]['re-opened']}
                        </Typography>
                        <Typography className="mt-4 text-sm font-medium text-center">Re-opened</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: (_theme) =>
                                _theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02)
                        }}
                        className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
                    >
                        <Typography className="text-5xl font-semibold leading-none tracking-tight">
                            {overview[currentRange]['needs-triage']}
                        </Typography>
                        <Typography className="mt-4 text-sm font-medium text-center">Needs Triage</Typography>
                    </Box>
                </div>
            </div>
        </div> */}
    </Paper>
    
  );
}
