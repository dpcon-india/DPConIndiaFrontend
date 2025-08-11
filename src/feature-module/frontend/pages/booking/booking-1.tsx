import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'react-calendar/dist/Calendar.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { checkPincode } from '../../../../APICalls';
import { BookingDetails, IService } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Booking1 = () => {
  const routes = all_routes;
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [service, setBooking] = useState<IService>();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setBooking(location.state);
  }, []);

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };
  const formik = useFormik({
    initialValues: {
      address: '',
      locality: '',
      pincode: '',
    },
    validationSchema: Yup.object({
      address: Yup.string()
        .min(5, 'Address must be at least 5 characters long')
        .required('Address is required'),
      locality: Yup.string()
        .min(3, 'Locality must be at least 3 characters long')
        .required('Locality is required'),
      pincode: Yup.string()
        .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
        .required('Pincode is required'),
    }),
    onSubmit: async (values) => {
      const response = await checkPincode({ pincode: values.pincode });
      if (response?.status != 200) {
        setModalMessage('Sorry, your service is not available in this pincode');
        setModalVisible(true);
        return;
      }
      const user = localStorage.getItem('user');
      if (user == null || user == undefined) {
        setModalMessage('Please Login To Book and appointment');
        setModalVisible(true);
      }
      navigate('/customers/booking-payment', {
        state: {
          location: {
            address: values.address,
            locality: values?.locality,
            pincode: values.pincode,
          },
          pincode: values.pincode,
          address: values.address,
          service,
          provider: service?.providerId,
          serviceId: service?._id,
          providerId: service?.providerId?._id,
          customerId: JSON.parse(user || '{}')?._id,
        },
      });
    },
  });
  return (
    <>
      <BreadCrumb title="Bookings" item1="Customer" item2="Bookings" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              {/* Booking */}
              <div className="col-lg-12">
                {/* Booking Step */}
                <ul className="step-register row">
                  <li className="active col-md-4">
                    <div className="multi-step-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/calendar-icon.svg"
                        alt="img"
                      />
                    </div>
                    <div className="multi-step-info">
                      <h6>Appointment</h6>
                      {/* <p>Choose time &amp; date for the service</p> */}
                      <p>Enter Your Address</p>
                    </div>
                  </li>
                  <li className="col-md-4">
                    <div className="multi-step-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/wallet-icon.svg"
                        alt="img"
                      />
                    </div>
                    <div className="multi-step-info">
                      <h6>Payment</h6>
                      <p>Select Payment Gateway</p>
                    </div>
                  </li>
                  <li className="col-md-4">
                    <div className="multi-step-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/book-done.svg"
                        alt="img"
                      />
                    </div>
                    <div className="multi-step-info">
                      <h6>Done </h6>
                      <p>Completion of Booking</p>
                    </div>
                  </li>
                </ul>
                {/* /Booking Step */}
                {/* Appointment */}
                <div className="booking-service card shadow-none">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 service-img me-3">
                            {service?.gallery[0] ? (
                              <ImageWithoutBasePath
                                src={service?.gallery[0]}
                                // className="rounded-circle"
                                alt="img"
                              />
                            ) : (
                              <ImageWithBasePath
                                src="assets/img/services/service-27.jpg"
                                alt="img"
                              />
                            )}
                          </div>
                          <div className="serv-profile">
                            <span className="badge badge-soft-primary">
                              {service?.categoryId?.categoryName}
                            </span>
                            <h5 className="my-2">{service?.serviceTitle}</h5>
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md rounded-circle me-2">
                                {service?.providerId?.image ? (
                                  <ImageWithoutBasePath
                                    src={service?.providerId?.image}
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                ) : (
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-01.jpg"
                                    className="rounded-circle"
                                    alt="img"
                                  />
                                )}
                              </span>
                              <div className="serv-pro-info">
                                <h6 className="fs-14 fw-medium">
                                  {service?.providerId?.name}
                                </h6>
                                {/* <p className="serv-review">
                                  <i className="fa-solid fa-star" />{' '}
                                  <span>4.9 </span>(255 reviews)
                                </p> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <div className="provide-box d-flex align-items-center  mb-3">
                                <span className="me-2">
                                  <i className="feather icon-phone" />
                                </span>
                                <div className="provide-info">
                                  <h6 className="fs-14 fw-medium mb-1">
                                    Phone
                                  </h6>
                                  <p className="fs-14">
                                    {service?.providerId?.number}
                                  </p>
                                </div>
                              </div>
                              <div className="provide-box d-flex align-items-center mb-3">
                                <span className="me-2">
                                  <i className="feather icon-mail" />
                                </span>
                                <div className="provide-info">
                                  <h6 className="fs-14 fw-medium mb-1">
                                    Email
                                  </h6>
                                  <p className="fs-14">
                                    {service?.providerId?.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <div className="provide-box d-flex align-items-center mb-3">
                                <span className="me-2">
                                  <i className="feather icon-map-pin" />
                                </span>
                                <div className="provide-info">
                                  <h6 className="fs-14 fw-medium mb-1">
                                    Address
                                  </h6>
                                  <p className="fs-14">
                                    {' ' +
                                      service?.providerId?.location?.locality +
                                      ' ' +
                                      service?.providerId?.location?.pincode}
                                  </p>
                                </div>
                              </div>
                              <div className="provide-box d-flex align-items-center mb-3">
                                <span className="me-2">
                                  <i className="ti ti-wallet" />
                                </span>
                                <div className="provide-info">
                                  <h6 className="fs-14 fw-medium mb-1">
                                    Service Amount
                                  </h6>
                                  <h5 className="fs-14"> ₹{service?.price}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  className="book-form border-top border-bottom pt-4 pb-2"
                >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className={`form-control ${
                            formik.touched.address && formik.errors.address
                              ? 'is-invalid'
                              : ''
                          }`}
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.address && formik.errors.address ? (
                          <div className="invalid-feedback">
                            {formik.errors.address}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="locality" className="form-label">
                          Locality
                        </label>
                        <input
                          type="text"
                          id="locality"
                          name="locality"
                          className={`form-control ${
                            formik.touched.locality && formik.errors.locality
                              ? 'is-invalid'
                              : ''
                          }`}
                          value={formik.values.locality}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.locality && formik.errors.locality ? (
                          <div className="invalid-feedback">
                            {formik.errors.locality}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="pincode" className="form-label">
                          Pincode
                        </label>
                        <input
                          type="number"
                          id="pincode"
                          name="pincode"
                          className={`form-control ${
                            formik.touched.pincode && formik.errors.pincode
                              ? 'is-invalid'
                              : ''
                          }`}
                          value={formik.values.pincode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.pincode && formik.errors.pincode ? (
                          <div className="invalid-feedback">
                            {formik.errors.pincode}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: '#011339',
                      color: '#ffffff',
                      borderRadius: '5px',
                      padding: '10px 15px',
                    }}
                    // className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Pincode Error */}
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

export default Booking1;
