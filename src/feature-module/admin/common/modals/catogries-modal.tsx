import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import axios from 'axios';
import { api, formDataHeader } from '../../../../config';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Category } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
declare global {
  interface Window {
    bootstrap: any;
  }
}

const CatogriesModal = ({ fromParent, updateCus }: Category | any) => {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState(fromParent);
  const addRef: any = useRef();
  const editRef: any = useRef();
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);
  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const initialValues = {
    name: '',
    slug: '',
    isFeatured: false,
    image: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
    slug: Yup.string().required('Category slug is required'),
    isFeatured: Yup.boolean(),
  });
  const editInitialValues = {
    name: data?.categoryName || '',
    slug: data?.categorySlug || '',
    isFeatured: data?.isFeatured || false,
    image: data?.image || '',
  };
  const submitHandler = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('categoryName', values.name);
      formData.append('categorySlug', values.slug);
      formData.append('isFeatured', values.isFeatured.toString());
      if (values.image) {
        formData.append('image', values.image); // Append the image file to formData
      }
      const res = await axios.post(`${api}category`, formData, formDataHeader);
      if (res?.status == 201) {
        alert(res?.data?.message);
        if (addRef.current) {
          closeModal('add-category');
          addRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
        updateCus();
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function editHandler(values: any) {
    try {
      const formData = new FormData();
      formData.append('categoryName', values.name);
      formData.append('categorySlug', values.slug);
      formData.append('isFeatured', values.isFeatured.toString());
      if (values.image) {
        formData.append('image', values.image); // Append the image file to formData
      }
      const res = await axios.put(
        `${api}category/${data?._id}`,
        formData,
        formDataHeader,
      );
      if (res?.status == 200) {
        alert(res?.data?.message);
        editRef.current.setAttribute('data-bs-dismiss', 'modal');
        updateCus();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* Add Category */}
      <div className="modal fade" id="add-category">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Category</h5>
              <button
                type="button"
                className="btn-close close-modal"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <Icon.X className="react-feather-custom" />
              </button>
            </div>
            <div className="modal-body pt-0">
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={submitHandler}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label me-1">SEO Title</label>
                      <small className="form-text text-muted">
                        (Ex: test-slug)
                      </small>
                      <Field type="text" name="slug" className="form-control" />
                      <ErrorMessage
                        name="slug"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Image</label>
                      <div className="form-uploads">
                        <div className="form-uploads-path">
                          <ImageWithoutBasePath src={values.image} alt="img" />
                          <div className="file-browse">
                            <h6>Drag &amp; drop image or </h6>
                            <div className="file-browse-path">
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e?.currentTarget.files)
                                    setFieldValue(
                                      'image',
                                      e.currentTarget.files[0],
                                    );
                                }}
                              />
                              <Link to="#"> Browse</Link>
                            </div>
                          </div>
                          <h5>Supported formats: JPEG, PNG</h5>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Is Featured?</label>
                      <ul className="custom-radiosbtn">
                        <li>
                          <label className="radiossets">
                            Yes
                            <input
                              type="radio"
                              name="radio"
                              onChange={(e) => {
                                setFieldValue('isFeatured', true);
                              }}
                            />
                            <span className="checkmark-radio" />
                          </label>
                        </li>
                        <li>
                          <label className="radiossets">
                            No
                            <input
                              type="radio"
                              name="radio"
                              onChange={(e) => {
                                setFieldValue('isFeatured', false);
                              }}
                            />
                            <span className="checkmark-radio" />
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div className="text-end">
                      <Link
                        to="#"
                        type="button"
                        className="btn btn-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
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
      {/* /Add Category */}

      {/* Edit Category */}
      <div className="modal fade" id="edit-category">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Category</h5>
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
                initialValues={editInitialValues}
                validationSchema={validationSchema}
                onSubmit={editHandler}
                enableReinitialize
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label me-1">SEO Title</label>
                      <small className="form-text text-muted">
                        (Ex: test-slug)
                      </small>
                      <Field type="text" name="slug" className="form-control" />
                      <ErrorMessage
                        name="slug"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Image</label>
                      <div className="form-uploads">
                        <div className="form-uploads-path">
                          <ImageWithoutBasePath src={data?.image} alt="img" />
                          <div className="file-browse">
                            <h6>Drag &amp; drop image or </h6>
                            <div className="file-browse-path">
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e?.currentTarget.files)
                                    setFieldValue(
                                      'image',
                                      e.currentTarget.files[0],
                                    );
                                }}
                              />
                              <Link to="#"> Browse</Link>
                            </div>
                          </div>
                          <h5>Supported formats: JPEG, PNG</h5>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Is Featured?</label>
                      <ul className="custom-radiosbtn">
                        <li>
                          <label className="radiossets">
                            Yes
                            <input
                              type="radio"
                              name="radio"
                              checked={values.isFeatured ? true : false}
                              onChange={(e) => {
                                setFieldValue('isFeatured', true);
                              }}
                            />
                            <span className="checkmark-radio" />
                          </label>
                        </li>
                        <li>
                          <label className="radiossets">
                            No
                            <input
                              type="radio"
                              checked={values.isFeatured ? false : true}
                              name="radio"
                              onChange={(e) => {
                                setFieldValue('isFeatured', false);
                              }}
                            />
                            <span className="checkmark-radio" />
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div className="text-end">
                      <Link
                        to="#"
                        type="button"
                        className="btn btn-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        ref={editRef}
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
      {/* /Edit Category */}
    </>
  );
};

export default CatogriesModal;
