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
			setUserData(data);
			setIsAuthenticated(true);
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isAuthenticated,
				userData: userData,
				login,
				logout,
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
