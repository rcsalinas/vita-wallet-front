import api from '../api';
import { configuration } from '../../config/configuration';
import qs from 'qs';

const loginUser = async (email, password) => {
	try {
		const response = await api.post(
			configuration.BASE_URL + 'auth/sign_in',
			qs.stringify({
				email,
				password,
				dev_mode: true,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		const { data, headers } = response;

		return { data, headers };
	} catch (error) {
		const errorObject = {
			message: error.response?.data?.message || 'An unknown error occurred',
			statusCode: error.response?.status || 500,
			rawError: error,
		};

		throw errorObject;
	}
};

export default loginUser;
