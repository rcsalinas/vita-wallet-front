import api from '../api';
import { configuration } from '../../config/configuration';

const exchange = async (
	userHeaders,
	currencySent,
	currencyReceived,
	amount
) => {
	try {
		const response = await api.post(
			configuration.BASE_URL + 'transactions/exchange',
			{
				currency_sent: currencySent,
				currency_received: currencyReceived,
				amount_sent: amount,
			},
			{
				headers: {
					'access-token': userHeaders['accessToken'],
					uid: userHeaders['uid'],
					expiry: userHeaders['expiry'],
					client: userHeaders['client'],
				},
			}
		);

		const { data } = response;

		return data;
	} catch (error) {
		const errorObject = {
			message: error.response?.data?.message || 'An unknown error occurred',
			statusCode: error.response?.status || 500,
			rawError: error,
		};

		throw errorObject;
	}
};

export default exchange;
