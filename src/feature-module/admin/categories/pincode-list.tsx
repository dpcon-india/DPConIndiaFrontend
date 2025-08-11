import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import SubCatogriesModal from '../common/modals/subcategories-modal';
import DeletepinCodeModal from '../common/modals/pincode-modal';
import { createpinCode, fetchpinCode } from '../../../APICalls';
declare global {
  interface Window {
    bootstrap: any;
  }
}
const PincodeList = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedData, setSelectedData] = useState<SubCategory>();
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z');
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [newPinCode, setNewPinCode] = useState('');

  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  type SubCategory = {
    _id: string;
    id?: number;
    pincode: string;
    createdAt: Date;
    categoryId: string | any;
    date?: string;
  };

  const PINS = async () => {
    try {
      const data = await fetchpinCode();
      if (data) {
        const formattedData = data.map((e: SubCategory, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          categoryName: e?.categoryId?.categoryName || '',
        }));
        // const sortedData = sortData(formattedData, sortOrder);
        setTotalRecords(formattedData.length);
        setData(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    PINS();
  }, [sortOrder, first, rows]);

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: SubCategory, b: SubCategory) => {
      if (order === 'A - Z') {
        return a.pincode.localeCompare(b.pincode);
      } else {
        return b.pincode.localeCompare(a.pincode);
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

  const handleAddPinCode = async () => {
    try {
      await createpinCode({ pincode: newPinCode });
      setShowModal(false);
      setNewPinCode('');
      PINS();
    } catch (error) {
      console.error('Error adding PIN code:', error);
    }
  };

  const actionButton = (data: SubCategory) => {
    return (
      <div className="table-actions d-flex justify-content-start">
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#delete-pin"
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
            <h5>PIN CODES</h5>
            <div className="list-btn">
              <ul>
                {/* <li>
                  <div className="filter-sorting">
                    <Dropdown
                      value={selectedValue}
                      onChange={handleSortChange}
                      options={value}
                      optionLabel="name"
                      placeholder="A - Z"
                      className="select admin-select-breadcrumb"
                    />
                  </div>
                </li> */}
                <li>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fa fa-plus me-2" />
                    Add Pin Code
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <DataTable
                  value={data}
                  showGridlines
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column sortable field="id" header="ID" />
                  <Column sortable field="pincode" header="PinCode" />
                  <Column sortable field="date" header="Date" />
                  <Column
                    field="Action"
                    header="Action"
                    body={(bodyData) => actionButton(bodyData)}
                  />
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

      {/* Modal for Adding PIN Code */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add PIN Code</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={newPinCode}
                  onChange={(e) => setNewPinCode(e.target.value)}
                  placeholder="Enter PIN Code"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleAddPinCode}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <SubCatogriesModal fromParent={selectedData} /> */}
      <DeletepinCodeModal updateData={PINS} id={selectedData?._id} />
    </>
  );
};

export default PincodeList;
