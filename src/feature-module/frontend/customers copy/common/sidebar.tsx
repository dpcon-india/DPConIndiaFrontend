import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import StickyBox from 'react-sticky-box';
import moment from 'moment';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { useUser } from '../../../../core/data/context/UserContext';
import {
  fetchNotificationCount,
  updateAnnoucementReadByStaff,
} from '../../../../APICalls';
const CustomerSideBar = () => {
  const routes = all_routes;
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [subdroptoggle, setsubdroptoggle] = useState(false);
  const { logout }: any = useUser();
  const [count, setCount] = useState<number>(0);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [user, setUser] = useState<any>();
  const fetchData = async () => {
    try {
      const c = await fetchNotificationCount();
      setCount(c);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    return () => {
      location.pathname.includes('settings')
        ? setsubdroptoggle(true)
        : setsubdroptoggle(false);
    };
  }, [location.pathname]);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchData();
  }, []);

  const activeRouterPath = (link: string) => {
    return link === location.pathname;
  };

  return (
    <>
      <StickyBox>
        <div className="card user-sidebar mb-4 mb-lg-0">
          <div className="card-header user-sidebar-header mb-4">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <span className="user rounded-circle avatar avatar-xxl mb-2">
                <ImageWithoutBasePath
                  src={user?.image || ''}
                  className="img-fluid rounded-circle"
                  alt="Img"
                />
              </span>
              <h6 className="mb-2">{user?.name || 'username'}</h6>
              <p className="fs-12">
                Member Since {moment(user?.createdAt).format('MMMM YYYY')}
              </p>
            </div>
          </div>
          <div className="card-body user-sidebar-body p-0">
            <ul>
              <li className="mb-4">
                <Link
                  to={routes.staffDashboard}
                  className={`d-flex align-items-center ${location.pathname === routes.staffDashboard && 'active'}`}
                >
                  <i className="ti ti-layout-grid me-2" />
                  Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={routes.staffBooking}
                  className={`d-flex align-items-center ${location.pathname === routes.staffBooking || location.pathname === routes.staffBookingCalendar ? 'active' : ''}`}
                >
                  <i className="ti ti-device-mobile me-2" />
                  Bookings
                </Link>
              </li>
              {/* <li className="mb-4">
                <Link
                  to={routes.staffSecurity}
                  className={`d-flex align-items-center ${location.pathname === routes.staffSecurity && 'active'}`}
                >
                  <i className="ti ti-lock  me-2" />
                  Change Password
                </Link>
              </li> */}{' '}
              <li className="mb-3">
                <Link
                  to={routes.staffNotification}
                  className={`fs-14 d-inline-flex align-items-center ${location.pathname === routes.staffNotification && 'active'}`}
                >
                  <i className="ti ti-chevrons-right me-2" />
                  Announcement
                  {count != 0 && (
                    <span className="bg-red p-1 rounded">{count}</span>
                  )}
                </Link>
              </li>
              <li className="mb-0">
                <div
                  className={`d-flex align-items-center `}
                  onClick={() => {
                    navigate('/');
                    logout();
                  }}
                >
                  <i className="ti ti-logout me-2" />
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
      </StickyBox>
      <>
        {/* Delete Account */}
        <div className="modal fade custom-modal" id="del-account">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
                <h5 className="modal-title">Delete Account</h5>
                <a href="#" data-bs-dismiss="modal" aria-label="Close">
                  <i className="ti ti-circle-x-filled fs-20" />
                </a>
              </div>
              <form>
                <div className="modal-body">
                  <p className="mb-3">
                    Are you sure you want to delete This Account? To delete your
                    account, Type your password.
                  </p>
                  <div className="mb-0">
                    <label className="form-label">Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        className="form-control pass-input"
                        placeholder="*************"
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        className={`toggle-password feather  ${passwordVisible ? 'icon-eye' : 'icon-eye-off'}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <a
                    href="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </a>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-dark"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Account */}
      </>
    </>
  );
};

export default CustomerSideBar;
