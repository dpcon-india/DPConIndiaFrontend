import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import ServiceFilters from './ServiceFilters';
import { IService } from '../../../../GlobleType';
import { fetchServices } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import AuthModals from '../../home/new-home/authModals';
import { jwtDecode } from 'jwt-decode';
const ServiceList = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(13).fill(false));
  const [services, setServices] = useState<IService[]>([]);
  const [filteredService, setFilteredService] = useState<IService[]>([]);
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 15;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetchServices();
      setServices(res);
      setFilteredService(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sorting function
  const sortServices = (order: string) => {
    const sortedServices = [...services];
    if (order === 'lowToHigh') {
      sortedServices.sort((a, b) => a?.price - b?.price);
    } else if (order === 'highToLow') {
      sortedServices.sort((a, b) => b?.price - a?.price);
    }
    setFilteredService(sortedServices);
  };

  // Handle sort option change
  const handleSortChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    option: string,
  ) => {
    e.preventDefault();
    setSortOrder(option);
    sortServices(option);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredService.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredService.slice(
    indexOfFirstService,
    indexOfLastService,
  );

  const handleClick = (e: { _id?: any }) => {
    if (e?._id) {
      navigate(`/services/service-details/${e._id}`);
    } else {
      console.error('Service ID is missing');
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  function chechHandler(e: any, data: any) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    if (token) {
      try {
        const decode: any = jwtDecode(token);
        if (decode?.id) {
          navigate('/customers/user-bookings', { state: data });
        } else {
          e.currentTarget.setAttribute('data-bs-toggle', 'modal');
          e.currentTarget.setAttribute('data-bs-target', '#login-modal');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    } else {
      e.currentTarget.setAttribute('data-bs-toggle', 'modal');
      e.currentTarget.setAttribute('data-bs-target', '#login-modal');
    }
  }

  return (
    <>
      <BreadCrumb title="Services" item1="Home" item2="Services" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 theiaStickySidebar">
                <ServiceFilters
                  services={services}
                  setServices={setFilteredService}
                />
              </div>
              <div className="col-xl-9 col-lg-8">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                  <h4>
                    Found
                    <span className="text-dark-blue">{` ${filteredService.length} Services`}</span>
                  </h4>
                  <div className="d-flex align-items-center">
                    <span className="text-dark me-2">Sort</span>
                    <div className="dropdown me-2">
                      <Link
                        to="#;"
                        className="dropdown-toggle bg-light-300"
                        data-bs-toggle="dropdown"
                      >
                        {sortOrder === 'lowToHigh'
                          ? 'Price Low to High'
                          : 'Price High to Low'}
                      </Link>
                      <div className="dropdown-menu">
                        <Link
                          to="#;"
                          className={`dropdown-item ${sortOrder === 'lowToHigh' ? 'active' : ''}`}
                          onClick={(e) => handleSortChange(e, 'lowToHigh')}
                        >
                          Price Low to High
                        </Link>
                        <Link
                          to="#;"
                          className={`dropdown-item ${sortOrder === 'highToLow' ? 'active' : ''}`}
                          onClick={(e) => handleSortChange(e, 'highToLow')}
                        >
                          Price High to Low
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {/* Service List */}
                    {currentServices.map((e, i) => (
                      <div className="service-list" key={i}>
                        <div className="service-cont m-0">
                          <div className="service-cont-img">
                            <Link to={`/services/service-details/${e?._id}`}>
                              <ImageWithoutBasePath
                                className="img-fluid serv-img"
                                alt="Service Image"
                                src={e?.image || e.gallery[0]}
                              />
                            </Link>
                          </div>
                          <div className="service-cont-info">
                            <span className="badge bg-light fs-14 mb-2">
                              {e?.categoryId?.categoryName}
                            </span>
                            <h3 className="title">
                              <Link to={`/services/service-details/${e?._id}`}>
                                {e?.serviceTitle}
                              </Link>
                            </h3>
                            <p>
                              <i className="feather icon-map-pin" />
                              {e?.location?.city}, {e?.location?.locality},{' '}
                              {e?.location?.pincode}
                            </p>
                            <div className="service-pro-img">
                              <ImageWithoutBasePath
                                src={e?.providerId?.image}
                                alt="user"
                              />
                              <p>{e?.providerId?.name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="service-action">
                          <h6>
                            {e?.price === 0 ? (
                              <span className="text-success fw-bold">Free</span>
                            ) : (
                              <>
                                ₹{e?.price}
                                <span className="old-price">
                                  ₹{e?.price + e?.price / 10}
                                </span>
                              </>
                            )}
                          </h6>

                          <div
                            onClick={() => handleClick(e)}
                            className="btn"
                            style={{
                              backgroundColor: '#011339',
                              color: 'white',
                            }}
                          >
                            <i className="ti ti-calendar me-2" />
                            Book Now
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <nav aria-label="Page navigation">
                  <ul className="pagination d-flex justify-content-center align-items-center">
                    <li
                      className={`page-item me-2 ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                      <Link
                        to="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                      >
                        <i className="ti ti-arrow-left me-2" />
                        Prev
                      </Link>
                    </li>

                    {/* Render page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item me-2 ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(index + 1);
                          }}
                        >
                          {index + 1}
                        </Link>
                      </li>
                    ))}

                    <li
                      className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                      <Link
                        to="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                      >
                        Next
                        <i className="ti ti-arrow-right ms-2" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModals />
    </>
  );
};

export default ServiceList;
