import { createContext, useState, useContext } from 'react';
import loginUser from '../networking/auth/loginUser';

export const AuthContext = createContext({
	isLoggedIn: false,
	userData: {},
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userData, setUserData] = useState({});

	const login = async (email, password) => {
		try {
			const data = await loginUser(email, password);
			setUserData({
				accessToken: data.headers['access-token'],
				uid: data.headers['uid'],
				expiry: data.headers['expiry'],
				client: data.headers['client'],
				name: data.data?.data?.attributes?.first_name,
				balances: {
					clp: data.data?.data?.attributes?.balances?.clp,
					usdt: data.data?.data?.attributes?.balances?.usdt,
					btc: data.data?.data?.attributes?.balances?.btc,
				},
			});
			setIsAuthenticated(true);
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
	};

	const setBalances = (clp, usdt, btc) => {
		setUserData({
			...userData,
			balances: {
				clp: clp,
				usdt: usdt,
				btc: btc,
			},
		});
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isAuthenticated,
				userData: userData,
				login,
				logout,
				setBalances,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};
