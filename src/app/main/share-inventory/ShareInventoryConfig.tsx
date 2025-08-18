import { lazy } from 'react';

const ShareInventory = lazy(() => import('./ShareInventory'));
const ShareInventoryCheckout = lazy(() => import('./ShareInventoryCheckout'));
const ShareInventoryCart = lazy(() => import('./ShareInventoryCart'));

/**
 * The Analysis page config.
 */
const ShareInventoryConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'share-inventory',
			element: <ShareInventory />
		},
		{
			path: 'share-inventory-checkout',
			element: <ShareInventoryCheckout />
		},
		{
			path: 'share-inventory-cart',
			element: <ShareInventoryCart />
		},
	]
};

export default ShareInventoryConfig;


