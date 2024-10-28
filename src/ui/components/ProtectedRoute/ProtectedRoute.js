import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import constants from '../../../config/constants';

const ProtectedRoute = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <Outlet /> : <Navigate to={constants.PAGES.LOGIN} />;
};

export default ProtectedRoute;
