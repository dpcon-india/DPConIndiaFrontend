import React, { useEffect, useState, useRef } from 'react';
import StaffModal from './staffModal';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import CommonDatePicker from '../../../../core/hooks/commonDatePicker';
import CustomDropdown from '../../common/dropdown/commonSelect';
import {
  staffIdOption,
  staffOption,
  statusOption,
} from '../../../../core/data/json/dropDownData';
import { Column } from 'primereact/column';
import * as Icon from 'react-feather';
import { DataTable } from 'primereact/datatable';
import { fetchAllStaff, fetchStaffByProvider, deleteStaff } from '../../../../APICalls';
import './table.css';
import './pagination.css';
import moment from 'moment';

const StaffList = () => {
  const routes = all_routes;
  const [showFilter, setShowFilter] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [sortOrder, setSortOrder] = useState('A - Z'); // Default sorting order
  const [staff, setStaff] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  const hasFetched = useRef(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = user?.role;
      let data;
      
      if (userRole === 'admin') {
        // Admin can see all staff
        data = await fetchAllStaff();
      } else if (userRole === 'provider') {
        // Provider can see only their staff
        data = await fetchStaffByProvider(user._id);
      } else {
        setError('Unauthorized access');
        return;
      }
      
      if (data && Array.isArray(data)) {
        const formattedData = data.map((e: any, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          status: e.isVerified ? 'Active' : 'Inactive',
          phone: e.number || 'N/A',
          email: e.email || 'N/A',
        }));

        setStaff(formattedData);
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, []);
  
  useEffect(() => {
    if (staff.length > 0) {
      const sortedData = sortData([...staff], sortOrder);
      setStaff(sortedData);
    }
  }, [sortOrder]);
  const sortData = (categories: any[], order: string) => {
    return categories.sort((a: any, b: any) => {
      if (order === 'A - Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    // Immediately remove from UI
    setStaff(prev => prev.filter((s: any) => s._id !== staffToDelete._id));
    setStaffToDelete(null);
    // Delete in background
    try {
      await deleteStaff(staffToDelete._id);
    } catch (error) {
      console.error('Error deleting staff:', error);
      // If delete fails, refresh to restore correct state
      fetchData();
    }
  };

  const actionButton = (data: any) => {
    return (
      <div className="table-actions d-flex">
        <button
          className="delete-table border-none me-2"
          type="button"
          onClick={() => {
            setSelectedData(data);
          }}
          data-bs-toggle="modal"
          data-bs-target="#edit-staff"
        >
          <Icon.Edit className="react-feather-custom" />
        </button>
        <button
          className="delete-table border-none"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#del-staff"
          onClick={() => setStaffToDelete(data)}
        >
          <Icon.Trash2 className="react-feather-custom" />
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="page-wrapper" style={{ marginLeft: '260px', paddingTop: '48px' }}>
        <div className="content" style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '2rem 0' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '300', color: '#000', margin: 0 }}>Staff</h1>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Manage your team members</p>
            </div>
            <Link
              to="#"
              style={{
                backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem',
                borderRadius: '0', textDecoration: 'none', fontSize: '0.9rem',
                fontWeight: '400', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
              data-bs-toggle="modal"
              data-bs-target="#add-staff"
            >
              <Icon.Plus size={18} />Add Staff
            </Link>
          </div>
          {/* Staff Table */}
          <div style={{ padding: '0 1.5rem' }}>
            {error && (
              <div style={{ 
                backgroundColor: '#fee', 
                border: '1px solid #fcc', 
                color: '#c33', 
                padding: '1rem', 
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                <Icon.Loader size={48} style={{ marginBottom: '1rem' }} />
                <p>Loading staff...</p>
              </div>
            ) : staff.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                <Icon.Users size={48} style={{ marginBottom: '1rem' }} />
                <p>No staff members found</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
                <DataTable
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  value={staff}
                  tableStyle={{ minWidth: '50rem' }}
                  emptyMessage="No staff found"
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  paginatorClassName="custom-paginator"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                  <Column field="id" header="#" style={{ width: '60px', fontSize: '0.85rem', color: '#666' }} />
                  <Column field="name" header="STAFF NAME" style={{ fontSize: '0.85rem', fontWeight: '500' }} headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                  <Column field="email" header="EMAIL" style={{ fontSize: '0.85rem', color: '#666' }} headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                  <Column field="phone" header="PHONE" style={{ fontSize: '0.85rem', color: '#666' }} headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                  <Column field="date" header="CREATED ON" style={{ fontSize: '0.85rem', color: '#666' }} headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                  <Column field="services" header="SERVICES" headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} body={(e) => { if (e?.services && e.services.length > 0) { return (<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>{e.services.slice(0, 2).map((item: any, i: number) => (<span key={i} style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '0.2rem 0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.serviceTitle || item.name || 'Service'}</span>))}{e.services.length > 2 && (<span style={{ backgroundColor: '#e5e5e5', color: '#999', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>+{e.services.length - 2}</span>)}</div>); } return <span style={{ color: '#999', fontSize: '0.8rem' }}>No services</span>; }} />
                  <Column field="status" header="STATUS" headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} body={(e) => (<span style={{ backgroundColor: e.isVerified ? '#000' : '#999', color: '#fff', padding: '0.25rem 0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{e.status}</span>)} />
                  <Column field="action" header="ACTION" headerStyle={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }} body={(data) => (<div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={() => setSelectedData(data)} data-bs-toggle="modal" data-bs-target="#edit-staff" style={{ padding: '0.4rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}><Icon.Edit size={12} /></button><button onClick={() => setStaffToDelete(data)} data-bs-toggle="modal" data-bs-target="#del-staff" style={{ padding: '0.4rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}><Icon.Trash2 size={12} /></button></div>)} />
                </DataTable>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <StaffModal fromParent={selectedData} onUpdate={fetchData} onDelete={handleDeleteStaff} staffToDelete={staffToDelete} />
    </>
  );
};

export default StaffList;
