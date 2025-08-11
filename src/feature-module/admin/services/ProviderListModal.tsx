import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { fetchAllProfileByRole } from '../../../APICalls';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import { useNavigate } from 'react-router-dom';
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
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          data-bs-dismiss="modal"
          onClick={() => {
            navigate('/services/create-service', {
              state: { providerId: data?._id },
            });
            setSelectedData(data);
          }}
        >
          <Icon.Plus className="react-feather-custom" />
        </button>
      </div>
    );
  };
  const renderCustomerNameColumn = (rowData: Customer) => {
    const [name, email] = rowData.name.split('\n');
    return (
      <div className="table-profileimage">
        <ImageWithoutBasePath
          className="me-2"
          src={rowData.image}
          alt="img"
          style={{ width: '50px', height: 'auto' }}
        />
        <div className="ml-2">
          <span>{name}</span>
          <br />
          <span>{email}</span>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="modal fade" id="provider-list">
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: '60%' }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body pt-0">
              <div className="d-grid gap-2 justify-content-center mt-4">
                {/* Provider List */}
                <h2>Select Provider</h2>
                <DataTable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  value={data}
                  showGridlines
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column sortable field="id" header="#"></Column>
                  <Column
                    sortable
                    field="name"
                    header="Customer Name"
                    body={(rowdata) => renderCustomerNameColumn(rowdata)}
                  ></Column>
                  <Column sortable field="number" header="Mobile"></Column>
                  {/* <Column
                      sortable
                      field="lastActivity"
                      header="Last Activity"
                    ></Column> */}
                  <Column
                    sortable
                    field="action"
                    header="Action"
                    body={actionButton}
                  ></Column>
                </DataTable>
                <button
                  type="button"
                  className="btn w-sm btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderListModal;
