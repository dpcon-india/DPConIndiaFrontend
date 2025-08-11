import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import CustomerSideBar from '../common/sidebar';
import { all_routes } from '../../../../core/data/routes/all_routes';
import {
  getBookingsByCustomer,
  getBookingsByStaff,
} from '../../../../APICalls';
import { BookingDetails } from '../../../../GlobleType';

const StaffDashboard = () => {
  const routes = all_routes;

  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const id = JSON.parse(localStorage.getItem('user') || '{}')._id;
        const response = await getBookingsByStaff(id);
        setBookings(response);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  const totalOrders = bookings?.length;
  const totalSpend = bookings?.reduce((total, booking) => {
    const price = booking?.service?.price || 0;
    return total + price;
  }, 0);

  return (
    <>
      <BreadCrumb title="Dashboard" item1="Staff" item2="Dashboard" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4">
                <CustomerSideBar />
              </div>
              <div className="col-xl-9 col-lg-8">
                <h4 className="mb-3">Dashboard</h4>
                <div className="row mb-4">
                  {/* Total Orders Card */}
                  <div className="col-xxl-3 col-md-6">
                    <div className="card dash-widget shadow-sm rounded">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="dash-icon bg-primary-transparent d-flex justify-content-center align-items-center rounded-circle p-3">
                              <i className="ti ti-shopping-cart text-dark-blue" />
                            </span>
                            <div className="ms-2">
                              <span className="fs-14 text-muted">
                                Total Orders
                              </span>
                              <h5 className="mb-0">
                                <span className="counter">
                                  <CountUp end={totalOrders} duration={2} />
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Spend Card */}
                  {/* <div className="col-xxl-3 col-md-6">
                    <div className="card dash-widget shadow-sm rounded">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="dash-icon bg-secondary-transparent d-flex justify-content-center align-items-center rounded-circle p-3">
                              <i className="ti ti-wallet text-secondary" />
                            </span>
                            <div className="ms-2">
                              <span className="fs-14 text-muted">
                                Total Spend
                              </span>
                              <h5 className="mb-0">
                                ${' '}
                                <span className="counter">
                                  <CountUp end={totalSpend} duration={2} />
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Recent Bookings Table */}
                <div className="row">
                  <div className="col-xxl-7 col-lg-7 d-flex">
                    <div className="w-100">
                      <h5 className="mb-3">Recent Bookings</h5>
                      <div className="table-responsive">
                        <table className="table table-bordered table-striped mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Service</th>
                              <th>Status</th>
                              <th>Price</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  Loading...
                                </td>
                              </tr>
                            ) : bookings?.length > 0 ? (
                              bookings?.map((booking) => (
                                <tr key={booking?._id}>
                                  <td>{booking?.serviceTitle}</td>
                                  <td>{booking?.status}</td>
                                  <td>${booking?.service?.price}</td>
                                  <td>
                                    {new Date(
                                      booking?.date,
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  No Bookings Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
