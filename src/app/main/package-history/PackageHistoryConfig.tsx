import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import PackageHistoryDetails from './PackageHistoryDetails';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const PackageHistoryCompleted = lazy(() => import('./PackageHistory'));

/**
 * The Example page config.
 */
const PackageHistoryConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'package-history',
			element: <PackageHistoryCompleted />
		},
		{
			path: 'package-history-details',
			element: <PackageHistoryDetails />
		}
	]
};

export default PackageHistoryConfig;
