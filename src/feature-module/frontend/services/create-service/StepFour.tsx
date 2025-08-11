import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faq } from '../../../../GlobleType';

const StepFour = ({ setStep, updateState, data }: any) => {
  const [currentStep, setCurrentStep] = useState(4);
  const [addList3, setAddList3] = useState<faq[]>(data?.faq);
  const [errors, setErrors] = useState<
    { question: boolean; answer: boolean }[]
  >([]);

  // Initialize errors for existing FAQs
  useEffect(() => {
    if (data?.faq) {
      setErrors(data.faq.map(() => ({ question: false, answer: false })));
    }
  }, [data]);

  const validateField = (
    index: number,
    key: 'question' | 'answer',
    value: string,
  ) => {
    const updatedErrors = [...errors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [key]: value.trim() === '',
    };
    setErrors(updatedErrors);
  };

  const isFormValid = () => {
    return errors.every((err) => !err.question && !err.answer);
  };

  const handelAdd3 = () => {
    setAddList3([...addList3, { question: '', answer: '' }]);
    setErrors([...errors, { question: true, answer: true }]); // New fields are invalid initially
  };

  const handelRemove3 = (index: number): void => {
    setAddList3((prevList) => prevList.filter((_, i) => i !== index));
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setStep(currentStep - 1);
  };

  const handleNext = () => {
    if (!isFormValid()) {
      alert('Please fill out all the fields.');
      return;
    }

    setCurrentStep(currentStep + 1);
    setStep(currentStep + 1);
    updateState({ faq: addList3 });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleAdditionalServiceChange = (
    i: number,
    key: 'question' | 'answer',
    value: string,
  ) => {
    const updatedServices = [...addList3];

    // Ensure the object exists
    if (!updatedServices[i]) {
      updatedServices[i] = { question: '', answer: '' };
    }

    // Update the specified property
    updatedServices[i][key] = value;
    setAddList3(updatedServices);

    // Validate the field
    validateField(i, key, value);
  };

  return (
    <fieldset style={{ display: 'block' }}>
      <h4 className="mb-3">FAQ</h4>
      <form>
        <div className="card">
          <div className="card-body">
            <div className="add-faq-info">
              {addList3.map((add: faq, index: number) => (
                <div className="row" key={index}>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Question </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors[index]?.question ? 'is-invalid' : ''
                        }`}
                        value={add.question}
                        onChange={(e) =>
                          handleAdditionalServiceChange(
                            index,
                            'question',
                            e.target.value,
                          )
                        }
                      />
                      {errors[index]?.question && (
                        <div className="invalid-feedback">
                          Question is required.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Answer </label>
                      <div className="d-flex align-items-center">
                        <div className="mb-3">
                          <input
                            type="text"
                            className={`form-control ${
                              errors[index]?.answer ? 'is-invalid' : ''
                            }`}
                            value={add.answer}
                            onChange={(e) =>
                              handleAdditionalServiceChange(
                                index,
                                'answer',
                                e.target.value,
                              )
                            }
                          />
                          {errors[index]?.answer && (
                            <div className="invalid-feedback">
                              Answer is required.
                            </div>
                          )}
                        </div>
                        {addList3.length > 1 ? (
                          <Link
                            to="#"
                            onClick={() => handelRemove3(index)}
                            className="text-dark-blue d-inline-flex align-items-center text-danger delete-item ms-4"
                          >
                            <i className="ti ti-trash"></i>
                          </Link>
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
              onClick={handelAdd3}
              className="text-dark-blue d-inline-flex align-items-center fs-14 add-extra-faq mb-3"
            >
              <i className="ti ti-circle-plus me-2" />
              Add New
            </Link>
            <div className="d-flex align-items-center justify-content-end border-top pt-3">
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-light prev_btn me-3"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-dark next_btn"
                disabled={!isFormValid()}
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

export default StepFour;
