import React, { useEffect, useState } from 'react';
import { fetchBookingsStatsByProvider } from '../../../../APICalls';

const Status = () => {
  const [stats, setStats] = useState<any>();
  const fetchData = async () => {
    const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
    try {
      const res = await fetchBookingsStatsByProvider(id);
      setStats(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="col-xxl-3 col-md-6">
      <div className="row flex-fill">
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Pending Appointments</p>
                  <h5>
                    <span className="counter">{stats?.pending}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-warning d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-success me-2">
              12% <i className="ti ti-arrow-badge-up-filled" />
            </span>
            from Last Week
          </p> */}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Completed Appointments</p>
                  <h5>
                    <span className="counter">{stats?.completed}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-success d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check text-dark" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-danger me-2">
              12% <i className="ti ti-arrow-badge-down-filled" />
            </span>
            from Last Week
          </p> */}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Progress Appointments</p>
                  <h5>
                    <span className="counter">{stats?.progress}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-info d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-danger me-2">0%</span>from Last
            Week
          </p> */}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Accepted Appointments</p>
                  <h5>
                    <span className="counter">{stats?.accepted}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-success d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-danger me-2">0%</span>from Last
            Week
          </p> */}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Rejected Appointments</p>
                  <h5>
                    <span className="counter">{stats?.rejected}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-dark d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-danger me-2">0%</span>from Last
            Week
          </p> */}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card prov-widget">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="mb-2">
                  <p className="mb-1">Cancelled Appointments</p>
                  <h5>
                    <span className="counter">{stats?.cancelled}</span>
                  </h5>
                </div>
                <span className="prov-icon bg-danger d-flex justify-content-center align-items-center rounded">
                  <i className="ti ti-calendar-check" />
                </span>
              </div>
              {/* <p className="fs-12">
            <span className="text-danger me-2">0%</span>from Last
            Week
          </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
