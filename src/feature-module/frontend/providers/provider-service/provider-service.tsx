import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchServicesByProvider,
  updateServiceStatus,
} from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { IService } from '../../../../GlobleType';
import { all_routes } from '../../../../core/data/routes/all_routes';

const routes = all_routes;

const ProviderServices = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [data, setData] = useState<IService[]>([]);
  const [id, setId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchServicesByProvider(id);
      const sortedData = sortServices(res, sortOrder);
      setData(sortedData);
      filtered(sortedData, true);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = (res: IService[], active: boolean) => {
    try {
      const filter = res?.filter((e: IService) => e?.active === active);
      setServices(filter);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (active: boolean) => {
    try {
      await updateServiceStatus(active, id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  const sortServices = (services: IService[], order: 'asc' | 'desc') => {
    return services.sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0; // Fallback to 0 if undefined
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0; // Fallback to 0 if undefined
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sortedData = sortServices(data, newOrder);
    setData(sortedData);
    filtered(sortedData, true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const option = [5, 10, 20, 50, 100];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
              <h5>My Services</h5>
              <div className="d-flex align-items-center">
                <span className="fs-14 me-2">Sort</span>
                <div className="dropdown me-2">
                  <button
                    className="btn bg-light-300"
                    onClick={handleSortToggle}
                  >
                    {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  </button>
                </div>
                <Link
                  to={routes.createService}
                  className="btn btn-dark d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Services
                </Link>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="tab-list mb-4" role="tablist">
              <ul className="nav d-flex align-items-center">
                <li>
                  <Link
                    to="#"
                    className="act-btn active me-3 p-2 rounded fs-14"
                    data-bs-toggle="tab"
                    // data-bs-target="#active-service"
                    // role="tab"
                    // aria-controls="active-service"
                    aria-selected="true"
                    tabIndex={-1}
                    onClick={() => filtered(data, true)}
                  >
                    Active Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="act-btn p-2 rounded fs-14"
                    data-bs-toggle="tab"
                    aria-selected="false"
                    tabIndex={-1}
                    onClick={() => filtered(data, false)}
                  >
                    Inactive Services
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-xl-12 col-lg-12">
              <div className="row  align-items-center">
                {currentServices?.map((e, i) => (
                  <div className="col-xl-4 col-md-6" key={i}>
                    <div className="card p-0">
                      <div className="card-body p-0">
                        <div className="img-sec w-100">
                          <Link to={routes.serviceDetails1}>
                            <img
                              src={e.gallery[0] || ''}
                              className="img-fluid rounded-top w-100"
                              alt="img"
                              style={{ height: '300px', objectFit: 'cover' }}
                            />
                          </Link>
                          <div className="image-tag d-flex justify-content-end align-items-center">
                            <span className="trend-tag">
                              {e?.categoryId?.categoryName}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h5 className="mb-2 text-truncate">
                            <Link to={routes.serviceDetails1}>
                              {e?.serviceTitle}
                            </Link>
                          </h5>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="fs-14 mb-0">
                              <i className="ti ti-map-pin me-2" />
                              {e?.location?.city}
                              {', ' + e?.location?.locality}
                              {', ' + e?.location?.pincode}
                            </p>
                            <h5>₹{e?.price}</h5>
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-3">
                              {/* <div
                                onClick={() =>
                                  navigate('/services/edit-service', {
                                    state: e,
                                  })
                                }
                              >
                                <i className="ti ti-edit me-2" />
                                Edit
                              </div> */}
                              <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target={
                                  e?.active ? '#in-active' : '#active'
                                }
                                onClick={() => setId(e?._id || '')}
                              >
                                <i className="ti ti-info-circle me-2" />
                                {!e?.active ? 'Activate' : 'Inactive'}
                              </Link>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="value d-flex align-items-center">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      const newItemsPerPage = Number(e.target.value);
                      setItemsPerPage(newItemsPerPage); // Update the items per page
                      setCurrentPage(1); // Reset to the first page
                    }}
                  >
                    {option.map((optionValue, index) => (
                      <option key={index} value={optionValue}>
                        {optionValue}
                      </option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          index + 1 === currentPage ? 'active' : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Inactive */}
      <div className="modal fade custom-modal" id="in-active">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Inactive Service</h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body">
              <div className="write-review">
                <form>
                  <p>Are you sure want to inactive this service?</p>
                  <div className="modal-submit text-end">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-dark"
                      onClick={() => updateStatus(false)}
                    >
                      Yes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inactive */}
      {/* active */}
      <div className="modal fade custom-modal" id="active">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Active Services</h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body">
              <div className="write-review">
                <form>
                  <p>Are you sure want to active this service?</p>
                  <div className="modal-submit text-end">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-dark"
                      onClick={() => updateStatus(true)}
                    >
                      Yes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /active */}
      {/* Delete Service */}
      <div className="modal fade custom-modal" id="del-service">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between border-bottom">
              <h5 className="modal-title">Delete Service</h5>
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body">
              <div className="write-review">
                <form>
                  <p>Are you sure want to delete this service?</p>
                  <div className="modal-submit text-end">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-dark"
                    >
                      Yes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Service */}
    </>
  );
};

export default ProviderServices;
