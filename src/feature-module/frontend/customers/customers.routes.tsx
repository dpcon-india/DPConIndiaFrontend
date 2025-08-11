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
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { user }: any = useUser();
  useEffect(() => {
    // Check if user is logged in

    if (
      localStorage.getItem('user') == null ||
      localStorage.getItem('user') == undefined
    ) {
      setLoggedIn(false);
      return navigate('/home');
    }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData?.role == 'customer') {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      navigate('/home');
    }
  }, [user]);
  return (
    <>
      <Routes>
        {loggedIn && (
          <Route>
            {all_customers_routes.map((route, idx) => (
              <Route path={route.path} element={route.element} key={idx} />
            ))}
          </Route>
        )}
      </Routes>
    </>
  );
};

export default CustomersRoutes;
