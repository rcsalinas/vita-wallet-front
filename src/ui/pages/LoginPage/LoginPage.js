import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import amico from '../../../assets/images/amico.png';
import constants from '../../../config/constants';
import TitleTypography from '../../components/TitleComponent/TitleTypography';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { styled, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Caption1 from '../../components/Caption1/Caption1';
import check from '../../../assets/icons/check.svg';
import FilledButton from '../../components/FilledButton/FilledButton';
import Swal from 'sweetalert2';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string().required('Required'),
});

const StyledTextField = styled(TextField)({
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: 'gray',
			borderRadius: '6px',
			padding: '16px',
			marginTop: '4px',
		},
	},
});

function LoginPage() {
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = async (values) => {
		try {
			await login(values.email, values.password);
		} catch (error) {
			Swal.fire({
				title: 'Error!',
				text: error.message,
				icon: 'error',
				confirmButtonText: 'Entendido',
			});
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '10rem 2rem 10rem 10rem',
				height: '100vh',
				width: '100vw',
			}}
		>
			<TitleTypography text={constants.MISC_TEXT.LOG_IN} />
			<Grid container spacing={2}>
				<Grid item xs={10} sm={8} md={6} lg={4}>
					<Formik
						initialValues={{ email: '', password: '' }}
						validationSchema={LoginSchema}
						onSubmit={onSubmit}
					>
						{({
							values,
							errors,
							touched,
							handleChange,
							isSubmitting,
							isValid,
						}) => (
							<Form>
								<Box
									display="flex"
									flexDirection="column"
									justifyContent={'left'}
									gap={6}
									paddingTop={10}
									sx={{
										maxWidth: '400px',
									}}
								>
									<Box
										sx={{
											maxWidth: '400px',
										}}
									>
										<Caption1 text={constants.MISC_TEXT.EMAIL_LABEL} />
										<Field
											as={StyledTextField}
											name="email"
											fullWidth
											value={values.email}
											onChange={handleChange}
											error={touched.email && Boolean(errors.email)}
											helperText={touched.email && errors.email}
											placeholder={constants.MISC_TEXT.EMAIL_PLACEHOLDER}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{Yup.string().email().isValidSync(values.email) &&
															values.email && (
																<img
																	src={check}
																	alt="check icon"
																	width={20}
																	height={20}
																	sx={{ backgroundColor: 'white' }}
																/>
															)}
													</InputAdornment>
												),
											}}
										/>
									</Box>
									<Box
										sx={{
											maxWidth: '400px',
										}}
									>
										<Caption1 text={constants.MISC_TEXT.PASSWORD_LABEL} />
										<Field
											as={StyledTextField}
											name="password"
											fullWidth
											type={showPassword ? 'text' : 'password'}
											value={values.password}
											onChange={handleChange}
											error={touched.password && Boolean(errors.password)}
											helperText={touched.password && errors.password}
											placeholder={constants.MISC_TEXT.PASSWORD_PLACEHOLDER}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={togglePasswordVisibility}
															edge="end"
														>
															{showPassword ? (
																<VisibilityOff />
															) : (
																<Visibility />
															)}
														</IconButton>
													</InputAdornment>
												),
											}}
										/>
									</Box>
									<FilledButton
										type="submit"
										fullWidth
										disabled={!isValid}
										loading={isSubmitting}
										text={constants.MISC_TEXT.LOGIN_BUTTON_TEXT}
									/>
								</Box>
							</Form>
						)}
					</Formik>
				</Grid>
				<Grid size={2}></Grid>
				<Grid size={6}>
					<Box
						component="img"
						src={amico}
						alt="Amico"
						sx={{
							display: { xs: 'none', sm: 'none', md: 'block' },
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default LoginPage;
