import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CustomerBooking from './customer-booking/customer-booking';
import LoginActivity from './settings/login-activity';
import Notification from './notification/notification';
import Booking2 from '../pages/booking/booking-2';
import Booking1 from '../pages/booking/booking-1';
import BookingDone from '../pages/booking/booking-done';
import BookingPayment from '../pages/booking/booking-payment';
import { useUser } from '../../../core/data/context/UserContext';
import StaffDashboard from './customer-dashboard/customer-dashboard';
import CustomerNotifications from './customer-notifications/customer-notifications';

const CustomersRoutes = () => {
  const all_customers_routes = [
    {
      path: '/staff-booking',
      name: 'staff-booking',
      element: <CustomerBooking />,
      route: Route,
    },
    // {
    //   path: '/staff-chat',
    //   name: 'staff-chat',
    //   element: <CustomerChat />,
    //   route: Route,
    // },
    // {
    //   path: '/staff-booking-calendar',
    //   name: 'staff-booking-calendar',
    //   element: <CustomerBookingCalendar />,
    //   route: Route,
    // },
    {
      path: '/staff-dashboard',
      name: 'staff-dashboard',
      element: <StaffDashboard />,
      route: Route,
    },
    // {
    //   path: '/staff-favourite',
    //   name: 'staff-favourite',
    //   element: <CustomerFavourite />,
    //   route: Route,
    // },
    {
      path: '/settings/notification',
      name: 'staff-notifications',
      element: <CustomerNotifications />,
      route: Route,
    },
    // {
    //   path: '/staff-reviews',
    //   name: 'staff-reviews',
    //   element: <CustomerReviews />,
    //   route: Route,
    // },
    // {
    //   path: '/staff-wallet',
    //   name: 'staff-reviews',
    //   element: <CustomerWallet />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/staff-profile',
    //   name: 'staff-profile',
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
    // {
    //   path: '/settings/login-activity',
    //   name: 'login-activity',
    //   element: <LoginActivity />,
    //   route: Route,
    // },

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
    // {
    //   path: '/settings/staff-security',
    //   name: 'SecuritySetting',
    //   element: <SecuritySetting />,
    //   route: Route,
    // },
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
    if (userData?.role == 'staff') {
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
