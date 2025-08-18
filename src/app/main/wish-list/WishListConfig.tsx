import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const WishList = lazy(() => import('./WishList'));

/**
 * The Example page config.
 */
const WishListConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'wish-list',
			element: <WishList />
		}
	]
};

export default WishListConfig;
