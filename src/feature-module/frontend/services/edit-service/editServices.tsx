import React, { useState, useEffect } from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { createService, updateService } from '../../../../APICalls';
import { Gallery, IService } from '../../../../GlobleType';
import SetpOne from '../create-service/SetpOne';
import SetpTwo from '../create-service/SetpTwo';
import StepThree from '../create-service/StepThree';
import StepFour from '../create-service/StepFour';
import StepFive from '../create-service/StepFive';
import Progress from '../create-service/Progress';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

const EditService = () => {
  const routes = all_routes;
  const loc = useLocation();
  const [serviceData, setServiceData] = useState<IService>(loc.state);
  const [showModal, setShowModal] = useState(false);
  console.log(loc.state);
  const handleSubmit = async (data: IService) => {
    try {
      const response = await updateService(data, serviceData._id);
      if (response?.status == 500) return false;
      return true;
    } catch (err) {
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
        title="Edit a Service"
        item1="Service"
        item2="Edit a Service"
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
                      providerId={serviceData?.providerId?._id}
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
                        {serviceData?.serviceTitle == ''
                          ? 'Example Title'
                          : serviceData?.serviceTitle}
                      </Link>
                    </h6>
                    <p className="fw-medium fs-14 mb-3">
                      <i className="ti ti-map-pin me-1" />
                      {serviceData?.location?.pincode == ''
                        ? 'Montana, USA'
                        : serviceData?.location?.city +
                          ' ' +
                          serviceData?.location?.locality +
                          ' ' +
                          serviceData?.location?.pincode}
                    </p>
                    <p className="service-price">
                      {serviceData?.price == 0
                        ? '₹20.00'
                        : '' + serviceData?.price}
                      <span className="text-decoration-line-through">
                        {serviceData?.price == 0
                          ? ' ₹20.00'
                          : ' ₹' +
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
            <h4 className="mb-2">Service Edited Successfullly</h4>
            <p>
              {serviceData?.serviceTitle} service been Edited, and updated on
              your Service List
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

export default EditService;
