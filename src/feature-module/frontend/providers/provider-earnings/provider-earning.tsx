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

// Modern H&M Style CSS
const hmStyles = {
  pageWrapper: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
    color: '#fff',
    padding: '24px 32px',
    marginBottom: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  card: {
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  statsCard: {
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  }
};

const ProviderEarnings = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [booking, setBookings] = useState<BookingDetails[]>([]);
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];

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

  // Calculate total earnings
  const totalEarnings = booking.reduce((sum, item) => sum + (item?.service?.price || 0), 0);
  const thisMonthEarnings = booking.filter(item =>
    moment(item.date).isSame(moment(), 'month')
  ).reduce((sum, item) => sum + (item?.service?.price || 0), 0);

  return (
    <>
      <div className="page-wrapper" style={hmStyles.pageWrapper}>
        <div className="content container-fluid" style={{ padding: '24px' }}>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div style={hmStyles.statsCard}>
                <div className="text-center">
                  <h6 style={{ color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Earnings</h6>
                  <h3 style={{ color: '#000', fontWeight: '600', margin: '0' }}>₹{totalEarnings.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div style={hmStyles.statsCard}>
                <div className="text-center">
                  <h6 style={{ color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>This Month</h6>
                  <h3 style={{ color: '#000', fontWeight: '600', margin: '0' }}>₹{thisMonthEarnings.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div style={hmStyles.statsCard}>
                <div className="text-center">
                  <h6 style={{ color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Bookings</h6>
                  <h3 style={{ color: '#000', fontWeight: '600', margin: '0' }}>{booking.length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Table */}
          <div style={hmStyles.card}>
            <div style={{ padding: '32px' }}>
              <h5 style={{ marginBottom: '24px', fontWeight: '600', color: '#1a1a1a' }}>Earnings History</h5>
              <div className="table-responsive">
                <DataTable
                  value={booking.reverse()}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  className="modern-table"
                  stripedRows
                  showGridlines={false}
                  style={{
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  pt={{
                    header: {
                      style: {
                        backgroundColor: '#f8f9fa',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '16px 20px',
                        border: 'none'
                      }
                    },
                    bodyRow: {
                      style: {
                        borderBottom: '1px solid #f0f0f0'
                      }
                    },
                    bodyCell: {
                      style: {
                        padding: '20px',
                        border: 'none'
                      }
                    }
                  }}
                >
                  <Column
                    field="service"
                    header="Service"
                    body={(rowData: BookingDetails) => (
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginRight: '16px',
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          <ImageWithoutBasePath
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            src={rowData?.service?.gallery[0] || ''}
                            alt="Service"
                          />
                        </div>
                        <div>
                          <span style={{ fontWeight: '500', color: '#1a1a1a' }}>
                            {rowData?.serviceTitle || 'N/A'}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                  <Column
                    field="service.price"
                    header="Amount"
                    body={(rowData: BookingDetails) => (
                      <span style={{
                        fontWeight: '600',
                        color: '#000',
                        fontSize: '15px'
                      }}>
                        ₹{rowData?.service?.price?.toLocaleString() || 0}
                      </span>
                    )}
                    style={{ textAlign: 'right' }}
                  />
                  <Column
                    field="date"
                    header="Date"
                    body={(rowData: BookingDetails) => (
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        {moment(rowData?.date).format('DD MMM YYYY')}
                      </span>
                    )}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderEarnings;
