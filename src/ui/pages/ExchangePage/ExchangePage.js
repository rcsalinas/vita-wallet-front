import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
	Button,
	Card,
	MenuItem,
	TextField,
	Typography,
	Box,
	InputAdornment,
	styled,
	Select,
	IconButton,
} from '@mui/material';
import bitcoin from '../../../assets/icons/bitcoin.svg';
import tether from '../../../assets/icons/tether.svg';
import chilean_peso from '../../../assets/icons/chilean_peso.svg';
import dollar_sign from '../../../assets/icons/dollar_sign.svg';
import back_arrow from '../../../assets/icons/back_arrow.svg';
import amico_modal from '../../../assets/images/amico_modal.png';
import constants from '../../../config/constants';
import { useAuth } from '../../../contexts/AuthContext';
import getCryptoPrices from '../../../networking/prices/getCryptoPrices';
// import exchange from '../../../networking/exchange/exchange';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

const currencyOptionsTo = [
	{ code: 'USDT', icon: tether },
	{ code: 'BTC', icon: bitcoin },
];

const currencyOptionsFrom = [{ code: 'CLP', icon: chilean_peso }];

const StepOneSchema = Yup.object().shape({
	fromCurrency: Yup.string().required('Required'),
	fromAmount: Yup.number().required('Required').positive('Must be positive'),
	toCurrency: Yup.string().required('Required'),
	toAmount: Yup.number().required('Required'),
});

const StyledTextField = styled(TextField)({
	'& .MuiOutlinedInput-root': {
		boxSizing: 'border-box',
		'& fieldset': {
			borderRadius: '6px !important',
			padding: '16px',
			border: '1px solid #B9C1C2 !important',
		},
	},
});

const StyledDropdown = styled(Select)({
	'&.MuiOutlinedInput-root': {
		'& fieldset': {
			borderRadius: '6px !important',
			border: '1px solid #B9C1C2  !important',
		},
		boxSizing: 'border-box',
		marginTop: '9px',
	},
});

const SuccesModal = ({ currencyReceived, onClose }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0, 0, 0, 0.4)',
				position: 'absolute',
				top: 0,
				left: 0,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'white',
					borderRadius: '6px',
					padding: '4rem',
					width: '25%',
					position: 'relative',
				}}
			>
				<IconButton
					sx={{
						position: 'absolute',
						top: '1rem',
						right: '1rem',
					}}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
				<img src={amico_modal} alt="amico modal" />
				<Typography
					sx={{
						fontFamily: 'Open Sans',
						fontSize: '28px',
						fontWeight: 600,
						lineHeight: '38.13px',
						marginTop: '2rem',
						color: '#167287',
					}}
				>
					{constants.MISC_TEXT.SUCCESFULL_TRANSACTION}
				</Typography>
				<Typography
					sx={{
						fontFamily: 'Open Sans',
						fontSize: '16px',
						fontWeight: 400,
						lineHeight: '21.79px',
						marginTop: '2rem',
					}}
				>
					{constants.MISC_TEXT.SUCCESS_MODAL_TEXT.replace(
						'%currency%',
						currencyReceived
					)}
				</Typography>
			</Box>
		</Box>
	);
};

function ContinueButton({ type, text, disabled = false, onClick }) {
	return (
		<Button
			type={type}
			loadingPosition="start"
			disabled={disabled}
			variant="contained"
			sx={{
				background: 'linear-gradient(90deg, #05BCB9 0%, #167287 100%)',
				color: 'white',
				height: '50px',
				'&.Mui-disabled': {
					background: '#DEE0E0',
					color: '#F9F9FA',
				},
				width: '183px',
			}}
			onClick={onClick}
		>
			{text}
		</Button>
	);
}

function BackButton({ text, disabled = false, onClick }) {
	return (
		<Button
			loadingPosition="start"
			disabled={disabled}
			variant="outlined"
			sx={{
				color: '#167287',
				height: '50px',
				'&.Mui-disabled': {
					background: '#DEE0E0',
					color: '#F9F9FA',
				},
				width: '183px',
				border: '1px solid linear-gradient(90deg, #05BCB9 0%, #167287 100%)',
				borderColor: 'linear-gradient(90deg, #05BCB9 0%, #167287 100%)',
			}}
			onClick={onClick}
		>
			{text}
		</Button>
	);
}

const exchangeRateUsdToClp = 946.94;

function ExchangePage() {
	const [step, setStep] = useState(1);
	const [prices, setPrices] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const { userData } = useAuth();

	const handleAccept = async (fromCurrency, toCurrency, amount) => {
		fromCurrency = fromCurrency.toLowerCase();
		toCurrency = toCurrency.toLowerCase();
		try {
			/*const userHeaders = {
				accessToken: userData.accessToken,
				uid: userData.uid,
				expiry: userData.expiry,
				client: userData.client,
			};
			await exchange(userHeaders, fromCurrency, toCurrency, amount);*/
			setModalOpen(true);
		} catch (error) {
			Swal.fire({
				title: 'Error!',
				text: error.message,
				icon: 'error',
				confirmButtonText: 'Entendido',
			});
		}
	};

	const getPrices = async () => {
		try {
			const userHeaders = {
				accessToken: userData.accessToken,
				uid: userData.uid,
				expiry: userData.expiry,
				client: userData.client,
			};
			const prices = await getCryptoPrices(userHeaders);
			setPrices(prices);
		} catch (error) {
			Swal.fire({
				title: 'Error!',
				text: error.message,
				icon: 'error',
				confirmButtonText: 'Entendido',
			});
		}
	};

	useEffect(() => {
		getPrices();
		const intervalId = setInterval(getPrices, 2 * 60 * 1000);

		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAmountFromBlur = (e, setFieldValue, values) => {
		const amountFrom = e.target.value;
		const toCurrency = values.toCurrency;
		if (toCurrency) {
			const conversionRate = prices?.prices?.usd[toCurrency.toLowerCase()] || 1;
			const amountTo = (amountFrom / exchangeRateUsdToClp) * conversionRate;

			setFieldValue('fromAmount', amountFrom);
			setFieldValue('toAmount', amountTo.toFixed(10));
		}
	};

	const handleCurrencyChange = (e, setFieldValue, values) => {
		const toCurrency = e.target.value;
		const amountFrom = values.fromAmount;
		const conversionRate = prices?.prices?.usd[toCurrency.toLowerCase()] || 1;
		setExchangeRate(conversionRate);
		if (amountFrom) {
			const amountTo = (amountFrom / exchangeRateUsdToClp) * conversionRate;

			setFieldValue('toCurrency', toCurrency);
			setFieldValue('toAmount', amountTo.toFixed(10));
		} else {
			setFieldValue('toCurrency', toCurrency);
		}
	};

	return (
		<>
			<Formik
				initialValues={{
					fromCurrency: 'CLP',
					fromAmount: '',
					toCurrency: '',
					toAmount: '',
				}}
				validationSchema={StepOneSchema}
				onSubmit={(values) => {
					setStep(2);
				}}
				validateOnChange={true}
				validateOnBlur={true}
			>
				{({
					values,
					errors,
					touched,
					handleSubmit,
					handleChange,
					setFieldValue,
					isValid,
				}) => (
					<Form onSubmit={handleSubmit}>
						{modalOpen && (
							<SuccesModal
								currencyReceived={values.toCurrency}
								onClose={() => {
									setModalOpen(false);
									window.location.reload();
								}}
							/>
						)}
						{step === 1 ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									padding: '8% 10% 10% 10%',
								}}
							>
								<Typography
									sx={{
										fontFamily: 'Open Sans',
										fontSize: '28px',
										fontWeight: 600,
										lineHeight: '38.13px',
									}}
								>
									{constants.MISC_TEXT.TRANSACTION_PAGE_TITLE}
								</Typography>
								<Typography
									sx={{
										fontFamily: 'Open Sans',
										fontSize: '16px',
										fontWeight: 600,
										lineHeight: '21.79px',
										color: '#05BCB9',
										marginTop: '2rem',
									}}
								>
									{constants.MISC_TEXT.BALANCE_AVAILABLE}: ${' '}
									{userData.balances?.clp} CLP
								</Typography>
								<Typography
									sx={{
										fontFamily: 'Open Sans',
										fontSize: '16px',
										fontWeight: 400,
										lineHeight: '21.79px',
										marginTop: '3rem',
									}}
								>
									{constants.MISC_TEXT.AMOUNT_TO_EXCHANGE}
								</Typography>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: '16px',
										alignItems: 'center',
									}}
								>
									<Field
										as={StyledDropdown}
										name="fromCurrency"
										error={touched.fromCurrency && Boolean(errors.fromCurrency)}
										helperText={touched.fromAmount && errors.fromAmount}
										sx={{
											width: '80px',
											height: '57px',
										}}
									>
										{currencyOptionsFrom.map((option) => (
											<MenuItem key={option.code} value={option.code}>
												<img src={option.icon} alt={option.code} />
											</MenuItem>
										))}
									</Field>

									<Field
										name="fromAmount"
										as={StyledTextField}
										type="number"
										fullWidth
										margin="normal"
										error={touched.fromAmount && Boolean(errors.fromAmount)}
										helperText={touched.fromAmount && errors.fromAmount}
										sx={{
											width: '387px',
											height: '56px',
										}}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<img
														src={dollar_sign}
														alt="dollar icon"
														width={24}
														height={24}
														sx={{ backgroundColor: 'white' }}
													/>
												</InputAdornment>
											),
										}}
										onBlur={(e) =>
											handleAmountFromBlur(e, setFieldValue, values)
										}
									/>
								</Box>
								<Typography
									sx={{
										fontFamily: 'Open Sans',
										fontSize: '16px',
										fontWeight: 400,
										lineHeight: '21.79px',
										marginTop: '3rem',
									}}
								>
									{constants.MISC_TEXT.I_WANT_TO_RECEIVE}
								</Typography>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: '16px',
										alignItems: 'center',
									}}
								>
									<Field
										name="toCurrency"
										as={StyledDropdown}
										error={touched.toCurrency && Boolean(errors.toCurrency)}
										helperText={touched.toCurrency && errors.toCurrency}
										sx={{
											width: '80px',
											height: '57px',
										}}
										onChange={(e) =>
											handleCurrencyChange(e, setFieldValue, values)
										}
									>
										{currencyOptionsTo.map((option) => (
											<MenuItem key={option.code} value={option.code}>
												<img src={option.icon} alt={option.code} />
											</MenuItem>
										))}
									</Field>

									<Field
										name="toAmount"
										as={StyledTextField}
										type="number"
										fullWidth
										margin="normal"
										error={touched.toAmount && Boolean(errors.toAmount)}
										helperText={touched.toAmount && errors.toAmount}
										sx={{
											width: '387px',
											height: '56px',
										}}
										InputProps={{
											readOnly: true,
										}}
									/>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										gap: '16px',
										position: 'absolute',
										bottom: '8%',
									}}
								>
									<BackButton
										onClick={() => setStep(1)}
										disabled={step === 1}
										text={constants.MISC_TEXT.BACK}
									/>

									<ContinueButton
										type="submit"
										variant="contained"
										color="primary"
										disabled={!values.toAmount}
										text={constants.MISC_TEXT.CONTINUE}
									/>
								</Box>
							</Box>
						) : (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									padding: '8% 10% 10% 8%',
									gap: '2rem',
								}}
							>
								<Box
									onClick={() => {
										window.location.reload();
									}}
								>
									<img src={back_arrow} alt="back arrow" />
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: '2rem',
									}}
								>
									<Typography
										sx={{
											fontFamily: 'Open Sans',
											fontSize: '28px',
											fontWeight: 600,
											lineHeight: '38.13px',
											marginBottom: '4rem',
										}}
									>
										{constants.MISC_TEXT.TRANSACTION_SUMMARY}
									</Typography>
									<Card
										variant="outlined"
										style={{
											padding: '1rem 2rem',
											marginBottom: '16px',
											width: '488px',
											backgroundColor: '#F9F9F9',
											borderRadius: '6px',
											display: 'flex',
											flexDirection: 'column',
											gap: '1rem',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',

												justifyContent: 'space-between',
											}}
										>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '14px',
													fontWeight: 400,
													lineHeight: '19.07px',
												}}
											>
												{constants.MISC_TEXT.AMOUNT_TO_EXCHANGE}
											</Typography>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '16px',
													fontWeight: 600,
													lineHeight: '21.79px',
												}}
											>
												$ {values.fromAmount} {values.fromCurrency}
											</Typography>
										</Box>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}
										>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '14px',
													fontWeight: 400,
													lineHeight: '19.07px',
												}}
											>
												{constants.MISC_TEXT.EXCHANGE_RATE}
											</Typography>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '16px',
													fontWeight: 600,
													lineHeight: '21.79px',
												}}
											>
												1 {values.toCurrency} ={' '}
												{(exchangeRate * exchangeRateUsdToClp).toLocaleString(
													'es-CL',
													{ style: 'currency', currency: 'CLP' }
												)}
												{' ' + values.fromCurrency}
											</Typography>
										</Box>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}
										>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '14px',
													fontWeight: 400,
													lineHeight: '19.07px',
												}}
											>
												{constants.MISC_TEXT.TOTAL_TO_RECEIVE}
											</Typography>
											<Typography
												sx={{
													fontFamily: 'Open Sans',
													fontSize: '16px',
													fontWeight: 600,
													lineHeight: '21.79px',
													color: '#167287',
												}}
											>
												{values.toAmount} {values.toCurrency}
											</Typography>
										</Box>
									</Card>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'row',
											gap: '8rem',
											position: 'absolute',
											bottom: '8%',
										}}
									>
										<BackButton
											onClick={() => setStep(1)}
											disabled={step === 1}
											text={constants.MISC_TEXT.BACK}
										/>
										<ContinueButton
											variant="contained"
											color="primary"
											onClick={() =>
												handleAccept(
													values.fromCurrency,
													values.toCurrency,
													values.fromAmount
												)
											}
											text={constants.MISC_TEXT.EXCHANGE}
										/>
									</Box>
								</Box>
							</Box>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}

export default ExchangePage;
