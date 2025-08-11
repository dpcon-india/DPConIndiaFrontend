import React from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import Revenue from './Revenue';
import Bookings from './Bookings';

const RevenueAndBookings = () => {
  return (
    <div className="row">
      <Revenue />
      <Bookings />
    </div>
  );
};

export default RevenueAndBookings;
