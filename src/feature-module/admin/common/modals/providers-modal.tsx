import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { createCustomer, updateCustomer } from '../../../../APICalls';
import * as Yup from 'yup';

const ProviderModel = ({ fromParent, updateCus }: any) => {
  type Provider = {
    _id: string;
    id?: number;
    number?: number;
    email: string;
    image: string;
    name: string;
    isVerified: boolean;
    createdAt: Date;
    password: string;
    role: string;
    date?: string;
  };
  const addRef: any = useRef();
  const editRef: any = useRef();
  const [data, setData] = useState<Provider>(fromParent);
  const [imagePreview, setImagePreview] = useState('');
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);

  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };

  const submitHandler = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    formData.append('role', 'provider');

    try {
      const newCustomer = await createCustomer(formData);
      if (newCustomer?.status == 200) {
        alert(newCustomer?.message);
        if (addRef.current) {
          closeModal('');
          addRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
        updateCus();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    try {
      const update = await updateCustomer(formData, data?._id);
      if (update?.status == 200) {
        alert(update?.message);
        updateCus();
        if (editRef.current) {
          closeModal('');
          editRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    number: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters')
      .required('Password is required'),
    image: Yup.mixed().nullable().required('Image is required'),
    isVerified: Yup.boolean(),
  });
  const EditvalidationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    number: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    image: Yup.mixed().nullable().required('Image is required'),
    isVerified: Yup.boolean(),
  });
  return (
    <>
      {/* Add Provider */}
      <div className="modal fade" id="add-provider">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Provider</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom"></Icon.X>
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  number: '',
                  isVerified: false,
                  password: '',
                  image: '',
                }}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <div className="profile-upload mb-3">
                      <div className="profile-upload-img">
                        {values.image && typeof values.image !== 'string' ? (
                          <ImageWithoutBasePath
                            src={URL.createObjectURL(values.image)}
                            alt="img"
                            id="blah"
                          />
                        ) : (
                          <ImageWithBasePath
                            src="assets/admin/img/customer/user-01.jpg"
                            alt="img"
                            id="blah"
                          />
                        )}
                      </div>
                      <div className="profile-upload-content">
                        <div className="profile-upload-btn">
                          <input
                            type="file"
                            id="image"
                            onChange={(event) => {
                              if (!event.target.files) return;
                              setFieldValue('image', event.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                      {errors.image && touched.image && (
                        <div className="text-danger">{errors.image}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <Field name="name" type="text" className="form-control" />
                      {errors.name && touched.name && (
                        <div className="text-danger">{errors.name}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <Field
                        name="email"
                        type="text"
                        className="form-control"
                      />
                      {errors.email && touched.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <Field
                        name="number"
                        type="text"
                        className="form-control"
                      />
                      {errors.number && touched.number && (
                        <div className="text-danger">{errors.number}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                      />
                      {errors.password && touched.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </div>
                    <div className="form-groupheads d-flex justify-content-between mb-4">
                      <h2>Is Verified?</h2>
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
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        ref={addRef}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Provider */}

      {/* Edit Provider */}
      <div className="modal fade" id="edit-provider">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Provider</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom"></Icon.X>
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={{
                  name: data?.name || '',
                  email: data?.email || '',
                  number: data?.number || '',
                  isVerified: data?.isVerified || false,
                  image: data?.image || '',
                }}
                enableReinitialize
                onSubmit={editHandler}
                validationSchema={EditvalidationSchema}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    {/* Profile image and upload section */}
                    <div className="profile-upload mb-3">
                      <div className="profile-upload-img">
                        <ImageWithoutBasePath
                          src={values.image || imagePreview}
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
                              const file = event?.currentTarget?.files[0];
                              const previewUrl = URL.createObjectURL(file);
                              setImagePreview(previewUrl);
                              setFieldValue(
                                'image',
                                event.currentTarget.files[0],
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <Field name="name" type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <Field
                        name="email"
                        type="text"
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
                    {/* <div className="mb-3">
                      <label className="form-label">Password</label>
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                      />
                    </div> */}
                    <div className="form-groupheads d-flex justify-content-between mb-4">
                      <h2>Is Verified?</h2>
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
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        ref={editRef}
                      >
                        Edit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Provider */}
    </>
  );
};

export default ProviderModel;
