import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Icon from 'react-feather';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Testimonial } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import {
  createTestimonials,
  deleteTestimonial,
  updateTestimonial,
} from '../../../../APICalls';
declare global {
  interface Window {
    bootstrap: any;
  }
}
// Form validation schema using Yup
const testimonialValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  jobTitle: Yup.string().required('Job Title is required'),
  desc: Yup.string().required('Content is required'),
});

const TestimonialsModal = ({ fromParent, updateCus }: any) => {
  // Add Testimonial Formik setup
  const [image, setImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState('');
  const [data, setData] = useState(fromParent);
  const addRef: any = useRef();
  const editRef: any = useRef();

  const closeModal = (modalId: string) => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };

  const deleteHanlder = async (e: any) => {
    e.currentTarget.setAttribute('data-bs-dismiss', 'modal');
    await deleteTestimonial(data?._id);
    updateCus();
  };
  useEffect(() => {
    setData(fromParent);
  }, [fromParent]);
  const addTestimonialFormik = useFormik({
    initialValues: {
      name: '',
      jobTitle: '',
      desc: '',
      rating: 4,
      image: '',
      status: false,
    },
    validationSchema: testimonialValidationSchema,
    onSubmit: async (values: Testimonial) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('jobTitle', values.jobTitle);
      formData.append('desc', values.desc);
      formData.append('rating', String(values?.rating));
      formData.append('status', String(values?.status));
      if (image) formData.append('image', image);
      const res = await createTestimonials(formData);
      if (res?.status == 201) {
        alert(res?.message);
        if (addRef.current) {
          closeModal('add-category');

          addRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
        updateCus();
      }
    },
  });

  // Edit Testimonial Formik setup
  const editTestimonialFormik = useFormik({
    initialValues: {
      name: data?.name || '',
      jobTitle: data?.jobTitle || '',
      desc: data?.desc || '',
      rating: data?.rating || '',
      image: data?.image || '',
      status: data?.status || '',
    },
    validationSchema: testimonialValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('jobTitle', values.jobTitle);
      formData.append('desc', values.desc);
      formData.append('rating', String(values?.rating));
      formData.append('status', String(values?.status));
      if (image) formData.append('image', image);
      else formData.append('image', values.image);
      const res = await updateTestimonial(formData, data._id);
      if (res?.status == 200) {
        alert('Updated Successfully');
        updateCus();
        if (editRef.current) {
          closeModal('add-category');
          editRef.current.setAttribute('data-bs-dismiss', 'modal');
        }
      }
    },
  });

  return (
    <>
      {/* Add Testimonial */}
      <div className="modal fade" id="add-testimonial">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Testimonial</h5>
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
              <form onSubmit={addTestimonialFormik.handleSubmit}>
                <div className="profile-upload mb-3">
                  <div className="profile-upload-img">
                    {imagePreview ? (
                      <ImageWithoutBasePath src={imagePreview} alt="img" />
                    ) : (
                      <ImageWithBasePath
                        src={'assets/admin/img/customer/user-01.jpg'}
                        alt="img"
                      />
                    )}
                  </div>
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
                              const previewUrl = URL.createObjectURL(file);
                              setImagePreview(previewUrl);
                              setImage(file);
                            }
                          }}
                        />
                        <Link to="#" className="btn btn-upload">
                          Upload
                        </Link>
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
                    <div className="profile-upload-para">
                      <p>
                        * Recommends a minimum size of 320 x 320 pixels. Allowed
                        files .png and .jpg.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...addTestimonialFormik.getFieldProps('name')}
                  />
                  {addTestimonialFormik.touched.name &&
                    addTestimonialFormik.errors.name && (
                      <div className="error">
                        {addTestimonialFormik.errors.name}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    {...addTestimonialFormik.getFieldProps('jobTitle')}
                  />
                  {addTestimonialFormik.touched.jobTitle &&
                    addTestimonialFormik.errors.jobTitle && (
                      <div className="error">
                        {addTestimonialFormik.errors.jobTitle}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Ratings</label>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${addTestimonialFormik.values.rating >= star ? 'filled' : ''}`}
                        onClick={() => {
                          addTestimonialFormik.setFieldValue('rating', star);
                        }} // Update rating when a star is clicked
                      />
                    ))}
                  </div>
                  {addTestimonialFormik.touched.rating &&
                    addTestimonialFormik.errors.rating && (
                      <div className="error">
                        {addTestimonialFormik.errors.rating}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    {...addTestimonialFormik.getFieldProps('desc')}
                  />
                  {addTestimonialFormik.touched.desc &&
                    addTestimonialFormik.errors.desc && (
                      <div className="error">
                        {addTestimonialFormik.errors.desc}
                      </div>
                    )}
                </div>
                <div className="form-groupheads d-flex justify-content-between mb-4">
                  <h2>Status</h2>
                  <div className="active-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        {...addTestimonialFormik.getFieldProps('status')}
                      />
                      <span className="sliders round" />
                    </label>
                  </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Testimonial */}
      <div className="modal fade" id="edit-testimonial">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Testimonial</h5>
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
              <form onSubmit={editTestimonialFormik.handleSubmit}>
                <div className="profile-upload mb-3">
                  <div className="profile-upload-img">
                    <ImageWithoutBasePath
                      src={imagePreview || data?.image}
                      alt="img"
                    />
                  </div>
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
                              const previewUrl = URL.createObjectURL(file);
                              setImagePreview(previewUrl);
                              setImage(file);
                            }
                          }}
                        />
                        <Link to="#" className="btn btn-upload">
                          Upload
                        </Link>
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
                    <div className="profile-upload-para">
                      <p>
                        * Recommends a minimum size of 320 x 320 pixels. Allowed
                        files .png and .jpg.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...editTestimonialFormik.getFieldProps('name')}
                  />
                  {editTestimonialFormik.touched.name &&
                    editTestimonialFormik.errors.name && (
                      <div className="error">
                        {String(editTestimonialFormik.errors.name)}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    {...editTestimonialFormik.getFieldProps('jobTitle')}
                  />
                  {editTestimonialFormik.touched.jobTitle &&
                    editTestimonialFormik.errors.jobTitle && (
                      <div className="error">
                        {String(editTestimonialFormik.errors.jobTitle)}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Ratings</label>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${editTestimonialFormik.values.rating >= star ? 'filled' : ''}`}
                        onClick={() =>
                          editTestimonialFormik.setFieldValue('rating', star)
                        } // Update rating when a star is clicked
                      />
                    ))}
                  </div>
                  {editTestimonialFormik.touched.rating &&
                    editTestimonialFormik.errors.rating && (
                      <div className="error">
                        {String(editTestimonialFormik.errors.rating)}
                      </div>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    {...editTestimonialFormik.getFieldProps('desc')}
                  />
                  {editTestimonialFormik.touched.desc &&
                    editTestimonialFormik.errors.desc && (
                      <div className="error">
                        {String(editTestimonialFormik.errors.desc)}
                      </div>
                    )}
                </div>
                <div className="form-groupheads d-flex justify-content-between mb-4">
                  <h2>Status</h2>
                  <div className="active-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        {...editTestimonialFormik.getFieldProps('status')}
                      />
                      <span className="sliders round" />
                    </label>
                  </div>
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
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Announcement Modal */}
      <div className="modal fade" id="delete-testimonial">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body pt-0">
              <div className="text-center">
                <Icon.Trash2 size={40} className="text-danger fs-1" />
                <div className="mt-4">
                  <h4>Delete Testimonial?</h4>
                  <p className="text-muted mb-0">
                    Are you sure want to delete this?
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2 justify-content-center mt-4">
                <button
                  type="button"
                  className="btn w-sm btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn w-sm btn-danger"
                  onClick={(e) => {
                    deleteHanlder(e);
                  }}
                >
                  Yes, Delete It!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsModal;
