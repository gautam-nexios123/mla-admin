import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'SettingsPage', en);
i18next.addResourceBundle('tr', 'SettingsPage', tr);
i18next.addResourceBundle('ar', 'SettingsPage', ar);

const Settings = lazy(() => import('./Settings'));

/**
 * The Settings page config.
 */
const SettingsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'settings',
			element: <Settings />
		}
	]
};

export default SettingsConfig;
