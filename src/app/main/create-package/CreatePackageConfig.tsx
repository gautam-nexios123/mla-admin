import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const CreatePackage = lazy(() => import('./CreatePackage'));

/**
 * The Example page config.
 */
const CreatePackageConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'create-package',
			element: <CreatePackage />
		}
	]
};

export default CreatePackageConfig;
