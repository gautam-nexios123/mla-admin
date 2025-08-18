import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { boxDropdown, conditionDropdown, dialDropdown, nyDropdown, strapDropdown } from 'src/utils/dropdownlist';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent } from 'react-draft-wysiwyg';
import StocksTable from './StocksTable';
import WarningIcon from '@mui/icons-material/Warning';
import Badge from '@mui/material/Badge';
import StockActionRequireTable from './StockActionRequireTable';
import StocksSoldTable from './StocksSoldTable';
import StocksShipTable from './StocksShipTable';
import StocksArchiveTable from './StocksArchiveTable';
import StocksHistoryTable from './StocksHistoryTable';
import StocksProTable from './StocksProTable';

function StockTabs() {
	const [tabValue, setTabValue] = React.useState(0);
	const [changeTab, setChangeTab] = React.useState(false);

    function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
        setChangeTab(true)
	}
console.log('tabValue',tabValue)
    return (
        <>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                style={{height: 45}}
                // classes={{ root: 'w-full h-42' }}
            >
                <Tab
                    className="font-600"
                    label="All Stocks"
                />
                <Tab
                    className="font-600"
                    label="Marked Sold"
                    // icon={
                    //     <Badge badgeContent={4} color="success" variant="dot">
                    //       <WarningIcon color="action" sx={{ fontSize: 14 }} />
                    //     </Badge>
                    //   }
                    iconPosition="start"
                />
                <Tab
                    className="font-600"
                    label="Marked To Ship"
                />
                <Tab
                    className="font-600"
                    label="Archived"
                />
            </Tabs>
            <div className={tabValue !== 0 ? 'hidden' : ''}>
                    <StocksProTable isChangeTab={tabValue} />
                {/* <StocksTable /> */}
            </div>
            <div className={tabValue !== 1 ? 'hidden' : ''}>
                {tabValue == 1 && (
                    <>
                    <StocksSoldTable isChangeTab={tabValue} />
                    </>
                )}
                
            </div>
            <div className={tabValue !== 2 ? 'hidden' : ''}>
                {tabValue == 2 && (
                    <>
                    <StocksShipTable isChangeTab={tabValue} />
                    </>
                )}
            </div>
            <div className={tabValue !== 3 ? 'hidden' : ''}>
                {tabValue == 3 && (
                    <>
                    <StocksArchiveTable isChangeTab={tabValue} />
                    </>
                )}
            </div>
        </>
        
    )

}

export default StockTabs;