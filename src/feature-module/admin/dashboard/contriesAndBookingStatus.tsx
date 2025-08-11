import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../core/data/routes/all_routes';
import ReactApexChart from 'react-apexcharts';

const ContriesAndBookingStatus = () => {
  const routes = all_routes;
  const book: any = {
    series: [10, 45, 45],
    chart: {
      width: 700,
      type: 'pie',
    },
    labels: ['Team A', 'Team B', 'Team C'],
    color: ['#1BA345', '#0081FF', ' #FEC001'],
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
                <h2>Top Countries</h2>
                <div className="home-select">
                  <div className="dropdown">
                    <button
                      className="btn btn-action btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Monthly
                    </button>
                    <ul
                      className="dropdown-menu"
                      data-popper-placement="bottom-end"
                    >
                      <li>
                        <Link to="#" className="dropdown-item">
                          Weekly
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          Monthly
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          Yearly
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <Link
                      className="delete-table bg-white"
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <i className="fa fa-ellipsis-v" aria-hidden="true" />
                    </Link>
                    <ul
                      className="dropdown-menu"
                      data-popper-placement="bottom-end"
                    >
                      <li>
                        <Link to="#" className="dropdown-item">
                          {' '}
                          View
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          {' '}
                          Edit
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="chartgraph">
                <div className="row align-items-center">
                  <div className="col-lg-7">
                    <div id="world_map" />
                    {/* <WorldMap
                    color="blue"
                    value-suffix="people"
                    size="sm"
                    data={data}
                  /> */}
                    <div style={{ height: '400px', width: '100%' }}>
                      <iframe
                        src="https://www.google.com/maps/embed"
                        style={{
                          border: '0',
                          height: '265px',
                          width: '364px',
                        }}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="contact-map"
                      />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="bookingmap">
                      <ul>
                        <li>
                          <span>
                            <ImageWithBasePath
                              src="assets/admin/img/flags/us.png"
                              alt="img"
                              className="me-2"
                            />
                            United State
                          </span>
                          <h6>60%</h6>
                        </li>
                        <li>
                          <span>
                            <ImageWithBasePath
                              src="assets/admin/img/flags/in.png"
                              alt="img"
                              className="me-2"
                            />
                            India
                          </span>
                          <h6>80%</h6>
                        </li>
                        <li>
                          <span>
                            <ImageWithBasePath
                              src="assets/admin/img/flags/ca.png"
                              alt="img"
                              className="me-2"
                            />
                            Canada
                          </span>
                          <h6>50%</h6>
                        </li>
                        <li>
                          <span>
                            <ImageWithBasePath
                              src="assets/admin/img/flags/au.png"
                              alt="img"
                              className="me-2"
                            />
                            Australia
                          </span>
                          <h6>75%</h6>
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
                        <li>
                          <span />
                          <h6>Completed</h6>
                        </li>
                        <li className="process-status">
                          <span />
                          <h6>Process</h6>
                        </li>
                        <li className="process-pending">
                          <span />
                          <h6>Pending</h6>
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
    </div>
  );
};

export default ContriesAndBookingStatus;
