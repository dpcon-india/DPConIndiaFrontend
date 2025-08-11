import React, { useState, useEffect } from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { createService } from '../../../../APICalls';
import { Gallery, IService } from '../../../../GlobleType';
import SetpOne from './SetpOne';
import SetpTwo from './SetpTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import Progress from './Progress';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

const CreateService = () => {
  const routes = all_routes;
  const routeProviderId = useLocation()?.state?.providerId;
  const defaultServiceState: IService = {
    count: 0, // Default value for count
    provider: '', // Default value for provider
    providerId:
      routeProviderId || JSON.parse(localStorage.getItem('user') || '{}')?._id,
    staff: [],
    serviceTitle: '',
    slug: '',
    categoryId: '',
    SubcategoryId: '',
    subCategory: '', // Default value for subCategory
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
  const [location, setLocation] = useState({
    address: '',
    country: '',
    city: '',
    locality: '',
    state: '',
    pincode: '',
    googleMapsPlaceId: '',
    latitude: '',
    longitude: '',
  });
  const [gallery, setGallery] = useState<Gallery>({
    images: [],
    defaultImage: '',
  });
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaKeywords: [],
    metaDescription: '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (data: IService) => {
    try {
      setLoading(true);
      const response = await createService(data);
      if (response?.status == 500) return false;
      setSuccess(response?.message ?? 'Service created successfully');
      setError('');
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to create service.');
      setSuccess('');
      setLoading(false);
      return false;
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const handelOpen = () => {
    setCurrentStep(1);
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  };
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepChange = async (num: number) => {
    if (num == 6) {
      const res = await handleSubmit(serviceData);
      if (res == true) {
        setCurrentStep(1);
        handelOpen();
        setCurrentStep(1);
      } else {
        alert('Error Creating Service');
      }
    } else {
      setCurrentStep(num);
    }
  };
  const saveFirst = (values: any) => {
    setServiceData((prev: IService) => ({
      ...prev,
      ...values,
    }));
  };
  return (
    <>
      <BreadCrumb
        title="Create a Service"
        item1="Service"
        item2="Create a Service"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="service-wizard mb-4">
                  <Progress currentStep={currentStep} />
                </div>
                <div className="service-inform-fieldset">
                  {currentStep === 1 && (
                    <SetpOne
                      setStep={handleStepChange}
                      updateState={saveFirst}
                      data={serviceData}
                      providerId={serviceData?.providerId}
                    />
                  )}
                  {currentStep === 2 && (
                    <SetpTwo
                      setStep={handleStepChange}
                      updateState={saveFirst}
                      data={serviceData}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepThree
                      setStep={handleStepChange}
                      updateState={saveFirst}
                      data={serviceData}
                    />
                  )}
                  {currentStep === 4 && (
                    <StepFour
                      setStep={handleStepChange}
                      updateState={saveFirst}
                      data={serviceData}
                    />
                  )}
                  {currentStep === 5 && (
                    <StepFive
                      setStep={handleStepChange}
                      updateState={saveFirst}
                      data={serviceData}
                    />
                  )}
                </div>
              </div>
              <div className="col-lg-3">
                <div>
                  <div className="text-end mb-4"></div>
                  <h4 className="mb-4">Quick Preview</h4>
                </div>
                <div className="service-item">
                  <div className="service-img">
                    <div className="slide-images">
                      <Link to={routes.serviceDetails1}>
                        {serviceData?.gallery.length > 0 ? (
                          <ImageWithoutBasePath
                            src={serviceData?.gallery[0]}
                            className="img-fluid"
                            alt="img"
                          />
                        ) : (
                          <ImageWithBasePath
                            src="assets/img/services/service-27.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        )}
                      </Link>
                    </div>
                    <span className="trend-tag">
                      {serviceData?.categoryName == ''
                        ? 'Category'
                        : serviceData?.categoryName}
                    </span>
                  </div>
                  <div className="service-content">
                    <h6 className="text-truncate mb-1">
                      <Link to={routes.serviceDetails1}>
                        {serviceData.serviceTitle == ''
                          ? 'Example Title'
                          : serviceData?.serviceTitle}
                      </Link>
                    </h6>
                    <p className="fw-medium fs-14 mb-3">
                      <i className="ti ti-map-pin me-1" />
                      {serviceData?.location?.pincode == ''
                        ? 'Mumbai'
                        : serviceData?.location?.city +
                          ' ' +
                          serviceData?.location?.locality +
                          ' ' +
                          serviceData?.location?.pincode}
                    </p>
                    <p className="service-price">
                      {serviceData?.price == 0
                        ? '20.00'
                        : '$' + serviceData?.price}
                      <span className="text-decoration-line-through">
                        {serviceData?.price == 0
                          ? ' 20.00'
                          : ' $' +
                            (serviceData?.price + serviceData?.price / 10)}
                      </span>
                      <span>{` in ${serviceData?.duration == '0' ? '0' : serviceData?.duration}hr`}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal centered show={showModal}>
        <div className="modal-body">
          <div className="text-center py-4">
            <span className="success-check mb-3 mx-auto">
              <i className="ti ti-check" />
            </span>
            <h4 className="mb-2">Service Created Successfullly</h4>
            <p>
              {serviceData?.categoryName} service has been Created, and updated
              on your Service List
            </p>
            <div className="f-flex align-items-center justify-content-center mt-3">
              <Link to="#" className="btn btn-light me-3" onClick={handleClose}>
                Close
              </Link>
              <Link
                to={routes.serviceDetails1}
                className="btn btn-linear-primary"
              >
                Preview
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateService;
