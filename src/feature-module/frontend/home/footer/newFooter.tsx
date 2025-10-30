import React from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';

const NewFooter = () => {
  const routes = all_routes;
  return (
    <>
      {/* Footer */}
      <footer className="bg-dark text-white" style={{ marginTop: '5rem' }}>
        <div className="py-5">
          <div className="container">
            {/* Main Footer Content */}
            <div className="row g-4">
              {/* Company Info */}
              <div className="col-lg-4 col-md-6">
                <div className="mb-4">
                  <h3 className="fw-bold mb-3 text-primary">DPCON India</h3>
                  <p className="text-light mb-4 lh-lg">
                    Your trusted partner for professional engineering services.
                    Connecting you with top-rated professionals across India.
                  </p>
                  <div className="d-flex gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-1 text-white">24/7 Support</h6>
                      <p className="text-light mb-0 small">Always here to help</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6">
                <h5 className="fw-semibold mb-4 text-white">Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <Link to="/" className="text-light text-decoration-none hover-primary">
                      Home
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/services/service-list" className="text-light text-decoration-none hover-primary">
                      Services
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/pages/about-us" className="text-light text-decoration-none hover-primary">
                      About Us
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/pages/contact-us" className="text-light text-decoration-none hover-primary">
                      Contact
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/blog/blog-grid" className="text-light text-decoration-none hover-primary">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="col-lg-2 col-md-6">
                <h5 className="fw-semibold mb-4 text-white">Support</h5>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <Link to="#" className="text-light text-decoration-none hover-primary">
                      Help Center
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/pages/terms-condition" className="text-light text-decoration-none hover-primary">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to="/pages/privacy-policy" className="text-light text-decoration-none hover-primary">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="col-lg-4 col-md-6">
                <h5 className="fw-semibold mb-4 text-white">Stay Connected</h5>
                <p className="text-light mb-4">Subscribe to get updates on new services and offers.</p>
                <div className="d-flex mb-4">
                  <input
                    type="email"
                    className="form-control me-2 bg-white border-0"
                    placeholder="Enter your email"
                    style={{ borderRadius: '8px' }}
                  />
                  <button className="btn btn-primary px-4" style={{ borderRadius: '8px' }}>
                    Subscribe
                  </button>
                </div>

                {/* Social Links */}
                <div className="d-flex gap-3">
                  <Link to="#" className="text-light hover-primary">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fab fa-facebook-f"></i>
                    </div>
                  </Link>
                  <Link to="#" className="text-light hover-primary">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fab fa-twitter"></i>
                    </div>
                  </Link>
                  <Link to="#" className="text-light hover-primary">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fab fa-linkedin-in"></i>
                    </div>
                  </Link>
                  <Link to="#" className="text-light hover-primary">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fab fa-instagram"></i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-top border-secondary py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <p className="mb-0 text-light small">
                  © {new Date().getFullYear()} DPCON Engineers India Pvt Ltd. All rights reserved.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex justify-content-md-end gap-4 mt-3 mt-md-0">
                  <Link to="/pages/terms-condition" className="text-light text-decoration-none small hover-primary">
                    Terms
                  </Link>
                  <Link to="/pages/privacy-policy" className="text-light text-decoration-none small hover-primary">
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NewFooter;
