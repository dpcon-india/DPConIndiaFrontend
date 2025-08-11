import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import * as Icon from 'react-feather';
import axios from 'axios';
import { api, formDataHeader } from '../../../config';

// Define the interface for the contact data
interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string; // Assuming createdAt is a string; you can change this based on the actual data type
}

const ContactMessages = () => {
  // Type the state to be an array of Contact objects
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const sortOptions = [{ name: 'A - Z' }, { name: 'Z - A' }];

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(`${api}contact`, formDataHeader);
        if (response.data && Array.isArray(response.data.data)) {
          setContacts(response.data.data);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching contact messages:', error);
      }
    };

    fetchContactMessages();
  }, []);

  const deleteContact = async (contactId: string) => {
    try {
      // Delete the contact by calling the API endpoint
      const response = await axios.delete(
        `${api}contact/${contactId}`,
        formDataHeader,
      );

      if (response.status === 200) {
        // Filter out the deleted contact from the state
        setContacts(contacts.filter((contact) => contact._id !== contactId));
      } else {
        console.error('Error deleting contact:', response);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const actionTemplate = (rowData: Contact) => {
    return (
      <button
        onClick={() => deleteContact(rowData._id)}
        className="btn btn-danger"
      >
        <Icon.Trash2 className="me-2" /> Delete
      </button>
    );
  };

  return (
    <div className="page-wrapper page-settings">
      <div className="content">
        <div className="content-page-header content-page-headersplit">
          <h5>Contact Messages</h5>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <DataTable
                value={contacts}
                showGridlines
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Phone" sortable />
                <Column field="message" header="Message" sortable />
                <Column field="createdAt" header="Date" sortable />
                <Column body={actionTemplate} header="Actions" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
