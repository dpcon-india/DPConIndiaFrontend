import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { useSelector } from 'react-redux';
import FaqModal from '../common/modals/faq-modal';
import DeleteFaqModal from '../common/modals/delete-faq-modal';
import { FaqItem } from '../../../core/models/interface';
import { fetchFAQ } from '../../../APICalls';
import moment from 'moment';
import { FAQ } from '../../../GlobleType';

const Faq = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const [selectedData, setSelectedData] = useState<FAQ>();
  const [data, setData] = useState<FAQ[]>([]);
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const fetchData = async () => {
    try {
      const data = await fetchFAQ();
      if (data) {
        const formattedData = data.map((e: FAQ, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          categoryName: e?.category?.categoryName,
        }));

        const sortedData = sortData(formattedData, sortOrder);
        setData(sortedData); // Slice data based on current page
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sortData = (categories: FAQ[], order: string) => {
    return categories.sort((a: FAQ, b: FAQ) => {
      if (order === 'A - Z') {
        return a.question.localeCompare(b.question);
      } else {
        return b.question.localeCompare(a.question);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [sortOrder]);
  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
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
          data-bs-target="#edit-faq"
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete-faq"
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
    <div className="page-wrapper page-settings">
      <div className="content">
        <div className="content-page-header content-page-headersplit">
          <h5>FAQ’s</h5>
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
                  data-bs-target="#add-faq"
                >
                  <i className="fa fa-plus me-2" />
                  Add FAQ
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
                <Column sortable field="id" header="#"></Column>
                <Column sortable field="question" header="Title"></Column>
                <Column
                  sortable
                  field="categoryName"
                  header="Category"
                ></Column>
                <Column sortable field="answer" header="Details"></Column>
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
      <FaqModal fromParent={selectedData} updateCus={() => fetchData()} />
      <DeleteFaqModal
        updateCustomer={() => fetchData()}
        id={selectedData?._id}
      />
    </div>
  );
};

export default Faq;
