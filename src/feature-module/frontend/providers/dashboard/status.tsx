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
    <div className="row g-3">
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">Pending</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.pending || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-warning d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-clock" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">Completed</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.completed || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-success d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-check" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">In Progress</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.progress || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-info d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-loader" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">Accepted</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.accepted || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-primary d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-thumb-up" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">Rejected</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.rejected || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-dark d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-x" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-sm-6">
        <div className="card prov-widget h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="mb-2">
                <p className="mb-1 text-muted small">Cancelled</p>
                <h5 className="mb-0">
                  <span className="counter">{stats?.cancelled || 0}</span>
                </h5>
              </div>
              <span className="prov-icon bg-danger d-flex justify-content-center align-items-center rounded">
                <i className="ti ti-ban" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
