import React, { useEffect, useState } from 'react';
import StaffModal from './staffModal';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import CommonDatePicker from '../../../../core/hooks/commonDatePicker';
import CustomDropdown from '../../common/dropdown/commonSelect';
import {
  staffIdOption,
  staffOption,
  statusOption,
} from '../../../../core/data/json/dropDownData';
import { Column } from 'primereact/column';
import * as Icon from 'react-feather';
import { DataTable } from 'primereact/datatable';
import { fetchStaff } from '../../../../APICalls';
import './table.css';
import moment from 'moment';

const StaffList = () => {
  const routes = all_routes;
  const [showFilter, setShowFilter] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const [staff, setStaff] = useState<any>([]);
  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const data = await fetchStaff(id);
      if (data) {
        const formattedData = data.map((e: any, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          categoryName: e?.category?.categoryName,
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setStaff(sortedData); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const sortData = (categories: any[], order: string) => {
    return categories.sort((a: any, b: any) => {
      if (order === 'A - Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };
  const actionButton = (data: any) => {
    return (
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          onClick={() => {
            setSelectedData(data);
          }}
          data-bs-toggle="modal"
          data-bs-target="#edit-staff"
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#del-staff"
          onClick={() => {
            localStorage.setItem('customerId', data._id);
          }}
        >
          <Icon.Trash2 className="react-feather-custom" />
        </button>
      </div>
    );
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mb-4">
            <h4>Staffs</h4>
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              {/* <span className="fs-14 me-2">Sort</span> */}
              {/* <div className="dropdown me-2">
                <Link
                  to="#"
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Newly Added
                </Link>
                <div className="dropdown-menu">
                  <Link to="#" className="dropdown-item active">
                    Newly Added
                  </Link>
                  <Link to="#" className="dropdown-item">
                    Oldest
                  </Link>
                </div>
              </div> */}
              {/* <div className="dropdown me-2">
                <Link
                  to="#"
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Export
                </Link>
                <div className="dropdown-menu">
                  <Link to="#" className="dropdown-item active">
                    Export
                  </Link>
                  <Link to="#" className="dropdown-item">
                    Import
                  </Link>
                </div>
              </div> */}
              {/* <Link
                to="#"
                className="tags d-flex justify-content-center align-items-center border rounded me-2"
              >
                <i className="ti ti-printer" />
              </Link>
              <Link
                to="#"
                className="tags d-flex justify-content-center align-items-center border rounded me-2"
                id="filter_search"
                onClick={() => setShowFilter(!showFilter)}
              >
                <i className="ti ti-sort-descending" />
              </Link>
              <Link
                to={routes.staffGrid}
                className="tags d-flex justify-content-center align-items-center border rounded me-2"
              >
                <i className="ti ti-layout-grid" />
              </Link>
              <Link
                to={routes.staffList}
                className="tags active d-flex justify-content-center align-items-center border rounded me-2"
              >
                <i className="ti ti-list" />
              </Link> */}
              <Link
                to="#"
                className="btn btn-dark d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#add-staff"
              >
                <i className="ti ti-circle-plus me-2" />
                Add Staffs
              </Link>
            </div>
          </div>
          <div
            id="filter_inputs"
            style={{ display: showFilter ? 'block' : 'none' }}
          >
            <div className="row">
              <div className="col-lg-4 col-md-6 col-xl">
                <div className="mb-3">
                  <div className="sel-cal react-calender Calendar-icon">
                    <span>
                      <i className="ti ti-calendar-month" />
                    </span>
                    <CommonDatePicker />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-xl">
                <div className="mb-3">
                  <CustomDropdown
                    options={staffIdOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-xl">
                <div className="mb-3">
                  <CustomDropdown
                    options={staffOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-xl">
                <div className="mb-3">
                  <CustomDropdown
                    options={statusOption}
                    className="select d-flex"
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="table-resposnive">
                <DataTable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  value={staff}
                  showGridlines
                  tableStyle={{ minWidth: '50rem' }}
                  rowClassName={() => 'data-table-row'}
                >
                  <Column sortable field="id" header="#"></Column>
                  <Column sortable field="name" header="Staffs Name"></Column>
                  <Column sortable field="date" header="Created On"></Column>
                  <Column
                    sortable
                    field="inService"
                    header="Services"
                    body={(e) => {
                      return e?.services?.map((item: any, i: number) => {
                        return <p key={i}>{item.serviceTitle}</p>;
                      });
                    }}
                  ></Column>
                  <Column sortable field="isAssigned" header="Status"></Column>
                  <Column
                    sortable
                    field="action"
                    header="Action"
                    body={actionButton}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <StaffModal fromParent={selectedData} />
    </>
  );
};

export default StaffList;
