import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { AllserviceInterface } from '../../../core/models/interface';
import ProviderListModal from './ProviderListModal';
import { deleteService, fetchServices } from '../../../APICalls';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import moment from 'moment';

const AllService = () => {
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState<any>();
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  }, []);

  const closeModal = () => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const renderBody = (res: any) => {
    const imageSrc =
      res?.image && res.image.trim() !== '' ? res.image : res?.gallery?.[0];
    return (
      <div className="table-imgname d-flex align-items-center">
        <div className="flex-shrink-0" style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '8px' }}>
          <ImageWithoutBasePath
            src={imageSrc}
            className="img-fluid"
            alt="img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <span className="ms-2 text-truncate" style={{ maxWidth: '200px' }} title={res?.serviceTitle}>
          {res?.serviceTitle}
        </span>
      </div>
    );
  };

  // console.log(res?.image)
  const renderBody2 = (res: any) => {
    return (
      <div className="d-flex align-items-center">
        <span className={`badge ${res.active ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
          {res.active ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };
  const renderBody4 = (res: any) => {
    return (
      <div className="text-muted">
        <span>{moment(res?.createdAt).format('MMM DD, YYYY')}</span>
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
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={() => {
            navigate('/admin/services/edit-service', { state: res });
          }}
          className="btn btn-sm btn-outline-primary d-flex align-items-center"
          title="Edit Service"
        >
          <i className="fa-regular fa-pen-to-square me-1"></i>
          <span>Edit</span>
        </button>
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center"
          type="button"
          onClick={() => {
            setSelectedService(res);
          }}
          data-bs-toggle="modal"
          data-bs-target="#delete-item"
          title="Delete Service"
        >
          <i className="fa-solid fa-trash-can me-1"></i>
          <span>Delete</span>
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit mb-4">
            <h5 className="mb-0">All Services</h5>
            <div className="list-btn">
              <button
                className="btn btn-primary d-flex align-items-center"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#provider-list"
              >
                <i className="fa fa-plus me-2" />
                Create New Service
              </button>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fa fa-inbox" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h5 className="text-muted">No Services Found</h5>
              <p className="text-muted">Create your first service to get started</p>
              <button
                className="btn btn-primary mt-3"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#provider-list"
              >
                <i className="fa fa-plus me-2" />
                Create Service
              </button>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table datatable">
                        <DataTable
                          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} services"
                          value={data}
                          paginator
                          rows={10}
                          rowsPerPageOptions={[5, 10, 25, 50]}
                          tableStyle={{ minWidth: '50rem' }}
                          className="custom-datatable"
                          stripedRows
                          showGridlines={false}
                        >
                          <Column header="Service" body={renderBody} style={{ minWidth: '250px' }}></Column>
                          <Column
                            header="Provider"
                            body={(res) => {
                              return (
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '50%' }}>
                                    <ImageWithoutBasePath
                                      src={res?.providerId?.image}
                                      className="img-fluid rounded-circle"
                                      alt="provider avatar"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </div>
                                  <span className="ms-2 text-truncate" style={{ maxWidth: '150px' }} title={res?.providerId?.name}>
                                    {res?.providerId?.name || 'N/A'}
                                  </span>
                                </div>
                              );
                            }}
                            style={{ minWidth: '200px' }}
                          ></Column>
                          <Column
                            field="category"
                            header="Category"
                            body={(res) => {
                              // Handle multiple categories
                              const categoryName = res?.categoryId?.categoryName ||
                                (res?.categories && res.categories.length > 0
                                  ? (typeof res.categories[0] === 'object'
                                    ? res.categories[0].categoryName
                                    : 'Multiple')
                                  : 'N/A');
                              return (
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-primary-light text-primary px-3 py-2" title={categoryName}>
                                    {categoryName}
                                  </span>
                                </div>
                              );
                            }}
                            style={{ minWidth: '150px' }}
                          ></Column>
                          <Column
                            sortable
                            field="price"
                            header="Price"
                            body={(res) => (
                              <div className="fw-semibold text-success">
                                ₹{res?.price?.toLocaleString()}
                              </div>
                            )}
                            style={{ minWidth: '120px' }}
                          ></Column>
                          <Column
                            sortable
                            field="duration"
                            header="Duration"
                            body={(res) => (
                              <div className="text-muted">
                                {res?.duration || 'N/A'}
                              </div>
                            )}
                            style={{ minWidth: '120px' }}
                          ></Column>
                          <Column
                            field="status"
                            header="Status"
                            body={renderBody2}
                            style={{ minWidth: '120px' }}
                          ></Column>
                          <Column
                            field="CreatedAt"
                            header="Created At"
                            body={renderBody4}
                            sortable
                            style={{ minWidth: '140px' }}
                          ></Column>
                          <Column
                            header="Action"
                            body={renderBody3}
                            style={{ minWidth: '200px' }}
                            headerStyle={{ textAlign: 'center' }}
                            bodyStyle={{ textAlign: 'center' }}
                          ></Column>
                        </DataTable>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Delete */}
      <div
        className="modal fade"
        id="delete-item"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <button
                type="button"
                className="delete-popup"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-regular fa-rectangle-xmark" />
              </button>
              <div className="del-modal">
                <h5>Do you realy want to delete this service?</h5>
                <p>{selectedService?.serviceTitle}</p>
              </div>
              {message && (
                <p style={{ textAlign: 'center', color: 'green' }}>{message}</p>
              )}
              {errorMessage && (
                <p style={{ textAlign: 'center', color: 'red' }}>
                  {errorMessage}
                </p>
              )}
              <div className="delete-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn modal-delete"
                  onClick={(e) => deleteHandler(e)}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ProviderListModal />
    </>
  );
};

export default AllService;
