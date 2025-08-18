import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import SettingsHeader from './SettingsHeader';
import { FormProvider, useForm } from 'react-hook-form';
import SettingsTabs from './SettingsTabs';

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

function Settings() {
	const { t } = useTranslation('SettingsPage');
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		// resolver: zodResolver(schema)
	});

	return (
		<FormProvider {...methods}>
			<div className='flex w-full p-24 md:p-32 pb-0 md:pb-0'>
				<FusePageCarded
					header={<SettingsHeader />}
					content={<SettingsTabs />}
				/>
			</div>
		</FormProvider>
	);
}

export default Settings;
