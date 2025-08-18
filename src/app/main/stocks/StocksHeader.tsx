import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
// import { useAppDispatch } from 'app/store/store';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
// import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';

/**
 * The Staff header.
 */
function StocksHeader() {
	// const dispatch = useAppDispatch();
	// const searchText = useSelector(selectSearchText);

	useEffect(() => {
		return () => {
			// dispatch(resetSearchText());
		};
	}, []);

	const handleClickAdd = () => {
		console.log('adddd')
	}

	return (
		<div className="flex w-full mb-25">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						Stocks
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Stocks Management
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
				<Paper
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
				>
					<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

					<Input
						placeholder="Search Stocks"
						className="flex flex-1"
						disableUnderline
						fullWidth
						// value={searchText}
						inputProps={{
							'aria-label': 'Search Stock ID'
						}}
						// onChange={(ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Paper>
				<Button onClick={handleClickAdd} color="primary" variant="contained" startIcon={<AddIcon />}>
					Add
				</Button>
					{/* <Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:document-report</FuseSvgIcon>}
					>
						Reports
					</Button>
					<Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
					>
						Settings
					</Button> */}
					{/* <Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Save
					</Button> */}
				</div>
			</div>
		</div>
	);
}

export default StocksHeader;
