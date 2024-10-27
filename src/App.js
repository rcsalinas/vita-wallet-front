import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './ui/pages/LoginPage/LoginPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<LoginPage />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
