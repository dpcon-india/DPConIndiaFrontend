import React from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import moment from 'moment';

const NewFooter = () => {
  const routes = all_routes;
  return (
    <>
      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-xl-4">
                <div className="footer-widget">
                  <h5 className="mb-4">Product</h5>
                  <ul className="footer-menu">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/services/service-list">Services</Link>
                    </li>
                    <li>
                      <Link to="/pages/contact-us">Contact</Link>
                    </li>
                    <li>
                      <Link to="/pages/about-us">About</Link>
                    </li>
                    <li>
                      <Link to="/blog/blog-grid">Blogs</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="footer-widget">
                  <h5 className="mb-4">Support</h5>
                  <ul className="footer-menu">
                    <li>
                      <Link to="#">Getting started</Link>
                    </li>
                    <li>
                      <Link to="/pages/terms-condition">Term & Conditions</Link>
                    </li>
                    <li>
                      <Link to="/pages/privacy-policy">Privacy Policy</Link>
                    </li>
                    {/* <li>
                      <Link to="#">Payment Policy</Link>
                    </li> */}
                    {/* <li>
                      <Link to="#">FAQ</Link>
                    </li> */}
                  </ul>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                {/* <div className="footer-widget">
                  <div className="card bg-light-200 border-0 mb-3">
                    <div className="card-body">
                      <h5 className="mb-3">SignUp For Subscription</h5>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email Address"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-linear-primary btn-lg w-100"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center flex-wrap">
                    <h6 className="fs-14 me-2">Download Our App</h6>
                    <ImageWithBasePath
                      src="assets/img/icons/app-store.svg"
                      className="me-2"
                      alt="img"
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/goolge-play.svg"
                      className="me-2"
                      alt="img"
                    />
                  </div>
                </div> */}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap mt-3">
              {/* <ul className="social-icon mb-3">
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/fb.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/instagram.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/twitter.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/whatsapp.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/youtube.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/linkedin.svg"
                      className="img"
                      alt="Img"
                    />
                  </Link>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <p className="mb-2">
                    Copyright © {new Date().getFullYear()} - All Rights
                    Reserved dpcon engineers india pvt Ltd. ( Dpcon India )
                  </p>

                  <ul className="menu-links mb-2">
                    <li>
                      <Link to="/pages/terms-condition">
                        Terms and Conditions
                      </Link>
                    </li>
                    <li>
                      <Link to="/pages/privacy-policy">Privacy Policy</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Footer Bottom */}
      </footer>
      {/* /Footer */}
    </>
  );
};

export default NewFooter;
