import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProviderHeader from './common/header';
import ProviderSidebar from './common/sidebar';
import ProvidersRoutes from './providers.routes';
import { useUser } from '../../../core/data/context/UserContext';

const Providers = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current route
  const { user }: any = useUser();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!userData || userData?.role !== 'provider') {
      setLoggedIn(false);
      return navigate('/home');
    }

    setLoggedIn(true);
  }, [user, navigate]);

  const excludedPaths = [
    '/providers/authentication/provider-signup',
    '/providers/authentication/provider-signup-payment',
    '/providers/authentication/provider-signup-subscription',
  ];

  const isExcludedPath = excludedPaths.includes(location.pathname);

  return (
    <>
      {loggedIn && !isExcludedPath && <ProviderHeader />}
      {loggedIn && !isExcludedPath && <ProviderSidebar />}
      {loggedIn && <ProvidersRoutes />}
    </>
  );
};

export default Providers;
