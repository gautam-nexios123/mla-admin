import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StocksHeader from './StocksHeader';
import StocksTable from './StocksTable';
import StockTabs from './StockTabs';

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

function Stocks() {
	const { t } = useTranslation('StocksPage');

	return (
		<div className='flex w-full'>
			<FusePageCarded
				// header={<StocksHeader />}
				content={<StockTabs />}
			/>
		</div>
		// Pending
		// Confirm
		// Ship
		// Paid
	);
}

export default Stocks;
