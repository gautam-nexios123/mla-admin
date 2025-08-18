import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';

/**
 * The Staff header.
 */
function StaffsHeader() {
	const navigate = useNavigate();

	// useEffect(() => {
	// 	return () => {
	// 		// dispatch(resetSearchText());
	// 	};
	// }, []);

	const createStaffHandle = () => {
		navigate(`/staffs/create`);
	}

	return (
		<div className="flex w-full mb-25">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						Staffs
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Staffs Management
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
				{/* <Paper
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
				>
					<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

					<Input
						placeholder="Search Staffs"
						className="flex flex-1"
						disableUnderline
						fullWidth
						// value={searchText}
						inputProps={{
							'aria-label': 'Search Staffs'
						}}
						// onChange={(ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Paper> */}
					<Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={createStaffHandle}>
					Add
				</Button>
				</div>
			</div>
		</div>
	);
}

export default StaffsHeader;
