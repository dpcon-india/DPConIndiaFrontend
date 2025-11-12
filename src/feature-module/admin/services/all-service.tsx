import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { AllserviceInterface } from '../../../core/models/interface';
import ProviderListModal from './ProviderListModal';
import { deleteService, fetchServices } from '../../../APICalls';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import './AllService.css';

const AllService = () => {
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState<any>();
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchServ = async () => {
    try {
      setLoading(true);
      const res = await fetchServices();
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServ();
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessModal(true);
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  const closeModal = () => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const renderBody = (res: any) => {
    const imageSrc =
      res?.image && res.image.trim() !== '' ? res.image : res?.gallery?.[0];
    return (
      <div className="service-item">
        <div className="service-image">
          <ImageWithoutBasePath
            src={imageSrc}
            className="service-img"
            alt="service"
          />
        </div>
        <div className="service-info">
          <h6 className="service-title">{res?.serviceTitle}</h6>
        </div>
      </div>
    );
  };

  // console.log(res?.image)
  const renderBody2 = (res: any) => {
    return (
      <div className="status-wrapper">
        <span className={`status-badge ${res.active ? 'active' : 'inactive'}`}>
          <span className="status-dot"></span>
          {res.active ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };
  const renderBody4 = (res: any) => {
    return (
      <div className="date-text">
        {moment(res?.createdAt).format('MMM DD, YYYY')}
      </div>
    );
  };
  const deleteHandler = async (e: any) => {
    try {
      const res = await deleteService(selectedService?._id);
      if (res?.status !== 200) {
        setErrorMessage(res?.message);
        return setTimeout(() => {
          setErrorMessage('');
        }, 2000);
      }
      setMessage(res?.message);
      return setTimeout(() => {
        closeModal();
        e?.currentTarget?.setAttribute('data-bs-dismiss', 'modal');
        fetchServ();
        setMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error as string);
      return setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const renderBody3 = (res: any) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => {
            navigate('/admin/services/edit-service', { state: res });
          }}
          className="action-btn edit-btn"
          title="Edit Service"
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button
          className="action-btn delete-btn"
          type="button"
          onClick={() => {
            setSelectedService(res);
          }}
          data-bs-toggle="modal"
          data-bs-target="#delete-item"
          title="Delete Service"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Services</h1>
              <p className="page-subtitle">Manage your service offerings</p>
            </div>
            <button
              className="create-btn"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#provider-list"
            >
              <i className="fa fa-plus" />
              <span>New Service</span>
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading services...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa fa-store"></i>
              </div>
              <h3>No services yet</h3>
              <p>Start by creating your first service offering</p>
              <button
                className="create-btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#provider-list"
              >
                <i className="fa fa-plus" />
                <span>Create Service</span>
              </button>
            </div>
          ) : (
            <div className="services-table-container">
              <div className="modern-table-wrapper">
                <DataTable
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="{first}-{last} of {totalRecords} services"
                  value={data}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  className="modern-datatable"
                  showGridlines={false}
                >
                  <Column header="Service" body={renderBody} className="service-column"></Column>
                  <Column
                    header="Provider"
                    body={(res) => {
                      return (
                        <div className="provider-item">
                          <div className="provider-avatar">
                            <ImageWithoutBasePath
                              src={res?.providerId?.image}
                              className="avatar-img"
                              alt="provider"
                            />
                          </div>
                          <span className="provider-name">
                            {res?.providerId?.name || 'N/A'}
                          </span>
                        </div>
                      );
                    }}
                    className="provider-column"
                  ></Column>
                  <Column
                    field="category"
                    header="Category"
                    body={(res) => {
                      const categoryName = res?.categoryId?.categoryName ||
                        (res?.categories && res.categories.length > 0
                          ? (typeof res.categories[0] === 'object'
                            ? res.categories[0].categoryName
                            : 'Multiple')
                          : 'N/A');
                      return (
                        <span className="category-tag">
                          {categoryName}
                        </span>
                      );
                    }}
                    className="category-column"
                  ></Column>
                  <Column
                    sortable
                    field="price"
                    header="Price"
                    body={(res) => (
                      <div className="price-text">
                        ₹{res?.price?.toLocaleString()}
                      </div>
                    )}
                    className="price-column"
                  ></Column>
                  <Column
                    sortable
                    field="duration"
                    header="Duration"
                    body={(res) => (
                      <div className="duration-text">
                        {res?.duration || 'N/A'}
                      </div>
                    )}
                    className="duration-column"
                  ></Column>
                  <Column
                    field="status"
                    header="Status"
                    body={renderBody2}
                    className="status-column"
                  ></Column>
                  <Column
                    field="CreatedAt"
                    header="Created"
                    body={renderBody4}
                    sortable
                    className="date-column"
                  ></Column>
                  <Column
                    header="Actions"
                    body={renderBody3}
                    className="action-column"
                  ></Column>
                </DataTable>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Delete Modal */}
      <div className="modal fade" id="delete-item" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modern-modal">
            <div className="modal-header">
              <h5 className="modal-title">Delete Service</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="delete-confirmation">
                <div className="warning-icon">
                  <i className="fa fa-exclamation-triangle"></i>
                </div>
                <p>Are you sure you want to delete this service?</p>
                <div className="service-name">{selectedService?.serviceTitle}</div>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
              {message && <div className="alert alert-success">{message}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </div>
            <div className="modal-footer">
              {!message && (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(e) => deleteHandler(e)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Deleting...
                      </>
                    ) : (
                      'Delete Service'
                    )}
                  </button>
                </>
              )}
              {message && (
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProviderListModal />

      {/* Success Modal */}
      <Modal centered show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <div className="modal-content modern-modal">
          <div className="modal-body">
            <div className="success-content">
              <div className="success-icon">
                <i className="fa fa-check"></i>
              </div>
              <h4>Service Created</h4>
              <p>Your service has been successfully added to the catalog</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AllService;
