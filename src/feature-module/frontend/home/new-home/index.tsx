import React, { useEffect, useState } from 'react';
import QuoteModal from '../../common/modals/quote-modal';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BecomeProvider from '../../common/modals/provider-modal';

import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import FeatureSection from './feature-section';
import Slider from 'react-slick';
import ServiceCarousel from './ServiceCarousel';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './new-home.css';
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
import {
  TbBuilding,
  TbDroplet,
  TbPaint,
  TbTools,
  TbToiletPaper,
  TbCircleDashed,
  TbPlug,
  TbBuildingSkyscraper,
  TbHammer,
  TbArmchair,
  TbRulerMeasure,
  TbCube,
  TbSettings,
} from "react-icons/tb";

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
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const routes = all_routes;

  // Carousel settings for 2x2 grid layout
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Show 2 items (rows) at a time
    slidesToScroll: 2, // Scroll 2 items at a time
    rows: 2, // 2 rows per slide
    slidesPerRow: 1, // 1 slide per row
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
          slidesPerRow: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 2 // On tablets, show 2 columns in 2 rows
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 1 // On mobile, show 1 column in 2 rows
        }
      }
    ]
  };

  // Service categories data
  const serviceCategories = [
    {
      name: "Building Repair & Restoration",
      img: "/assets/home/service-categories/b&r2.png",
      color: "#e3f2fd"
    },
    {
      name: "Waterproofing Work",
      img: "/assets/home/service-categories/waterproofing.png",
      color: "#e1f5fe"
    },
    {
      name: "Painting",
      img: "/assets/home/service-categories/painting.png",
      color: "#f3e5f5"
    },
    {
      name: "Interior Design",
      img: "/assets/home/service-categories/arch.png",
      color: "#f1f8e9"
    },
    {
      name: "Plumbing work",
      img: "/assets/home/service-categories/plumbing.png",
      color: "#e8f5e9"
    },
    {
      name: "Core Cutting",
      img: "/assets/home/service-categories/core-cutting.png",
      color: "#fff3e0"
    },
    {
      name: "Electrical work",
      img: "/assets/home/service-categories/electrical.png",
      color: "#fff8e1"
    },
    {
      name: "Facade Cleaning",
      img: "/assets/home/service-categories/facade.png",
      color: "#e8eaf6"
    },
    {
      name: "Fabrication Work",
      img: "/assets/home/service-categories/fabrication.png",
      color: "#fce4ec"
    },
    {
      name: "Furniture",
      img: "/assets/home/service-categories/furniture.png",
      color: "#f1f8e9"
    }
  ];

  // Function to get uniform black outlined icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('repair') || name.includes('restoration') || name.includes('building')) {
      return <TbBuilding size={40} color="#333" />;
    }

    if (name.includes('waterproof')) {
      return <TbDroplet size={40} color="#333" />;
    }

    if (name.includes('paint')) {
      return <TbPaint size={40} color="#333" />;
    }

    if (name.includes('marble') || name.includes('tiles') || name.includes('tile')) {
      return <TbCube size={40} color="#333" />;
    }

    if (name.includes('plumb')) {
      return <TbToiletPaper size={40} color="#333" />;
    }

    if (name.includes('core') || name.includes('cutting')) {
      return <TbCircleDashed size={40} color="#333" />;
    }

    if (name.includes('electric')) {
      return <TbPlug size={40} color="#333" />;
    }

    if (name.includes('facade') || name.includes('clean')) {
      return <TbBuildingSkyscraper size={40} color="#333" />;
    }

    if (name.includes('fabrication')) {
      return <TbSettings size={40} color="#333" />;
    }

    if (name.includes('furniture')) {
      return <TbArmchair size={40} color="#333" />;
    }

    if (name.includes('estimation') || name.includes('survey')) {
      return <TbRulerMeasure size={40} color="#333" />;
    }

    // Default icon for unmatched categories
    return <TbBuilding size={40} color="#333" />;
  };

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
          <div className="hero-content position-relative overflow-hidden py-5">
            <div className="container h-100">
              <div className="row align-items-center h-100">
                {/* Left Section - 50% width */}
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <div className="home-service-card p-4 rounded-4 shadow-sm bg-white">
                    <h2 className="fw-bold mb-4">Connect with Nearby Top-rated Professionals</h2>

                    <div className="service-box" style={{
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      <h5 className="fw-bold mb-4" style={{
                        color: '#2d3748',
                        fontSize: '18px',
                        letterSpacing: '-0.02em'
                      }}>What are you looking for?</h5>

                      <ServiceCarousel serviceCategories={serviceCategories} />

                    </div>

                    {/* <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="text-center flex-fill">
                        <div className="fw-bold fs-4">⭐ 4.8</div>
                        <small className="text-muted">Service Rating*</small>
                      </div>
                      <div className="text-center flex-fill">
                        <div className="fw-bold fs-4">👥 12M+</div>
                        <small className="text-muted">Customers Globally*</small>
                      </div>
                    </div> */}
                  </div>

                </div>

                {/* Right Section - 50% width - Image Grid */}
                <div className="col-lg-6">
                  <div className="h-100 d-flex align-items-center">
                    <div className="w-100">
                      <div className="row g-3">
                        {/* Large Top Left Image */}
                        <div className="col-md-8">
                          <div className="position-relative overflow-hidden rounded-4" style={{
                            height: '200px',
                            marginBottom: '0.5rem'
                          }}>
                            <img
                              src="/assets/home/service (1).jpg"
                              alt="Service 1"
                              className="w-100 h-100"
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        </div>

                        {/* Small Top Right Image */}
                        <div className="col-md-4">
                          <div className="position-relative overflow-hidden rounded-4" style={{
                            height: '96px',
                            marginBottom: '0.5rem'
                          }}>
                            <img
                              src="/assets/home/service (2).jpg"
                              alt="Service 2"
                              className="w-100 h-100"
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        </div>

                        {/* Small Bottom Left Image */}
                        <div className="col-md-4">
                          <div className="position-relative overflow-hidden rounded-4" style={{
                            height: '96px',
                            marginBottom: '0.5rem'
                          }}>
                            <img
                              src="/assets/home/service (3).jpg"
                              alt="Service 3"
                              className="w-100 h-100"
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        </div>

                        {/* Large Bottom Right Image */}
                        <div className="col-md-8">
                          <div className="position-relative overflow-hidden rounded-4" style={{
                            height: '200px',
                            marginBottom: '0.5rem'
                          }}>
                            <img
                              src="/assets/home/service (4).jpg"
                              alt="Service 4"
                              className="w-100 h-100"
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Hero Section */}
        {/* Category Section */}
        <section className="section category-section pt-0">
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
                    <Link
                      to={`/services/service-list?categories=${JSON.stringify([category?._id])}`}
                      className="category-item text-center flex-fill wow fadeInUp text-decoration-none"
                      data-wow-delay="0.2s"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1.5rem 1rem',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="mb-3 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', flexShrink: 0 }}>
                        {getCategoryIcon(category?.categoryName)}
                      </div>
                      <h6 className="fs-14 mb-2 text-dark" style={{ minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {category?.categoryName}
                      </h6>
                      <span
                        className="link-primary text-decoration-underline fs-14"
                        style={{ marginTop: 'auto' }}
                      >
                        View All
                      </span>
                    </Link>
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

        {/* Urban Company Style - Quality Promise Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="fw-bold mb-4">Quality you can trust</h2>
                <div className="row g-4">
                  <div className="col-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-success rounded-circle p-2 me-3 flex-shrink-0">
                        <TbSettings size={20} className="text-white" />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Verified professionals</h6>
                        <small className="text-muted">Background verified & rated professionals</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-success rounded-circle p-2 me-3 flex-shrink-0">
                        <TbBuilding size={20} className="text-white" />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Transparent pricing</h6>
                        <small className="text-muted">See fixed prices before you book</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-success rounded-circle p-2 me-3 flex-shrink-0">
                        <TbHammer size={20} className="text-white" />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Timely service</h6>
                        <small className="text-muted">Professionals arrive on time</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-success rounded-circle p-2 me-3 flex-shrink-0">
                        <FaPhoneAlt size={16} className="text-white" />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Post-service support</h6>
                        <small className="text-muted">Get help even after service completion</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <img src="/assets/home/service (1).jpg" alt="Quality Service" className="img-fluid rounded-4" />
              </div>
            </div>
          </div>
        </section>

        {featuredCat && <PopularSection featuredCat={featuredCat} />}

        {/* Urban Company Style - Service Booking CTA */}
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="container">
            <div className="row align-items-center text-white">
              <div className="col-lg-6">
                <h2 className="fw-bold mb-3">Ready to book a service?</h2>
                <p className="mb-4 opacity-75">Get instant quotes, compare professionals, and book your service in minutes</p>
                <div className="d-flex gap-3">
                  <Link to="/services/service-list" className="btn btn-light btn-lg px-4">
                    <TbSettings size={20} className="me-2" />
                    Book Service
                  </Link>
                  <button
                    className="btn btn-outline-light btn-lg px-4"
                    onClick={() => setShowQuoteModal(true)}
                  >
                    <FaPhoneAlt size={16} className="me-2" />
                    Get Quote
                  </button>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <img src="/assets/home/service (3).jpg" alt="Professional Service" className="img-fluid rounded-4" style={{ maxHeight: '300px' }} />
              </div>
            </div>
          </div>
        </section>


        {/* Urban Company Style - Stats Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="row text-center g-4">
              <div className="col-6 col-md-3">
                <div className="fw-bold" style={{ fontSize: '2.5rem', color: '#6c5ce7' }}>12M+</div>
                <p className="mb-0 text-muted fw-medium">Customers globally</p>
              </div>
              <div className="col-6 col-md-3">
                <div className="fw-bold" style={{ fontSize: '2.5rem', color: '#6c5ce7' }}>25K+</div>
                <p className="mb-0 text-muted fw-medium">Trained professionals</p>
              </div>
              <div className="col-6 col-md-3">
                <div className="fw-bold" style={{ fontSize: '2.5rem', color: '#6c5ce7' }}>50+</div>
                <p className="mb-0 text-muted fw-medium">Cities covered</p>
              </div>
              <div className="col-6 col-md-3">
                <div className="fw-bold" style={{ fontSize: '2.5rem', color: '#6c5ce7' }}>4.8★</div>
                <p className="mb-0 text-muted fw-medium">Average rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* <WorkSection /> */}
        {/* <PreferredSection /> */}
        {/* <ProviderSection/> */}
        {/* <RateServiceSection /> */}
        {/* <CustomerSection /> */}
        {/* <BlogAndJoinus /> */}
        {/* <BussinessWithUs /> */}
        {/* <ServiceCities /> */}
        <NewFooter />
      </>
      <AuthModals />
      <QuoteModal show={showQuoteModal} onHide={() => setShowQuoteModal(false)} />
      <BecomeProvider />

    </>
  );
};

export default NewHome;
