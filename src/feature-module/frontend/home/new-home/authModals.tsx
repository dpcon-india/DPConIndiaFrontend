import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../../config';
import axios from 'axios';
import { useUser } from '../../../../core/data/context/UserContext';
import { toast } from 'react-toastify';

const AuthModals = () => {
  const [password, setPassword] = useState('');
  const [numberOrEmail, setNumberOrEmail] = useState<string>(''); // phone/email
  const [rName, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('customer');
  const [rError, setRError] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [requestId, setRequestId] = useState('');
  const location = useLocation();
  const RegisterRef: any = useRef();
  const { storeUser }: any = useUser();
  const navigate = useNavigate();

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordResponce, setPasswordResponce] = useState({
    passwordResponceText: "Use 8 or more characters with a mix of letters, numbers, symbols.",
    passwordResponceKey: '',
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetRegisterForm = () => {
    setName('');
    setEmail('');
    setNumberOrEmail('');
    setPassword('');
    setRole('customer');
    setOtp('');
    setRequestId('');
    setRError('');
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setPasswordResponce({
      passwordResponceText: 'Use 8 or more characters with a mix of letters, numbers, symbols.',
      passwordResponceKey: '',
    });
  };

  // Small helpers to show/hide modals using CSS classes/backdrop (no bootstrap JS)
  const hideAllBootstrapModals = () => {
    // hide any modal with .show
    document.querySelectorAll('.modal.show').forEach((modal) => {
      const el = modal as HTMLElement;
      el.classList.remove('show');
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });
    // remove backdrops
    document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove());
    // restore body classes scroll if any
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
  };

  const showModalById = (id: string) => {
    const modal = document.getElementById(id) as HTMLElement | null;
    if (!modal) return;
    // ensure other modals/backdrops are removed first
    hideAllBootstrapModals();
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    // add a backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    // prevent body scroll
    document.body.classList.add('modal-open');
  };

  const hideModalById = (id: string) => {
    const modal = document.getElementById(id) as HTMLElement | null;
    if (!modal) return;
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove());
    document.body.classList.remove('modal-open');
  };

  // Password handler
  const onChangePassword = (password: string) => {
    setPassword(password);
    if (password.match(/^$|\s+/)) {
      setPasswordResponce({ passwordResponceText: 'Whitespaces are not allowed', passwordResponceKey: '' });
    } else if (password.length < 8) {
      setPasswordResponce({ passwordResponceText: 'Weak. Must contain at least 8 characters', passwordResponceKey: '0' });
    } else if (password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0) {
      setPasswordResponce({ passwordResponceText: 'Average. Must contain at least 1 uppercase and number', passwordResponceKey: '1' });
    } else if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
      setPasswordResponce({ passwordResponceText: 'Almost. Must contain a special symbol', passwordResponceKey: '2' });
    } else {
      setPasswordResponce({ passwordResponceText: 'Awesome! You have a secure password.', passwordResponceKey: '3' });
    }
  };

  // LOGIN HANDLER
  const submitHandler = async () => {
    if (!numberOrEmail) {
      setRError('Email is required');
      return;
    }
    if (!password) {
      setRError('Password is required');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email: numberOrEmail });
      const response = await axios.post(`${api}profiles/login`, {
        email: numberOrEmail,
        password
      });

      console.log('Login response:', response.data);

      if (response.status === 200 && response.data.profile) {
        const { _id, token, role, name, email } = response.data.profile;
        const userData = { _id, token, role, name, email };

        // Store user data in localStorage and context
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        storeUser(userData);

        // Verify data was stored correctly
        const storedUser = localStorage.getItem('user');
        console.log('Stored user data:', storedUser);

        // Close the login modal
        hideModalById('login-modal');

        // Redirect based on role using React Router's navigate
        const redirectPath = role === 'admin' ? '/admin/dashboard' :
          role === 'provider' ? '/providers/dashboard' :
            role === 'staff' ? '/staff/staff-dashboard' :
              '/customers/customer-dashboard';

        console.log('Redirecting to:', redirectPath);
        window.location.href = window.location.origin + redirectPath;
      } else {
        setRError('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setRError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitHandler();
    }
  };

  // REGISTER HANDLER
  const registerHandler = async () => {
    // Reset errors
    setNameError(''); setEmailError(''); setPhoneError(''); setPasswordError(''); setRError('');
    let isValid = true;

    if (!rName) { setNameError('Full Name is required'); isValid = false; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) { setEmailError('Valid Email is required'); isValid = false; }
    if (!numberOrEmail || numberOrEmail.length < 6) { setPhoneError('Phone/Username is required'); isValid = false; }
    if (!password || password.length < 8) { setPasswordError('Password must be at least 8 characters'); isValid = false; }
    if (!isValid) return;

    setIsLoading(true);
    try {
      console.log('Attempting registration with:', { name: rName, email, number: numberOrEmail, role });
      const response = await axios.post(`${api}profiles/signup`, {
        name: rName, email, number: numberOrEmail, password, role,
      });

      console.log('Full registration response:', response);
      console.log('Registration response data:', response.data);
      console.log('Registration response status:', response.status);

      if (response.data.error) { 
        setRError(response.data.error); 
        return; 
      }

      // Check if the response indicates OTP was sent
      if (response.data.message && response.data.message.includes('OTP sent')) {
        toast.success('OTP sent to your email. Please check your inbox.');
        console.log('OTP should be sent to email:', email);
      } else {
        toast.success('Registration initiated. Please check your email for OTP.');
        console.log('Registration response:', response.data);
      }
      
      setRError('');
      // hide any open bootstrap modals (register)
      hideAllBootstrapModals();
      // show OTP modal by id
      showModalById('otp-modal');

      // focus the OTP input after a tick
      setTimeout(() => {
        const input = document.querySelector('#otp-modal input[type="text"]') as HTMLElement | null;
        input?.focus();
      }, 50);
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      setRError(error.response?.data?.error || error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      registerHandler();
    }
  };

  // OTP VERIFICATION HANDLER
  const verifyOtpHandler = async () => {
    if (!otp || otp.length < 4) { setRError('Enter valid OTP'); return; }

    try {
      const payload = {
        email,
        otp
      };

      const { data } = await axios.post(`${api}profiles/verify-otp`, payload);

      if (data && (data.success || data.message?.toLowerCase()?.includes('verified'))) {
        toast.success('Email verified successfully! Please login.');
        hideModalById('otp-modal');
        showModalById('login-modal');
        resetRegisterForm();
      } else {
        setRError(data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      setRError(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const forgotPasswordHandler = async () => {
    if (!forgotEmail) {
      setRError('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(`${api}profiles/forgot-password`, { email: forgotEmail });

      if (data.message?.includes('reset link') || data.success) {
        hideAllBootstrapModals();
        showModalById('forgot-success-modal');
        setForgotEmail('');
        setRError('');
      } else {
        setRError(data.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setRError(error.response?.data?.message || 'Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordHandler = async () => {
    if (!newPassword || !confirmPassword) {
      setRError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRError('Passwords do not match');
      return;
    }

    if (passwordResponce.passwordResponceKey !== '3') {
      setRError('Please enter a strong password');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(`${api}profiles/reset-password`, {
        token: resetToken,
        newPassword: newPassword
      });

      if (data.message?.includes('successful') || data.success) {
        toast.success('Password has been reset successfully');
        hideAllBootstrapModals();
        showModalById('login-modal');
        setNewPassword('');
        setConfirmPassword('');
        setResetToken('');
      } else {
        setRError(data.message || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setRError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for reset token in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      hideAllBootstrapModals();
      showModalById('reset-password');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <>
      {/* Login Modal */}
      <div className="modal fade" id="login-modal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <button type="button" className="btn-close" onClick={() => hideModalById('login-modal')} aria-label="Close" />
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="text-center mb-3">
                  <h3 className="mb-2">Welcome</h3>
                  <p>Enter your credentials to access your account</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={numberOrEmail}
                    onChange={(e) => setNumberOrEmail(e.target.value)} 
                    onKeyPress={handleLoginKeyPress}
                    placeholder="Enter your email" 
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    onKeyPress={handleLoginKeyPress}
                    placeholder="Enter your password" 
                    disabled={isLoading}
                  />
                </div>

                {rError && <div className="alert alert-danger py-2 small">{rError}</div>}

                {/* Forgot Password Link */}
                <div className="mb-3 text-end">
                  <button
                    type="button"
                    className="text-dark-blue btn p-0"
                    onClick={() => {
                      hideAllBootstrapModals();
                      showModalById('forgot-modal');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mb-3">
                  <button 
                    type="button" 
                    className="btn btn-lg btn-linear-primary w-100" 
                    onClick={submitHandler}
                    disabled={isLoading}
                    style={{ cursor: 'pointer' }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : 'Sign In'}
                  </button>
                </div>

                <div className="d-flex justify-content-center">
                  <p>
                    Don’t have an account?{' '}
                    <button className="text-dark-blue" type="button" data-bs-toggle="modal" data-bs-target="#register-modal" onClick={resetRegisterForm}>Join us Today</button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Login Modal */}

      {/* Forgot Password Modal */}
      <div className="modal fade" id="forgot-modal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between pb-0 border-0">
              <h5 className="modal-title">Forgot Password</h5>
              <button type="button" className="btn-close" onClick={() => hideModalById('forgot-modal')} aria-label="Close" />
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              {rError && <div className="alert alert-danger">{rError}</div>}

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-lg btn-primary"
                  onClick={forgotPasswordHandler}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    hideModalById('forgot-modal');
                    showModalById('login-modal');
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Forgot Password Modal */}

      {/* Register Modal */}
      <div className="modal fade" id="register-modal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close"><i className="ti ti-circle-x-filled fs-20" /></Link>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="text-center mb-3">
                  <h3 className="mb-2">Registration</h3>
                  {rError ? <p style={{ color: 'red' }}>{rError}</p> : <p>Enter your details to create an account</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={rName} 
                    onChange={(e) => setName(e.target.value)} 
                    onKeyPress={handleRegisterKeyPress}
                    placeholder="Enter your full name" 
                    disabled={isLoading}
                    autoFocus
                  />
                  {nameError && <div className="text-danger small mt-1">{nameError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    onKeyPress={handleRegisterKeyPress}
                    placeholder="Enter your email" 
                    disabled={isLoading}
                  />
                  {emailError && <div className="text-danger small mt-1">{emailError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={numberOrEmail} 
                    onChange={(e) => setNumberOrEmail(e.target.value)} 
                    onKeyPress={handleRegisterKeyPress}
                    placeholder="Enter your phone number" 
                    disabled={isLoading}
                  />
                  {phoneError && <div className="text-danger small mt-1">{phoneError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="customer">Customer</option>
                    <option value="provider">Service Provider</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => onChangePassword(e.target.value)} 
                    onKeyPress={handleRegisterKeyPress}
                    placeholder="Enter your password" 
                    disabled={isLoading}
                  />
                  {passwordError && <div className="text-danger small mt-1">{passwordError}</div>}
                  <small className={passwordResponce.passwordResponceKey === '3' ? 'text-success' : 'text-muted'}>
                    {passwordResponce.passwordResponceText}
                  </small>
                </div>

                <div className="mb-3">
                  <button 
                    type="button" 
                    className="btn btn-lg btn-linear-primary w-100" 
                    onClick={registerHandler} 
                    disabled={isLoading}
                    style={{ cursor: 'pointer' }}
                    ref={RegisterRef}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : 'Register'}
                  </button>
                </div>

                <div className="d-flex justify-content-center">
                  <p>
                    Already have an account?{' '}
                    <Link to="#" className="text-dark-blue" data-bs-target="#login-modal" data-bs-toggle="modal">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Register Modal */}

      {/* OTP Verification Modal */}
      <div className="modal fade" id="otp-modal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => hideModalById('otp-modal')}
              />
            </div>
            <div className="modal-body p-4">
              <div className="text-center mb-4">
                <h3 className="mb-2">Verify Email OTP</h3>
                <p className="text-muted">Enter the 4-digit OTP sent to your email address</p>
                {rError && <div className="alert alert-danger py-2">{rError}</div>}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-lg btn-linear-primary"
                  onClick={verifyOtpHandler}
                  disabled={!otp || otp.length < 4 || isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  className="btn btn-link text-muted"
                  onClick={() => {
                    hideModalById('otp-modal');
                    showModalById('register-modal');
                  }}
                >
                  Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <div className="modal fade" id="reset-password" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <button type="button" className="btn-close" onClick={() => hideModalById('reset-password')} aria-label="Close" />
            </div>
            <div className="modal-body p-4">
              <div className="text-center mb-3">
                <h3 className="mb-2">Reset Password</h3>
                <p>Create a new password for your account</p>
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    onChangePassword(e.target.value);
                  }}
                  placeholder="Enter new password"
                />
                <div className="mt-2">
                  <small className={passwordResponce.passwordResponceKey === '3' ? 'text-success' : 'text-muted'}>
                    {passwordResponce.passwordResponceText}
                  </small>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              {rError && <p className="text-danger text-center">{rError}</p>}
              <div className="mb-3">
                <button
                  className="btn btn-lg btn-linear-primary w-100"
                  onClick={resetPasswordHandler}
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Success Modal */}
      <div className="modal fade" id="forgot-success-modal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-4 text-center">
              <div className="mb-4">
                <i className="ti ti-mail-check text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="mb-3">Check Your Email</h4>
              <p className="mb-4">We&apos;ve sent a password reset link to your email address.</p>
              <p className="text-muted small mb-4">Didn&apos;t receive an email? Check your spam folder or try again.</p>
              <button
                className="btn btn-lg btn-linear-primary w-100"
                onClick={() => {
                  hideAllBootstrapModals();
                  showModalById('login-modal');
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModals;
