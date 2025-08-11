import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { AllserviceInterface } from '../../../core/models/interface';
import ProviderListModal from './ProviderListModal';
import { deleteService, fetchServices } from '../../../APICalls';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import moment from 'moment';

const AllService = () => {
  const [data, setData] = useState([]);
  const [selectedService, setSelectedService] = useState<any>();
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const fetchServ = async () => {
    try {
      const res = await fetchServices();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchServ();
  }, []);

  const closeModal = () => {
    (
      document.querySelector(`[data-bs-dismiss="modal"]`) as HTMLElement
    )?.click();
  };
  const renderBody = (res: any) => {
    const imageSrc =
      res?.image && res.image.trim() !== '' ? res.image : res?.gallery?.[0];
    return (
      <Link to="#" className="table-imgname">
        <ImageWithoutBasePath src={imageSrc} className="me-2" alt="img" />
        <span>{res?.serviceTitle}</span>
      </Link>
    );
  };

  // console.log(res?.image)
  const renderBody2 = (res: any) => {
    return (
      <h6 className={`${res.active ? 'badge-active' : 'badge-inactive'}`}>
        {res.active ? 'Active' : 'Inactive'}
      </h6>
    );
  };
  const renderBody4 = (res: any) => {
    return (
      <Link to="#" className="table-profileimage">
        <span>{moment(res?.createdAt).format('MMM DD YYYY')}</span>
      </Link>
    );
  };
  const deleteHandler = async (e: any) => {
    try {
      const res = await deleteService(selectedService?._id);
      if (res?.status !== 200) {
        setErrorMessage(res?.message);
        return setTimeout(() => {
          setErrorMessage('');
        }, 2000);
      }
      setMessage(res?.message);
      return setTimeout(() => {
        closeModal();
        e?.currentTarget?.setAttribute('data-bs-dismiss', 'modal');
        fetchServ();
        setMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error as string);
      return setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const renderBody3 = (res: any) => {
    return (
      <div className="action-language">
        <div
          onClick={() => {
            navigate('/services/edit-service', { state: res });
          }}
          className="table-edit"
        >
          <i className="fa-regular fa-pen-to-square"></i>
          <span>Edit</span>
        </div>
        <button
          className="table-delete"
          type="button"
          onClick={() => {
            setSelectedService(res);
          }}
          data-bs-toggle="modal"
          data-bs-target="#delete-item"
          style={{ border: 'none' }}
        >
          <i className="fa-solid fa-trash-can"></i>
          <span>Delete</span>
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="page-wrapper page-settings">
        <div className="content">
          <div
            className="content-page-header content-page-headersplit"
            style={{ marginBottom: '0' }}
          >
            <h5>Services</h5>
            <div className="list-btn">
              <ul>
                <li>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#provider-list"
                  >
                    <i className="fa fa-plus me-2" />
                    Create
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
                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    value={data}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                  >
                    <Column header="Service" body={renderBody}></Column>
                    <Column
                      header="Staff"
                      body={(res) => {
                        return (
                          <Link to="#" className="table-imgname">
                            <ImageWithoutBasePath
                              src={res?.providerId?.image}
                              className="me-2"
                              alt="img"
                            />
                            <span>{res?.providerId?.name}</span>
                          </Link>
                        );
                      }}
                    ></Column>
                    <Column
                      field="category"
                      header="Category"
                      body={(res) => {
                        return (
                          <Link to="#" className="table-imgname">
                            <ImageWithoutBasePath
                              src={res?.categoryId?.image}
                              className="me-2"
                              alt="img"
                            />
                            <span>{res?.categoryId?.categoryName}</span>
                          </Link>
                        );
                      }}
                    ></Column>
                    <Column
                      field="subCategory"
                      header="Sub Category"
                      body={(res) => {
                        return (
                          <Link to="#" className="table-imgname">
                            <span>{res?.SubcategoryId?.SubcategoryName}</span>
                          </Link>
                        );
                      }}
                    ></Column>
                    <Column sortable field="price" header="Price"></Column>
                    <Column
                      sortable
                      field="duration"
                      header="Duration"
                    ></Column>
                    <Column
                      field="status"
                      header="Status"
                      body={renderBody2}
                    ></Column>
                    <Column
                      field="CreatedAt"
                      header="Created At"
                      body={renderBody4}
                    ></Column>
                    <Column header="Action" body={renderBody3}></Column>
                  </DataTable>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete */}
      <div
        className="modal fade"
        id="delete-item"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <button
                type="button"
                className="delete-popup"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-regular fa-rectangle-xmark" />
              </button>
              <div className="del-modal">
                <h5>Do you realy want to delete this service?</h5>
                <p>{selectedService?.serviceTitle}</p>
              </div>
              {message && (
                <p style={{ textAlign: 'center', color: 'green' }}>{message}</p>
              )}
              {errorMessage && (
                <p style={{ textAlign: 'center', color: 'red' }}>
                  {errorMessage}
                </p>
              )}
              <div className="delete-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn modal-delete"
                  onClick={(e) => deleteHandler(e)}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ProviderListModal />
    </>
  );
};

export default AllService;
