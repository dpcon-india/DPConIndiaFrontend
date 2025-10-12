import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Icon from 'react-feather';
import axios from 'axios';
import { api, formDataHeader } from '../../../config';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';

interface Appointment {
  _id: string;
  userId: {
    name: string;
    email: string;
    number: string;
    image?: string;
  };
  name: string;
  date: string;
  time: string;
  serviceDetails: string;
  createdAt: string;
  serviceId?: {
    serviceTitle: string;
    price: number;
    providerId?: {
      name: string;
    };
  };
  amount?: number;
}

const AppointmentModal = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${api}getAllAppointments`,
        formDataHeader,
      );

      // Check if response.data is already an array
      let appointmentsData: Appointment[] = [];
      if (Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        appointmentsData = response.data.data;
      } else {
        console.error('Expected an array but received:', response.data);
      }

      // Sort appointments
      const sorted = sortAppointments(appointmentsData, sortOrder);
      setAppointments(sorted);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortAppointments = (data: Appointment[], order: 'latest' | 'oldest') => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime();
      const dateB = new Date(b.createdAt || b.date).getTime();
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const sorted = sortAppointments(appointments, sortOrder);
      setAppointments(sorted);
    }
  }, [sortOrder]);

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const response = await axios.delete(
        `${api}delete/${appointmentId}`,
        formDataHeader,
      );

      if (response.status === 200) {
        setAppointments(
          appointments.filter((appt) => appt._id !== appointmentId),
        );
        setDeleteConfirmModal(false);
        setAppointmentToDelete(null);
      } else {
        console.error('Error deleting appointment:', response);
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  const actionTemplate = (rowData: Appointment) => (
    <div className="d-flex align-items-center gap-2 justify-content-center">
      <button
        onClick={() => {
          setSelectedAppointment(rowData);
          setShowModal(true);
        }}
        className="btn btn-sm btn-outline-primary d-flex align-items-center"
        title="View Details"
      >
        <Icon.Eye size={16} className="me-1" /> View
      </button>
      <button
        onClick={() => {
          setAppointmentToDelete(rowData._id);
          setDeleteConfirmModal(true);
        }}
        className="btn btn-sm btn-outline-danger d-flex align-items-center"
        title="Delete Appointment"
      >
        <Icon.Trash2 size={16} className="me-1" /> Delete
      </button>
    </div>
  );

  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit mb-4">
            <h5 className="mb-0">Appointments</h5>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <label className="me-2 mb-0 fw-medium">Sort By:</label>
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fa fa-calendar" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h5 className="text-muted">No Appointments Found</h5>
              <p className="text-muted">No appointments have been booked yet</p>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <DataTable
                        value={appointments}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
                        className="custom-datatable"
                        stripedRows
                        showGridlines={false}
                      >
                        <Column
                          field="userId.name"
                          header="Customer"
                          sortable
                          body={(rowData) => (
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0" style={{ width: '35px', height: '35px', overflow: 'hidden', borderRadius: '50%' }}>
                                <ImageWithoutBasePath
                                  src={rowData?.userId?.image}
                                  className="img-fluid rounded-circle"
                                  alt="user avatar"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="ms-2">
                                <div className="fw-semibold text-truncate" style={{ maxWidth: '150px' }} title={rowData?.userId?.name}>
                                  {rowData?.userId?.name}
                                </div>
                                <small className="text-muted text-truncate d-block" style={{ maxWidth: '150px' }} title={rowData?.userId?.email}>
                                  {rowData?.userId?.email}
                                </small>
                              </div>
                            </div>
                          )}
                          style={{ minWidth: '220px' }}
                        />
                        <Column
                          field="userId.number"
                          header="Phone"
                          body={(rowData) => (
                            <span className="text-muted">{rowData?.userId?.number}</span>
                          )}
                          style={{ width: '120px' }}
                        />
                        <Column
                          field="serviceId.serviceTitle"
                          header="Service"
                          sortable
                          body={(rowData) => (
                            <div>
                              <div className="fw-medium text-truncate" style={{ maxWidth: '180px' }} title={rowData?.serviceId?.serviceTitle}>
                                {rowData?.serviceId?.serviceTitle || 'N/A'}
                              </div>
                              {rowData?.serviceId?.providerId?.name && (
                                <small className="text-muted">By: {rowData.serviceId.providerId.name}</small>
                              )}
                            </div>
                          )}
                          style={{ minWidth: '200px' }}
                        />
                        <Column
                          header="Appointment"
                          body={(rowData) => (
                            <div>
                              <div className="fw-medium">
                                {moment(rowData.date).format('DD MMM YYYY')}
                              </div>
                              <small className="text-muted">{rowData.time}</small>
                            </div>
                          )}
                          sortable
                          sortField="date"
                          style={{ width: '140px' }}
                        />
                        <Column
                          field="amount"
                          header="Amount"
                          sortable
                          body={(rowData) => (
                            <span className={`badge ${rowData.amount ? 'bg-success' : 'bg-info'} px-3 py-2`}>
                              {rowData.amount ? `₹${rowData.amount}` : 'Free Survey'}
                            </span>
                          )}
                          style={{ width: '120px' }}
                        />
                        <Column
                          header="Created"
                          body={(rowData) => (
                            <small className="text-muted">
                              {moment(rowData.createdAt).format('DD MMM YYYY')}
                            </small>
                          )}
                          sortable
                          sortField="createdAt"
                          style={{ width: '120px' }}
                        />
                        <Column
                          body={actionTemplate}
                          header="Actions"
                          headerStyle={{ textAlign: 'center' }}
                          bodyStyle={{ textAlign: 'center' }}
                          style={{ width: '180px' }}
                        />
                      </DataTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Appointment Modal */}
      {showModal && selectedAppointment && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Customer Name</label>
                    <p className="mb-0">{selectedAppointment.userId?.name}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Email</label>
                    <p className="mb-0">{selectedAppointment.userId?.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Phone Number</label>
                    <p className="mb-0">{selectedAppointment.userId?.number}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Service</label>
                    <p className="mb-0">{selectedAppointment.serviceId?.serviceTitle || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Appointment Date</label>
                    <p className="mb-0">{moment(selectedAppointment.date).format('DD MMMM YYYY')}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Appointment Time</label>
                    <p className="mb-0">{selectedAppointment.time}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Amount</label>
                    <p className="mb-0">
                      <span className={`badge ${selectedAppointment.amount ? 'bg-success' : 'bg-info'}`}>
                        {selectedAppointment.amount ? `₹${selectedAppointment.amount}` : 'Free Survey'}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-semibold text-muted small">Created At</label>
                    <p className="mb-0">{moment(selectedAppointment.createdAt).format('DD MMM YYYY, HH:mm')}</p>
                  </div>
                  {selectedAppointment.serviceId?.providerId?.name && (
                    <div className="col-md-6 mb-3">
                      <label className="fw-semibold text-muted small">Provider</label>
                      <p className="mb-0">{selectedAppointment.serviceId.providerId.name}</p>
                    </div>
                  )}
                  <div className="col-12 mb-3">
                    <label className="fw-semibold text-muted small">Service Details / Notes</label>
                    <p className="mb-0 p-3 bg-light rounded">{selectedAppointment.serviceDetails || 'No details provided'}</p>
                  </div>
                  <div className="col-12">
                    <label className="fw-semibold text-muted small">Appointment ID</label>
                    <p className="mb-0"><code>{selectedAppointment._id}</code></p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setDeleteConfirmModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center pt-0">
                <div className="mb-3">
                  <i className="fa fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
                </div>
                <h5>Delete Appointment?</h5>
                <p className="text-muted">Are you sure you want to delete this appointment? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setDeleteConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={() => {
                    if (appointmentToDelete) {
                      deleteAppointment(appointmentToDelete);
                    }
                  }}
                >
                  <Icon.Trash2 size={16} className="me-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentModal;
