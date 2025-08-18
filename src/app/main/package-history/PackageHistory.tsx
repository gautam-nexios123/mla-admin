import FusePageCarded from '@fuse/core/FusePageCarded';
import PackageHistoryTable from './PackageHistoryTable';


function PackageHistoryCompleted() {

	return (
		<div className='flex w-full'>
			<FusePageCarded 
				header={null}
				content={<PackageHistoryTable/>}
			/>
		</div>
	);
}

export default PackageHistoryCompleted;
