import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const InventoryInStock = lazy(() => import('./InventoryInStock'));

/**
 * The Example page config.
 */
const InventoryInStockConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'inventory-in-stock',
			element: <InventoryInStock />
		}
	]
};

export default InventoryInStockConfig;
