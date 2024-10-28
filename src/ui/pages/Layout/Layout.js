import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Typography,
	Box,
} from '@mui/material';
import constants from '../../../config/constants';
import { useAuth } from '../../../contexts/AuthContext';
import illustrations from '../../../assets/images/illustrations.png';

const Layout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout, isLoggedIn } = useAuth();

	const isLoginPage = location.pathname === '/';

	console.log('isLogged', isLoggedIn);

	const menuItems = [
		{
			text: constants.MISC_TEXT.START_PAGE_DRAWER_ITEM,
			link: constants.PAGES.START,
		},
		{
			text: constants.MISC_TEXT.TRANSFER_PAGE_DRAWER_ITEM,
			link: constants.PAGES.TRANSFER,
		},
		{
			text: constants.MISC_TEXT.RECHARGE_PAGE_DRAWER_ITEM,
			link: constants.PAGES.RECHARGE,
		},
		{
			text: constants.MISC_TEXT.EXCHANGE_PAGE_DRAWER_ITEM,
			link: constants.PAGES.EXCHANGE,
		},
		{
			text: constants.MISC_TEXT.PROFILE_PAGE_DRAWER_ITEM,
			link: constants.PAGES.PROFILE,
		},
		{
			text: constants.MISC_TEXT.HELP_PAGE_DRAWER_ITEM,
			link: constants.PAGES.HELP,
		},
	];

	return (
		<div style={{ display: 'flex' }}>
			{!isLoginPage && (
				<Drawer
					variant="permanent"
					sx={{
						'& .MuiDrawer-paper': {
							backgroundColor: '#167287',
							width: '20%',
							padding: '4rem 0rem',
							height: '100vh',
							backgroundImage: `url(${illustrations})`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'contain',
							backgroundPosition: 'bottom',
							backgroundPositionY: '80%',
						},
					}}
				>
					<List>
						{menuItems.map((item) => (
							<ListItem
								key={item.text}
								button
								onClick={() => navigate(item.link)}
								sx={{
									borderRadius: '0 32.5px 32.5px 0',
									margin: '2rem 0rem',
									backgroundColor:
										location.pathname === item.link
											? ' #05BCB9'
											: 'transparent',
									color: '#FFFFFF',
									'&:hover': {
										backgroundColor:
											location.pathname !== item.link ? '#ffffff30' : '#05BCB9',
									},
									width: '80%',
									textAlign: 'left',
									paddingLeft: '4rem',
								}}
							>
								<ListItemText
									primary={item.text}
									sx={{
										'& .MuiListItemText-primary': {
											fontFamily: 'Open Sans',
											fontSize: '24px',
											lineHeight: '32.68px',
											fontWeight:
												location.pathname === item.link ? '600' : '400',
										},
									}}
								/>
							</ListItem>
						))}
					</List>
					<Box
						sx={{
							left: '20%',
							marginTop: '22rem',
							cursor: 'pointer',
							zIndex: 2,
							marginLeft: '20%',
						}}
						onClick={logout}
					>
						<Typography
							sx={{
								fontFamily: 'Open Sans',
								color: '#FFFFFF',
								fontSize: '24px',
								fontWeight: '400',
								'&:hover': {
									textDecoration: 'underline',
								},
								lineHeight: '32.68px',
							}}
						>
							{constants.MISC_TEXT.LOGOUT_DRAWER_ITEM}
						</Typography>
					</Box>
				</Drawer>
			)}
			<main style={{ marginLeft: '20%', flexGrow: 1, padding: '16px' }}>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
