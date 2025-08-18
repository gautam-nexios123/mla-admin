import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import StaffDetail from './StaffDetail';
import StaffCreate from './StaffCreate';

i18next.addResourceBundle('en', 'StaffsPage', en);
i18next.addResourceBundle('tr', 'StaffsPage', tr);
i18next.addResourceBundle('ar', 'StaffsPage', ar);

const Staffs = lazy(() => import('./Staffs'));

/**
 * The Staffs page config.
 */
const StaffsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'staffs',
			element: <Staffs />
		},
		{
			path: 'staffs/:staffId',
			element: <StaffDetail />
		},
		{
			path: 'staffs/create',
			element: <StaffCreate />
		}
	]
};

export default StaffsConfig;
