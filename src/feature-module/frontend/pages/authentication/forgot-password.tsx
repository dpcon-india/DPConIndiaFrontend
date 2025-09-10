import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../../../APICalls';
import PagesAuthHeader from './common/header';
import AuthFooter from './common/footer';

const ForgotPassword = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      toast.success('Password reset link has been sent to your email');
      navigate(routes.login);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset link';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PagesAuthHeader />
      <div className="main-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column justify-content-center">
                  <div className="card p-sm-4 my-5">
                    <div className="card-body">
                      <div className="text-center mb-3">
                        <h3 className="mb-2">Forgot Password</h3>
                        <p>Enter your email to receive a password reset link</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-lg btn-linear-primary w-100"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="mb-0">
                          Remember your password?{' '}
                          <Link to={routes.login} className="text-primary">
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </>
  );
};

export default ForgotPassword;
