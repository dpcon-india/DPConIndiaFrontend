import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceInformation from './serviceInformation';

const EditService = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceData = location.state;

  // Redirect if no service data is provided
  useEffect(() => {
    if (!serviceData || !serviceData._id) {
      console.log('No service data provided, redirecting to all services');
      navigate('/admin/services/all-services');
    }
  }, [serviceData, navigate]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-lg-12 m-auto">
              <ServiceInformation serviceData={serviceData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditService;
