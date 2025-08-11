/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { all_routes } from '../../../core/data/routes/all_routes';
import * as Icon from 'react-feather';
import { BookingInterface } from '../../../core/models/interface';
import axios from 'axios';
import { fetchBookings } from '../../../APICalls';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';

const Booking = () => {
  const routes = all_routes;
  // const data = useSelector((state: any) => state.all_booking);
  const [type, setType] = useState<string>('all');
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState();
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order

  const fetchData = async (type: string) => {
    try {
      let t;
      if (type == 'all') t = '';
      else t = type;
      const res = await fetchBookings(t);
      if (res) {
        const formattedData = res.map((e: any, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.date).format('DD MMM YYYY'),
          providerName: e?.provider?.name,
          userName: e?.customer?.name,
          serviceName: e.service?.serviceTitle,
          price: e?.service?.price,
          staffName: e?.acceptedBy?.name,
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setData(sortedData); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: any, b: any) => {
      if (order === 'A - Z') {
        return a.customerName.localeCompare(b.customerName);
      } else {
        return b.customerName.localeCompare(a.customerName);
      }
    });
  };
  useEffect(() => {
    fetchData(type);
  }, [type]);

  const value2 = [
    { name: 'Select Status' },
    { name: 'Pending' },
    { name: 'Inprogress' },
    { name: 'Completed' },
    { name: 'Cancelled' },
  ];

  // const fetchBooks = async () => {
  //   try {
  //     // const bookings =
  //   } catch (error) {}
  // };
  // useEffect(() => {}, []);

  const providerImage = (rowData: any) => {
    return (
      <Link to="#" className="table-profileimage">
        <ImageWithoutBasePath
          src={rowData?.provider?.image}
          className="me-2"
          alt="img"
        />
        <span>{rowData.providerName}</span>
      </Link>
    );
  };
  const userImage = (rowData: any) => {
    return (
      <Link to="#" className="table-profileimage">
        <ImageWithoutBasePath
          src={rowData?.customer?.image}
          className="me-2"
          alt="img"
        />
        <span>{rowData.userName}</span>
      </Link>
    );
  };
  const staffImage = (rowData: any) => {
    return (
      <Link to="#" className="table-profileimage">
        <ImageWithoutBasePath
          src={rowData?.acceptedBy?.image}
          className="me-2"
          alt="img"
        />
        <span>{rowData.staffName}</span>
      </Link>
    );
  };
  const serviceImage = (rowData: any) => {
    return (
      <Link to="#" className="table-imgname">
        <ImageWithoutBasePath
          src={rowData?.service?.gallery[0]}
          className="me-2"
          alt="img"
        />
        <span>{rowData.serviceName}</span>
      </Link>
    );
  };
  const statusButton = (rowData: BookingInterface) => {
    if (rowData.status === 'Completed') {
      return <span className="badge-delete">{rowData.status}</span>;
    } else if (rowData.status === 'Canceleld') {
      return <span className="badge-inactive">{rowData.status}</span>;
    } else if (rowData.status === 'Inprogress') {
      return <span className="badge-inactive">{rowData.status}</span>;
    } else if (rowData.status === 'Pending') {
      return <span className="badge-pending">{rowData.status}</span>;
    } else {
      return rowData.status;
    }
  };
  const actionButton = () => {
    return (
      <div className="table-select">
        <div className="form-group mb-0">
          <select className="form-select">
            <option>Select Status</option>
            <option> Pending</option>
            <option> Inprogress</option>
            <option>Completed</option>
            <option>cancelled</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit">
            <h5>Booking List</h5>
            <div className="list-btn">
              <ul>
                <li>
                  <div className="filter-sorting">
                    <ul>
                      <li>
                        <Link to="#" className="filter-sets">
                          <Icon.Filter className="react-feather-custom me-2" />
                          Filter
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
                            onChange={(e) => setSelectedValue(e.value)}
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
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="tab-sets">
                <div className="tab-contents-sets">
                  <ul>
                    <li onClick={() => setType('all')}>
                      <div className={type == 'all' ? 'active' : ''}>
                        All Booking
                      </div>
                    </li>
                    <li onClick={() => setType('pending')}>
                      <div className={type == 'pending' ? 'active' : ''}>
                        Pending{' '}
                      </div>
                    </li>
                    <li onClick={() => setType('progress')}>
                      <div className={type == 'progress' ? 'active' : ''}>
                        Inprogress
                      </div>
                    </li>
                    <li onClick={() => setType('completed')}>
                      <div className={type == 'completed' ? 'active' : ''}>
                        Completed
                      </div>
                    </li>
                    <li onClick={() => setType('cancelled')}>
                      <div className={type == 'cancelled' ? 'active' : ''}>
                        Cancelled
                      </div>
                    </li>
                    <li onClick={() => setType('accepted')}>
                      <div className={type == 'accepted' ? 'active' : ''}>
                        Accepted
                      </div>
                    </li>
                    <li onClick={() => setType('rejected')}>
                      <div className={type == 'rejected' ? 'active' : ''}>
                        Rejected
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="tab-contents-count">
                  <h6>Showing 8-10 of 84 results</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="table-resposnive table-div">
                <table className="table datatable">
                  <DataTable
                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    value={data}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                  >
                    <Column sortable field="id" header="#"></Column>
                    <Column sortable field="date" header="Date"></Column>
                    {/* <Column
                      sortable
                      field="bookingTime"
                      header="Booking Time"
                    ></Column> */}
                    <Column
                      sortable
                      field="providerName"
                      header="Provider"
                      body={providerImage}
                    ></Column>
                    <Column
                      sortable
                      field="userName"
                      header="User"
                      body={userImage}
                    ></Column>
                    <Column
                      sortable
                      field="staffName"
                      header="Staff"
                      body={staffImage}
                    ></Column>
                    <Column
                      sortable
                      field="serviceName"
                      header="Service"
                      body={serviceImage}
                    ></Column>
                    {/* <Column sortable field="price" header="Amount"></Column> */}
                    <Column
                      sortable
                      field="price"
                      header="Amount"
                      body={(rowData) => `₹${rowData.price}`}
                    />

                    <Column
                      sortable
                      field="paymentStatus"
                      header="Payment"
                      // body={statusButton}
                    ></Column>
                    <Column
                      sortable
                      field="status"
                      header="Status"
                      body={statusButton}
                    ></Column>
                    <Column
                      sortable
                      field="action"
                      header="Action"
                      body={actionButton}
                    ></Column>
                  </DataTable>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
