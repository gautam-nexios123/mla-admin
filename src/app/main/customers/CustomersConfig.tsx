import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import CustomersDetail from './CustomersDetail';

i18next.addResourceBundle('en', 'CustomersPage', en);
i18next.addResourceBundle('tr', 'CustomersPage', tr);
i18next.addResourceBundle('ar', 'CustomersPage', ar);

const Customers = lazy(() => import('./Customers'));

/**
 * The Customers page config.
 */
const CustomersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'customers',
			element: <Customers />
		},
		{
			path: 'customers/:customerId',
			element: <CustomersDetail />
		}
	]
};

export default CustomersConfig;
