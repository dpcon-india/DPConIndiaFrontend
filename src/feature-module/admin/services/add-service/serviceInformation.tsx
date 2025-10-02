import { Dropdown } from 'primereact/dropdown';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultEditor from 'react-simple-wysiwyg';
import * as Icon from 'react-feather';
import axios from 'axios';
import { api, bearerHeader } from '../../../../core/api/axiosCore';

// Type definitions
interface User {
  _id: string;
  role: string;
  providerId?: string;
  name: string;
  token?: string;
}

interface Provider {
  _id: string;
  name: string;
}

interface ServiceRow {
  id: number;
  additionalService: string;
  price: number;
  duration: string;
}

type props = {
  nextTab: CallableFunction;
};
const ServiceInformation: React.FC<props> = ({ nextTab }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Provider | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string } | null>(null);
  const [selectedSub, setSelectedCategorySub] = useState<{ name: string } | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [staffList, setStaffList] = useState<Provider[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [services, setServices] = useState<ServiceRow[]>([
    {
      id: 1,
      additionalService: '',
      price: 0,
      duration: '',
    },
  ]);

  const addNewServiceRow = () => {
    const newId = services.length + 1;
    setServices([
      ...services,
      { id: newId, additionalService: '', price: 0, duration: '' },
    ]);
  };

  const deleteServiceRow = (id: any) => {
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);
  };

  const handleInputChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, [name]: value } : service,
    );
    setServices(updatedServices);
  };

  // Fetch providers and check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user: User = JSON.parse(localStorage.getItem('user') || '{}');
        const isUserAdmin = user?.role === 'admin';
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          // Fetch all providers for admin
          const response = await axios.get<Provider[]>(`${api}profiles/all/provider`, bearerHeader);
          setProviders(response.data || []);
        } else if (user?.providerId) {
          // For providers, set their own ID and fetch their staff
          const provider: Provider = { _id: user.providerId, name: user.name };
          setSelectedProvider(provider);
          fetchStaff(user.providerId);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to load providers. Please try again.');
      }
    };

    checkUserRole();
  }, []);

  // Fetch staff for the selected provider
  const fetchStaff = async (providerId: string) => {
    if (!providerId) return;

    setIsLoading(true);
    setError('');
    try {
      interface StaffResponse {
        success: boolean;
        data: Provider[];
      }

      const response = await axios.get<StaffResponse>(
        `${api}profiles/provider/${providerId}/staff`,
        bearerHeader
      );

      if (response.data?.success) {
        setStaffList(response.data.data || []);
      } else {
        setStaffList([]);
        setError('No staff found for the selected provider');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load staff. Please try again.');
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle provider selection change
  const handleProviderChange = (e: { value: Provider | null }) => {
    const provider = e.value;
    setSelectedProvider(provider);
    setSelectedStaff(null);

    if (provider?._id) {
      fetchStaff(provider._id);
    } else {
      setStaffList([]);
    }
  };

  const valueCategory = [{ name: 'Car Wash' }, { name: 'House Cleaning' }];
  const valueSub = [{ name: 'Car Repair' }, { name: 'Plumbing' }];

  const [values, setValues] = React.useState<string>('');

  function onChange(e: { target: { value: string } }) {
    setValues(e.target.value);
  }

  return (
    <>
      <fieldset id="first-field">
        <div className="container-service space-service">
          <div className="sub-title">
            <h6>Service Information</h6>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Provider</label>
                {/* <select className="select">
                  <option>Johnny</option>
                  <option>James</option>
                </select> */}

                {isAdmin ? (
                  <Dropdown
                    value={selectedProvider}
                    onChange={handleProviderChange}
                    options={providers}
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="Select a provider"
                    className="select w-100"
                    disabled={isLoading}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={selectedProvider?.name || ''}
                    disabled
                  />
                )}
                {error && <div className="text-danger small mt-1">{error}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Staff Member</label>
                <Dropdown
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.value)}
                  options={staffList}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder={isLoading ? 'Loading staff...' : 'Select a staff member'}
                  className="select w-100"
                  disabled={isLoading || staffList.length === 0}
                />
                {isLoading && <small className="text-muted">Loading staff members...</small>}
                {!isLoading && staffList.length === 0 && (
                  <small className="text-muted">No staff members available</small>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Service Title</label>
                <input type="text" className="form-control" defaultValue="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Category</label>

                <Dropdown
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.value)}
                  options={valueCategory}
                  optionLabel="name"
                  placeholder=""
                  className="select w-100"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Sub Category</label>

                <Dropdown
                  value={selectedSub}
                  onChange={(e) => setSelectedCategorySub(e.value)}
                  options={valueSub}
                  optionLabel="name"
                  placeholder=""
                  className="select w-100"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group price">
                <label>
                  Price <span>Set 0 for free</span>
                </label>
                <input type="text" className="form-control" defaultValue="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Duration</label>
                <div className="form-duration">
                  <input type="text" className="form-control" defaultValue="" />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group service-editor">
                <label>Description</label>
                <DefaultEditor value={values} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="container-service">
          <div className="row">
            <div className="col-sm-12">
              <div className="additional">
                <div className="sub-title Service">
                  <h6>Additional Service</h6>
                </div>
                <div className="status-toggle float-sm-end mb-3">
                  <input
                    type="checkbox"
                    id="status_1"
                    className="check"
                    defaultChecked
                  />
                  <label htmlFor="status_1" className="checktoggle">
                    checkbox
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="addservice-info">
            <div className="row service-cont">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Additional Service</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Car Repair"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Price"
                    defaultValue={500}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group tax">
                  <label>
                    Duration <span>Include tax</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="30 mins"
                  />
                </div>
              </div>
            </div>
          </div> */}

          <div className="addservice-info">
            {services.map((service) => (
              <div key={service.id} className="row service-cont">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Additional Service</label>
                    <input
                      type="text"
                      className="form-control"
                      name="additionalService"
                      value={service.additionalService}
                      onChange={(event) => handleInputChange(service.id, event)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={service.price}
                      onChange={(event) => handleInputChange(service.id, event)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Duration <span>Include tax</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="duration"
                      value={service.duration}
                      onChange={(event) => handleInputChange(service.id, event)}
                    />
                  </div>
                </div>
                {service.id > 1 && ( // Only render delete button for newly added rows
                  <div className="col-md-1">
                    <button
                      onClick={() => deleteServiceRow(service.id)}
                      className="btn btn-danger-outline delete-icon"
                    >
                      <Icon.Trash2 className="react-feather-custom trashicon" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            to="#"
            className="link-sets add-extra"
            onClick={addNewServiceRow}
          >
            <i className="fa fa-plus-circle me-2" aria-hidden="true" />
            Add Additional Service
          </Link>
        </div>
        <div className="container-service space-service">
          <div className="row">
            <div className="col-lg-12">
              <div className="video">
                <div className="video-title">
                  <h6>Video</h6>
                </div>
              </div>
              <div className="video-link">
                <div className="form-group">
                  <label>Video Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://www.youtube.com/shorts/Lf-Z7H8bZ8o"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="bottom-btn">
              <div className="field-btns">
                <button
                  className="btn btn-primary next_btn"
                  type="button"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  onClick={nextTab}
                >
                  Next <i className="fas fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default ServiceInformation;
