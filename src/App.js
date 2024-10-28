import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import LoginPage from './ui/pages/LoginPage/LoginPage';
import StartPage from './ui/pages/StartPage/StartPage';
import Layout from './ui/pages/Layout/Layout';
import ExchangePage from './ui/pages/ExchangePage/ExchangePage';
import { AuthProvider } from './contexts/AuthContext';
import constants from './config/constants';
import WipPage from './ui/pages/WipPage/WipPage';
import ProtectedRoute from './ui/components/ProtectedRoute/ProtectedRoute';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path={constants.PAGES.LOGIN} element={<LoginPage />} />
					<Route element={<ProtectedRoute />}>
						<Route element={<Layout />}>
							<Route path={constants.PAGES.START} element={<StartPage />} />
							<Route
								path={constants.PAGES.EXCHANGE}
								element={<ExchangePage />}
							/>
							<Route path={constants.PAGES.HELP} element={<WipPage />} />
							<Route path={constants.PAGES.PROFILE} element={<WipPage />} />
							<Route path={constants.PAGES.HELP} element={<WipPage />} />
							<Route path={constants.PAGES.RECHARGE} element={<WipPage />} />
							<Route path={constants.PAGES.TRANSFER} element={<WipPage />} />
							<Route
								path="*"
								element={<Navigate to={constants.PAGES.START} />}
							/>
						</Route>
					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
