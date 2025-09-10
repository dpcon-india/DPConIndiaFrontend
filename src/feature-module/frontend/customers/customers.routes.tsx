import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CustomerBookingCalendar from './customer-booking-calendar/customer-booking-calendar';
import CustomerBooking from './customer-booking/customer-booking';
import CustomerChat from './customer-chat/customer-chat';
import CustomerDashboard from './customer-dashboard/customer-dashboard';
import CustomerFavourite from './customer-favourite/customer-favourite';
import CustomerNotifications from './customer-notifications/customer-notifications';
import CustomerProfile from './customer-profile/customer-profile';
import CustomerReviews from './customer-reviews/customer-reviews';
import CustomerWallet from './customer-wallet/customer-wallet';
import DeviceManagement from './settings/device-management';
import LoginActivity from './settings/login-activity';
import Notification from './notification/notification';
import SecuritySetting from './settings/security-setting';
import CustomerConnectedApp from './settings/connectedApp';
import Booking2 from '../pages/booking/booking-2';
import Booking1 from '../pages/booking/booking-1';
import BookingDone from '../pages/booking/booking-done';
import BookingPayment from '../pages/booking/booking-payment';
import { useUser } from '../../../core/data/context/UserContext';

const CustomersRoutes = () => {
  const all_customers_routes = [
    {
      path: '/customer-booking',
      name: 'customer-booking',
      element: <CustomerBooking />,
      route: Route,
    },
    // {
    //   path: '/customer-chat',
    //   name: 'customer-chat',
    //   element: <CustomerChat />,
    //   route: Route,
    // },
    // {
    //   path: '/customer-booking-calendar',
    //   name: 'customer-booking-calendar',
    //   element: <CustomerBookingCalendar />,
    //   route: Route,
    // },
    {
      path: '/customer-dashboard',
      name: 'customer-dashboard',
      element: <CustomerDashboard />,
      route: Route,
    },
    // {
    //   path: '/customer-favourite',
    //   name: 'customer-favourite',
    //   element: <CustomerFavourite />,
    //   route: Route,
    // },
    {
      path: '/settings/notification',
      name: 'customer-notifications',
      element: <CustomerNotifications />,
      route: Route,
    },
    // {
    //   path: '/customer-reviews',
    //   name: 'customer-reviews',
    //   element: <CustomerReviews />,
    //   route: Route,
    // },
    // {
    //   path: '/customer-wallet',
    //   name: 'customer-reviews',
    //   element: <CustomerWallet />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/customer-profile',
    //   name: 'customer-profile',
    //   element: <CustomerProfile />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/connected-apps',
    //   name: 'Connected App',
    //   element: <CustomerConnectedApp />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/device-management',
    //   name: 'device-management',
    //   element: <DeviceManagement />,
    //   route: Route,
    // },
    {
      path: '/settings/login-activity',
      name: 'login-activity',
      element: <LoginActivity />,
      route: Route,
    },

    {
      path: '/user-bookings',
      name: 'booking-2',
      element: <Booking1 />,
      route: Route,
    },

    {
      path: '/booking-done',
      name: 'booking-done',
      element: <BookingDone />,
      route: Route,
    },
    {
      path: '/booking-payment',
      name: 'booking-payment',
      element: <BookingPayment />,
      route: Route,
    },
    {
      path: '/notification',
      name: 'notification',
      element: <Notification />,
      route: Route,
    },
    {
      path: '/settings/customer-security',
      name: 'SecuritySetting',
      element: <SecuritySetting />,
      route: Route,
    },
    {
      path: '*',
      name: 'NotFound',
      element: <Navigate to="/" />,
      route: Route,
    },
  ];
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const checkAuth = () => {
      const userDataStr = localStorage.getItem('user');
      
      // If no user data in localStorage, redirect to home
      if (!userDataStr) {
        setAuthStatus('unauthenticated');
        navigate('/home');
        return;
      }

      try {
        const userData = JSON.parse(userDataStr);
        
        // If user data exists but no token, consider unauthenticated
        if (!userData?.token) {
          setAuthStatus('unauthenticated');
          localStorage.removeItem('user');
          navigate('/home');
          return;
        }

        // If we have a valid customer token, allow access
        if (userData?.role === 'customer') {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
          navigate('/home');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        setAuthStatus('unauthenticated');
        navigate('/home');
      }
    };

    // Only check auth if we're not already authenticated
    if (authStatus === 'checking') {
      checkAuth();
    }
  }, [user]);
  if (authStatus === 'checking') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will be handled by the effect)
  if (authStatus !== 'authenticated') {
    return null;
  }

  return (
    <Routes>
      {/* Add a redirect from the base /customers path to the dashboard */}
      <Route path="/" element={<Navigate to="customer-dashboard" replace />} />
      {all_customers_routes.map((route, idx) => (
        <Route key={idx} path={route.path.replace('/customers', '')} element={route.element} />
      ))}
      {/* Catch-all route for /customers/* to redirect to dashboard */}
      <Route path="*" element={<Navigate to="customer-dashboard" replace />} />
    </Routes>
  );
};

export default CustomersRoutes;
