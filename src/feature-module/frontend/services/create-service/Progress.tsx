import React from 'react';

const Progress = ({ currentStep }: any) => {
  return (
    <ul
      className="d-flex align-items-center flex-wrap row-gap-2"
      id="progressbar"
    >
      <li
        className={`${currentStep === 1 ? 'active' : currentStep > 1 ? 'activated' : ''} me-2`}
      >
        <span className="me-2">
          <i className="ti ti-info-circle" />
        </span>
        <h6>Service Information</h6>
      </li>
      <li
        className={`${currentStep === 2 ? 'active' : currentStep > 2 ? 'activated' : ''} me-2`}
      >
        <span className="me-2">
          <i className="ti ti-map-pin" />
        </span>
        <h6>Location</h6>
      </li>
      <li
        className={`${currentStep === 3 ? 'active' : currentStep > 3 ? 'activated' : ''} me-2`}
      >
        <span className="me-2">
          <i className="ti ti-photo" />
        </span>
        <h6>Gallery</h6>
      </li>
      <li
        className={`${currentStep === 4 ? 'active' : currentStep > 4 ? 'activated' : ''} me-2`}
      >
        <span className="me-2">
          <i className="ti ti-message-question" />
        </span>
        <h6>FAQ</h6>
      </li>
      <li
        className={`${currentStep === 5 ? 'active' : currentStep > 5 ? 'activated' : ''} me-2`}
      >
        <span className="me-2">
          <i className="ti ti-shield" />
        </span>
        <h6>Seo</h6>
      </li>
    </ul>
  );
};

export default Progress;
