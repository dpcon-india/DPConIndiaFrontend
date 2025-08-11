import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../../common/dropdown/commonSelect';
import {
  cityOption,
  countryOption,
  serviceOption,
  stateOption,
  statusOption,
} from '../../../../core/data/json/dropDownData';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createStaff, deleteCustomer, updateStaff } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import * as Yup from 'yup';

const StaffModal = ({ fromParent }: any) => {
  const [image, setImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState('');
  const [data, setData] = useState(fromParent);
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);
  // Initial values for the form
  const initialValues = {
    name: '',
    email: '',
    password: '',
    number: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    // locality: '',
    status: '',
    image: '',
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Full Name is required.')
      .min(2, 'Name must be at least 2 characters long.'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required.'),
    password: Yup.string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters long.'),
    number: Yup.string()
      .required('Phone Number is required.')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits.'),
    address: Yup.string()
      .required('Address is required.')
      .min(10, 'Address must be at least 10 characters long.'),
    country: Yup.string().required('Country is required.'),
    state: Yup.string().required('State is required.'),
    city: Yup.string().required('City is required.'),
    pincode: Yup.string()
      .required('Zip Code is required.')
      .matches(/^[0-9]{6}$/, 'Zip Code must be 6 digits.'),
  });
  const EditValidationSchema = Yup.object({
    name: Yup.string()
      .required('Full Name is required.')
      .min(2, 'Name must be at least 2 characters long.'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required.'),
    number: Yup.string()
      .required('Phone Number is required.')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits.'),
    address: Yup.string()
      .required('Address is required.')
      .min(10, 'Address must be at least 10 characters long.'),
    country: Yup.string().required('Country is required.'),
    state: Yup.string().required('State is required.'),
    city: Yup.string().required('City is required.'),
    pincode: Yup.string()
      .required('Zip Code is required.')
      .matches(/^[0-9]{6}$/, 'Zip Code must be 6 digits.'),
  });
  // Submit function for the form
  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('role', 'staff');
    formData.append('name', values.name);
    formData.append('password', values.password);
    formData.append('email', values.email);
    formData.append('number', values.number);
    formData.append('location[city]', values.city);
    formData.append('location[state]', values.state);
    formData.append('location[country]', values.country);
    formData.append('location[address]', values.address);
    formData.append('location[pincode]', values.pincode);
    const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
    formData.append('providerId', id);
    if (image) formData.append('image', image);
    const res = await createStaff(formData);

    // Handle form submission (e.g., make an API call to submit the data)
  };

  const editHandler = async (values: any) => {
    const formData = new FormData();
    formData.append('role', 'staff');
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('number', values.number);
    formData.append('location[city]', values.city);
    formData.append('location[state]', values.state);
    formData.append('location[country]', values.country);
    formData.append('location[address]', values.address);
    formData.append('location[pincode]', values.pincode);
    if (image) formData.append('image', image);
    const res = await updateStaff(formData, data?._id);
    if (res?.status == 200) alert('staff updated successfully');
  };
  return (
    <>
      {/* Add Staff */}
      <div className="modal fade custom-modal" id="add-staff">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content doctor-profile">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Add Staff </h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body pb-0">
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <div className="d-flex profile-upload align-items-center">
                            <span
                              className="d-flex justify-content-center align-items-center p-1 bg-light rounded me-2"
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                              }}
                            >
                              {imagePreview ? (
                                <ImageWithoutBasePath
                                  src={imagePreview}
                                  alt="img"
                                />
                              ) : (
                                <ImageWithBasePath
                                  src={'assets/admin/img/customer/user-01.jpg'}
                                  alt="img"
                                />
                              )}
                            </span>
                            {/* <div>
                              <h6 className="fs-16">Profile</h6>
                              <span className="fs-14">
                                Image size does not exceed 5MB
                              </span>
                            </div>{' '} */}
                            <div className="profile-upload-content">
                              <div className="profile-upload-btn">
                                <div className="profile-upload-file">
                                  <input
                                    type="file"
                                    id="imgInp"
                                    onChange={(e) => {
                                      if (!e?.currentTarget?.files) return;
                                      const file = e?.currentTarget?.files[0];
                                      if (file) {
                                        const previewUrl =
                                          URL.createObjectURL(file);
                                        setImagePreview(previewUrl);
                                        setImage(file);
                                      }
                                    }}
                                  />
                                </div>
                                <Link
                                  to="#"
                                  className="btn btn-remove"
                                  onClick={() => {
                                    setImagePreview('');
                                    setImage(null);
                                  }}
                                >
                                  Remove
                                </Link>
                              </div>
                              {/* <div className="profile-upload-para">
                                <p>
                                  * Recommends a minimum size of 320 x 320
                                  pixels. Allowed files .png and .jpg.
                                </p>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <Field
                            type="text"
                            name="name"
                            className="form-control pass-input"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <Field
                            type="email"
                            name="email"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <Field
                            type="number"
                            name="number"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="number"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">password</label>
                          <Field
                            type="password"
                            name="password"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <Field
                            type="text"
                            name="address"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <Field
                            type="text"
                            name="country"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State</label>
                          <Field
                            type="text"
                            name="state"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <Field
                            type="text"
                            name="city"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Locality</label>
                          <Field
                            type="text"
                            name="locality"
                            className="form-control pass-input"
                          />
                        </div>
                      </div> */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Zip Code</label>
                          <Field
                            type="text"
                            name="pincode"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="pincode"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="d-flex justify-content-end align-items-center">
                        <Link
                          to="#"
                          className="btn btn-light me-2"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-dark">
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Staff */}

      {/* Edit Staff (same as Add Staff with default values) */}
      <div className="modal fade custom-modal" id="edit-staff">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content doctor-profile">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Edit Staff </h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body pb-0">
              <Formik
                initialValues={{
                  name: data?.name,
                  email: data?.email,
                  number: data?.number,
                  address: data?.location?.address,
                  country: data?.location?.country,
                  state: data?.location?.state,
                  city: data?.location?.city,
                  pincode: data?.location?.pincode,
                  status: '',
                  image: data?.nameimage,
                }}
                enableReinitialize
                onSubmit={editHandler}
                validationSchema={EditValidationSchema}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <div className="d-flex profile-upload align-items-center">
                            <span
                              className="d-flex justify-content-center align-items-center p-1 bg-light rounded me-2"
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                              }}
                            >
                              <ImageWithoutBasePath
                                src={imagePreview || data?.image}
                                alt="img"
                              />
                            </span>
                            {/* <div>
                            <h6 className="fs-16">Profile</h6>
                            <span className="fs-14">
                              Image size does not exceed 5MB
                            </span>
                          </div>{' '} */}
                            <div className="profile-upload-content">
                              <div className="profile-upload-btn">
                                <div className="profile-upload-file">
                                  <input
                                    type="file"
                                    id="imgInp"
                                    onChange={(e) => {
                                      if (!e?.currentTarget?.files) return;
                                      const file = e?.currentTarget?.files[0];
                                      if (file) {
                                        const previewUrl =
                                          URL.createObjectURL(file);
                                        setImagePreview(previewUrl);
                                        setImage(file);
                                      }
                                    }}
                                  />
                                </div>
                                <Link
                                  to="#"
                                  className="btn btn-remove"
                                  onClick={() => {
                                    setImagePreview('');
                                    setImage(null);
                                  }}
                                >
                                  Remove
                                </Link>
                              </div>
                              {/* <div className="profile-upload-para">
                              <p>
                                * Recommends a minimum size of 320 x 320
                                pixels. Allowed files .png and .jpg.
                              </p>
                            </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <Field
                            type="text"
                            name="name"
                            className="form-control pass-input"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <Field
                            type="email"
                            name="email"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <Field
                            type="number"
                            name="number"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="number"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <Field
                            type="text"
                            name="address"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <Field
                            type="text"
                            name="country"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State</label>
                          <Field
                            type="text"
                            name="state"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <Field
                            type="text"
                            name="city"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Locality</label>
                        <Field
                          type="text"
                          name="locality"
                          className="form-control pass-input"
                        />
                      </div>
                    </div> */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Zip Code</label>
                          <Field
                            type="text"
                            name="pincode"
                            className="form-control pass-input"
                          />{' '}
                          <ErrorMessage
                            name="pincode"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="d-flex justify-content-end align-items-center">
                        <Link
                          to="#"
                          className="btn btn-light me-2"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-dark">
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Staff */}

      <div className="modal fade custom-modal" id="del-staff">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Delete Staff</h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body">
              <div className="write-review">
                <form>
                  <p>Are you sure want to delete this Staff?</p>
                  <div className="modal-submit text-end">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-dark"
                      onClick={() => deleteCustomer()}
                    >
                      Yes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffModal;
