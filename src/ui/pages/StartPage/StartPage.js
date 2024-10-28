import React, { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Box, Typography, Card, CardContent } from '@mui/material';
import coin from '../../../assets/images/coin.png';
import constants from '../../../config/constants';
import chilean_peso from '../../../assets/icons/chilean_peso.svg';
import bitcoin from '../../../assets/icons/bitcoin.svg';
import tether from '../../../assets/icons/tether.svg';
import getUserData from '../../../networking/profile/getUserData';
import getTransactions from '../../../networking/transactions/getTransactions';
import Swal from 'sweetalert2';

const formatCurrencyForCard = (value = 0, currency) => {
	if (currency === constants.MISC_TEXT.CLP_SHORT) {
		return `$ ${value.toFixed(6).toLocaleString('en-US')}`;
	}
	return value.toFixed(6).toLocaleString('en-US');
};

function formatAmount(amount, currencyType) {
	let formattedAmount;
	currencyType = currencyType.toUpperCase();

	if (
		currencyType === 'USDT' ||
		currencyType === 'USDC' ||
		currencyType === 'BTC'
	) {
		formattedAmount = `$ ${amount.toLocaleString()} ${currencyType}`;
	} else {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyType,
			minimumFractionDigits: 0,
		});
		formattedAmount = formatter.format(amount);
	}

	return formattedAmount;
}

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
						{formatCurrencyForCard(balance, currencyCode)}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

const HistoryEntry = ({ transactionType, amount, currency }) => {
	let transactionWording;
	let color;
	switch (transactionType) {
		case 'exchange':
			transactionWording = constants.MISC_TEXT.YOU_EXCHANGED;
			color = '#010E11';
			break;
		case 'deposit':
			transactionWording = constants.MISC_TEXT.YOU_RECHARGED;
			color = '#05BCB9';
			break;
		case 'transfer':
			transactionWording = constants.MISC_TEXT.YOU_SENT;
			color = '#CE3434';
			break;
		case 'recharge':
			transactionWording = constants.MISC_TEXT.YOU_RECEIVED;
			color = '#05BCB9';
			break;
		default:
			transactionWording = constants.MISC_TEXT.UNKNOWN_TRANSACTION;
			color = '#010E11';
			break;
	}
	return (
		<Box
			sx={{
				borderBottom: '1px solid #DEE0E0',
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'space-between',
				paddingBottom: '2rem',
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
				{transactionWording}
			</Typography>
			<Typography
				sx={{
					fontFamily: 'Open Sans',
					fontWeight: 600,
					fontSize: '16px',
					lineHeight: '21.79px',
				}}
				color={color}
			>
				{formatAmount(amount, currency)}
			</Typography>
		</Box>
	);
};

function StartPage() {
	const { userData, setBalances } = useAuth();
	const [transactions, setTransactions] = React.useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userHeaders = {
					accessToken: userData.accessToken,
					uid: userData.uid,
					expiry: userData.expiry,
					client: userData.client,
				};

				const userDataResponse = await getUserData(userHeaders);
				const transactionsResponse = await getTransactions(userHeaders); //category: "exchange (intercambiaste)", "deposit (recibiste)", "transfer (transferiste), recharge (recargaste)"

				setBalances(
					userDataResponse?.data?.attributes?.balances?.clp || 0,
					userDataResponse?.data?.attributes?.balances?.usdt || 0,
					userDataResponse?.data?.attributes?.balances?.btc || 0
				);
				setTransactions(transactionsResponse?.data);
			} catch (error) {
				Swal.fire({
					title: 'Error!',
					text: error.message,
					icon: 'error',
					confirmButtonText: 'Entendido',
				});
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				padding: '5rem 0 0 3rem',
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
					flexWrap: 'wrap',
				}}
			>
				<BalanceCard
					coin={constants.MISC_TEXT.CHILEAN_PESO}
					icon={chilean_peso}
					balance={userData.balances?.clp}
				/>
				<BalanceCard
					coin={constants.MISC_TEXT.BITCOIN}
					icon={bitcoin}
					balance={userData.balances?.btc}
				/>
				<BalanceCard
					coin={constants.MISC_TEXT.USD_TETHER}
					icon={tether}
					balance={userData.balances?.usdt}
				/>
			</Box>
			<Typography
				variant="h3"
				sx={{
					marginTop: '4rem',
					fontFamily: 'Open Sans',
					fontWeight: 400,
					fontSize: '24px',
					lineHeight: '32.68px',
				}}
			>
				{constants.MISC_TEXT.HISTORY}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					marginTop: '2rem',
					overflowY: 'auto',
					height: '60%',
					paddingRight: '1rem',
					maxWidth: '1020px',
				}}
			>
				{transactions.map((transaction) => (
					<HistoryEntry
						key={transaction.id}
						transactionType={transaction.attributes?.category}
						amount={transaction.attributes?.amount}
						currency={transaction.attributes?.currency}
					/>
				))}
			</Box>
		</Box>
	);
}

export default StartPage;
