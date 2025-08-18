import FusePageCarded from '@fuse/core/FusePageCarded';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import ShippingCreatePackageTable from './ShippingCreatePackageTable';
import ShippingPackageHeader from './ShippingPackageHeader';

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

function ShippingPackage() {

	return (
		<div className='flex w-full'>
			<FusePageCarded 
				header={<ShippingPackageHeader/>}
				content={<ShippingCreatePackageTable/>}
			/>
		</div>
	);
}

export default ShippingPackage;
