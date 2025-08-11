import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { getAllProviders, fetchTestimonials } from '../../../../APICalls';
import { Category } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import AuthModals from '../../home/new-home/authModals';
const AboutUs = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providers, setProviders] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Category[]>([]);

  useEffect(() => {
    const loadproviders = async () => {
      try {
        setLoading(true);
        const data = await getAllProviders();
        setProviders(data);
      } catch (err) {
        setError('Failed to load providers.');
      } finally {
        setLoading(false);
      }
    };

    loadproviders();
  }, []);
  useEffect(() => {
    const loadfetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load Testimonials.');
      } finally {
        setLoading(false);
      }
    };

    loadfetchTestimonials();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const clientSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <>
      <BreadCrumb title="About Us" item1="Home" item2="About Us" />
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content p-0">
            {/* About */}
            <div className="about-sec">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="about-img d-none d-md-block">
                      <div className="about-exp">
                        <span>12+ years of experiences</span>
                      </div>
                      <div className="abt-img">
                        <ImageWithBasePath
                          src="assets/img/providers/provider-23.jpg"
                          className="img-fluid"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="about-content">
                      <h6>ABOUT OUR COMPANY</h6>
                      <h2>Best Solution For Cleaning Services</h2>
                      <p>
                        Welcome to DPConIndia, your premier destination for
                        connecting with top-rated service providers and finding
                        the perfect match for your needs. Our platform is
                        designed to simplify the process of discovering,
                        evaluating, and hiring trusted professionals across a
                        wide range of services, from home improvement and IT
                        support to personal care and more.
                      </p>
                      <p>
                        Our commitment to innovation and excellence invariably
                        results in a successfully completed project for both
                        contractor and client. We understand and promote the
                        idea of working as a partnership with our clients to
                        ensure their goals are met. We undertake a variety of
                        projects for a wide range of clients – from small
                        private developments to large projects. Our unique and
                        360-degree flexible project management systems ensure
                        that a positive outcome is achieved regardless of the
                        size or nature of the project. We look at every
                        opportunity with a beginner’s mind. This approach of
                        getting involved in various kinds of projects came to
                        reality cause of the availability of different types of
                        eminent teams.
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <ul>
                            <li className="text-truncate">
                              <i className="ti ti-circle-check-filled text-dark me-1" />
                              We prioritize quality and reliability
                            </li>
                            <li className="text-truncate">
                              <i className="ti ti-circle-check-filled text-dark me-1" />
                              We saving your time and effort.
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul>
                            <li className="text-truncate">
                              <i className="ti ti-circle-check-filled text-dark me-1" />
                              Clear, detailed service listings &amp; reviews
                            </li>
                            <li className="text-truncate">
                              <i className="ti ti-circle-check-filled text-dark me-1" />{' '}
                              Smooth and satisfactory experience.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /About */}
            {/* Work Section */}
            <section className="work-section px-0 my-0 work-bg">
              <div className="work-bg-2 d-none d-md-block">
                <ImageWithBasePath
                  src="assets/img/bg/dotted.png"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="work-bg-1 d-none d-md-block">
                <ImageWithBasePath
                  src="assets/img/bg/bg-13.png"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <div className="section-heading">
                      <h2>How It Works</h2>
                      <p>
                        Straightforward process designed to make your experience
                        seamless and hassle-free.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 d-flex">
                    <div className=" card work-box flex-fill">
                      <div className="card-body">
                        <div className="work-icon">
                          <span>
                            <ImageWithBasePath
                              src="assets/img/icons/about-hands.svg"
                              alt="img"
                            />
                          </span>
                        </div>
                        <h5>1. Search and Browse</h5>
                        <p>
                          Customers can browse or search for specific products
                          or services using categories, filters, or search bars.
                        </p>
                        <h4>01</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex">
                    <div className=" card work-box flex-fill">
                      <div className="card-body">
                        <div className="work-icon">
                          <span>
                            <ImageWithBasePath
                              src="assets/img/icons/about-documents.svg"
                              alt="img"
                            />
                          </span>
                        </div>
                        <h5>2 Add to Cart or Book Now</h5>
                        <p>
                          Customers can add items to their shopping cart. For
                          services, they may select a service and proceed to
                          book.
                        </p>
                        <h4>02</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex">
                    <div className=" card work-box flex-fill">
                      <div className="card-body">
                        <div className="work-icon">
                          <span>
                            <ImageWithBasePath
                              src="assets/img/icons/about-book.svg"
                              alt="img"
                            />
                          </span>
                        </div>
                        <h5>Amazing Places</h5>
                        <p>
                          The Customer fulfills the order by either providing
                          the service to the buyer.
                        </p>
                        <h4>03</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* /Work Section */}
            {/* Choose Us Section */}
            <div className="chooseus-sec">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="choose-content">
                      <h2>Why Choose Us</h2>
                      <p>
                        Choose us for reliable, personalized service and
                        exceptional results.
                      </p>
                      <div className="accordion" id="faq_accordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#panelsStayOpen-collapseOne"
                              aria-expanded="true"
                              aria-controls="panelsStayOpen-collapseOne"
                            >
                              24/7 Supports
                            </button>
                          </h2>
                          <div
                            id="panelsStayOpen-collapseOne"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#faq_accordion"
                          >
                            <div className="accordion-body">
                              <p>
                                Access round-the-clock support through our
                                dedicated helpdesk, available 24/7 to address
                                any issues or queries you may have. Whether it’s
                                day or night, our team is here to ensure you
                                receive timely assistance and seamless service.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#panelsStayOpen-collapseTwo"
                              aria-expanded="false"
                              aria-controls="panelsStayOpen-collapseTwo"
                            >
                              Client’s reviews
                            </button>
                          </h2>
                          <div
                            id="panelsStayOpen-collapseTwo"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faq_accordion"
                          >
                            <div className="accordion-body">
                              <p>
                                Access round-the-clock support through our
                                dedicated helpdesk, available 24/7 to address
                                any issues or queries you may have. Whether it’s
                                day or night, our team is here to ensure you
                                receive timely assistance and seamless service.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#panelsStayOpen-collapseThree"
                              aria-expanded="false"
                              aria-controls="panelsStayOpen-collapseThree"
                            >
                              Professional Team
                            </button>
                          </h2>
                          <div
                            id="panelsStayOpen-collapseThree"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faq_accordion"
                          >
                            <div className="accordion-body">
                              <p>
                                Access round-the-clock support through our
                                dedicated helpdesk, available 24/7 to address
                                any issues or queries you may have. Whether it’s
                                day or night, our team is here to ensure you
                                receive timely assistance and seamless service.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#panelsStayOpen-collapse4"
                              aria-expanded="false"
                              aria-controls="panelsStayOpen-collapseThree"
                            >
                              Best Services
                            </button>
                          </h2>
                          <div
                            id="panelsStayOpen-collapse4"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faq_accordion"
                          >
                            <div className="accordion-body">
                              <p>
                                Access round-the-clock support through our
                                dedicated helpdesk, available 24/7 to address
                                any issues or queries you may have. Whether it’s
                                day or night, our team is here to ensure you
                                receive timely assistance and seamless service.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="chooseus-img">
                      <ImageWithBasePath
                        src="assets/img/services/service-75.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-xl-3 col-lg-4 col-sm-6">
                    <div className="choose-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/group-stars.svg"
                        className="img-fluid"
                        alt="img"
                      />
                      <div className="choose-info">
                        <h3>2583+</h3>
                        <p>Satisfied Clients</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6">
                    <div className="choose-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/expert-team.svg"
                        className="img-fluid"
                        alt="img"
                      />
                      <div className="choose-info">
                        <h3>2583+</h3>
                        <p>Expert Team</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6">
                    <div className="choose-icon">
                      <ImageWithBasePath
                        src="assets/img/icons/about-documents.svg"
                        className="img-fluid"
                        alt="img"
                      />
                      <div className="choose-info">
                        <h3>2583+</h3>
                        <p>Project Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-6">
                    <div className="choose-icon border-0">
                      <ImageWithBasePath
                        src="assets/img/icons/expereience.svg"
                        className="img-fluid"
                        alt="img"
                      />
                      <div className="choose-info">
                        <h3>2583+</h3>
                        <p>Years of experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Choose Us Section */}
            {/* Providers Section */}
            {/* <section className="providers-section abt-provider">
              <div className="container">
                <div className="section-heading">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-0 fs-16">Meet Our Experts</p>
                      <h2 className="fs-32">Top Providers</h2>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {providers.length === 0 ? (
                    <p>No providers available.</p>
                  ) : (
                    providers.map((provider) => (
                      <div
                        key={provider._id}
                        className="col-lg-3 col-md-4 col-sm-6"
                      >
                        <div className="card providerset p-0 flex-fill">
                          <div className="card-body">
                            <div className="providerset-img">
                              <Link to={/provider/${provider._id}}>
                                <ImageWithoutBasePath
                                  src={
                                    provider.image ||
                                    'assets/img/providers/default.jpg'
                                  }
                                  alt={provider.name}
                                />
                              </Link>
                            </div>
                            <div className="providerset-content">
                              <div className="providerset-price">
                                <div className="d-flex justify-content-between align-items-center flex-fill">
                                  <div className="providerset-name">
                                    <h4 className="d-flex align-items-center">
                                      <Link
                                        to={/provider/${provider._id}}
                                        className="me-1 text-truncate"
                                      >
                                        {provider.name}{' '}
                                      </Link>
                                      <i className="ti ti-circle-check-filled text-success" />
                                    </h4>
                                    <span>{provider.email}</span>{' '}
                                    <span>{provider.number}</span>{' '}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section> */}

            {/* /Providers Section */}
            {/* Client Section */}
            <section className="client-section client-section-about">
              <div className="container">
                <div className="overlay-img d-none d-md-block">
                  <div className="overlay-img-left">
                    <ImageWithBasePath
                      src="assets/img/bg/transperent-circle.png"
                      alt="img"
                      className="img-fluid"
                    />
                  </div>
                  <div className="overlay-img-right">
                    <ImageWithBasePath
                      src="assets/img/bg/bg-graphics.png"
                      alt="img"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-center">
                    <div className="section-heading">
                      <h2>Testimonials</h2>
                      <p>
                        Our clients rave about our seamless service, exceptional
                        quality, and unmatched customer support.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Slider className="testimonial-slider-3" {...clientSlider}>
                      {testimonials.length === 0 ? (
                        <p>No testimonials available.</p>
                      ) : (
                        testimonials.map((testimonial) => (
                          <div
                            className="card client-widget"
                            key={testimonial?._id}
                          >
                            <div className="card-body">
                              <div className="client-img">
                                <Link to="#">
                                  <ImageWithoutBasePath
                                    className="img-fluid rounded-circle"
                                    alt="Image"
                                    src={
                                      testimonial?.image ||
                                      'assets/img/user/default.jpg'
                                    } // Default image if no image available
                                  />
                                </Link>
                              </div>
                              <div className="client-content">
                                <p>{testimonial?.desc}</p>

                                <h5>{testimonial?.name}</h5>
                                <h6>{testimonial?.jobTitle}</h6>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </Slider>
                  </div>
                </div>
              </div>
            </section>

            {/* /Client Section */}
            {/* Service Section */}
            <div className="service-offer about-service-offer">
              <div className="container">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-7">
                        <div className="service-content">
                          <h6 className="display-6">
                            Looking for the Best Service Finder &amp; Bookings
                          </h6>
                          <p>
                            We offer a comprehensive directory of top-rated
                            service providers, detailed profiles, and customer
                            reviews to help you make informed choices.
                          </p>
                          <div className="d-flex">
                            <Link
                              to="#"
                              className="btn btn-white d-flex align-items-center"
                            >
                              Get Started{' '}
                              <i className="ms-1 ti ti-circle-arrow-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="service-img">
                          <ImageWithBasePath
                            src="assets/img/services/repair-img.png"
                            alt="img"
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
      </>
      <AuthModals />
    </>
  );
};

export default AboutUs;
