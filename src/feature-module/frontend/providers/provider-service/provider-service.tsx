import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchServicesByProvider, updateServiceStatus, deleteService } from '../../../../APICalls';
import { IService } from '../../../../GlobleType';
import { all_routes } from '../../../../core/data/routes/all_routes';
import * as Icon from 'react-feather';
import moment from 'moment';
import EditServiceModal from './EditServiceModal';
import { Modal } from 'react-bootstrap';

const routes = all_routes;

const ProviderServices = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [data, setData] = useState<IService[]>([]);
  const [id, setId] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();


  const fetchData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchServicesByProvider(userId);
      const formattedData = res.map((service: any, index: number) => ({
        ...service,
        serialNo: index + 1,
        createdDate: moment(service.createdAt).format('DD MMM YYYY'),
        statusText: service.active ? 'Active' : 'Inactive',
        categoryName: service.categories?.[0]?.categoryName || 'N/A',
        locationText: `${service.location?.city || ''}, ${service.location?.locality || ''}, ${service.location?.pincode || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A',
        serviceImage: service.image || service.gallery?.[0] || '',
      }));
      setData(formattedData);
      setServices(formattedData.filter(s => s.active === (activeTab === 'active')));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (tab: 'active' | 'inactive') => {
    setActiveTab(tab);
    const filtered = data.filter(s => s.active === (tab === 'active'));
    setServices(filtered);
  };

  const updateStatus = async (active: boolean) => {
    try {
      await updateServiceStatus(active, id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteService = async () => {
    try {
      const result = await deleteService(id);
      if (result?.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchData();
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessModal(true);
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  useEffect(() => {
    handleTabChange(activeTab);
  }, [data]);






  return (
    <>
    <div className="page-wrapper" style={{ marginLeft: '260px', paddingTop: '48px' }}>
      <div className="content" style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '300', color: '#000', margin: 0 }}>Services</h1>
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Manage your offerings</p>
        </div>
        <Link to={routes.createService} style={{
          backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem',
          borderRadius: '0', textDecoration: 'none', fontSize: '0.9rem',
          fontWeight: '400', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Icon.Plus size={18} />Add Service
        </Link>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #e5e5e5', padding: '0 1.5rem' }}>
        {['active', 'inactive'].map(tab => (
          <button key={tab} onClick={() => handleTabChange(tab as 'active' | 'inactive')}
            style={{
              padding: '1rem 0', marginRight: '2rem', border: 'none', background: 'none',
              fontSize: '0.9rem', fontWeight: '400', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
              color: activeTab === tab ? '#000' : '#666'
            }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({data.filter(s => s.active === (tab === 'active')).length})
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div style={{ padding: '0 1.5rem' }}>
      {services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
          <Icon.Package size={48} style={{ marginBottom: '1rem' }} />
          <p>No {activeTab} services</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {services.map(service => (
            <div key={service._id} style={{
              backgroundColor: '#fff', border: '1px solid #e5e5e5', overflow: 'hidden',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div style={{ position: 'relative', height: '140px' }}>
                <img src={service.serviceImage || '/placeholder.jpg'} alt={service.serviceTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  backgroundColor: service.active ? '#000' : '#999', color: '#fff',
                  padding: '0.25rem 0.5rem', fontSize: '0.7rem'
                }}>
                  {service.statusText}
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '400', margin: '0 0 0.5rem 0' }}>
                  {service.serviceTitle}
                </h3>
                <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.75rem 0', lineHeight: '1.3' }}>
                  {service.description?.substring(0, 60)}...
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>PRICE</span>
                    <div style={{ fontSize: '1rem', fontWeight: '500' }}>₹{service.price}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>CATEGORY</span>
                    <div style={{ fontSize: '0.8rem' }}>{service.categoryName}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#666', fontSize: '0.75rem' }}>
                  <Icon.MapPin size={12} />{service.locationText}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0' }}>
                  <button onClick={() => setSelectedService(service)} data-bs-toggle="modal" data-bs-target="#edit-service"
                    style={{ flex: 1, padding: '0.4rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                    <Icon.Edit size={12} />
                  </button>
                  <button onClick={() => setId(service._id)} data-bs-toggle="modal" data-bs-target={service.active ? '#in-active' : '#active'}
                    style={{ padding: '0.4rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                    <Icon.ToggleLeft size={12} />
                  </button>
                  <button onClick={() => setId(service._id)} data-bs-toggle="modal" data-bs-target="#del-service"
                    style={{ padding: '0.4rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                    <Icon.Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
    </div>
    
    {/* Modals */}
      <div className="modal fade" id="in-active">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <h6 style={{ margin: 0, fontWeight: '400' }}>Deactivate Service</h6>
              <button type="button" data-bs-dismiss="modal" style={{ border: 'none', background: 'none' }}>
                <Icon.X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <p style={{ margin: '0 0 2rem 0' }}>Deactivate this service?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff' }}>Cancel</button>
                <button onClick={() => updateStatus(false)} data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: 'none', background: '#000', color: '#fff' }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal fade" id="active">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <h6 style={{ margin: 0, fontWeight: '400' }}>Activate Service</h6>
              <button type="button" data-bs-dismiss="modal" style={{ border: 'none', background: 'none' }}>
                <Icon.X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <p style={{ margin: '0 0 2rem 0' }}>Activate this service?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff' }}>Cancel</button>
                <button onClick={() => updateStatus(true)} data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: 'none', background: '#000', color: '#fff' }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal fade" id="del-service">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <h6 style={{ margin: 0, fontWeight: '400' }}>Delete Service</h6>
              <button type="button" data-bs-dismiss="modal" style={{ border: 'none', background: 'none' }}>
                <Icon.X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <p style={{ margin: '0 0 2rem 0' }}>Delete this service permanently?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff' }}>Cancel</button>
                <button onClick={handleDeleteService} data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: 'none', background: '#000', color: '#fff' }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EditServiceModal selectedService={selectedService} onServiceUpdated={fetchData} />
      
      {/* Success Modal */}
      <Modal centered show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <div className="modal-body">
          <div className="text-center py-4">
            <span className="success-check mb-3 mx-auto">
              <i className="ti ti-check" />
            </span>
            <h4 className="mb-2">Service Created Successfully</h4>
            <p>
              Service has been created and added to your Service List
            </p>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <button 
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProviderServices;
