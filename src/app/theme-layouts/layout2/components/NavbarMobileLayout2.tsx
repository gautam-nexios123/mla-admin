import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import NavbarToggleButton from 'app/theme-layouts/shared-components/navbar/NavbarToggleButton';
import UserNavbarHeader from '../../shared-components/UserNavbarHeader';
import Logo from '../../shared-components/Logo';
import Navigation from '../../shared-components/navigation/Navigation';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ListItemIcon, ListItemText } from '@mui/material';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import MenuItem from '@mui/material/MenuItem';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,

	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
		}`
	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${
			theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
		}`
	}
}));

const StyledContent = styled(FuseScrollbars)(() => ({
	overscrollBehavior: 'contain',
	overflowX: 'hidden',
	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
	backgroundRepeat: 'no-repeat',
	backgroundSize: '100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll'
}));

type NavbarMobileLayout2Props = {
	className?: string;
};

/**
 * The navbar mobile layout 2.
 */
function NavbarMobileLayout2(props: NavbarMobileLayout2Props) {
	const { className = '' } = props;
	const { signOut } = useAuth();
	return (
		<Root className={clsx('flex h-full flex-col overflow-hidden', className)}>
			<div className="flex h-48 shrink-0 flex-row items-center px-20 md:h-72">
				<div className="mx-4 flex flex-1">
					<Logo />
				</div>

				<NavbarToggleButton className="h-40 w-40 p-0" />
			</div>

			<StyledContent
				className="flex min-h-0 flex-1 flex-col"
				option={{ suppressScrollX: true, wheelPropagation: false }}
			>
				{/* <UserNavbarHeader /> */}

				<Navigation layout="vertical" />
				<MenuItem
				className='ml-[10px]'
						onClick={() => {
							signOut();
						}}
					>
						<ListItemIcon className="min-w-40">
							<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
						</ListItemIcon>
						<ListItemText primary="Sign out" />
					</MenuItem>
				<div className="flex-0 flex items-center justify-center py-48 opacity-10">
					<img
						className="w-full max-w-64"
						src="assets/images/logo/mla-white.svg"
						alt="footer logo"
					/>
				</div>
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarMobileLayout2);
