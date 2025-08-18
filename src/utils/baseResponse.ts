export type BaseResponse<T> = {
	// success: boolean;
	statusCode: number;
	errors: any;
	message: any;
	// error_friendly_message: {
	// 	en: string;
	// 	th: string;
	// };
	results: T;
	processing_time: number;
};

export type BasePagination = {
	page: number;
	total: number;
};
