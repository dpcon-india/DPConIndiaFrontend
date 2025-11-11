import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Icon from 'react-feather';
import axios from 'axios';
import { api, formDataHeader } from '../../../config';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import './Appointments.css';

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
    <div className="action-buttons">
      <button
        onClick={() => {
          setSelectedAppointment(rowData);
          setShowModal(true);
        }}
        className="action-btn view-btn"
        title="View Details"
      >
        <Icon.Eye size={16} />
      </button>
      <button
        onClick={() => {
          setAppointmentToDelete(rowData._id);
          setDeleteConfirmModal(true);
        }}
        className="action-btn delete-btn"
        title="Delete Appointment"
      >
        <Icon.Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Appointments</h1>
              <p className="page-subtitle">Manage customer appointments and bookings</p>
            </div>
            <div className="header-actions">
              <div className="sort-dropdown">
                <label className="sort-label">Sort By:</label>
                <select
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading appointments...</p>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa fa-calendar"></i>
              </div>
              <h3>No appointments yet</h3>
              <p>Customer appointments will appear here once they start booking</p>
            </div>
          ) : (
            <div className="appointments-table-container">
              <div className="modern-table-wrapper">
                <DataTable
                  value={appointments}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="{first}-{last} of {totalRecords} appointments"
                  className="modern-datatable"
                  showGridlines={false}
                >
                  <Column
                    field="userId.name"
                    header="Customer"
                    sortable
                    body={(rowData) => (
                      <div className="customer-item">
                        <div className="customer-avatar">
                          <ImageWithoutBasePath
                            src={rowData?.userId?.image}
                            className="avatar-img"
                            alt="customer"
                          />
                        </div>
                        <div className="customer-details">
                          <div className="customer-name">{rowData?.userId?.name}</div>
                          <div className="customer-email">{rowData?.userId?.email}</div>
                        </div>
                      </div>
                    )}
                    className="customer-column"
                  />
                  <Column
                    field="userId.number"
                    header="Phone"
                    body={(rowData) => (
                      <div className="phone-text">{rowData?.userId?.number}</div>
                    )}
                    className="phone-column"
                  />
                  <Column
                    field="serviceId.serviceTitle"
                    header="Service"
                    sortable
                    body={(rowData) => (
                      <div className="service-item">
                        <div className="service-title">{rowData?.serviceId?.serviceTitle || 'N/A'}</div>
                        {rowData?.serviceId?.providerId?.name && (
                          <div className="service-provider">By: {rowData.serviceId.providerId.name}</div>
                        )}
                      </div>
                    )}
                    className="service-column"
                  />
                  <Column
                    header="Appointment"
                    body={(rowData) => (
                      <div className="appointment-datetime">
                        <div className="appointment-date">
                          {moment(rowData.date).format('DD MMM YYYY')}
                        </div>
                        <div className="appointment-time">{rowData.time}</div>
                      </div>
                    )}
                    sortable
                    sortField="date"
                    className="datetime-column"
                  />
                  <Column
                    field="amount"
                    header="Amount"
                    sortable
                    body={(rowData) => (
                      <span className={`amount-badge ${rowData.amount ? 'paid' : 'free'}`}>
                        {rowData.amount ? `₹${rowData.amount}` : 'Free Survey'}
                      </span>
                    )}
                    className="amount-column"
                  />
                  <Column
                    header="Created"
                    body={(rowData) => (
                      <div className="created-date">
                        {moment(rowData.createdAt).format('DD MMM YYYY')}
                      </div>
                    )}
                    sortable
                    sortField="createdAt"
                    className="created-column"
                  />
                  <Column
                    body={actionTemplate}
                    header="Actions"
                    className="action-column"
                  />
                </DataTable>
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
            <div className="modal-content modern-modal">
              <div className="modal-header modern-modal-header">
                <div className="modal-title-section">
                  <h3 className="modal-title">Appointment Details</h3>
                  <p className="modal-subtitle">View complete appointment information</p>
                </div>
                <button
                  type="button"
                  className="btn-close modern-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
              <div className="modal-body modern-modal-body">
                <div className="appointment-details-grid">
                  <div className="detail-item">
                    <label className="detail-label">Customer Name</label>
                    <p className="detail-value">{selectedAppointment.userId?.name}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Email</label>
                    <p className="detail-value">{selectedAppointment.userId?.email}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Phone Number</label>
                    <p className="detail-value">{selectedAppointment.userId?.number}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Service</label>
                    <p className="detail-value">{selectedAppointment.serviceId?.serviceTitle || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Appointment Date</label>
                    <p className="detail-value">{moment(selectedAppointment.date).format('DD MMMM YYYY')}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Appointment Time</label>
                    <p className="detail-value">{selectedAppointment.time}</p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Amount</label>
                    <p className="detail-value">
                      <span className={`amount-badge ${selectedAppointment.amount ? 'paid' : 'free'}`}>
                        {selectedAppointment.amount ? `₹${selectedAppointment.amount}` : 'Free Survey'}
                      </span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <label className="detail-label">Created At</label>
                    <p className="detail-value">{moment(selectedAppointment.createdAt).format('DD MMM YYYY, HH:mm')}</p>
                  </div>
                  {selectedAppointment.serviceId?.providerId?.name && (
                    <div className="detail-item">
                      <label className="detail-label">Provider</label>
                      <p className="detail-value">{selectedAppointment.serviceId.providerId.name}</p>
                    </div>
                  )}
                  <div className="detail-item full-width">
                    <label className="detail-label">Service Details / Notes</label>
                    <div className="detail-notes">{selectedAppointment.serviceDetails || 'No details provided'}</div>
                  </div>
                  <div className="detail-item full-width">
                    <label className="detail-label">Appointment ID</label>
                    <p className="detail-value appointment-id">{selectedAppointment._id}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer modern-modal-footer">
                <button
                  type="button"
                  className="close-btn"
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
            <div className="modal-content modern-modal">
              <div className="modal-header modern-modal-header">
                <button
                  type="button"
                  className="btn-close modern-close-btn"
                  onClick={() => setDeleteConfirmModal(false)}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
              <div className="modal-body modern-modal-body">
                <div className="delete-confirmation">
                  <div className="warning-icon">
                    <i className="fa fa-exclamation-triangle"></i>
                  </div>
                  <h4>Delete Appointment</h4>
                  <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
                </div>
              </div>
              <div className="modal-footer modern-modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setDeleteConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={() => {
                    if (appointmentToDelete) {
                      deleteAppointment(appointmentToDelete);
                    }
                  }}
                >
                  <Icon.Trash2 size={16} />
                  <span>Delete</span>
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
