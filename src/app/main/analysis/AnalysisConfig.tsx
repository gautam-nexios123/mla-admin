import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'AnalysisPage', en);
i18next.addResourceBundle('tr', 'AnalysisPage', tr);
i18next.addResourceBundle('ar', 'AnalysisPage', ar);

const Analysis = lazy(() => import('./Analysis'));

/**
 * The Analysis page config.
 */
const AnalysisConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'analysis',
			element: <Analysis />
		}
	]
};

export default AnalysisConfig;
