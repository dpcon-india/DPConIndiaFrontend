import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchStaff } from '../../../../APICalls';
import { Category, faq, FAQ, IAdditionalService } from '../../../../GlobleType';
import TemplateDemo from '../../common/multi-select/multiSelect';
import { Link } from 'react-router-dom';
import DefaultEditor from 'react-simple-wysiwyg';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SetpOne = ({ setStep, updateState, data, providerId }: any) => {
  const [loading, setLoading] = useState(true);
  const [fetchStaffs, setfetchStaff] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [includes, setIncludes] = useState<string[]>(data?.includes || []);
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [faq, setFaq] = useState<faq[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [additionalServices, setAdditionalServices] = useState<IAdditionalService[]>(
    data?.additionalServices || []
  );
  const [selectedStaff, setSelectedStaff] = useState<any>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    const filter = includes.filter((e) => e !== i);
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
    const loadStaff = async () => {
      try {
        setLoading(true);
        const id = providerId;
        const data = await fetchStaff(id);
        setfetchStaff(data);
      } catch (err) {
        setError('Failed to load staff.');
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [providerId]);

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
    if (!updatedServices[i]) {
      updatedServices[i] = { service: '', price: '', duration: '', desc: '' };
    }
    updatedServices[i][key] = value;
    formik.setFieldValue('additionalServices', updatedServices);
  };

  const validationSchema = Yup.object({
    serviceTitle: Yup.string().required('Service Title is required'),
    slug: Yup.string().required('Slug is required').min(1),
    categoryId: Yup.string().required('Category is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be 0 or greater'),
    description: Yup.string().required('Description is required'),
    staff: Yup.array()
      .required('Staff is required')
      .min(1, 'At least one staff is required'),
    duration: Yup.string().required('Please add the Duration'),
  });

  const formik = useFormik({
    initialValues: {
      serviceTitle: data?.serviceTitle || '',
      slug: data?.slug || '',
      categoryId: data?.categoryId || '',
      description: data?.description || '',
      staff: data?.staff || [],
      price: data?.price || '',
      additionalServices: data?.additionalServices || [],
      includes: data?.includes || [],
      active: data?.active || false,
      duration: data?.duration || '',
      categoryName: data?.categoryName || '',
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
                          {formik.touched.serviceTitle && formik.errors.serviceTitle ? (
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
                              const selectedOption = e?.target?.options[e?.target?.selectedIndex];
                              const categoryName = selectedOption.dataset.categoryName;
                              setSelectedCategoryId(e?.target?.value);
                              formik.setFieldValue('categoryName', categoryName);
                              formik.setFieldValue('categoryId', e?.target?.value);
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
                          {formik.touched.categoryId && formik.errors.categoryId ? (
                            <div className="text-danger">
                              {String(formik.errors.categoryId)}
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
                      </div>
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

              {/* Includes Section */}
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
                                {includes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handelRemove2(add)}
                                    className="btn text-dark-blue d-inline-flex align-items-center text-danger delete-item ms-4"
                                  >
                                    <i className="ti ti-trash"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handelAdd2}
                      className="btn btn-link text-dark-blue d-inline-flex align-items-center add-extra fs-14 mb-3 p-0"
                    >
                      <i className="ti ti-circle-plus me-2" />
                      Add New
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Services Section */}
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
                              <div className="flex-grow-1">
                                <label className="form-label">Service</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={add.service}
                                  onChange={(e) =>
                                    handleAdditionalServiceChange(
                                      index,
                                      'service',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {additionalServices.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemove(index)}
                                  className="btn btn-link text-danger ms-2"
                                >
                                  <i className="ti ti-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <div className="mb-3">
                              <label className="form-label">Price</label>
                              <input
                                type="text"
                                className="form-control"
                                value={add.price}
                                onChange={(e) =>
                                  handleAdditionalServiceChange(
                                    index,
                                    'price',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-2">
                            <div className="mb-3">
                              <label className="form-label">Duration</label>
                              <input
                                type="text"
                                className="form-control"
                                value={add.duration}
                                onChange={(e) =>
                                  handleAdditionalServiceChange(
                                    index,
                                    'duration',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-4">
                            <div className="mb-3">
                              <label className="form-label">Description</label>
                              <input
                                type="text"
                                className="form-control"
                                value={add.desc}
                                onChange={(e) =>
                                  handleAdditionalServiceChange(
                                    index,
                                    'desc',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handelAdd}
                      className="btn btn-link text-dark-blue d-inline-flex align-items-center add-extra fs-14 mb-3 p-0"
                    >
                      <i className="ti ti-circle-plus me-2" />
                      Add Additional Service
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingTwo">
                  <div
                    className="accordion-button p-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#accordion-collapseTwo"
                    aria-expanded="true"
                    aria-controls="accordion-collapseTwo"
                    role="button"
                  >
                    Description
                  </div>
                </div>
                <div
                  id="accordion-collapseTwo"
                  className="accordion-collapse collapse show"
                  aria-labelledby="accordion-headingTwo"
                >
                  <div className="accordion-body p-0 mt-3 pb-1">
                    <div className="mb-3">
                      <DefaultEditor
                        value={formik.values.description}
                        onChange={(e) => {
                          formik.setFieldValue('description', e.target.value);
                        }}
                      />
                      {formik.touched.description && formik.errors.description ? (
                        <div className="text-danger">
                          {String(formik.errors.description)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
  );
};

export default SetpOne;
