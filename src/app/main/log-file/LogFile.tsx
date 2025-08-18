import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import LogFileTable from './LogFileTable';
import { FormProvider, useForm } from 'react-hook-form';

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

function LogFile() {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {stockId: "", name: ""},
	});

	return (
		<FormProvider {...methods}>
		<div className='flex w-full'>
			<FusePageCarded 
				header={null}
				content={<LogFileTable/>}
			/>
		</div>
		</FormProvider>
	);
}

export default LogFile;
