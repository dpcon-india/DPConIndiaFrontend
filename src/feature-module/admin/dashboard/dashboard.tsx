import React from 'react';
import Profiles from './profiles';
import RevenueAndBookings from './RevenueAndBooking/revenueAndBookings';
import ServiceAndProvider from './serviceAndProvider';
import ContriesAndBookingStatus from './contriesAndBookingStatus';
import RecentBookings from './recentBookings';

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <div className="content">
        <Profiles />
        <RevenueAndBookings />
        <ServiceAndProvider />
        {/* <ContriesAndBookingStatus /> */}
        {/* <RecentBookings /> */}
      </div>
    </div>
  );
};

export default Dashboard;
