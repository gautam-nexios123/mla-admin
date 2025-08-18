import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useParams } from 'react-router';
import CustomerContent from './CustomerContent';
import CustomersDetailHeader from './CustomersDetailHeader';
import AboutTab from './AboutTab';

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

function CustomersDetail() {
	const { t } = useTranslation('CustomersDetailPage');
	const routeParams = useParams();
	const { customerId } = routeParams;

	return (
		<div className='flex flex-col w-full'>
			{/* <FusePageCarded 
				header={<CustomersDetailHeader customerId={customerId} />}
				content={<AboutTab />}
			/> */}
			<div className='mb-20'>
				<CustomersDetailHeader customerId={customerId} />
			</div>
			<div className='m-20'>
				<AboutTab customerId={customerId}/>
			</div>
		</div>
		// <Root
		// 	header={
		// 		<div className="p-24">
		// 			<h4>{t('TITLE')}</h4>
		// 		</div>
		// 	}
		// 	content={
		// 		<div className="p-24">
		// 			<h4>Content</h4>
		// 			<br />
		// 			<DemoContent />
		// 		</div>
		// 	}
		// />
	);
}

export default CustomersDetail;
