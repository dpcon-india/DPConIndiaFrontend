import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import axios from 'axios';
import { api, formDataHeader } from '../../../../config';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchCategories } from '../../../../APICalls';

declare global {
  interface Window {
    bootstrap: any;
  }
}
const SubCatogriesModal = ({ fromParent, updateCus }: any) => {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [categoryList, setCategoryList] = useState<any>([]);
  const addRef: any = useRef();
  const editRef: any = useRef();
  const [data, setData] = useState(fromParent);
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);
  const fetchCat = async () => {
    try {
      const categories = await fetchCategories();
      setCategoryList(categories);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCat();
  }, []);
  const initialValues = {
    name: '',
    slug: '',
    isFeatured: false,
    categoryId: '',
  };
  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  type Category = {
    _id: string;
    id?: number;
    categoryName: string;
    categorySlug: string;
    isFeatured: boolean;
    createdAt: Date;
    date?: string;
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
    slug: Yup.string().required('Category slug is required'),
    isFeatured: Yup.boolean(),
    categoryId: Yup.string().required('Category slug is required'),
  });
  const editInitialValues = {
    name: data?.SubcategoryName || '',
    slug: data?.SubcategorySlug || '',
    isFeatured: data?.isFeatured || false,
    categoryId: data?.categoryId || '',
    image: data?.image || '',
  };
  const submitHandler = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('SubcategoryName', values.name);
      formData.append('SubcategorySlug', values.slug);
      formData.append('isFeatured', values.isFeatured.toString());
      formData.append('categoryId', values.categoryId);
      if (values.image) {
        formData.append('image', values.image); // Append the image file to formData
      }
      const res = await axios.post(
        `${api}subcategory`,
        formData,
        formDataHeader,
      );
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
      const id = data?._id;
      const res = await axios.put(
        `${api}updateSubcategory/${id}`,
        formData,
        formDataHeader,
      );
      if (res?.status == 200) {
        if (editRef.current) {
          closeModal('add-category');
          editRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
        alert(res?.data?.message);
        updateCus();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* Add Category */}
      <div className="modal fade" id="sub-add-category">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add SubCategory</h5>
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
                validationSchema={validationSchema}
                onSubmit={submitHandler}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="form-label">SubCategory</label>
                      <select
                        name=""
                        id=""
                        className="form-control"
                        onChange={(e: any) => {
                          setFieldValue('categoryId', e.target.value);
                        }}
                      >
                        {categoryList?.map((e: Category, i: number) => (
                          <option value={e._id} key={i}>
                            {e.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">SubCategory Name</label>
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
                      <label className="form-label">SubCategory Image</label>
                      <div className="form-uploads">
                        <div className="form-uploads-path">
                          <ImageWithBasePath
                            src="assets/img/icons/upload.svg"
                            alt="img"
                          />
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
      <div className="modal fade" id="sub-edit-category">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit SubCategory</h5>
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
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={editHandler}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="form-label">Category</label>
                      <select
                        name="categoryId"
                        id="categoryId"
                        value={values.categoryId} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setFieldValue('categoryId', e.target.value);
                        }}
                      >
                        {categoryList?.map((e: Category, i: number) => (
                          <option value={e._id} key={i}>
                            {e.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">SubCategory Name</label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label me-1">SubCategory Slug</label>
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
                      <label className="form-label">SubCategory Image</label>
                      <div className="form-uploads">
                        <div className="form-uploads-path">
                          <ImageWithBasePath
                            src="assets/img/icons/upload.svg"
                            alt="img"
                          />
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

export default SubCatogriesModal;
