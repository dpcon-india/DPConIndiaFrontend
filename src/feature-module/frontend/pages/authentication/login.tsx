import React, { useState } from 'react';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import HomeHeader from '../../home/header/home-header';
import { Link, useNavigate } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import AuthFooter from './common/footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { api } from '../../../../config';
import { useUser } from '../../../../core/data/context/UserContext';

const Login2 = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const { storeUser }: any = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rError, setRError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRError('');
    if (!formData.email) {
      setRError('Email is required');
      toast.error('Email is required');
      return;
    }
    if (!formData.password) {
      setRError('Password is required');
      toast.error('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${api}profiles/login-user`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.profile) {
        const { _id, token, role, name, email } = response.data.profile;
        const userData = { _id, token, role, name, email };
        localStorage.setItem('user', JSON.stringify(userData));
        storeUser(userData);
        toast.success('Login successful');

        const redirectPath = role === 'admin'
          ? '/admin/dashboard'
          : role === 'provider'
          ? '/providers/dashboard'
          : role === 'staff'
          ? '/staff/staff-dashboard'
          : '/customers/customer-dashboard';

        // Use hard redirect similar to modal implementation
        window.location.href = window.location.origin + redirectPath;
      } else {
        setRError('Invalid response from server');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Invalid email or password';
      setRError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <HomeHeader type={11} />
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column justify-content-center">
                    <div className="card shadow-sm p-sm-4 my-5">
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <h3 className="mb-2">Welcome</h3>
                          <p>Enter your credentials to access your account</p>
                        </div>
                        {rError && (
                          <div className="alert alert-danger py-2 text-center" role="alert">
                            {rError}
                          </div>
                        )}
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="text"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter phone or email"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <label className="form-label">Password</label>
                            <Link
                              to={routes.forgotPassword}
                              className="text-dark-blue fw-medium text-decoration-underline mb-1 fs-14"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue=""
                                id="remember_me"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="remember_me"
                              >
                                Remember Me
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue=""
                                id="otp_signin"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="otp_signin"
                              >
                                Sign in with OTP
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-lg btn-linear-primary w-100"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                          </button>
                        </div>
                        <div className="login-or mb-3">
                          <span className="span-or">Or sign in with </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to="#"
                            className="btn btn-light flex-fill d-flex align-items-center justify-content-center me-3"
                          >
                            <ImageWithBasePath
                              src="assets/img/icons/google-icon.svg"
                              className="me-2"
                              alt="Img"
                            />
                            Google
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-light flex-fill d-flex align-items-center justify-content-center"
                          >
                            <ImageWithBasePath
                              src="assets/img/icons/fb-icon.svg"
                              className="me-2"
                              alt="Img"
                            />
                            Facebook
                          </Link>
                        </div>
                        <div className="d-flex justify-content-center">
                          <p>
                            Don’t have a account?{' '}
                            <Link
                              to={routes.userSignup}
                              className="text-dark-blue"
                            >
                              {' '}
                              Join us Today
                            </Link>
                          </p>
                        </div>
                      </div>
                      <div>
                        <ImageWithBasePath
                          src="assets/img/bg/authentication-bg.png"
                          className="bg-left-top"
                          alt="Img"
                        />
                        <ImageWithBasePath
                          src="assets/img/bg/authentication-bg.png"
                          className="bg-right-bottom"
                          alt="Img"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default Login2;
