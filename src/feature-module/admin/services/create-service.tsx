import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createService } from '../../../APICalls';
import { IService } from '../../../GlobleType';
import SetpOne from '../../frontend/services/create-service/SetpOne';
import './CreateService.css';

const CreateService = () => {
  const navigate = useNavigate();
  const routeProviderId = useLocation()?.state?.providerId;
  
  const defaultServiceState: IService = {
    count: 0,
    provider: '',
    providerId: routeProviderId || JSON.parse(localStorage.getItem('user') || '{}')._id,
    staff: [],
    serviceTitle: '',
    slug: '',
    categoryId: '',
    price: 0,
    duration: '',
    description: '',
    additionalServices: [],
    includes: [],
    videoLink: '',
    location: {
      address: '',
      country: '',
      city: '',
      locality: '',
      state: '',
      pincode: '',
      googleMapsPlaceId: '',
    },
    gallery: [],
    seo: {
      metaTitle: '',
      metaKeywords: [],
      metaDescription: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryName: '',
    active: true,
    faq: [
      {
        question: '',
        answer: '',
      },
    ],
  };

  const [serviceData, setServiceData] = useState<IService>(defaultServiceState);

  useEffect(() => {
    routeProviderId &&
      setServiceData((prev: IService) => ({
        ...prev,
        providerId: routeProviderId,
      }));
  }, [routeProviderId]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Create Service</h1>
              <p className="page-subtitle">Add a new service to your catalog</p>
            </div>
            <button 
              className="create-btn"
              onClick={() => navigate('/admin/services/all-services')}
            >
              <i className="fa fa-arrow-left" />
              <span>Back to Services</span>
            </button>
          </div>
          
          <div className="services-table-container">
            <div className="modern-table-wrapper">
              <SetpOne
                providerId={serviceData?.providerId}
                onSuccess={() => {
                  navigate('/admin/services/all-services?success=true');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateService;