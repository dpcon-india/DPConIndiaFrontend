import React, { useState } from 'react';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import CustomDropdown from '../../common/dropdown/commonSelect';
import {
  cityOption,
  countryOption,
  serviceOption,
  stateOption,
  statusOption,
} from '../../../../core/data/json/dropDownData';
import ReactApexChart from 'react-apexcharts';

import 'react-datepicker/dist/react-datepicker.css';

import Calendar from 'react-calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TopServices from './TopServices';
import Status from './status';
import Graph from './Graph';

// Modern H&M Style CSS
const hmStyles = {
  pageWrapper: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
    color: '#fff',
    padding: '32px 0',
    marginBottom: '32px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  card: {
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    borderRadius: '12px',
    marginBottom: '24px',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f0f0',
    padding: '24px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardBody: {
    padding: '32px'
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#000',
    border: '2px solid #000',
    padding: '10px 26px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  }
};

const ProviderDashboard = () => {
  const routes = all_routes;
  const [showModal, setShowModal] = useState(false);
  const [value, onChange] = useState(new Date());
  const handleClose = () => {
    setShowModal(false);
  };
  const handelOpen = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="page-wrapper" style={hmStyles.pageWrapper}>
        <div className="content container-fluid" style={{ padding: '24px' }}>
          {/* Dashboard Grid */}
          <div className="row g-4">
            {/* Status Section */}
            <div className="col-12">
              <div style={hmStyles.card}>
                <div style={hmStyles.cardBody}>
                  <Status />
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="col-12">
              <div style={hmStyles.card}>
                <div style={hmStyles.cardBody}>
                  <Graph />
                </div>
              </div>
            </div>

            {/* Top Services Section */}
            <div className="col-12">
              <div style={hmStyles.card}>
                <div style={hmStyles.cardHeader}>
                  <span>Top Services</span>
                  <Link
                    to={routes.serviceDetails1}
                    style={hmStyles.buttonSecondary}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#000';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#000';
                    }}
                  >
                    View All
                  </Link>
                </div>
                <div style={{ padding: '0 32px 32px 32px' }}>
                  <TopServices />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal className="doctor-profile" centered show={showModal}>
        <div className="modal-header" style={{
          padding: '24px 32px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fff'
        }}>
          <h5 className="modal-title" style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '0'
          }}>Add Staff</h5>
          <Link
            to="#"
            onClick={handleClose}
            aria-label="Close"
            style={{
              color: '#666',
              fontSize: '24px',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#666'}
          >
            <i className="ti ti-x" />
          </Link>
        </div>
        <div className="modal-body" style={{ padding: '32px' }}>
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <div className="d-flex profile-upload align-items-center">
                    <span className="d-flex justify-content-center align-items-center p-4 bg-light rounded me-2">
                      <i className="ti ti-photo" />
                    </span>
                    <div>
                      <h6 className="fs-16">Profile</h6>
                      <span className="fs-14">
                        Image size does not exceed 5MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control pass-input"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control pass-input"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="number"
                    className="form-control pass-input"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control pass-input"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <CustomDropdown
                    options={countryOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">State</label>
                  <CustomDropdown
                    options={stateOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <CustomDropdown
                    options={cityOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control pass-input"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    defaultValue={''}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Services</label>
                  <CustomDropdown
                    options={serviceOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CustomDropdown
                    options={statusOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer" style={{
          padding: '24px 32px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fff'
        }}>
          <div className="d-flex justify-content-end align-items-center gap-3">
            <Link
              to="#"
              style={hmStyles.buttonSecondary}
              onClick={handleClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </Link>
            <Link
              to={routes.staffList}
              style={hmStyles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#000';
              }}
            >
              Submit
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProviderDashboard;