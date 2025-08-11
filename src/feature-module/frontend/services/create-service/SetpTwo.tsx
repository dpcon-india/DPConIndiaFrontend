import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CustomDropdown from '../../common/dropdown/commonSelect';

const StepTwo = ({ setStep, updateState, data }: any) => {
  const [currentStep, setCurrentStep] = useState(2);

  // Form validation schema
  const validationSchema = Yup.object({
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    locality: Yup.string().required('Locality is required'),
    pincode: Yup.number()
      .required('Pincode is required')
      .min(100, 'Enter full Pincode'),
  });

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setStep(currentStep - 1);
  };

  const handleNext = (values: any) => {
    setCurrentStep(currentStep + 1);
    setStep(currentStep + 1);
    updateState({ location: values }); // Update state with form values
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <fieldset style={{ display: 'block' }}>
      <h4 className="mb-3">Location</h4>
      <Formik
        initialValues={{
          address: data?.location?.address,
          country: data?.location?.country,
          city: data?.location?.city,
          state: data?.location?.state,
          pincode: data?.location?.pincode,
          locality: data?.location?.locality,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleNext(values)}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="card">
              <div className="card-body">
                <div className="border-bottom mb-3 pb-3">
                  <h4 className="fs-20">Add Location</h4>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Address <span>*</span>
                      </label>
                      <Field
                        type="text"
                        name="address"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        name="country"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        City <span className="text-danger">*</span>
                      </label>
                      <Field type="text" name="city" className="form-control" />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        State <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        name="state"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>{' '}
                  <div className="col-xl-4 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Locality
                        <span className="text-success">{` (eg:- Colaba) `}</span>
                        <span className="text-danger">* </span>
                      </label>
                      <Field
                        type="text"
                        name="locality"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="locality"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Pincode <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="number"
                        name="pincode"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn btn-light prev_btn me-3"
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-dark next_btn">
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

export default StepTwo;
