import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  set_dark_mode,
  set_is_mobile_sidebar,
  set_mouseoversidebar_data,
  set_toggleSidebar_data_2,
} from '../../../../core/data/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { all_routes } from '../../../../core/data/routes/all_routes';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { AppState } from '../../../../core/models/interface';
import { useUser } from '../../../../core/data/context/UserContext';
import {
  fetchNotificationCount,
  fetchNotifications,
  updateAnnoucementReadByStaff,
} from '../../../../APICalls';
import moment from 'moment';

const ProviderHeader = () => {
  const routes = all_routes;
  const toggle_data = useSelector((state: AppState) => state.toggleSidebar2);
  const { logout }: any = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificaions, setNotfications] = useState<any>();

  const fetchData = async () => {
    try {
      const notif = await fetchNotifications();
      setNotfications(notif);
      setTimeout(async () => {
        await updateAnnoucementReadByStaff();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCount = async () => {
    try {
      const c = await fetchNotificationCount();
      setCount(c);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const toogle = () => {
    dispatch(set_toggleSidebar_data_2(toggle_data ? false : true));
  };

  const mobileSidebar = useSelector((state: AppState) => state.mobileSidebar);

  const handleClick = () => {
    dispatch(set_is_mobile_sidebar(!mobileSidebar));
  };

  const toggle = () => {
    dispatch(set_mouseoversidebar_data(true));
  };

  const toggle2 = () => {
    dispatch(set_mouseoversidebar_data(false));
  };

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode'));

  const LayoutDark = () => {
    const htmlElement = document.documentElement;
    if (darkMode === 'enabled') {
      localStorage.setItem('darkMode', 'enabled');
      dispatch(set_dark_mode(true));
      setDarkMode('enabled');
      htmlElement.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'disabled');
      dispatch(set_dark_mode(false));
      setDarkMode('disabled');
      htmlElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode'));
    LayoutDark();
  }, [darkMode]);

  return (
    <div className="header provider-header">
      {/* Logo */}
      <div
        className="header-left active"
        onMouseEnter={toggle}
        onMouseLeave={toggle2}
      >
        <Link to={routes.index} className="logo logo-normal d-flex align-items-center">
          <img
            src="/assets/img/dpconlogo.png"
            alt="Logo"
            style={{
              height: '45px',
              width: 'auto',
              objectFit: 'contain',
              marginRight: '12px'
            }}
          />
          <div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#000', 
              lineHeight: '1.1',
              letterSpacing: '0.5px'
            }}>DPCON</div>
            <div style={{ 
              fontSize: '10px', 
              color: '#666', 
              lineHeight: '1.1',
              fontWeight: '400',
              textAlign: 'center'
            }}>Engineers India Pvt Ltd</div>
          </div>
        </Link>
        <Link to={routes.index} className="logo-small">
          <img
            src="/assets/img/dpconlogo.png"
            alt="Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Link>
        <Link id="toggle_btn" onClick={toogle} to="#">
          <i className="ti ti-menu-deep" />
        </Link>
      </div>
      {/* /Logo */}
      <Link
        id="mobile_btn"
        onClick={handleClick}
        className="mobile_btn"
        to="#sidebar"
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      <div className="header-user">
        <div className="nav user-menu">
          <div className="d-flex align-items-center">
            <div className="provider-head-links">
              <div>
                <Link
                  to="#"
                  id="dark-mode-toggle"
                  onClick={() => setDarkMode('enabled')}
                  className={`dark-mode-toggle me-2 ${darkMode === 'disabled' && 'activate'}`}
                >
                  <i className="fa-regular fa-moon" />
                </Link>
                <Link
                  to="#"
                  id="light-mode-toggle"
                  onClick={() => setDarkMode('disabled')}
                  className={`dark-mode-toggle me-2 ${darkMode === 'enabled' && 'activate'}`}
                >
                  <i className="ti ti-sun-filled" />
                </Link>
              </div>
            </div>
            <div className="provider-head-links">
              <div
                className="d-flex align-items-center justify-content-center me-2 dropdown-toggle notify-link"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="true"
                onClick={() => {
                  fetchData();
                }}
                style={{ position: 'relative' }}
              >
                <i className="feather icon-bell" />
                {count != 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    background: 'red',
                    fontSize: '10px',
                    color: 'white',
                    borderRadius: '50%',
                    paddingInline: '0.3rem',
                    right: '-7px',
                  }}>
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <div className="dropdown-menu dropdown-menu-end notification-dropdown p-3">
                <div className="d-flex dropdown-body align-items-center justify-content-between border-bottom p-0 pb-3 mb-3">
                  <h6 className="notification-title">
                    Notifications{' '}
                    {count > 0 && (
                      <span className="fs-16 text-gray"> {`(${count})`}</span>
                    )}
                  </h6>
                </div>
                <div className="noti-content">
                  <div
                    className="d-flex flex-column"
                    style={{ maxHeight: '400px', overflowY: 'scroll' }}
                  >
                    {notificaions?.map((e: any, i: number) => (
                      <div className="border-bottom mb-3 pb-3" key={i}>
                        <div>
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <p className="mb-1 w-100 fs-16">
                                  <span className="text-dark fw-semibold">
                                    {e?.subject}
                                  </span>
                                </p>
                                {!e?.isRead && (
                                  <span className="d-flex justify-content-end ">
                                    <i className="ti ti-point-filled text-dark-blue" />
                                  </span>
                                )}
                              </div>
                              <p className="mb-1 w-100">{e?.message}</p>
                              <span>
                                {moment(e?.createdAt).format('MMMM DD YYYY')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="provider-head-links">
              <Link
                to="#"
                onClick={toggleFullscreen}
                className="d-flex align-items-center justify-content-center me-2"
              >
                <i className="feather icon-maximize" />
              </Link>
            </div>
            <div
              className="dropdown-item d-flex align-items-center"
              onClick={() => {
                navigate('/');
                logout();
              }}
            >
              <i className="ti ti-logout me-1" />
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <Link
          to="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <div
            className="dropdown-item"
            onClick={() => {
              navigate('/');
              logout();
            }}
          >
            <i className="ti ti-logout me-1" />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderHeader;