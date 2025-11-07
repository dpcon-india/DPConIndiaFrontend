import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';

const ProviderSidebar = () => {
  const routes = all_routes;
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const activeRouterPath = (link: string) => {
    return link === location.pathname;
  };

  const activeRouterPath3 = () => {
    return location.pathname.includes('staff');
  };

  const menuItems = [
    {
      path: '/providers/dashboard',
      icon: 'ti-layout-grid',
      label: 'Dashboard',
      isActive: activeRouterPath('/providers/dashboard')
    },
    {
      path: '/providers/provider-service',
      icon: 'ti-briefcase',
      label: 'Services',
      isActive: activeRouterPath('/providers/provider-service')
    },
    {
      path: '/providers/provider-booking',
      icon: 'ti-calendar',
      label: 'Bookings',
      isActive: activeRouterPath('/providers/provider-booking')
    },
    {
      path: routes.staffList,
      icon: 'ti-users',
      label: 'Staff',
      isActive: activeRouterPath3()
    },
    {
      path: '/providers/provider-earnings',
      icon: 'ti-cash',
      label: 'Earnings',
      isActive: activeRouterPath('/providers/provider-earnings')
    }
  ];

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '48px',
        left: '0',
        bottom: '0',
        width: '260px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e5e5',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Brand Section */}
        {/* <div style={{
          padding: '1.5rem 1.5rem 1rem',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h6 style={{
            margin: 0,
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>Provider Dashboard</h6>
        </div> */}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                margin: '0 1rem',
                borderRadius: '0',
                textDecoration: 'none',
                color: item.isActive ? '#000' : '#666',
                backgroundColor: item.isActive ? '#f8f8f8' : 'transparent',
                borderLeft: item.isActive ? '3px solid #000' : '3px solid transparent',
                fontSize: '0.875rem',
                fontWeight: item.isActive ? '500' : '400',
                transition: 'all 0.2s ease',
                marginBottom: '0.25rem'
              }}
              onMouseEnter={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              <i className={`ti ${item.icon}`} style={{
                fontSize: '1.125rem',
                marginRight: '0.75rem',
                width: '20px',
                textAlign: 'center'
              }} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <Link
            to="/providers/provider-service"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.6rem',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
            }}
          >
            <i className="ti ti-plus" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
            Add Service
          </Link>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.5rem',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{
            fontSize: '0.65rem',
            color: '#999',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            © 2024 DPCon Provider
          </div>
        </div>
      </div>
      {/* Delete Account Modal */}
      <div className="modal fade" id="del-account" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: 'none', borderRadius: '0' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #f0f0f0', padding: '1.5rem' }}>
              <h6 style={{ margin: 0, fontWeight: '500', fontSize: '1rem' }}>Delete Account</h6>
              <button type="button" data-bs-dismiss="modal" style={{
                border: 'none',
                background: 'none',
                fontSize: '1.25rem',
                color: '#666'
              }}>
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem 1.5rem' }}>
              <p style={{ margin: '0 0 1.5rem 0', color: '#666', lineHeight: '1.5' }}>
                Are you sure you want to delete this account? This action cannot be undone.
              </p>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#333'
                }}>Password</label>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '0',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="modal-footer" style={{
              borderTop: '1px solid #f0f0f0',
              padding: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button
                data-bs-dismiss="modal"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #e0e0e0',
                  background: '#fff',
                  color: '#666',
                  borderRadius: '0',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  borderRadius: '0',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderSidebar;
