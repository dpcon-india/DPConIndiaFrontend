import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Icon from 'react-feather';
import axios from 'axios';
import { api, formDataHeader } from '../../../config';

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
}

const AppointmentModal = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${api}getAllAppointments`,
          formDataHeader,
        );

        // Check if response.data is already an array
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        }
        // If response.data has a nested data property
        else if (response.data && Array.isArray(response.data.data)) {
          setAppointments(response.data.data);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

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
      } else {
        console.error('Error deleting appointment:', response);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const actionTemplate = (rowData: Appointment) => (
    <button
      onClick={() => deleteAppointment(rowData._id)}
      className="btn btn-danger"
    >
      <Icon.Trash2 className="me-2" /> Delete
    </button>
  );

  return (
    <div className="page-wrapper page-settings">
      <div className="content">
        <div className="content-page-header content-page-headersplit">
          <h5>Appointments</h5>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <DataTable
                value={appointments}
                showGridlines
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column field="userId.name" header="User Name" sortable />
                <Column field="userId.email" header="Email" sortable />
                <Column field="userId.number" header="Phone" sortable />
                {/* <Column field="name" header="Name" sortable /> */}
                <Column field="serviceId.serviceTitle" header="Service" sortable />
                <Column
                  field="serviceDetails"
                  header="Description"
                  sortable
                />
                {/* <Column field="createdAt" header="Created At" sortable /> */}
                <Column
                  header="Date"
                  body={(rowData) =>
                    new Intl.DateTimeFormat('en-GB').format(
                      new Date(rowData.date),
                    )
                  }
                  sortable
                />
                <Column field="time" header="Time" sortable />
                <Column
  field="amount"
  header="Booking Amount"
  sortable
  body={(rowData) => (
    <span
      style={{
        color: rowData.amount ? "green" : "black",
        backgroundColor: rowData.amount ? "#d4edda" : "#fff3cd",
        padding: "5px 10px",
        borderRadius: "5px",
        display: "inline-block",
      }}
    >
      {rowData.amount ? rowData.amount : "Free Survey"}
    </span>
  )}
/>


                <Column body={actionTemplate} header="Actions" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
