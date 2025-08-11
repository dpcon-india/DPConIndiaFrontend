import React, { useEffect, useState } from 'react';
import {
  fetchCategories,
  fetchStaff,
  fetchSubCategoriesByCategory,
} from '../../../../APICalls';
import { Category, faq, FAQ, IAdditionalService } from '../../../../GlobleType';
import TemplateDemo from '../../common/multi-select/multiSelect';
import { Link } from 'react-router-dom';
import DefaultEditor from 'react-simple-wysiwyg';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SetpOne = ({ setStep, updateState, data, providerId }: any) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchStaffs, setfetchStaff] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [slug, setslug] = useState('');
  const [price, setPrice] = useState('');
  const [includes, setIncludes] = useState<string[]>(data?.includes);
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [SubcategoryId, setSelectedSubCat] = useState<any>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>([]);
  const [faq, setFaq] = useState<faq[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [additionalServices, setAdditionalServices] = useState<
    IAdditionalService[]
  >(data?.additionalServices);
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setSelectedCategoryId] = useState<string | number>('');

  const handelAdd = () => {
    setAdditionalServices([
      ...additionalServices,
      { service: '', price: '', duration: '', desc: '' },
    ]);
  };
  const handleRemove = (index: number) => {
    setAdditionalServices((prevList) => prevList.filter((_, i) => i !== index));
  };
  const handelAdd2 = () => {
    setIncludes([...includes, ' ']);
  };

  const handelRemove2 = (i: string) => {
    const filter = includes.filter((e) => e != i);
    setIncludes(filter);
    formik.setFieldValue('includes', filter);
  };

  const handleChangeStaff = (arr: any) => {
    setSelectedStaff(arr);
  };
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);
  useEffect(() => {
    const loadfetchStaff = async () => {
      try {
        setLoading(true);
        const id = providerId;
        const data = await fetchStaff(id);
        setfetchStaff(data);
      } catch (err) {
        setError('Failed to load fetchStaff.');
      } finally {
        setLoading(false);
      }
    };

    loadfetchStaff();
  }, []);
  useEffect(() => {
    if (!categoryId) return;

    const loadSubCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchSubCategoriesByCategory(categoryId);
        setSubCategories(data);
      } catch (err) {
        setError('Failed to load subcategories.');
      } finally {
        setLoading(false);
      }
    };

    loadSubCategories();
  }, [categoryId]);
  const handleNext = () => {
    setStep(1 + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updatedIncludes = [...includes];
    updatedIncludes[index] = newValue;
    setIncludes(updatedIncludes);
    formik.setFieldValue('includes', updatedIncludes);
  };

  const handleAdditionalServiceChange = (
    i: number,
    key: 'service' | 'price' | 'duration' | 'desc',
    value: string,
  ) => {
    const updatedServices = [...additionalServices];

    // Ensure the object exists
    if (!updatedServices[i]) {
      updatedServices[i] = { service: '', price: '', duration: '', desc: '' };
    }

    // Update the specified property
    updatedServices[i][key] = value;

    // Update the formik field value
    formik.setFieldValue('additionalServices', updatedServices);
  };
  const validationSchema = Yup.object({
    serviceTitle: Yup.string().required('Service Title is required'),
    slug: Yup.string().required('Slug is required').min(1),
    categoryId: Yup.string().required('Category is required'),
    SubcategoryId: Yup.string().required('SubCategory is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be 0 or greater'),
    description: Yup.string().required('Desctiption Status is required'),
    staff: Yup.array()
      .required('Staff Status is required')
      .min(1, 'At least one staff is required'),
    duration: Yup.string().required('Please add the Duration'),
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      serviceTitle: data?.serviceTitle,
      slug: data?.slug,
      categoryId: data?.categoryId,
      description: data?.description,
      SubcategoryId: data?.SubcategoryId,
      staff: data?.staff,
      price: data?.price,
      additionalServices: data?.additionalServices,
      includes: data?.includes,
      active: data?.active,
      duration: data?.duration,
      categoryName: data?.categoryName,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateState(values);
      setStep(2);
    },
  });
  return (
    <fieldset id="first-field" style={{ display: 'block' }}>
      <h4 className="mb-3">Service Information</h4>
      <form
        onSubmit={(e) => {
          e?.preventDefault();
          formik.handleSubmit(e);
        }}
      >
        <div className="card">
          <div className="card-body">
            <div className="accordion" id="accordionPanelsStayOpenExample">
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingOne">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseOne"
                    aria-expanded="true"
                    aria-controls="accordion-collapseOne"
                    role="button"
                  >
                    Basic Information
                  </div>
                </div>
                <div
                  id="accordion-collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingOne"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Service Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="serviceTitle"
                            value={formik.values.serviceTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.serviceTitle &&
                          formik.errors.serviceTitle ? (
                            <div className="text-danger">
                              {String(formik.errors.serviceTitle)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Slug <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="slug"
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.slug && formik.errors.slug ? (
                            <div className="text-danger">
                              {String(formik.errors.slug)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Category <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            name="categoryId"
                            value={formik.values.categoryId}
                            onChange={(e) => {
                              const selectedOption =
                                e?.target?.options[e?.target?.selectedIndex];
                              const categoryName =
                                selectedOption.dataset.categoryName;
                              setSelectedCategoryId(e?.target?.value);
                              formik.setFieldValue(
                                'categoryName',
                                categoryName,
                              );
                              formik.setFieldValue(
                                'categoryId',
                                e?.target?.value,
                              );
                            }}
                            onBlur={formik.handleBlur}
                          >
                            <option value="" disabled>
                              Select Category
                            </option>
                            {categories?.map((category) => (
                              <option
                                key={category._id}
                                value={category._id}
                                data-category-name={category.categoryName}
                              >
                                {category.categoryName}
                              </option>
                            ))}
                          </select>

                          {formik.touched.categoryId &&
                          formik.errors.categoryId ? (
                            <div className="text-danger">
                              {String(formik.errors.categoryId)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            SubCategory <span className="text-danger">*</span>
                          </label>
                          {loading ? (
                            <p>Loading...</p>
                          ) : error ? (
                            <p className="text-danger">{error}</p>
                          ) : (
                            <select
                              className="form-select"
                              name="SubcategoryId"
                              value={formik.values.SubcategoryId}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="" disabled>
                                Select SubCategory
                              </option>
                              {subCategories?.map((subCategory) => (
                                <option
                                  key={subCategory._id}
                                  value={subCategory._id}
                                >
                                  {subCategory.SubcategoryName}
                                </option>
                              ))}
                            </select>
                          )}
                          {formik.touched.SubcategoryId &&
                          formik.errors.SubcategoryId ? (
                            <div className="text-danger">
                              {String(formik.errors.SubcategoryId)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingThree">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseThree"
                    aria-expanded="true"
                    aria-controls="accordion-collapseThree"
                    role="button"
                  >
                    Price <span className="fs-14 ms-1 text-default"></span>
                  </div>
                </div>
                <div
                  id="accordion-collapseThree"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingThree"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Price <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.price && formik.errors.price ? (
                            <div className="text-danger">
                              {String(formik.errors.price)}
                            </div>
                          ) : null}
                        </div>
                      </div>{' '}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Duration
                            <span className="text-success"> hrs</span>
                            <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="duration"
                            value={formik.values.duration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.duration && formik.errors.duration ? (
                            <div className="text-danger">
                              {String(formik.errors.duration)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingseven">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseseven"
                    aria-expanded="true"
                    aria-controls="accordion-collapseseven"
                    role="button"
                  >
                    Staffs
                    {/* <span className="fs-14 ms-1 text-default">
                      ( Can add multiple Locations )
                    </span> */}
                  </div>
                </div>
                <div
                  id="accordion-collapseseven"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingseven"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Staff <span className="text-danger"> *</span>
                          </label>
                          <TemplateDemo
                            name="staff"
                            data={fetchStaffs}
                            setStaff={(staffIds: string[]) =>
                              formik.setFieldValue('staff', staffIds)
                            }
                          />
                          {formik.touched.staff && formik.errors.staff ? (
                            <div className="text-danger">
                              {String(formik.errors.staff)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* includes */}
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingFour">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseFour"
                    aria-expanded="true"
                    aria-controls="accordion-collapseFour"
                    role="button"
                  >
                    Includes
                  </div>
                </div>
                <div
                  id="accordion-collapseFour"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingFour"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="addtitle-info">
                      {includes.map((add: any, index: any) => (
                        <div className="row" key={index}>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Title <span className="text-danger">*</span>
                              </label>
                              <div className="d-flex align-items-center">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={add}
                                  onChange={(e) =>
                                    handleInputChange(index, e?.target?.value)
                                  }
                                />
                                {includes.length > 1 ? (
                                  <button
                                    onClick={() => handelRemove2(add)}
                                    className="btn text-dark-blue d-inline-flex align-items-center text-danger delete-item ms-4"
                                  >
                                    <i className="ti ti-trash"></i>
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="#"
                      onClick={handelAdd2}
                      className="text-dark-blue d-inline-flex align-items-center add-extra fs-14 mb-3"
                    >
                      <i className="ti ti-circle-plus me-2" />
                      Add New
                    </Link>
                  </div>
                </div>
              </div>
              {/* Addittional Services*/}
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingFive">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseFive"
                    aria-expanded="true"
                    aria-controls="accordion-collapseFive"
                    role="button"
                  >
                    Add Additional Services
                  </div>
                </div>
                <div
                  id="accordion-collapseFive"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingFive"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="addservice-info">
                      {additionalServices.map((add: any, index: any) => (
                        <div className="row addservice-info-row" key={index}>
                          <div className="col-xl-4">
                            <div className="d-flex align-items-center mb-3">
                              {/* <div className="file-upload service-file-upload d-flex align-items-center justify-content-center flex-column me-4">
                                <i className="ti ti-photo" />
                                <input type="file" accept="video/image" />
                              </div> */}
                              <div className="mb-3 flex-fill">
                                <label className="form-label">
                                  Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleAdditionalServiceChange(
                                      index,
                                      'service',
                                      e?.target?.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Description
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                  handleAdditionalServiceChange(
                                    index,
                                    'desc',
                                    e?.target?.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <div className="mb-3">
                              <label className="form-label">
                                Price <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                onChange={(e) =>
                                  handleAdditionalServiceChange(
                                    index,
                                    'price',
                                    e?.target?.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <div className="mb-3">
                              <label className="form-label">
                                Duration <span className="text-danger">*</span>
                              </label>
                              <div className="d-flex align-items-center">
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleAdditionalServiceChange(
                                      index,
                                      'duration',
                                      e?.target?.value,
                                    )
                                  }
                                />
                                {additionalServices.length > 1 ? (
                                  <button
                                    onClick={() => handleRemove(index)}
                                    className="btn text-dark-blue d-inline-flex align-items-center text-danger delete-item ms-4"
                                  >
                                    <i className="ti ti-trash"></i>
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="#"
                      onClick={handelAdd}
                      className="text-dark-blue d-inline-flex align-items-center fs-14 add-extra2 mb-3"
                    >
                      <i className="ti ti-circle-plus me-2" />
                      Add New
                    </Link>
                  </div>
                </div>
              </div>
              {/* Service overView */}
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingSix">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseSix"
                    aria-expanded="true"
                    aria-controls="accordion-collapseSix"
                    role="button"
                  >
                    Service Overview
                  </div>
                </div>
                <div
                  id="accordion-collapseSix"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingSix"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Overview</label>
                          <textarea
                            // value={description}
                            // onChange={(e) => setDescription(e?.target?.value)}
                            className="form-control"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={7}
                          />
                          {formik.touched.description &&
                          formik.errors.description ? (
                            <div className="text-danger">
                              {String(formik.errors.description)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Service Status
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="d-flex align-items-center mb-3">
                            <div className="form-check me-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                id="status_active"
                                defaultChecked={
                                  data?.active == true ? true : false
                                }
                                onClick={() =>
                                  formik.setFieldValue('active', true)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="status_active"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                id="status_inactive"
                                defaultChecked={
                                  data?.active != true ? true : false
                                }
                                onClick={() =>
                                  formik.setFieldValue('active', false)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="status_inactive"
                              >
                                Inactive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-end">
              <button
                className="btn btn-dark next_btn"
                // onClick={handleSubmit}
                // onClick={handleSubmit}
                type="submit"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
  );
};

export default SetpOne;
