import React, { useEffect, useState } from 'react';
import QuoteModal from '../../common/modals/quote-modal';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BecomeProvider from '../../common/modals/provider-modal';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import FeatureSection from './feature-section';
import PopularSection from './popular-section';
import WorkSection from './workSection';
import PreferredSection from './preferredSection';
import ProviderSection from './provider-section';
import RateServiceSection from './rateServiceSection';
import CustomerSection from './customerSection';
import BlogAndJoinus from './blogAndJoinus';
import BussinessWithUs from './bussinessWithUs';
import ServiceCities from './serviceCities';
import HomeHeader from '../header/home-header';
import NewFooter from '../footer/newFooter';
import AuthModals from './authModals';
import { fetchCategories, fetchServices } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const NewHome = () => {
  type Category = {
    _id: string;
    id?: number;
    categoryName: string;
    categorySlug: string;
    isFeatured: boolean;
    createdAt: Date;
    date?: string;
    image: string;
  };

  type Service = {
    _id: string;
    serviceTitle: string;
    slug: string;
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [featuredCat, setFeaturedCat] = useState<Category[]>();
  const routes = all_routes;

  const fetchData = async () => {
    const fetCat = await fetchCategories();
    const fetchServ = await fetchServices();
    setServices(fetchServ);
    const filtered = fetCat?.filter((e: Category) => {
      return e.isFeatured == true;
    });
    setFeaturedCat(filtered);
    setCategories(fetCat.length > 12 ? fetCat.slice(0, 12) : fetCat);
  };
  useEffect(() => {
    fetchData();
  }, []);
  function generateRandomNumber() {
    // Generate a random number between 10 and 999
    const randomNumber = Math.floor(Math.random() * 990) + 10;
    return randomNumber;
  }
  const updateSearch = () => {
    if (searchTerm && services.length > 0) {
      const filtered = services?.filter((service: Service) =>
        service?.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };
  return (
    <>
      <HomeHeader type={1} />
      <>
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content position-relative overflow-hidden">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div
                    className="wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay=".25s"
                  >
                    <h1 className="mb-2">
                      Connect with Nearby Top-rated{' '}
                      <span className="typed" data-type-text="Carpenters">
                        Professionals
                      </span>
                    </h1>
                    <p className="mb-3 sub-title">
                      We can connect you to the right Service, first time and
                      every time.
                    </p>
                    <div className="banner-form bg-white border mb-3">
                      <form action="#">
                        <div className="d-md-flex align-items-center">
                          <div className="input-group mb-2">
                            <span className="input-group-text px-1">
                              <i className="ti ti-search" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search for Service"
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                updateSearch();
                              }}
                            />
                          </div>
                          <div className="input-group mb-2">
                            <span className="input-group-text px-1">
                              <i className="ti ti-map-pin" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter you pin code"
                              onChange={(e) => {
                                setLocation(e.target.value);
                              }}
                            />
                          </div>
                          <div className="mb-2">
                            <Link
                              to={`/services/service-list?name=${searchTerm}&location=${location}`}
                              className="btn btn-linear-primary d-inline-flex align-items-center w-100"
                            >
                              <i className="feather icon-search me-2"></i>
                              Search
                            </Link>
                          </div>
                        </div>
                      </form>
                      {filteredServices.length > 0 && searchTerm.length > 0 && (
                        <div className="suggestions-list bg-white border mt-1 p-2">
                          {filteredServices.map((service) => (
                            <div
                              // to={`/`}
                              key={service._id}
                              className="suggestion-item d-block p-1 text-dark"
                              onClick={() => {
                                setSearchTerm(service?.serviceTitle);
                              }}
                            >
                              {service.serviceTitle}
                            </div>
                          ))}
                        </div>
                      )}
                      <ImageWithBasePath
                        src="assets/img/bg/bg-06.svg"
                        alt="img"
                        className="shape-06 round-animate"
                      />
                    </div>
                    {categories && (
                      <div className="d-flex align-items-center flex-wrap">
                        <h6 className="mb-2 me-2 fw-medium">
                          Popular Searches
                        </h6>
                        {categories?.slice(0, 3).map((category, index) => (
                          <Link
                            key={index}
                            to={`/services/service-list?categories=${JSON.stringify([category?._id])}`}
                            className="badge badge-dark-transparent badge-hover-orange fs-14 fw-normal mb-2 me-2"
                          >
                            {category?.categoryName}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="d-flex align-items-center flex-wrap banner-info">
                      <div className="d-flex align-items-center me-4 mt-4">
                        <ImageWithBasePath
                          src="assets/img/icons/success-01.svg"
                          alt="icon"
                        />
                        <div className="ms-2">
                          <h6>215,292 +</h6>
                          <p>Verified Providers</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center me-4 mt-4">
                        <ImageWithBasePath
                          src="assets/img/icons/success-02.svg"
                          alt="icon"
                        />
                        <div className="ms-2">
                          <h6>90,000+</h6>
                          <p>Services Completed</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center me-4 mt-4">
                        <ImageWithBasePath
                          src="assets/img/icons/success-03.svg"
                          alt="icon"
                        />
                        <div className="ms-2">
                          <h6>2,390,968 </h6>
                          <p>Reviews Globally</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="banner-img wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay=".25s"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/Black_Simple_Image_Gallery_Logo-removebg-preview.png`}
                    alt="img"
                    className="img-fluid animation-float"
                  />
                </div>
              </div>
            </div>

            <div className="hero-image">
              {/* <div className="d-inline-flex bg-white p-2 rounded align-items-center shape-01 floating-x">
                <span className="avatar avatar-md bg-warning rounded-circle me-2">
                  <i className="ti ti-star-filled" />
                </span>
                <span>
                  4.9 / 5<small className="d-block">(255 reviews)</small>
                </span>
                <i className="border-edge" />
              </div> */}
              <div className="d-inline-flex bg-white p-2 rounded align-items-center shape-02 floating-x">
                <span className="me-2">
                  <ImageWithBasePath
                    src="assets/img/icons/tick-banner.svg"
                    alt=""
                  />
                </span>
                <p className="fs-15 text-dark mb-0">300 Booking Completed</p>
                <i className="border-edge" />
              </div>
              <ImageWithBasePath
                src="assets/img/bg/bg-03.svg"
                alt="img"
                className="shape-03"
              />
              <ImageWithBasePath
                src="assets/img/bg/bg-04.svg"
                alt="img"
                className="shape-04"
              />
              <ImageWithBasePath
                src="assets/img/bg/bg-05.svg"
                alt="img"
                className="shape-05"
              />
            </div>
            <div className="d-inline-flex bg-white p-2 rounded align-items-center shape-02 floating-x">
              <span className="me-2">
                <ImageWithBasePath
                  src="assets/img/icons/tick-banner.svg"
                  alt=""
                />
              </span>
              <p className="fs-15 text-dark mb-0">250 Estimation Completed</p>
              <i className="border-edge" />
            </div>
          </div>
        </section>
        {/* /Hero Section */}
        {/* Category Section */}
        <section className="section category-section">
          <div className="container">
            <div className="row justify-content-center">
              <div
                className="col-lg-6 text-center wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="section-header text-center">
                  <h2 className="mb-1">
                    Explore our{' '}
                    <span className="text-linear-primary">Categories</span>
                  </h2>
                  <p className="sub-title">
                    Service categories help organize and structure the offerings
                    on a marketplace, making it easier for users to find what
                    they need.
                  </p>
                </div>
              </div>
            </div>
            <div className="row g-4 row-cols-xxl-6 row-cols-xl-6 row-cols-md-4 row-cols-sm-2 row-cols-1 justify-content-center">
              {categories
                ?.filter((e) => e?.isFeatured)
                ?.map((category, index) => (
                  <div className="col d-flex" key={index}>
                    <div
                      className="category-item text-center flex-fill wow fadeInUp"
                      data-wow-delay="0.2s"
                    >
                      <div className="mx-auto mb-3">
                        <ImageWithoutBasePath
                          src={category?.image}
                          className="img-fluid"
                          alt={category?.categoryName}
                        />
                      </div>
                      <h6 className="fs-14 mb-1">
                        {category?.categoryName?.slice(0, 20) + '...'}
                      </h6>
                      {/* <p className="fs-14 mb-0">{generateRandomNumber()}</p> */}
                      <Link
                        // to={routes.categories}
                        to={`/services/service-list?categories=${JSON.stringify([category?._id])}`}
                        className="link-primary text-decoration-underline fs-14"
                      >
                        View All
                      </Link>
                      {/* {category?.newBadge && (
                      <span className="badge bg-success">New</span>
                    )} */}
                    </div>
                  </div>
                ))}
            </div>

            <div className="row">
              <div className="col-md-12">
                <div
                  className="text-center view-all wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <Link to={routes.categories} className="btn btn-dark">
                    View All
                    <i className="ti ti-arrow-right ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Category Section */}
        {/* <FeatureSection /> */}
        {featuredCat && <PopularSection featuredCat={featuredCat} />}
        <WorkSection />
        {/* <PreferredSection /> */}
        {/* <ProviderSection/> */}
        {/* <RateServiceSection /> */}
        <CustomerSection />
        {/* <BlogAndJoinus /> */}
        {/* <BussinessWithUs /> */}
        <ServiceCities />
        <NewFooter />
      </>
      <AuthModals />
      <QuoteModal />
      <BecomeProvider />
    </>
  );
};

export default NewHome;
