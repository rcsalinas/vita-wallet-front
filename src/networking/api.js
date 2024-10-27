import axios from 'axios';
import { configuration } from '../config/configuration';

axios.defaults.baseURL = configuration.BASE_URL;
axios.defaults.timeout = configuration.TIME_OUT;

axios.defaults.headers.common = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

export default axios;
