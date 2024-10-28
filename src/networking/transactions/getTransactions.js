import api from '../api';
import { configuration } from '../../config/configuration';

const getTransactions = async (userHeaders) => {
	try {
		const response = await api.get(configuration.BASE_URL + 'transactions', {
			headers: {
				'access-token': userHeaders['accessToken'],
				uid: userHeaders['uid'],
				expiry: userHeaders['expiry'],
				client: userHeaders['client'],
			},
		});

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

export default getTransactions;
