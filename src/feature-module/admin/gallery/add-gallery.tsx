import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { api } from '../../../config';
import confetti from 'canvas-confetti';

const AddGallery = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);

  const validationSchema = Yup.object({
    images: Yup.mixed().nullable().required('Gallery Images are required'),
  });

  const handleSubmit = async (
    values: { images: FileList | null },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const formData = new FormData();
    formData.append('titel', 'Gallery');
    if (values.images) {
      Array.from(values.images).forEach((image) => {
        formData.append('images', image);
      });
    }

    try {
      const response = await axios.post(`${api}/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setUploadProgress(percentCompleted);
        },
      });
      confetti({
        particleCount: 1000,
        spread: 100,
        origin: { y: 0.6 }, 
      });

      alert('Gallery added successfully!');
      navigate('/admin/gallery/all-gallery');
    } catch (error) {
      console.error('Error adding gallery:', error);
      alert('Failed to add gallery. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-lg-6 col-md-8">
        <div className="card shadow-lg">
          <div
            className="card-header text-white text-center"
            style={{
              background: 'linear-gradient(to right, #0057FF, #FF8C00)',
              borderRadius: '8px',
            }}
          >
            <h5 className="mb-0">Add New Gallery</h5>
          </div>
          <div className="card-body">
            <Formik
              initialValues={{ images: null }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Gallery Images
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={(e) => setFieldValue('images', e.target.files)}
                    />
                    <ErrorMessage
                      name="images"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  {/* Progress Bar */}
                  {uploadProgress > 0 && (
                    <div className="progress my-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between">
                    <Link to="#" className="btn btn-danger">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Uploading...' : 'Save Gallery'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGallery;
