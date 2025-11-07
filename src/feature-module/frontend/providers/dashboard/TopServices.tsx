import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { fetchTopServicesByProvider } from '../../../../APICalls';

const TopServices = () => {
  const routes = all_routes;
  const [services, setServices] = useState<any>();

  const serviceImage1 = (rowData: any) => {
    return (
      <Link 
        to={routes.viewServices} 
        style={{
          textDecoration: 'none',
          color: '#1a1a1a',
          fontWeight: '500',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#000'}
        onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
      >
        {rowData?.serviceTitle || 'N/A'}
      </Link>
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchTopServicesByProvider(id);
      const additional = res.map((e: any, i: number) => ({ ...e, id: i + 1 }));
      setServices(additional);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="w-100">
      <div className="table-responsive">
        <DataTable
          value={services}
          className="modern-table"
          stripedRows
          showGridlines={false}
          style={{
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
          pt={{
            table: { 
              style: { 
                borderCollapse: 'separate',
                borderSpacing: '0 8px'
              } 
            },
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
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                marginBottom: '8px'
              }
            },
            bodyCell: {
              style: {
                padding: '20px',
                border: 'none',
                borderRadius: '8px'
              }
            }
          }}
        >
          <Column 
            field="id" 
            header="#"
            style={{ width: '60px', textAlign: 'center', fontWeight: '500' }}
          />
          <Column
            field="service"
            header="Service"
            body={serviceImage1}
            style={{ fontWeight: '500', color: '#1a1a1a' }}
          />
          <Column
            field="bookingCount"
            header="Bookings"
            body={(rowData) => (
              <span style={{
                backgroundColor: '#f0f0f0',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#666'
              }}>
                {rowData.bookingCount || 0}
              </span>
            )}
            style={{ textAlign: 'center' }}
          />
          <Column 
            field="category" 
            header="Category"
            style={{ color: '#666', fontSize: '13px' }}
          />
          <Column 
            field="price" 
            header="Amount"
            body={(rowData) => (
              <span style={{
                fontWeight: '600',
                color: '#000',
                fontSize: '14px'
              }}>
                ${rowData.price || 0}
              </span>
            )}
            style={{ textAlign: 'right' }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TopServices;
