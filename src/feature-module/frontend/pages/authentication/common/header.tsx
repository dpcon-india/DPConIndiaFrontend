import React from 'react';
import ImageWithBasePath from '../../../../../core/img/ImageWithBasePath';

const PagesAuthHeader = () => {
  return (
    <>
      {/* Header */}
      <div className="authentication-header">
        <div className="container">
          <div className="col-md-12">
            <div className="text-center">
              <ImageWithBasePath src="assets/img/DPcon_A2.jpg" alt="logo" />
            </div>
          </div>
        </div>
      </div>
      {/* /Header */}
    </>
  );
};

export default PagesAuthHeader;
