import FusePageCarded from '@fuse/core/FusePageCarded';
import ShareInventoryTabs from './ShareInventoryTabs';

function ShareInventory() {

	return (
		<div className='flex w-full'>
			<FusePageCarded
				content={<ShareInventoryTabs />}
			/>
		</div>
	);
}

export default ShareInventory;
