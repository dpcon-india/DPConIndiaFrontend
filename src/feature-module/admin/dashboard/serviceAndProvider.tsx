import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { all_routes } from '../../../core/data/routes/all_routes';
import { useSelector } from 'react-redux';
import {
  fetchBookings,
  fetchBookingsStats,
  fetchTopServices,
} from '../../../APICalls';
import ImageWithoutBasePath from '../../../core/img/ImageWithoutBasePath';
import ReactApexChart from 'react-apexcharts';

const ServiceAndProvider = () => {
  const [services, setServices] = useState<any>();
  const [stats, setStats] = useState<any[]>([]);
  const routes = all_routes;

  const serviceImage1 = (rowData: any) => {
    return (
      <Link to={routes.viewServices} className="table-imgname">
        <ImageWithoutBasePath src={rowData?.image} className="me-2" alt="img" />
        <span>{rowData?.serviceTitle}</span>
      </Link>
    );
  };
  const serviceImage2 = (rowData: any) => {
    const [providerName] = rowData.providerName.split('\n');
    return (
      <Link to={routes.viewServices} className="table-imgname">
        <ImageWithBasePath src={rowData.img} className="me-2" alt="img" />
        <span>{providerName}</span>
      </Link>
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetchTopServices();
      const book = await fetchBookingsStats();
      const arr = Object.entries(book || {}).map(([key, value]) => ({
        key,
        value,
      }));
      setStats(arr);

      const additional = res?.map((e: any, i: number) => ({ ...e, id: i + 1 }));
      setServices(additional);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const series = stats.map((item) => item.value);
  const labels = stats.map((item) => item.key);

  const book: any = {
    series,
    chart: {
      width: 700,
      type: 'pie',
    },
    labels,
    colors: [
      '#8B8000', // Pending
      'darkgreen', // Completed
      'lightgreen', // Accepted
      '#8B0000', // Rejected
      '#0000FF', // Progress
      'lightcoral', // Cancelled
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-lg-8 col-sm-12 d-flex widget-path">
        <div className="card">
          <div className="card-body">
            <div className="home-user">
              <div className="home-head-user home-graph-header">
                <h2>Top Services</h2>
                <Link to={routes.allServices} className="btn btn-viewall">
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
                    value={services}
                  >
                    <Column sortable field="id" header="#"></Column>
                    <Column
                      sortable
                      field="service"
                      header="Service"
                      body={serviceImage1}
                    ></Column>
                    <Column
                      sortable
                      field="bookingCount"
                      header="Bookings"
                    ></Column>
                    <Column
                      sortable
                      field="category"
                      header="Category"
                    ></Column>
                    <Column
                      sortable
                      field="price"
                      header="Amount"
                      body={(rowData) => (
                        <p>₹{rowData.bookingCount * rowData.price}</p>
                      )}
                    ></Column>
                  </DataTable>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-12 d-flex widget-path">
        <div className="card">
          <div className="card-body">
            <div className="home-user">
              <div className="home-head-user home-graph-header">
                <h2>Booking Statistics</h2>
                <Link to={routes.booking} className="btn btn-viewall">
                  View All
                  <ImageWithBasePath
                    src="assets/admin/img/icons/arrow-right.svg"
                    className="ms-2"
                    alt="img"
                  />
                </Link>
              </div>
              <div className="chartgraph">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-sm-6">
                    <ReactApexChart
                      options={book}
                      series={book.series}
                      type="pie"
                      height={350}
                      width={200}
                    />
                  </div>
                  <div className="col-lg-5 col-sm-6">
                    <div className="bookingstatus">
                      <ul>
                        <li className="status-pending">
                          <span style={{ backgroundColor: '#8B8000' }} />
                          <h6>Pending</h6>
                        </li>
                        <li className="status-accepted">
                          <span style={{ backgroundColor: 'lightgreen' }} />
                          <h6>Accepted</h6>
                        </li>
                        <li className="status-completed">
                          <span style={{ backgroundColor: 'darkgreen' }} />
                          <h6>Completed</h6>
                        </li>
                        <li className="status-process">
                          <span style={{ backgroundColor: 'blue' }} />
                          <h6>Process</h6>
                        </li>
                        <li className="status-pending">
                          <span style={{ backgroundColor: 'coral' }} />
                          <h6>Rejected</h6>
                        </li>
                        <li className="status-pending">
                          <span style={{ backgroundColor: '#8B0000' }} />
                          <h6>Cancelled</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-lg-6 col-sm-12 d-flex widget-path">
        <div className="card">
          <div className="card-body">
            <div className="home-user">
              <div className="home-head-user home-graph-header">
                <h2>Top Providers</h2>
                <Link to={routes.provider} className="btn btn-viewall">
                  View All
                  <ImageWithBasePath
                    src="assets/admin/img/icons/arrow-right.svg"
                    className="ms-2"
                    alt="img"
                  />
                </Link>
              </div>
              <div className="table-responsive datatable-nofooter">
                <table className="table datatable ">
                  <DataTable
                    paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    value={data2}
                  >
                    <Column sortable field="#" header="#"></Column>
                    <Column
                      sortable
                      field="providerName"
                      header="Provider Name"
                      body={serviceImage2}
                    ></Column>
                    <Column sortable field="email" header="Email"></Column>
                    <Column sortable field="phone" header="Phone"></Column>
                  </DataTable>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ServiceAndProvider;
