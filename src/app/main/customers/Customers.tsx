import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import CustomersHeader from './CustomersHeader';
import CustomersTable from './CustomersTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useState } from 'react';

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

function Customers() {
	const { t } = useTranslation('CustomersPage');
	const [totalCustomerRecords, setTotalCustomerRecords] = useState("")
	const [searchValue, setSearchValue] = useState("")
	return (
		<div className='flex w-full'>
			<FusePageCarded 
				header={<CustomersHeader searchValue={searchValue} setSearchValue={setSearchValue} totalCustomerRecords={totalCustomerRecords} />}
				content={<CustomersTable searchValue={searchValue} setSearchValue={setSearchValue}  setTotalCustomerRecords={setTotalCustomerRecords} />}
			/>
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

export default Customers;
