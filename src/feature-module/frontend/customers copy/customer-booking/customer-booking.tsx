import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import CustomerSideBar from '../common/sidebar';
import BookingModals from '../common/bookingModals';
import { getBookingsByStaff, updateBooking } from '../../../../APICalls';
import { BookingDetails } from '../../../../GlobleType';
import moment from 'moment';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import * as Icon from 'react-feather';
import { Dropdown } from 'primereact/dropdown';
import StaffBookingStatus from './StaffBookingStatus';

const CustomerBooking: React.FC = () => {
  const routes = all_routes;
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>();
  const [id, setId] = useState<string>('');
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
  const updateBookings = () => {
    getBookings();
  };
  useEffect(() => {
    getBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const updatedBooking = await updateBooking(bookingId, 'Cancelled');
      setBookings((prevBookings) =>
        prevBookings?.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: updatedBooking.status }
            : booking,
        ),
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const updatedBooking = await updateBooking(bookingId, newStatus);
      setBookings((prevBookings) =>
        prevBookings?.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: updatedBooking.status }
            : booking,
        ),
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }
  const returnBadgeForStatus = (status: string) => {
    let element;
    switch (status) {
      case 'pending':
        element = (
          <span className="badge badge-soft-warning ms-2">Pending</span>
        );
        break;
      case 'accepted':
        element = (
          <span className="badge badge-soft-success ms-2">Accepted</span>
        );
        break;
      case 'completed':
        element = (
          <span className="badge badge-soft-success ms-2">Completed</span>
        );
        break;
      case 'canceled':
      case 'cancelled':
      case 'Cancelled':
        element = (
          <span className="badge badge-soft-danger ms-2">Canceled</span>
        );
        break;
      case 'progress':
        element = (
          <span className="badge badge-soft-info ms-2">In Progress</span>
        );
        break;
      case 'rejected':
        element = (
          <span className="badge badge-soft-danger ms-2">Rejected</span>
        );
        break;
      default:
        element = (
          <span className="badge badge-soft-secondary ms-2">Unknown</span>
        );
        break;
    }
    return element;
  };
  return (
    <>
      <BreadCrumb title="Bookings" item1="Staff" item2="Bookings" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4">
                <CustomerSideBar />
              </div>
              <div className="col-xl-9 col-lg-8">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-4">
                  <h4>Staff Booking List</h4>
                </div>
                {bookings?.map((booking) => (
                  <div
                    key={booking?._id}
                    className="card shadow-none booking-list"
                  >
                    <div className="card-body d-md-flex align-items-center justify-content-between">
                      <div className="booking-widget d-sm-flex align-items-center row-gap-3 flex-fill mb-3 mb-md-0">
                        <div className="booking-img me-sm-3 mb-3 mb-sm-0">
                          {/* <Link to={routes.bookingDetails} className="avatar">
                           
                          </Link> */}

                          <div className="avatar">
                            <ImageWithoutBasePath
                              src={booking?.service?.gallery[0] || ''}
                              alt="Service"
                            />
                          </div>
                        </div>
                        <div className="booking-det-info">
                          <h6 className="mb-3">
                            {/* <Link to={routes.bookingDetails}>
                             
                            </Link> */}
                            {booking?.serviceTitle}
                            {returnBadgeForStatus(booking?.status)}
                          </h6>
                          <ul className="booking-details">
                            <li className="d-flex align-items-center mb-2">
                              <span className="book-item">Booking Date</span>
                              <small className="me-2">: </small>
                              {moment(booking?.date).format('dd DD-MM-YYYY')}
                            </li>
                            <li className="d-flex align-items-center mb-2">
                              <span className="book-item">Amount</span>
                              <small className="me-2">: </small>
                              {`${booking?.service?.price?.toFixed(2)}`}
                              <span className="badge badge-soft-primary ms-2">
                                {booking?.paymentStatus}
                              </span>
                            </li>
                            <li className="d-flex align-items-center mb-2">
                              <span className="book-item">Location</span>
                              <small className="me-2">: </small>
                              {booking?.location ? (
                                `${booking.location.address} ${booking.location.locality} ${booking.location.pincode}`
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </li>
                            <li className="d-flex align-items-center flex-wrap">
                              <span className="book-item">Provider</span>
                              <small className="me-2">: </small>
                              <div className="user-book d-flex align-items-center flex-wrap me-2">
                                <div className="avatar avatar-xs me-2">
                                  <ImageWithoutBasePath
                                    className="avatar-img rounded-circle"
                                    alt="Provider"
                                    src={booking?.provider?.image}
                                  />
                                </div>
                                {booking?.providerName}
                              </div>
                              <p className="mb-0 me-2">
                                <i className="ti ti-point-filled fs-10 text-muted me-2" />
                                {booking?.provider?.email}
                              </p>
                              <p>
                                <i className="ti ti-point-filled fs-10 text-muted me-2" />
                                {booking?.provider?.number}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {booking?.status != 'cancelled' && (
                        <div className="text-end">
                          <StaffBookingStatus
                            bookings={booking}
                            updatedBooking={updateBookings}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="modal fade" id="delete-faq">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body pt-0">
                <div className="text-center">
                  <Icon.Trash2
                    size={45}
                    color="#f05050 "
                    className="text-danger fs-1"
                  />
                  <div className="mt-4">
                    <h4>Cancel Booking?</h4>
                    <p className="text-muted mb-0">
                      Are you sure want to Cancel this?
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn w-sm btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn w-sm btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      handleCancelBooking(id);
                    }}
                  >
                    Yes, Cancel It!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingModals />
    </>
  );
};

export default CustomerBooking;
