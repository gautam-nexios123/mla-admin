import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StocksReplacementTable from '../stock-replacement/tools/StocksReplacementTable';
import BoxInventoryTable from './BoxInventoryTable';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function BoxInventory() {

	return (
		<div className='flex w-full'>
			<FusePageCarded 
				header={null}
				content={<BoxInventoryTable/>}
			/>
		</div>
	);
}

export default BoxInventory;
