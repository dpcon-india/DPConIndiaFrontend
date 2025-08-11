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
import { fetchSubCategories } from '../../../APICalls';
import moment from 'moment';
import { Paginator } from 'primereact/paginator';

const SubCategoriesList = () => {
  // const data = useSelector((state: any) => state.sub_categories);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedData, setSelectedData] = useState<SubCategory>();
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const [totalRecords, setTotalRecords] = useState(0); // Total records for pagination
  const [first, setFirst] = useState(0); // Pagination start point
  const [rows, setRows] = useState(10); // Rows per page
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  type SubCategory = {
    _id: string;
    id?: number;
    SubcategoryName: string;
    SubcategorySlug: string;
    isFeatured: boolean;
    createdAt: Date;
    categoryId: string | any;
    date?: string;
  };
  const fetchCategories = async () => {
    try {
      const data = await fetchSubCategories();
      if (data) {
        const formattedData = data.map((e: SubCategory, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          categoryName: e?.categoryId?.categoryName || '',
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
    return categories.sort((a: SubCategory, b: SubCategory) => {
      if (order === 'A - Z') {
        return a.SubcategoryName.localeCompare(b.SubcategoryName);
      } else {
        return b.SubcategoryName.localeCompare(a.SubcategoryName);
      }
    });
  };
  const handlePageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };
  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
  };
  const renderFeaturedSwitch = (value: boolean) => (
    <div className="active-switch">
      <label className="switch">
        <input type="checkbox" checked={value} />
        <span className="sliders round"></span>
      </label>
    </div>
  );
  const actionButton = (data: SubCategory) => {
    return (
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#sub-edit-category"
          onClick={() => {
            setSelectedData(data);
            // localStorage.setItem('categoryObj', JSON.stringify(data));
          }}
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete-category"
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
  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div className="content-page-header content-page-headersplit mb-0">
            <h5>Sub Categories</h5>
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
                    data-bs-target="#sub-add-category"
                  >
                    <i className="fa fa-plus me-2" />
                    Add Sub Category
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
                    field="SubcategoryName"
                    header="SubCategory"
                  ></Column>
                  <Column
                    sortable
                    field="SubcategorySlug"
                    header="SEO Title"
                  ></Column>
                  <Column
                    sortable
                    field="categoryName"
                    header="Category"
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
                <Paginator
                  rows={rows}
                  totalRecords={totalRecords}
                  onPageChange={handlePageChange}
                  rowsPerPageOptions={[10, 25, 50]}
                  className="mt-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubCatogriesModal
        fromParent={selectedData}
        updateCus={() => fetchCategories()}
      />
      <DeleteSubCategoriesModal
        updateCustomer={() => fetchCategories()}
        id={selectedData?._id}
      />
    </>
  );
};

export default SubCategoriesList;
