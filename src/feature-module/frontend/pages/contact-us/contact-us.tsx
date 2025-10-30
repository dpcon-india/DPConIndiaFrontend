import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { Dropdown } from 'primereact/dropdown';
import { createContactUs, fetchServices } from '../../../../APICalls';
import { IService } from '../../../../GlobleType';
import AuthModals from '../../home/new-home/authModals';

const ContactUs = () => {
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [services, setServices] = useState<IService[]>([]);
  const fetchData = async () => {
    try {
      const fetchServ = await fetchServices();
      setServices(fetchServ);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const value2 = [
    { name: 'Select Service' },
    { name: 'Car Repair' },
    { name: 'House Cleaning' },
    { name: 'Interior Designing' },
  ];

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    ServiceId: null,
    message: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .max(10, "Phone number can't be more than 10 digits")
      .required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });
  type ContactUs = {
    name: string;
    email: string;
    phone: string;
    message: string;
    ServiceId?: string | null;
  };
  const onSubmit = async (values: ContactUs) => {
    // handle form submission
    try {
      const sendData = await createContactUs(values);
      alert('Enquiry Submitted Successfully');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <BreadCrumb title="Contact Us" item1="Home" item2="Contact Us" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="contacts">
              <div className="contacts-overlay-img d-none d-lg-block">
                <ImageWithBasePath
                  src="assets/img/bg/bg-07.png"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="contacts-overlay-sm d-none d-lg-block">
                <ImageWithBasePath
                  src="assets/img/bg/bg-08.png"
                  alt="img"
                  className="img-fluid"
                />
              </div>

              {/* Contact Details */}
              <div className="contact-details">
                <div className="row justify-content-center">
                  {/* Contact information cards */}
                  <div className="col-md-6 col-lg-4 d-flex">
                    <div className="card flex-fill">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <span className="rounded-circle">
                            <i className="ti ti-phone text-dark-blue" />
                          </span>
                          <div>
                            <h6 className="fs-18 mb-1">Phone Number</h6>
                            <p className="fs-14">(+91)-9833133366</p>
                            <p className="fs-14">(+91)-9082992844</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 d-flex">
                    <div className="card flex-fill">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <span className="rounded-circle">
                            <i className="ti ti-mail text-dark-blue" />
                          </span>
                          <div>
                            <h6 className="fs-18 mb-1">Email Address</h6>
                            <p className="fs-14">dpconindia@gmail.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* More cards can go here */}
                </div>
              </div>
              {/* /Contact Details */}

              {/* Get In Touch */}
              <div className="row justify-content-center">
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <div className="contact-queries flex-fill">
                    <h2>Get In Touch</h2>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <div className="row">
                            <div className="col-md-12 mb-3">
                              <Field
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 mb-3">
                              <Field
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Your Email Address"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 mb-3">
                              <Field
                                className="form-control"
                                type="text"
                                name="phone"
                                placeholder="Your Phone Number"
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 mb-3">
                              <Dropdown
                                value={selectedValue2}
                                onChange={(e) => {
                                  setSelectedValue2(e.value);
                                  setFieldValue('ServiceId', e.value?._id);
                                }}
                                options={services}
                                optionLabel="serviceTitle"
                                placeholder="Select Service"
                                className="select w-100"
                              />
                              <ErrorMessage
                                name="service"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 mb-3">
                              <Field
                                as="textarea"
                                className="form-control"
                                name="message"
                                placeholder="Type Message"
                              />
                              <ErrorMessage
                                name="message"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 submit-btn">
                              <button
                                className="btn btn-dark d-flex align-items-center"
                                type="submit"
                              >
                                Send Message
                                <i className="feather icon-arrow-right-circle ms-2" />
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
              {/* /Get In Touch */}
            </div>
          </div>
        </div>
      </div>
      <AuthModals />
    </>
  );
};

export default ContactUs;
