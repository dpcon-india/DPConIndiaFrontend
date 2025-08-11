import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const StepFive = ({ setStep, updateState, data }: any) => {
  const [currentStep, setCurrentStep] = useState(5);

  const initialValues = {
    metaTitle: data?.seo?.metaTitle,
    metaKeywords: data?.seo?.metaKeywords,
    metaDescription: data?.seo?.metaDescription,
  };

  const validationSchema = Yup.object().shape({
    metaTitle: Yup.string()
      .required('Meta Title is required')
      .max(60, 'Meta Title must be at most 60 characters'),
    metaKeywords: Yup.string()
      .required('Meta Keywords are required')
      .max(150, 'Meta Keywords must be at most 150 characters'),
    metaDescription: Yup.string()
      .required('Meta Description is required')
      .max(160, 'Meta Description must be at most 160 characters'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    updateState({ seo: values }); // Save the form data
    handleNext(); // Proceed to the next step
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setStep(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    setStep(currentStep + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <fieldset style={{ display: 'block' }}>
      <h4 className="mb-3">Seo</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="card">
              <div className="card-body">
                <div className="border-bottom mb-3 pb-3">
                  <h4 className="fs-20">Seo Details</h4>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Meta Title <span className="text-danger">*</span>{' '}
                      </label>
                      <Field
                        type="text"
                        name="metaTitle"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="metaTitle"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Meta Keywords <span className="text-danger"> *</span>
                      </label>
                      <Field
                        type="text"
                        name="metaKeywords"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="metaKeywords"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Meta Description <span className="text-danger"> *</span>
                      </label>
                      <Field
                        type="text"
                        name="metaDescription"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="metaDescription"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end border-top pt-3">
                  <button
                    type="button"
                    className="btn btn-light prev_btn me-3"
                    onClick={handlePrev}
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={isSubmitting}
                  >
                    Save &amp; Continue
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </fieldset>
  );
};

export default StepFive;
