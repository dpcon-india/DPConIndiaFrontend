// BookingPayment.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { createBooking } from '../../../../APICalls';
import moment from 'moment';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import RazorpayIntegration from './RazorPayButton';

const BookingPayment = () => {
  const routes = all_routes;
  interface BookingData {
    service?: {
      gallery: string[];
      price: number; // Price in paise from backend
      serviceTitle: string;
      categoryId?: {
        categoryName: string;
      };
      location?: {
        address: string;
        city: string;
      };
    };
    provider?: {
      name: string;
      image: string;
    };
  }

  const [bookingData, setBookingData] = useState<BookingData>({});
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // Calculate all values in paise
  const originalPrice = bookingData?.service?.price ?? 0;
  const discount = Math.round(originalPrice * 0.10);
  const subtotal = originalPrice - discount;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  // Format paise as whole rupees without decimals
  const formatCurrency = (amount: number) => 
    `₹${amount.toLocaleString('en-IN', { useGrouping: false })}`;

  useEffect(() => {
    if (location?.state) {
      setBookingData(location.state);
    }
  }, [location]);

  const closeModal = () => setModalVisible(false);

  const createBook = async () => {
    try {
      const bookingPayload = {
        ...bookingData,
        totalAmount: totalAmount,
        gstAmount: gst,
        date: Date.now(),
      };

      const res = await createBooking(bookingPayload);

      if (res?.status !== 201) {
        setModalMessage(res?.message || 'An error occurred.');
        setModalVisible(true);
        return;
      }

      navigate('/customers/booking-done');
    } catch (error) {
      setModalMessage('Something went wrong. Please try again.');
      setModalVisible(true);
    }
  };

  return (
    <>
      <BreadCrumb title="Bookings" item1="Customer" item2="Bookings" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="step-register row">
                  <li className="activate col-md-4">
                    <div className="multi-step-icon">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/calendar-icon.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="multi-step-info">
                      <h6>Appointment</h6>
                      <p>Choose time &amp; date for the service</p>
                    </div>
                  </li>
                  <li className="active col-md-4">
                    <div className="multi-step-icon">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/wallet-icon.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="multi-step-info">
                      <h6>Payment</h6>
                      <p>Select Payment Gateway</p>
                    </div>
                  </li>
                  <li className="col-md-4">
                    <div className="multi-step-icon">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/book-done.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="multi-step-info">
                      <h6>Done</h6>
                      <p>Completion of Booking</p>
                    </div>
                  </li>
                </ul>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <div className="col-lg-8">
                    <div className="summary-box">
                      <div className="booking-info">
                        <div className="service-book">
                          <div className="service-book-img">
                            <ImageWithoutBasePath
                              src={bookingData?.service?.gallery[0]}
                              alt="img"
                            />
                          </div>
                          <div className="serv-profile">
                            <span className="badge badge-soft-primary">
                              {bookingData?.service?.categoryId?.categoryName}
                            </span>
                            <h2>{bookingData?.service?.serviceTitle}</h2>
                            <ul>
                              <li className="serv-pro">
                                <ImageWithoutBasePath
                                  src={bookingData?.provider?.image}
                                  alt="img"
                                />
                              </li>
                              <li className="service-map">
                                <i className="feather icon-map-pin" />{' '}
                                {bookingData?.service?.location?.address +
                                  ', ' +
                                  bookingData?.service?.location?.city}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <ul className="booking-date">
                        <li>
                          Original Price
                          <span>{formatCurrency(originalPrice)}</span>
                        </li>
                        <li>
                          Discount (10%)
                          <span>-{formatCurrency(discount)}</span>
                        </li>
                        <li>
                          Subtotal (Before GST)
                          <span>{formatCurrency(subtotal)}</span>
                        </li>
                        <li>
                          GST (18%)
                          <span>{formatCurrency(gst)}</span>
                        </li>
                      </ul>
                      <div className="booking-total">
                        <ul className="booking-total-list">
                          <li>
                            <span>Total</span>
                            <span className="total-cost">
                              {formatCurrency(totalAmount)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <RazorpayIntegration
                      amount={totalAmount} // Pass paise directly
                      submit={createBook}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div
          className="modal show"
          style={{ display: 'block' }}
          aria-labelledby="modalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">
                  Error
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">{modalMessage}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPayment;