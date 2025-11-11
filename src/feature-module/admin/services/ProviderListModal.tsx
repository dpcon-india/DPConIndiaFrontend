import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { fetchAllProfileByRole } from '../../../APICalls';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import { useNavigate } from 'react-router-dom';
import './ProviderListModal.css';
type Customer = {
  _id: string;
  id?: number;
  number?: number;
  email: string;
  image: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  password: string;
  role: string;
  date?: string;
};
const ProviderListModal = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedData, setSelectedData] = useState<Customer>();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const [totalRecords, setTotalRecords] = useState(0); // Total records for pagination
  const [first, setFirst] = useState(0); // Pagination start point
  const [rows, setRows] = useState(10); // Rows per page
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const fetchCategories = async () => {
    try {
      const data = await fetchAllProfileByRole('provider');
      if (data) {
        const formattedData = data.map((e: Customer, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setTotalRecords(sortedData.length); // Set total records for pagination
        setData(sortedData.slice(first, first + rows)); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [sortOrder, first, rows]);

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: Customer, b: Customer) => {
      if (order === 'A - Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };
  const actionButton = (data: Customer) => {
    return (
      <div className="provider-action">
        <button
          className="select-provider-btn"
          type="button"
          data-bs-dismiss="modal"
          onClick={() => {
            navigate('/admin/services/create-service', {
              state: { providerId: data?._id },
            });
            setSelectedData(data);
          }}
          title="Select Provider"
        >
          <Icon.Plus size={16} />
          <span>Select</span>
        </button>
      </div>
    );
  };
  const renderCustomerNameColumn = (rowData: Customer) => {
    const [name, email] = rowData.name.split('\n');
    return (
      <div className="provider-profile">
        <div className="provider-avatar">
          <ImageWithoutBasePath
            src={rowData.image}
            alt="provider"
            className="avatar-image"
          />
        </div>
        <div className="provider-details">
          <div className="provider-name">{name || rowData.name}</div>
          <div className="provider-email">{email || rowData.email}</div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="modal fade" id="provider-list">
        <div className="modal-dialog modal-dialog-centered provider-modal-dialog">
          <div className="modal-content provider-modal-content">
            <div className="modal-header provider-modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Select Provider</h3>
                <p className="modal-subtitle">Choose a provider to create a new service</p>
              </div>
              <button
                type="button"
                className="btn-close modern-close-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body provider-modal-body">
              <div className="provider-table-container">
                <DataTable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  value={data}
                  className="provider-datatable"
                  showGridlines={false}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                  currentPageReportTemplate="{first}-{last} of {totalRecords} providers"
                >
                  <Column 
                    field="id" 
                    header="#" 
                    className="id-column"
                    headerClassName="table-header"
                  ></Column>
                  <Column
                    field="name"
                    header="Provider"
                    body={(rowdata) => renderCustomerNameColumn(rowdata)}
                    className="provider-column"
                    headerClassName="table-header"
                  ></Column>
                  <Column 
                    field="number" 
                    header="Mobile"
                    className="mobile-column"
                    headerClassName="table-header"
                    body={(rowData) => (
                      <div className="mobile-text">
                        {rowData.number || 'N/A'}
                      </div>
                    )}
                  ></Column>
                  <Column
                    field="action"
                    header="Action"
                    body={actionButton}
                    className="action-column"
                    headerClassName="table-header"
                  ></Column>
                </DataTable>
              </div>
            </div>
            <div className="modal-footer provider-modal-footer">
              <button
                type="button"
                className="cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderListModal;
