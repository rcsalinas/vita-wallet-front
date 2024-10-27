import api from '../api';
import { configuration } from '../../config/configuration';

const loginUser = async (email, password) => {
	try {
		const response = await api.post(configuration.BASE_URL + 'auth/sign_in', {
			email,
			password,
			dev_mode: true,
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

export default loginUser;
