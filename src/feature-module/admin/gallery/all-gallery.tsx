import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Modal, ProgressBar } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  fetchGalleryImages,
  deleteGalleryImageindex,
  addgalleryImage,
} from '../../../APICalls';

interface GalleryImage {
  title: string;
  images: string[];
  _id: string;
}

const AllGallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchGallery = async () => {
    const images = await fetchGalleryImages();
    setGalleryImages(images);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const validationSchema = Yup.object({
    images: Yup.mixed().nullable().required('Gallery Images are required'),
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark-blue">Gallery</h2>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowModal(true)}
          >
            <Icon.Plus className="me-2" size={20} />
            Add Gallery
          </button>
        </div>

        {/* Gallery Images Grid */}
        <div className="row g-4">
          {galleryImages.length > 0 ? (
            galleryImages.map((gallery) =>
              gallery.images.map((imageUrl, index) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={`${gallery._id}-${index}`}
                >
                  <div className="card border-0 shadow-lg overflow-hidden rounded">
                    <img
                      src={imageUrl}
                      className="img-fluid rounded"
                      alt={gallery.title}
                      style={{ height: '350px', objectFit: 'cover' }}
                    />
                    <div className="p-3 d-flex justify-content-between align-items-center">
                      <h5 className="text-dark fw-bold mb-0">
                        {gallery.title}
                      </h5>
                      <Link
                        to="#"
                        className="text-danger"
                        onClick={() =>
                          deleteGalleryImageindex(
                            gallery._id,
                            index,
                            fetchGallery,
                          )
                        }
                      >
                        <Icon.Trash2 size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              )),
            )
          ) : (
            <p className="text-muted text-center">No gallery images found.</p>
          )}
        </div>
      </div>

      {/* Modal for Add Gallery */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add New Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ images: null }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const formData = new FormData();
              formData.append('titel', 'Gallery');

              if (values.images) {
                Array.from(values.images).forEach((image) => {
                  formData.append('images', image as Blob);
                });
              }

              try {
                await addgalleryImage(formData, fetchGallery);
                alert('Gallery added successfully!');
                setShowModal(false);
              } catch (error) {
                console.error('Error adding gallery:', error);
                alert('Failed to add gallery. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
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

                {uploadProgress > 0 && (
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    className="mb-3"
                  />
                )}

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
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
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style>
        {`
          .gallery-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            transition: all 0.3s ease;
          }
          .btn-primary:hover {
            background-color: #0056b3;
          }
          .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default AllGallery;
