import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StaffsHeader from './StaffsHeader';
import StaffTable from './StaffTable';

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



function Staffs() {
	const { t } = useTranslation('StaffsPage');

	return (
		<div className='flex w-full'>
			<FusePageCarded 
				header={<StaffsHeader />}
				content={<StaffTable />}
			/>
		</div>
	);
}

export default Staffs;
