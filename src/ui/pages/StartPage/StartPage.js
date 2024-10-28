import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Box, Typography, Card, CardContent } from '@mui/material';
import coin from '../../../assets/images/coin.png';
import constants from '../../../config/constants';
import chilean_peso from '../../../assets/icons/chilean_peso.svg';
import bitcoin from '../../../assets/icons/bitcoin.svg';
import tether from '../../../assets/icons/tether.svg';

const formatCurrency = (value, currency) => {
	if (currency === constants.MISC_TEXT.CHILEAN_PESO) {
		return `$${value.toFixed(6).toLocaleString('en-US')}`;
	}
	return value.toFixed(6).toLocaleString('en-US');
};
const UserGreeting = ({ name }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				gap: '16px',
			}}
		>
			<img src={coin} alt="coin" />
			<Typography
				variant="h3"
				sx={{
					fontFamily: 'Open Sans',
					fontWeight: 600,
					fontSize: '28px',
					lineHeight: '38.13px',
					display: 'flex',
					flexDirection: 'row',
					gap: '0.5rem',
				}}
			>
				{constants.MISC_TEXT.START_PAGE_GREETING}
				<Typography
					sx={{
						fontFamily: 'Open Sans',
						fontWeight: 600,
						fontSize: '28px',
						lineHeight: '38.13px',
						background: 'linear-gradient(90deg, #05BCB9 0%, #167287 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}
				>
					{name}!
				</Typography>
			</Typography>
		</Box>
	);
};

const Subtitle2 = ({ text }) => {
	return (
		<Typography
			sx={{
				fontFamily: 'Open Sans',
				fontWeight: 400,
				fontSize: '24px',
				lineHeight: '32.68px',
				marginTop: '4rem',
			}}
		>
			{text}
		</Typography>
	);
};

const BalanceCard = ({ coin, icon, balance }) => {
	const currencyCode =
		coin === constants.MISC_TEXT.CHILEAN_PESO ? 'CLP' : 'USD';
	return (
		<Card
			sx={{
				background: '#F5F6F6',
				width: '285px',
				height: '129px',
				borderRadius: '6px',
				border: '2px solid #DEE0E0',
				padding: '0.5rem',
			}}
		>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'left',
						width: '100%',
						gap: '3rem',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: '16px',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<Typography
							sx={{
								fontFamily: 'Open Sans',
								fontWeight: 400,
								fontSize: '16px',
								lineHeight: '21.79px',
							}}
						>
							{coin}
						</Typography>
						<img src={icon} alt="coin" width={24} height={24} />
					</Box>
					<Typography
						sx={{
							fontFamily: 'Open Sans',
							fontWeight: 600,
							fontSize: '24px',
							lineHeight: '32.68px',
							color: '#010E11',
						}}
					>
						{formatCurrency(balance, currencyCode)}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

function StartPage() {
	const { userData } = useAuth();
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				padding: '5rem 2rem 10rem 3rem',
			}}
		>
			<UserGreeting name={userData.name} />
			<Subtitle2 text={constants.MISC_TEXT.START_PAGE_SUBTITLE} />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					marginTop: '2rem',
					gap: '2rem',
				}}
			>
				<BalanceCard
					coin={constants.MISC_TEXT.CHILEAN_PESO}
					icon={chilean_peso}
					balance={1000000}
				/>
				<BalanceCard
					coin={constants.MISC_TEXT.BITCOIN}
					icon={bitcoin}
					balance={1000000}
				/>
				<BalanceCard
					coin={constants.MISC_TEXT.USD_TETHER}
					icon={tether}
					balance={1.574e-5}
				/>
			</Box>
		</Box>
	);
}

export default StartPage;
