import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

import * as Icon from 'react-feather';
import { Dropdown } from 'primereact/dropdown';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SubCatogriesModal from '../common/modals/subcategories-modal';
import DeleteSubCategoriesModal from '../common/modals/delete-subcategories-modal';
import moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { fetchAllCustomers, updateCustomer } from '../../../APICalls';
import CustomersModal from '../common/modals/customers-modal';
import DeleteCustomersModal from '../common/modals/delete-customers-modal';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';

const Customers = () => {
  // const data = useSelector((state: any) => state.sub_categories);
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const [selectedData, setSelectedData] = useState<Customer>();
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
  const fetchCategories = async () => {
    try {
      const data = await fetchAllCustomers();
      if (data) {
        const formattedData = data?.map((e: Customer, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setData(sortedData); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [sortOrder]);

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: Customer, b: Customer) => {
      if (order === 'A - Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };
  // const handlePageChange = (e: any) => {
  //   setFirst(e.first);
  //   setRows(e.rows);
  // };
  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
  };
  // const renderFeaturedSwitch = (value: boolean) => (
  //   <div className="active-switch">
  //     <label className="switch">
  //       <input type="checkbox" checked={value} />
  //       <span className="sliders round"></span>
  //     </label>
  //   </div>
  // );
  const actionButton = (data: Customer) => {
    return (
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#edit-customer"
          onClick={() => {
            setSelectedData(data);
          }}
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete-customer"
          onClick={() => {
            localStorage.setItem('customerId', data._id);
          }}
        >
          <Icon.Trash2 className="react-feather-custom" />
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
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit mb-0">
            <h5>Customers</h5>
            <div className="list-btn">
              <ul>
                <li>
                  <div className="filter-sorting">
                    <ul>
                      <li>
                        <Link to="#" className="filter-sets">
                          {/* <Icon.Filter size={15} />
                          Filter */}
                          sorting
                        </Link>
                      </li>
                      <li>
                        <span>
                          <ImageWithBasePath
                            src="assets/admin/img/icons/sort.svg"
                            className="me-2"
                            alt="img"
                          />
                        </span>
                        <div className="review-sort">
                          <Dropdown
                            value={selectedValue}
                            onChange={handleSortChange}
                            options={value}
                            optionLabel="name"
                            placeholder="A - Z"
                            className="select admin-select-breadcrumb"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#add-customer"
                  >
                    <i className="fa fa-plus me-2" />
                    Add Customers
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="table-resposnive table-div">
                <table className="table datatable">
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
                    <Column sortable field="date" header="Reg Date"></Column>
                    {/* <Column
                      sortable
                      field="lastActivity"
                      header="Last Activity"
                    ></Column> */}
                    <Column
                      sortable
                      field="isVerified"
                      header="Status"
                      body={(rowData) => (
                        <span
                          className={
                            rowData.isVerified === 'Active'
                              ? 'badge-active'
                              : ''
                          }
                        >
                          {rowData.isVerified ? 'verified' : 'not verified'}
                        </span>
                      )}
                    ></Column>
                    <Column
                      sortable
                      field="action"
                      header="Action"
                      body={actionButton}
                    ></Column>
                  </DataTable>
                  {/* <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords} // Correct prop name
                    onPageChange={handlePageChange}
                    rowsPerPageOptions={[10, 25, 50]}
                    className="mt-3"
                  /> */}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomersModal
        fromParent={selectedData}
        updateCus={() => fetchCategories()}
      />
      <DeleteCustomersModal updateCustomer={() => fetchCategories()} />
    </>
  );
};

export default Customers;
