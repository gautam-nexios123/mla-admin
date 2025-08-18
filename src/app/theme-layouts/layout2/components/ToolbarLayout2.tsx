import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ListItemIcon, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { Layout2ConfigDefaultsType } from 'app/theme-layouts/layout2/Layout2Config';
import Navigation from 'app/theme-layouts/shared-components/navigation/Navigation';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import Logo from '../../shared-components/Logo';

type ToolbarLayout2Props = {
	className?: string;
};

/**
 * The toolbar layout 2.
 */
function ToolbarLayout2(props: ToolbarLayout2Props) {
	const { className = '' } = props;
	const { signOut } = useAuth();
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout2ConfigDefaultsType;
	const toolbarTheme = useSelector(selectToolbarTheme);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex shadow-md', className)}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
			>
				{/* container */}
				<Toolbar className=" min-h-40 p-0 md:min-h-40 lg:px-24 overflow-y-auto w-full">
					{/* {config.navbar.display && (
						<Hidden lgUp>
							<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
						</Hidden>
					)} */}
					{/* <Hidden lgDown> */}
					<FuseScrollbars className="flex h-full items-center">
						<Logo />
						<Navigation
							className="w-full menu-list-design"
							layout="horizontal"
						/>
						<MenuItem
							onClick={() => {
								signOut();
							}}
							className='w-fit p-0 h-[40px] w-[48px] flex justify-center'
						>
							<ListItemIcon className='!min-w-fit p-0'>
								<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
							</ListItemIcon>
						</MenuItem>
					</FuseScrollbars >
					{/* </Hidden> */}
					{/* <div className="flex flex-1">
						<Hidden lgDown>
							<NavigationShortcuts />
						</Hidden>
					</div> */}

					<div className="flex h-full items-center overflow-x-auto px-8">
						{/* <LanguageSwitcher />
						<AdjustFontSize />
						<FullScreenToggle />
						<NavigationSearch />
						<QuickPanelToggleButton /> */}
						{/* <UserMenu /> */}
					</div>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout2);
