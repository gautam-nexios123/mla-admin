import { lazy } from 'react';

const RetailInStock = lazy(() => import('./RetailInStock'));
/**
 * The Example page config.
 */
const RetailInventoryInStockConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'retail-inventory',
			element: <RetailInStock />
		}
	]
};

export default RetailInventoryInStockConfig;
