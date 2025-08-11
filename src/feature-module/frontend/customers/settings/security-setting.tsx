import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import CustomerSideBar from '../common/sidebar';
import { Field, Form, Formik } from 'formik';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { getUserById, updateCustomerById } from '../../../../APICalls';
import * as Icon from 'react-feather';
import * as Yup from 'yup';
import moment from 'moment';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  number: Yup.string()
    .matches(/^\d+$/, 'Phone number must be digits only')
    .required('Phone number is required'),
});

const SecuritySetting = () => {
  const [imagePreview, setImagePreview] = useState<any>();
  const [userData, setUserData] = useState<any>(null);
  const [modalShow, setModalShow] = useState(false); // State to control modal visibility

  // Fetch data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
        if (userId) {
          const response = await getUserById(userId);
          console.log('User data fetched:', response);
          if (response?.status === 200) {
            console.log('response', response);
            // setUserData1(response.data);
            // setImagePreview1(response.data?.image);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

const editHandler = async (values: any) => {
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  try {
    const update = await updateCustomerById(formData);
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    
    if (update?.status === 200) {
      const response = await getUserById(userId);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify({ ...user, ...response }));
      
      // Check if image was updated (new file selected)
      if (values.image instanceof File) {
        window.location.reload(); // Refresh page for image updates
      } else {
        setUserData(response);    // Update state for non-image changes
        setModalShow(false);      // Close modal
      }
    }
  } catch (error) {
    console.log(error);
  }
};

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BreadCrumb title="Settings" item1="Customer" item2="Settings" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4">
                <CustomerSideBar />
              </div>
              <div className="col-xl-9 col-lg-8">
                <div className="row justify-content-center align-items-center">
                  <div className="col-xxl-4 col-md-6">
                    <div className="card dash-widget-2">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <span className="set-icon bg-light d-flex justify-content-center align-items-center rounded-circle p-1 me-2">
                            <i className="ti ti-lock text-dark fs-20" />
                          </span>
                          <div>
                            <p className="mb-0 text-gray-9 fw-medium">
                              Update Profile
                            </p>
                            <span className="fs-12 text-truncate">
                              Last Changed:{' '}
                              <span className="text-gray-9">
                                {moment(userData?.updatedAt).format(
                                  'DD MMMM YYYY',
                                )}
                              </span>
                            </span>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="btn btn-dark"
                          onClick={() => setModalShow(true)} 
                        >
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modalShow && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          onClick={() => setModalShow(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalShow(false)} // Close modal
                >
                  <Icon.X />
                </button>
              </div>
              <div className="modal-body pt-0">
                <Formik
                  initialValues={{
                    name: userData?.name || '',
                    email: userData?.email || '',
                    number: userData?.number || '',
                    isVerified: userData?.isVerified || false,
                    image: userData?.image || '',
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={editHandler}
                >
                  {({ setFieldValue, values }) => (
                    <Form>
                      <div className="profile-upload mb-3">
                        <div className="profile-upload-img">
                          <ImageWithoutBasePath
                            src={imagePreview || values.image}
                            alt="img"
                            id="blah"
                          />
                        </div>
                        <div className="profile-upload-content">
                          <div className="profile-upload-btn">
                            <input
                              type="file"
                              id="image"
                              onChange={(event) => {
                                if (!event.currentTarget.files) return;
                                const file = event.currentTarget.files[0];

                                // Generate a preview URL for the image
                                const previewUrl = URL.createObjectURL(file);
                                setImagePreview(previewUrl); // Update state for preview
                                setFieldValue('image', file); // Set file in formik values
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <Field
                          name="name"
                          type="text"
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <Field
                          name="number"
                          type="text"
                          className="form-control"
                        />
                      </div>
                      <div className="form-group d-flex justify-content-between mb-4">
                        <h2>Status</h2>
                        <label className="switch">
                          <Field
                            name="isVerified"
                            type="checkbox"
                            className="form-check-input"
                          />
                          <span className="sliders round" />
                        </label>
                      </div>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => setModalShow(false)} // Close modal
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecuritySetting;
