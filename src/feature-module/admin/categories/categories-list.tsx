import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import * as Icon from 'react-feather';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import CatogriesModal from '../common/modals/catogries-modal';
import { useSelector } from 'react-redux';
import DeleteCategoriesModal from '../common/modals/delete-categories-modal';
import axios from 'axios';
import { api } from '../../../config';
import moment from 'moment';
import { Paginator } from 'primereact/paginator'; // Import Paginator component

const CategoriesList = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const [totalRecords, setTotalRecords] = useState(0); // Total records for pagination
  const [first, setFirst] = useState(0); // Pagination start point
  const [rows, setRows] = useState(10); // Rows per page
  const [selectedData, setSelectedData] = useState<Category>();
  type Category = {
    _id: string;
    id?: number;
    categoryName: string;
    categorySlug: string;
    isFeatured: boolean;
    createdAt: Date;
    date?: string;
  };

  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${api}categories`);
      if (data) {
        const formattedData = data.map((e: Category, index: number) => ({
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

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: Category, b: Category) => {
      if (order === 'A - Z') {
        return a.categoryName.localeCompare(b.categoryName);
      } else {
        return b.categoryName.localeCompare(a.categoryName);
      }
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [sortOrder, first, rows]);

  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
  };

  const handlePageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const renderFeaturedSwitch = (value: boolean) => (
    <div className="active-switch">
      <label className="switch">
        <input type="checkbox" checked={value} />
        <span className="sliders round"></span>
      </label>
    </div>
  );

  const actionButton = (data: Category) => (
    <div className="table-actions d-flex">
      <Link
        className="delete-table me-2"
        to="#"
        data-bs-toggle="modal"
        data-bs-target="#edit-category"
        onClick={() => {
          // localStorage.setItem('categoryObj', JSON.stringify(data));
          setSelectedData(data);
        }}
      >
        <Icon.Edit className="react-feather-custom" />
      </Link>
      <Link
        className="delete-table border-none"
        to="#"
        data-bs-toggle="modal"
        data-bs-target="#delete-category"
        onClick={() => {
          setSelectedData(data);
          localStorage.setItem('categoryId', data._id);
        }}
      >
        <Icon.Trash2 className="react-feather-custom" />
      </Link>
    </div>
  );

  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit mb-0">
            <h5>Main Categories</h5>
            <div className="list-btn">
              <ul>
                <li>
                  <div className="filter-sorting">
                    <ul>
                      <li>
                        <Link to="#" className="filter-sets">
                          <p style={{ margin: '0' }}>sorting</p>
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
                    data-bs-target="#add-category"
                  >
                    <i className="fa fa-plus me-2" />
                    Add Category
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <div className="table-resposnive table-div">
                <DataTable
                  value={data}
                  showGridlines
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column sortable field="id" header="ID"></Column>
                  <Column
                    sortable
                    field="categoryName"
                    header="Categories"
                  ></Column>
                  <Column
                    sortable
                    field="categorySlug"
                    header="SEO Title"
                  ></Column>
                  <Column sortable field="date" header="Date"></Column>
                  <Column
                    sortable
                    field="isFeatured"
                    header="Featured"
                    body={(rowData) => renderFeaturedSwitch(rowData.isFeatured)}
                  ></Column>
                  <Column
                    sortable
                    field="Action"
                    header="Action"
                    body={(bodyData) => actionButton(bodyData)}
                  ></Column>
                </DataTable>
                {/* Paginator */}
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={totalRecords} // Correct prop name
                  onPageChange={handlePageChange}
                  rowsPerPageOptions={[10, 25, 50]}
                  className="mt-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CatogriesModal
        fromParent={selectedData}
        updateCus={() => fetchCategories()}
      />
      <DeleteCategoriesModal
        updateCustomer={() => fetchCategories()}
        id={selectedData?._id}
      />
    </>
  );
};

export default CategoriesList;
