import DisplayPriceConfigCreate from "./DisplayPriceConfigCreate";

/**
 * The Staffs page config.
 */
const DisplayPriceConfig = {
	settings: {
		layout: {}
	},
	routes: [
		// {
		// 	path: 'vintage/:vintageId',
		// 	element: <VintageDetail />
		// },
		{
			path: 'displayPriceConfig/create',
			element: <DisplayPriceConfigCreate />
		}
	]
};

export default DisplayPriceConfig;
