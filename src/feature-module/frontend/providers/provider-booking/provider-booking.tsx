import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BookingModals from '../../customers/common/bookingModals';

import { fetchBookingsByProvider } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { BookingDetails } from '../../../../GlobleType';
import moment from 'moment';
import StaffSelect from './staffSelect';

const ProviderBooking = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [booking, setBookings] = useState<BookingDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('newest');

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  const sortBookings = (bookings: BookingDetails[]) => {
    if (sortOrder === 'newest') {
      return bookings?.sort(
        (a: BookingDetails, b: BookingDetails) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
      );
    } else if (sortOrder === 'oldest') {
      return bookings?.sort(
        (a: BookingDetails, b: BookingDetails) =>
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime(),
      );
    }
    return bookings;
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = sortBookings(booking)?.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(booking?.length / itemsPerPage);
  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchBookingsByProvider(id);
      setBookings(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


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
          <span className="badge badge-soft-danger ms-2">Cancelled</span>
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
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-4">
              <h4>Provider Booking List</h4>
              <div className="d-flex align-items-center flex-wrap row-gap-3">
                <span className="fs-14 me-2 ">Sort</span>
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {sortOrder === 'newest' ? 'Newly Added' : 'Oldest'}
                  </Link>
                  <div className="dropdown-menu">
                    <Link
                      to="#"
                      className={`dropdown-item ${sortOrder === 'newest' ? 'active' : ''}`}
                      onClick={() => handleSortChange('newest')}
                    >
                      Newly Added
                    </Link>
                    <Link
                      to="#"
                      className={`dropdown-item ${sortOrder === 'oldest' ? 'active' : ''}`}
                      onClick={() => handleSortChange('oldest')}
                    >
                      Oldest
                    </Link>
                  </div>
                </div>

              
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xxl-12 col-lg-12">
              {currentBookings?.reverse()?.map((e, i) => (
                <div className="card shadow-none booking-list" key={i}>
                  <div className="card-body d-md-flex align-items-center">
                    <div className="booking-widget d-sm-flex align-items-center row-gap-3 flex-fill  mb-3 mb-md-0">
                      <div className="booking-img me-sm-3 mb-3 mb-sm-0">
                        <div  className="avatar">
                          <ImageWithoutBasePath
                            src={e?.service?.gallery || ''}
                            alt="User Image"
                          />
                        </div>
                        <div className="fav-item">
                        
                        </div>
                      </div>
                      <div className="booking-det-info">
                        <h6 className="mb-3">
                          <div >
                            {e?.service?.serviceTitle}
                            {returnBadgeForStatus(e?.status)}
                          </div>
                          
                        
                        </h6>
                        <ul className="booking-details">
                          <li className="d-flex align-items-center mb-2">
                            <span className="book-item">Booking Date</span>
                            <small className="me-2">: </small>
                            {moment(e?.date).format('dd DD-MM-YYYY')}
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span className="book-item">Amount</span>
                            <small className="me-2">: </small> ₹
                            {e?.service?.price}
                            <span
                              className={
                                e?.paymentStatus == 'unpaid'
                                  ? 'badge badge-soft-primary ms-2'
                                  : 'badge badge-soft-success ms-2'
                              }
                            >
                              {e?.paymentStatus}
                            </span>
                          </li>
                          <li className="d-flex align-items-center mb-2">
                            <span className="book-item">Location</span>
                            <small className="me-2">: </small>
                            {e?.service?.location?.city}
                            {', ' + e?.service?.location?.locality}
                            {', ' + e?.service?.location?.pincode}
                          </li>
                          <li className="d-flex align-items-center flex-wrap">
                            <span className="book-item">Customer</span>
                            <small className="me-2">: </small>
                            <div className="user-book d-flex align-items-center flex-wrap me-2">
                              <div className="avatar avatar-xs me-2">
                                <ImageWithoutBasePath
                                  className="avatar-img rounded-circle"
                                  alt="User Image"
                                  src={e?.customer?.image || ''}
                                />
                              </div>
                              {e?.customer?.name}
                            </div>
                            <p className="mb-0 me-2">
                              <i className="ti ti-point-filled fs-10 text-muted me-2" />
                              {e?.customer?.email}
                            </p>
                            <p>
                              <i className="ti ti-point-filled fs-10 text-muted me-2" />
                              {e?.customer?.number}
                            </p>
                          </li>
                          <li className="d-flex align-items-center flex-wrap">
                            <span className="book-item">Staff</span>
                            <small className="me-2">: </small>
                            <div className="user-book d-flex align-items-center flex-wrap me-2">
                              <div className="avatar avatar-xs me-2">
                                <ImageWithoutBasePath
                                  className="avatar-img rounded-circle"
                                  alt="staff image"
                                  src={e?.acceptedBy?.image}
                                />
                              </div>
                              {e?.acceptedBy?.name}
                            </div>
                            <p className="mb-0 me-2">
                              <i className="ti ti-point-filled fs-10 text-muted me-2" />
                              {e?.acceptedBy?.email}
                            </p>
                            <p>
                              <i className="ti ti-point-filled fs-10 text-muted me-2" />
                              {e?.acceptedBy?.number}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {(e?.status == 'pending' || e?.status == 'rejected') && (
                      <div>
                       
                        <StaffSelect staff={e?.staff[0]} bookId={e?._id} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination mt-3">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${
                    currentPage === index + 1 ? 'btn-primary' : 'btn-light'
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Add Booking */}

      {/* /Add Booking */}
      {/* /Page Wrapper */}
      <BookingModals />
    </>
  );
};

export default ProviderBooking;
