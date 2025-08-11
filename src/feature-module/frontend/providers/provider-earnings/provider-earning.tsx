import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { BookingDetails } from '../../../../GlobleType';
import { fetchBookingsByProvider } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import moment from 'moment';

const ProviderEarnings = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [booking, setBookings] = useState<BookingDetails[]>([]);
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const actionBodyTemplate = () => {
    return (
      <td>
        <div className="table-actions">
          <Link className="action-set" to="#">
            <Icon.Edit size={15} />
          </Link>
          <Link className="action-set confirm-text" to="#">
            <Icon.Trash2 size={15} />
          </Link>
        </div>
      </td>
    );
  };
  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchBookingsByProvider(id);
      setBookings(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const data = useSelector((state: any) => state.provider_earning);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-md-4">
                <div className="provider-subtitle">
                  <h6>Earnings</h6>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Coupons */}
          <div className="row" style={{ alignContent: 'center' }}>
            <div className="col-md-12">
              <div className="provide-table manage-table">
                <div className="table-responsive">
                  <DataTable
                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    value={booking.reverse()}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    size={'small'}
                  >
                    {/* <Column sortable field="#" header="#"></Column> */}
                    <Column
                      field="service"
                      header="Service"
                      body={(rowData: BookingDetails) => (
                        <td>
                          <Link to="#" className="avatar avatar-m me-2">
                            <ImageWithoutBasePath
                              className="avatar-img rounded"
                              src={rowData?.service?. gallery[0] || ''}
                              alt="User Image"
                            />
                          </Link>
                          <Link to="#">{rowData?.serviceTitle}</Link>
                        </td>
                      )}
                    ></Column>
                    <Column
                      sortable
                      field="service.price"
                      header="EarnedAmount"
                      body={(rowData: BookingDetails) => (
                        <td>
                          <p>₹ {rowData?.service?.price}</p>
                        </td>
                      )}
                    ></Column>
                    <Column
                      sortable
                      field="date"
                      header="Date"
                      body={(rowData: BookingDetails) => (
                        <td>
                          <p>{moment(rowData?.date).format('DD-MM-YYYY')}</p>
                        </td>
                      )}
                    ></Column>
                    {/* <Column
                      sortable
                      field="action"
                      header="Action"
                      body={actionBodyTemplate}
                    ></Column> */}
                  </DataTable>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div id="tablelength" />
                </div>
                <div className="col-md-9">
                  <div className="table-ingopage">
                    <div id="tableinfo" />
                    <div id="tablepagination" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Coupons */}
        </div>
      </div>
    </>
  );
};

export default ProviderEarnings;
