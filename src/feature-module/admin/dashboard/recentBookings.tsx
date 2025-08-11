import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../core/data/routes/all_routes';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import { AdminDashboardThree } from '../../../core/data/json/admin-dashboard3';
import { AdminDashboardInterface } from '../../../core/models/interface';

const RecentBookings = () => {
  const routes = all_routes;
  const data3 = useSelector(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (state: AdminDashboardThree) => state.admin_dashboard_3,
  );
  const serviceImage3 = (rowData: AdminDashboardInterface) => {
    const [service] = rowData.service.split('\n');
    return (
      <Link to={routes.viewServices} className="table-imgname">
        <ImageWithBasePath
          src={rowData.serviceImg}
          className="me-2"
          alt="img"
        />
        <span>{service}</span>
      </Link>
    );
  };
  const userImage = (rowData: AdminDashboardInterface) => {
    const [user] = rowData.user.split('\n');
    return (
      <Link to={routes.viewServices} className="table-imgname">
        <ImageWithBasePath src={rowData.userImg} className="me-2" alt="img" />
        <span>{user}</span>
      </Link>
    );
  };
  const providerImage = (rowData: AdminDashboardInterface) => {
    const [provider] = rowData.provider.split('\n');
    return (
      <Link to={routes.viewServices} className="table-imgname">
        <ImageWithBasePath
          src={rowData.providerImg}
          className="me-2"
          alt="img"
        />
        <span>{provider}</span>
      </Link>
    );
  };
  return (
    <div className="row">
      <div className="col-lg-12 widget-path">
        <div className="card mb-0">
          <div className="card-body">
            <div className="home-user">
              <div className="home-head-user home-graph-header">
                <h2>Recent Booking</h2>
                <Link to={routes.booking} className="btn btn-viewall">
                  View All
                  <ImageWithBasePath
                    src="assets/admin/img/icons/arrow-right.svg"
                    className="ms-2"
                    alt="img"
                  />
                </Link>
              </div>
              <div className="table-responsive datatable-nofooter">
                <table className="table datatable">
                  <DataTable
                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    value={data3}
                  >
                    <Column sortable field="#" header="#"></Column>
                    <Column sortable field="date" header="Date"></Column>
                    <Column
                      sortable
                      field="bookingTime"
                      header="Booking Time"
                    ></Column>
                    <Column
                      sortable
                      field="provider"
                      header="Provider"
                      body={providerImage}
                    ></Column>
                    <Column
                      sortable
                      field="user"
                      header="User"
                      body={userImage}
                    ></Column>
                    <Column
                      sortable
                      field="service"
                      header="Service"
                      body={serviceImage3}
                    ></Column>
                    <Column sortable field="amount" header="Amount"></Column>
                    <Column sortable field="status" header="Status"></Column>
                  </DataTable>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBookings;
