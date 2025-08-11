import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { InputOtp } from 'primereact/inputotp';
import { api } from '../../../../config';
import axios from 'axios';
import { useUser } from '../../../../core/data/context/UserContext';
const AuthModals = () => {
  const [token, setTokens] = useState<any>();
  const [token2, setTokens2] = useState<any>();
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState<number>();
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [showROtp, setShowROtp] = useState<boolean>(false);
  const [number, setNumber] = useState<string>('');
  const [otpValue, setOtpValue] = useState<string>();
  const [requestId, setRequestId] = useState<string>();
  const [rName, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [showModalTrigger, setShowModalTrigger] = useState<boolean>(false);
  const [rError, setRError] = useState<string>('');
  const location = useLocation();
  const [passwordResponce, setPasswordResponce] = useState({
    passwordResponceText:
      "Use 8 or more characters with a mix of letters, number's symbols.",
    passwordResponceKey: '',
  });
  const RegisterRef: any = useRef();
  const { storeUser }: any = useUser();
  const navigate = useNavigate();
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const onChangePassword = (password: string) => {
    setPassword(password);
    if (password.match(/^$|\s+/)) {
      setPasswordResponce({
        passwordResponceText: 'Whitespaces are not allowed',
        passwordResponceKey: '',
      });
    } else if (password.length === 0) {
      setPasswordResponce({
        passwordResponceText: '',
        passwordResponceKey: '',
      });
    } else if (password.length < 8) {
      setPasswordResponce({
        passwordResponceText: 'Weak. Must contain at least 8 characters',
        passwordResponceKey: '0',
      });
    } else if (
      password.search(/[a-z]/) < 0 ||
      password.search(/[A-Z]/) < 0 ||
      password.search(/[0-9]/) < 0
    ) {
      setPasswordResponce({
        passwordResponceText:
          'Average. Must contain at least 1 upper case and number',
        passwordResponceKey: '1',
      });
    } else if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
      setPasswordResponce({
        passwordResponceText: 'Almost. Must contain a special symbol',
        passwordResponceKey: '2',
      });
    } else {
      setPasswordResponce({
        passwordResponceText: 'Awesome! You have a secure password.',
        passwordResponceKey: '3',
      });
    }
  };

  // const phoneSubmit = async () => {
  //   try {
  //     const { data } = await axios.post(`${api}profiles/gen-otp`, {
  //       number,
  //     });
  //     setOtp(data.otp);
  //     setRequestId(data.otpResponse?.requestId);
  //     setShowOtp(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const phoneSubmit = async () => {
    setPhoneError(''); // Reset error message before new request

    try {
      const { data } = await axios.post(`${api}profiles/gen-otp`, {
        number,
      });
      setOtp(data.otp);
      setRequestId(data.otpResponse?.requestId);
      setShowOtp(true);
    } catch (error: any) {
      if (error.response) {
        // Display API error message if available, otherwise use a default message
        setPhoneError(error.response.data.message || 'Invalid phone number');
      } else {
        setPhoneError('Network error. Please try again.');
      }
    }
  };
  const submitHandler = async () => {
    try {
      const response = await axios.post(`${api}profiles/login-user`, {
        number,
        otp: otpValue,
        requestId,
      });
      if (response.status === 200) {
        alert('Login successful!');
        localStorage.setItem('user', JSON.stringify(response.data));
        if (location.pathname == '/home') {
          if (response.data?.profile.role == 'admin')
            navigate('/admin/dashboard');
          else if (response.data?.profile.role == 'provider')
            navigate('/providers/dashboard');
          else if (response.data?.profile.role == 'customer')
            navigate('/customers/customer-dashboard');
          else if (response.data?.profile.role == 'staff')
            navigate('/staff/staff-dashboard');
        } else {
          navigate(location.pathname);
        }
        storeUser(response.data.profile);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const registerHandler = async () => {
  //   try {
  //     if (!rName || !email || !number || !password)
  //       return setRError('Please Fill All The Details');
  //     if (number.length != 10)
  //       return setRError('Phone Number Must be 10-digit long');
  //     if (password.length < 6)
  //       return setRError('Password Must be Atleast 8 words');

  //     const { data } = await axios.post(`${api}profiles/signup`, {
  //       name: rName,
  //       email,
  //       number,
  //       password,
  //       role: 'customer',
  //     });
  //     if (data.error) return setRError(data.error);
  //     setRequestId(data.requestId);
  //     setShowROtp(true);
  //     setOtp(data.otp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const registerHandler = async () => {
    // Reset error messages
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setRError('');

    let isValid = true;

    // Validate Name
    if (!rName) {
      setNameError('First Name is required');
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setEmailError('Valid Email is required');
      isValid = false;
    }

    // Validate Phone Number
    if (!number || number.length !== 10) {
      setPhoneError('Phone Number must be 10 digits long');
      isValid = false;
    }

    // Validate Password
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    // If any validation fails, stop the function
    if (!isValid) return;

    try {
      const { data } = await axios.post(`${api}profiles/signup`, {
        name: rName,
        email,
        number,
        password,
        role: 'customer',
      });

      if (data.error) {
        setRError(data.error); // Display API error message
        return;
      }

      setRequestId(data.requestId);
      setShowROtp(true);
      setOtp(data.otp);
    } catch (error: any) {
      if (error.response) {
        // Check if API returns a 400 error with "number already exists" message
        if (error.response.status === 400) {
          setPhoneError(
            error.response.data.message || 'Phone number already exists',
          );
        } else {
          setRError(
            error.response.data.message ||
              'Something went wrong. Please try again.',
          );
        }
      } else {
        setRError('Network error. Please try again later.');
      }
    }
  };

  const VerifyOtp = async () => {
    try {
      const res = await axios.post(`${api}profiles/verify-otp`, {
        number,
        otp: otpValue,
        requestId,
      });
      if (res?.status != 200) {
        return setRError(res?.data?.message);
      }
      alert('Login successful!');
      localStorage.setItem('user', JSON.stringify(res.data));
      if (location.pathname == '/home') {
        if (res.data?.profile.role == 'admin') navigate('/admin/dashboard');
        else if (res.data?.profile.role == 'provider')
          navigate('/providers/dashboard');
        else if (res.data?.profile.role == 'customer')
          navigate('/customers/customer-dashboard');
        else if (res.data?.profile.role == 'staff')
          navigate('/staff/staff-dashboard');
      } else {
        navigate(location.pathname);
      }
      storeUser(res.data.profile);
      window.location.reload();
      setShowROtp(false);
      // if (RegisterRef.current) {
      //   RegisterRef.current.setAttribute('data-bs-dismiss', 'modal');
      //   RegisterRef.current.setAttribute('data-bs-target', '#login-modal');
      // }
      setShowModalTrigger(true);
    } catch (error) {
      setShowModalTrigger(false);
      console.log(error);
    }
  };
  return (
    <>
      {/* Login Modal */}
      <div
        className="modal fade"
        id="login-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="text-center mb-3">
                  <h3 className="mb-2">Welcome</h3>
                  <p>Enter your credentials to access your account</p>
                </div>
                {/* <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setNumber(e?.target?.value)}
                    placeholder="91XXXXXXXXXX"
                  />
                </div> */}
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setNumber(e?.target?.value)}
                    placeholder="91XXXXXXXXXX"
                  />
                  {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
                </div>

                {!showOtp && (
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-lg btn-linear-primary w-100"
                      onClick={() => phoneSubmit()}
                    >
                      Get OTP
                    </button>
                  </div>
                )}
                {otp && <p>{otp}</p>}
                {showOtp && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">OTP</label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => setOtpValue(e?.target?.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="btn btn-lg btn-linear-primary w-100"
                        onClick={() => submitHandler()}
                      >
                        Sign In
                      </button>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-center">
                  <p>
                    Don’t have a account?{' '}
                    <button
                      className="text-dark-blue"
                      type="button"
                      onClick={() => setShowROtp(false)}
                      data-bs-toggle="modal"
                      data-bs-target="#register-modal"
                    >
                      Join us Today
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Login Modal */}
      {/* Register Modal */}
      <div
        className="modal fade"
        id="register-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <form action="#">
                {!showROtp ? (
                  <>
                    <div className="text-center mb-3">
                      <h3 className="mb-2">Registration</h3>
                      {rError ? (
                        <p style={{ color: 'red' }}>{rError}</p>
                      ) : (
                        <p>Enter your credentials to access your account</p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                      />
                      {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailError && (
                        <p style={{ color: 'red' }}>{emailError}</p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        id="phone"
                        name="phone"
                        type="number"
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="91XXXXXXXXXX"
                      />
                      {phoneError && (
                        <p style={{ color: 'red' }}>{phoneError}</p>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <label className="form-label">Password</label>
                        <p className="text-gray-6 fw-medium mb-1">
                          Must be 8 Characters at Least
                        </p>
                      </div>
                      <input
                        type="password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {passwordError && (
                        <p style={{ color: 'red' }}>{passwordError}</p>
                      )}
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
                            I agree to{' '}
                            <Link
                              to="/pages/terms-condition"
                              className="text-dark-blue text-decoration-underline"
                            >
                              Terms of use
                            </Link>{' '}
                            &amp;{' '}
                            <Link
                              to="/pages/privacy-policy"
                              className="text-dark-blue text-decoration-underline"
                            >
                              Privacy policy
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        type="button"
                        // data-bs-toggle="modal"
                        // data-bs-target="#login-modal"
                        className="btn btn-lg btn-linear-primary w-100"
                        onClick={() => {
                          registerHandler();
                        }}
                        ref={RegisterRef}
                      >
                        Register
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">OTP</label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => setOtpValue(e?.target?.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        type="button"
                        {...(showModalTrigger && {
                          'data-bs-toggle': 'modal',
                          'data-bs-target': '#login-modal',
                        })}
                        className="btn btn-lg btn-linear-primary w-100"
                        onClick={() => {
                          VerifyOtp();
                        }}
                      >
                        Verify Otp
                      </button>
                    </div>
                  </>
                )}
                <div className=" d-flex justify-content-center">
                  <p>
                    Already have a account?{' '}
                    <Link
                      to="#"
                      className="text-dark-blue"
                      data-bs-target="#login-modal"
                      data-bs-toggle="modal"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Register Modal */}
      {/* Forgot Modal */}
      <div
        className="modal fade"
        id="forgot-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <form action="#">
                <div className="text-center mb-3">
                  <h3 className="mb-2">Forgot Password?</h3>
                  <p>
                    Enter your email, we will send you a otp to reset your
                    password.
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" />
                </div>
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-lg btn-linear-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#otp-email-modal"
                  >
                    Submit
                  </button>
                </div>
                <div className=" d-flex justify-content-center">
                  <p>
                    Remember Password?{' '}
                    <Link
                      to="#"
                      className="text-dark-blue"
                      data-bs-toggle="modal"
                      data-bs-target="#login-modal"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Forgot Modal */}
      {/* Email otp Modal */}
      <div
        className="modal fade"
        id="otp-email-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <form action="#" className="digit-group">
                <div className="text-center mb-3">
                  <h3 className="mb-2">Email OTP Verification</h3>
                  <p className="fs-14">
                    OTP sent to your Email Address ending ******doe@example.com
                  </p>
                </div>
                <div className="text-center otp-input">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <InputOtp
                      value={token}
                      onChange={(e) => setTokens(e.value)}
                      integerOnly
                    />
                  </div>
                  <div>
                    <div className="badge bg-danger-transparent mb-3">
                      <p className="d-flex align-items-center ">
                        <i className="ti ti-clock me-1" />
                        09:59
                      </p>
                    </div>
                    <div className="mb-3 d-flex justify-content-center">
                      <p>
                        Didn&apos;t get the OTP?{' '}
                        <Link to="#" className="text-dark-blue">
                          Resend OTP
                        </Link>
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-lg btn-linear-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#otp-phone-modal"
                      >
                        Verify &amp; Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Email otp Modal */}
      {/* Phone otp Modal */}
      <div
        className="modal fade"
        id="otp-phone-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <form action="#" className="digit-group">
                <div className="text-center mb-3">
                  <h3 className="mb-2">Phone OTP Verification</h3>
                  <p>OTP sent to your mobile number ending&nbsp;******9575</p>
                </div>
                <div className="text-center otp-input">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <InputOtp
                      value={token2}
                      onChange={(e) => setTokens2(e.value)}
                      integerOnly
                    />
                  </div>
                  <div>
                    <div className="badge bg-danger-transparent mb-3">
                      <p className="d-flex align-items-center ">
                        <i className="ti ti-clock me-1" />
                        09:59
                      </p>
                    </div>
                    <div className="mb-3 d-flex justify-content-center">
                      <p>
                        Didn&apos;t get the OTP?{' '}
                        <Link to="#" className="text-dark-blue">
                          Resend OTP
                        </Link>
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-lg btn-linear-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#reset-password"
                      >
                        Verify &amp; Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Phone otp Modal */}
      {/* Reset password Modal */}
      <div
        className="modal fade"
        id="reset-password"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <div className="text-center mb-3">
                <h3 className="mb-2">Reset Password</h3>
                <p className="fs-14">
                  Your new password must be different from previous used
                  passwords.
                </p>
              </div>
              <form action="#">
                <div className="input-block mb-3">
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="pass-group" id="passwordInput">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => onChangePassword(e.target.value)}
                        className="form-control pass-input"
                      />
                    </div>
                  </div>
                  <div
                    className={`password-strength d-flex ${
                      passwordResponce.passwordResponceKey === '0'
                        ? 'poor-active'
                        : passwordResponce.passwordResponceKey === '1'
                          ? 'avg-active'
                          : passwordResponce.passwordResponceKey === '2'
                            ? 'strong-active'
                            : passwordResponce.passwordResponceKey === '3'
                              ? 'heavy-active'
                              : ''
                    }`}
                    id="passwordStrength"
                  >
                    <span id="poor" className="active" />
                    <span id="weak" className="active" />
                    <span id="strong" className="active" />
                    <span id="heavy" className="active" />
                  </div>
                  <div id="passwordInfo" className="mb-2" />
                  <p className="fs-12">
                    {passwordResponce.passwordResponceText}
                  </p>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <label className="form-label">Confirm Password</label>
                  </div>
                  <input type="password" className="form-control" />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-lg btn-linear-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#success_modal"
                  >
                    Save Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Reset password Modal */}
      {/* success message Modal */}
      <div
        className="modal fade"
        id="success-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-end pb-0 border-0">
              <Link to="#" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-circle-x-filled fs-20" />
              </Link>
            </div>
            <div className="modal-body p-4">
              <div className="text-center">
                <span className="success-check mb-3 mx-auto">
                  <i className="ti ti-check" />
                </span>
                <h4 className="mb-2">Success</h4>
                <p>Your new password has been successfully saved</p>
                <div>
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-lg btn-linear-primary w-100"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /success message Modal */}
    </>
  );
};

export default AuthModals;
