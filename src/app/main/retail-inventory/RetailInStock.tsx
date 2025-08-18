import FusePageCarded from '@fuse/core/FusePageCarded';
import RetailStockProTable from '../stocks/RetailStockProTable';

function RetailInStock() {

	return (
		<div className='flex w-full h-full'>
			<FusePageCarded 
				header={null}
				content={<RetailStockProTable />}
			/>
		</div>
	);
}

export default RetailInStock;
