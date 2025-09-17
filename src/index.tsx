/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './style/icon/tabler-icons/webfont/tabler-icons.css';
import './style/icon/feather/css/iconfont.css';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './core/data/redux/store';
import { UserProvider } from './core/data/context/UserContext';
import AllRoutes from './feature-module/router/router';
import FloatingIcons from './feature-module/components/FloatingIcons';
import DocumentHead from './components/DocumentHead/DocumentHead';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Dont remove this code//

// import disableInspect from './utils/disableInspect';
// disableInspect();

const App = () => {
  const location = useLocation();
  const isAdmin = useMemo(
    () => location.pathname.startsWith('/admin'),
    [location.pathname],
  );

  return (
    <>
      <DocumentHead />
      <AllRoutes />
      {!isAdmin && <FloatingIcons />}
    </>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  // Create a new app with all providers
  const AppWithProviders = () => (
    <React.StrictMode>
      <HelmetProvider>
        <UserProvider>
          <Provider store={store}>
            <Router>
              <App />
            </Router>
          </Provider>
        </UserProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  // Render the app
  root.render(<AppWithProviders />);
} else {
  console.error("Element with id 'root' not found.");
}
