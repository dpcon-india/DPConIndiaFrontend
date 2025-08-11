import React, { useState } from 'react';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { createImageUrl } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

const StepThree = ({ setStep, updateState, data }: any) => {
  const [currentStep, setCurrentStep] = useState(3);
  const [gallery, setGallery] = useState<string[]>(data?.gallery);

  const formik = useFormik({
    initialValues: {
      images: null, // For validation purposes
    },
    onSubmit: () => {
      handleNext();
    },
  });

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    setStep(currentStep + 1);
    updateState({ gallery });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newGallery: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const imageUrl = await createImageUrl(formData);
        newGallery.push(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setGallery((prevGallery) => [...prevGallery, ...newGallery]);
  };

  const handleDeleteImage = (url: string) => {
    setGallery((prevGallery) => prevGallery.filter((image) => image !== url));
  };

  return (
    <fieldset style={{ display: 'block' }}>
      <h4 className="mb-3">Gallery</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="border-bottom mb-3 pb-3">
              <h4 className="fs-20">Add Media &amp; Files</h4>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Add Service Images <span className="text-danger"> *</span>
                  </label>
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    {gallery.map((url, index) => (
                      <div className="avatar avatar-gallery me-3" key={index}>
                        <ImageWithoutBasePath
                          src={url}
                          alt={`Uploaded Img ${index}`}
                        />
                        <Link
                          to="#"
                          className="trash-top d-flex align-items-center justify-content-center"
                          onClick={() => handleDeleteImage(url)}
                        >
                          <i className="ti ti-trash" />
                        </Link>
                      </div>
                    ))}
                    <div className="file-upload d-flex align-items-center justify-content-center flex-column">
                      <i className="ti ti-photo mb-2" />
                      <p className="mb-0">Add Images</p>
                      <input
                        type="file"
                        accept="video/image"
                        multiple // Allow multiple file selection
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  {formik.errors.images && formik.touched.images && (
                    <div className="text-danger">{formik.errors.images}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end border-top pt-3">
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-light prev_btn me-3"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-dark next_btn"
                disabled={gallery.length === 0}
              >
                Save &amp; Continue
              </button>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
  );
};

export default StepThree;

{
  /* <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Service Video</label>
                  <div className="file-upload drag-file w-100 d-flex align-items-center justify-content-center flex-column mb-2">
                    <span className="upload-img d-block mb-2">
                      <ImageWithBasePath
                        src="assets/img/icons/upload-icon.svg"
                        alt="Img"
                      />
                    </span>
                    <p className="mb-0">
                      Drag &amp; Drop or{' '}
                      <span className="text-dark-blue">Browse</span>
                    </p>
                    <input type="file" accept="video/image" />
                  </div>
                  <div className="avatar avatar-gallery me-3">
                    <ImageWithBasePath
                      src="assets/img/gallery/gallery-03.jpg"
                      alt="Img"
                    />
                    <Link
                      to="#"
                      className="trash-top d-flex align-items-center justify-content-center"
                    >
                      <i className="ti ti-trash" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Video Link</label>
                  <input type="text" className="form-control" />
                </div>
              </div> */
}
