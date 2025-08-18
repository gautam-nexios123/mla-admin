import VintageCreate from "./VintageCreate";
import VintageDetail from "./VintageDetail";

/**
 * The Staffs page config.
 */
const VintageConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'vintage/:vintageId',
			element: <VintageDetail />
		},
		{
			path: 'vintage/create',
			element: <VintageCreate />
		}
	]
};

export default VintageConfig;
