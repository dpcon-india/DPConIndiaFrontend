/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { useSelector } from 'react-redux';
import TestimonialsModal from '../common/modals/testimonials-modal';
import { Testimonial } from '../../../GlobleType';
import { fetchTestimonials } from '../../../APICalls';
import moment from 'moment';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';

const Testimonials = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const [selectedData, setSelectedData] = useState<Testimonial>();
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order

  const fetchData = async () => {
    try {
      const data = await fetchTestimonials();
      if (data) {
        const formattedData = data.map((e: Testimonial, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e?.createdAt).format('DD MMM YYYY'),
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setData(sortedData); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: Testimonial, b: Testimonial) => {
      if (order === 'A - Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

  const renderCustomerNameColumn = (rowData: any) => {
    return (
      <div className="table-profileimage">
        <ImageWithoutBasePath
          className="me-2"
          src={rowData.image}
          alt="img"
          style={{ width: '50px', height: 'auto' }}
        />
        <div className="ml-2">
          {rowData.name && <span>{rowData.name.split('\n')[0]}</span>}
          <br />
          {rowData.name && <span>{rowData.name.split('\n')[1]}</span>}
        </div>
      </div>
    );
  };

  const renderStatusColumn = (resData: any) => {
    const statusClassName = resData.status ? 'badge-active' : 'badge-inactive';

    return (
      <span className={statusClassName}>
        {resData.status ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const actionButton = (data: Testimonial | any) => {
    return (
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          onClick={() => {
            setSelectedData(data);
          }}
          data-bs-toggle="modal"
          data-bs-target="#edit-testimonial"
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete-testimonial"
          onClick={() => {
            setSelectedData(data);
            localStorage.setItem('categoryId', data._id);
          }}
        >
          <Icon.Trash2 className="react-feather-custom" />
        </button>
      </div>
    );
  };

  const renderRatingStars = (resData: Testimonial) => {
    const num = resData.rating - 2;
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon.Star
            key={star}
            // className={`fas fa-star ${num >= star ? 'filled' : ''}`}
            // style={{ color: resData.rating >= star ? 'gold' : 'gray' }}
          />
        ))}
      </div>
    );
  };
  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
  };
  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit">
            <h5>Testimonials</h5>
            <div className="list-btn">
              <ul>
                <li>
                  <div className="filter-sorting">
                    <ul>
                      <li>
                        <Link to="#" className="filter-sets">
                          Sorting
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
                    data-bs-target="#add-testimonial"
                  >
                    <i className="fa fa-plus me-2" />
                    Add Testimonial
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="table-resposnive">
                <DataTable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  value={data}
                  showGridlines
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column sortable field="id" header="ID"></Column>
                  <Column
                    sortable
                    field="name"
                    header="UserName"
                    body={renderCustomerNameColumn}
                  ></Column>
                  <Column
                    sortable
                    field="rating"
                    header="rating"
                    // body={(val) => renderRatingStars(val)}
                  />
                  <Column sortable field="desc" header="Content"></Column>
                  <Column sortable field="date" header="createAt"></Column>
                  <Column
                    sortable
                    field="status"
                    header="status"
                    body={renderStatusColumn}
                  ></Column>
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
        <TestimonialsModal
          fromParent={selectedData}
          updateCus={() => fetchData()}
        />
      </div>
    </>
  );
};

export default Testimonials;
