import React, { useEffect, useState } from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword, validateResetToken } from '../../../../APICalls';
import HomeHeader from '../../home/header/home-header';
import AuthFooter from './common/footer';

interface PasswordResponse {
  text: string;
  strength: 'weak' | 'medium' | 'strong' | '';
}

const ResetPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [passwordResponse, setPasswordResponse] = useState<PasswordResponse>({
    text: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    strength: '',
  });

  const getPasswordStrengthClass = () => {
    switch (passwordResponse.strength) {
      case 'weak':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'strong':
        return 'text-success';
      default:
        return 'text-muted';
    }
  };

  const getPasswordStrengthIcon = () => {
    switch (passwordResponse.strength) {
      case 'weak':
        return 'fas fa-exclamation-circle';
      case 'medium':
        return 'fas fa-exclamation-triangle';
      case 'strong':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setError('No reset token found in URL');
        setIsValidToken(false);
        return;
      }
      try {
        const { valid, error: validationError, email: userEmail } = await validateResetToken(token);
        if (!valid) {
          setError(validationError || 'This password reset link is invalid or has expired. Please request a new one.');
          setIsValidToken(false);
          return;
        }
        setEmail(userEmail || '');
        setIsValidToken(true);
        setError('');
      } catch (e: any) {
        setError(e?.message || 'An unexpected error occurred while validating your reset link.');
        setIsValidToken(false);
      }
    };
    validate();
  }, [token]);

  const onChangePassword = (newPassword: string) => {
    setPassword(newPassword);
    if (/^$|\s+/.test(newPassword)) {
      setPasswordResponse({ text: 'Whitespaces are not allowed', strength: '' });
    } else if (newPassword.length === 0) {
      setPasswordResponse({ text: 'Use 8 or more characters with a mix of letters, numbers & symbols', strength: '' });
    } else if (newPassword.length < 8) {
      setPasswordResponse({ text: 'Weak. Must contain at least 8 characters', strength: 'weak' });
    } else if (
      newPassword.search(/[a-z]/) < 0 ||
      newPassword.search(/[A-Z]/) < 0 ||
      newPassword.search(/[0-9]/) < 0 ||
      newPassword.search(/[^A-Za-z0-9]/) < 0
    ) {
      setPasswordResponse({ text: 'Medium. Include upper & lower case letters, numbers & symbols', strength: 'medium' });
    } else {
      setPasswordResponse({ text: 'Strong password', strength: 'strong' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordResponse.strength !== 'strong') {
      toast.error('Please enter a strong password');
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(token!, password);
      toast.success('Password has been reset successfully');
      navigate(routes.login);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <HomeHeader type={11} />

      {isValidToken === null ? (
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-sm my-5">
                  <div className="card-body p-5 text-center">
                    <h2 className="mb-4">Verifying Your Link</h2>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Please wait while we verify your password reset link.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !isValidToken ? (
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-sm my-5">
                  <div className="card-body p-5">
                    <h2 className="text-center mb-4">Invalid Reset Link</h2>
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error || 'This password reset link is invalid or has expired.'}
                    </div>
                    <div className="text-center mt-4">
                      <Link to={routes.forgotPassword} className="btn btn-primary">
                        Request New Reset Link
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-sm my-5">
                  <div className="card-body p-5">
                    <div className="text-center mb-4">
                      <h2>Reset Your Password</h2>
                      <p className="text-muted">Enter your new password below {email ? `for ${email}` : ''}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          id="newPassword"
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => onChangePassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                        />
                        <div className={`form-text ${getPasswordStrengthClass()}`}>
                          <i className={`${getPasswordStrengthIcon()} me-2`}></i>
                          {passwordResponse.text}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                        />
                        {password && confirmPassword && password !== confirmPassword && (
                          <div className="text-danger small mt-1">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            Passwords do not match
                          </div>
                        )}
                      </div>

                      <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Resetting...
                            </>
                          ) : (
                            'Reset Password'
                          )}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link to={routes.login} className="text-primary">
                          <i className="ti ti-arrow-left me-1"></i> Back to Login
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthFooter />
    </div>
  );
};

export default ResetPassword;
