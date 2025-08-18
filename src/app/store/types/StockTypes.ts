import { BasePagination } from "src/utils/baseResponse";

export type DataStock = {
	id: string;
	stockId: string;
	imageUrl?: string;
	thumbnailUrl?: string;
	status?: string;
	brand?: string;
	model?: string;
	description?: string;
	collection?: string;
	full_serial_number_not_in_link?: string;
	serial_no?: string;
	dial?: string;
	strap_bracelet?: string;
	num_of_links?: string;
	paper?: string;
	paper_date?: string;
	watch_box?: string;
	condition?: string;
	wholesale_price_usd?: number;
	notes?: string;
	have_video? : string;
	total_images?: number;
};



export type StockDataQueriesRes = {
	data: DataStock[];
	pagination?: BasePagination;
};

export type StockStateTypes = {
	stock: DataStock;
	// role: RoleDataQueriesRes;
	openDialog: boolean;
};

export interface StockParamsGetDataTable {
	// tab: number;
	direct?: string;
	sort?: string;
	brands?: string;
	model?: string;
	collections?: string;
	conditions?: string;
	box?: string;
	warranty?: string;
	prices?: string;
	filter?: string;
	search?: string;
	excludes?: string;
	page? : number;
	limit? : number;
}


export interface searchParams {
	key: string,
	value: string
}