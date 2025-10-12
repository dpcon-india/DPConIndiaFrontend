/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './style/icon/tabler-icons/webfont/tabler-icons.css';
import './style/icon/feather/css/iconfont.css';
import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './core/data/redux/store';
import { UserProvider } from './core/data/context/UserContext';
import AllRoutes from './feature-module/router/router';
import FloatingIcons from './feature-module/components/FloatingIcons';
import DocumentHead from './components/DocumentHead/DocumentHead';

// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min';

// This ensures Bootstrap is available before we try to use it
const initializeApp = async () => {
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    await new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  // Wait for Bootstrap to be available
  if (!window.bootstrap) {
    await new Promise((resolve) => {
      const checkBootstrap = () => {
        if (window.bootstrap) {
          resolve(true);
        } else {
          setTimeout(checkBootstrap, 100);
        }
      };
      checkBootstrap();
    });
  }

  // Initialize Bootstrap components
  const { Tooltip, Popover, Modal } = window.bootstrap;

  // Initialize tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(
    (el) => new Tooltip(el)
  );

  // Initialize popovers
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(
    (el) => new Popover(el)
  );

  // Initialize modals
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach((triggerEl) => {
    triggerEl.addEventListener('click', (e) => {
      const target = triggerEl.getAttribute('data-bs-target');
      if (target) {
        e.preventDefault();
        const modalEl = document.querySelector(target);
        if (modalEl) {
          const modal = Modal.getOrCreateInstance(modalEl);
          modal.show();
        }
      }
    });
  });
};

// Dont remove this code//

// import disableInspect from './utils/disableInspect';
// disableInspect();

const App = () => {
  const location = useLocation();
  const isAdmin = useMemo(
    () => location.pathname.startsWith('/admin'),
    [location.pathname],
  );

  // Initialize Bootstrap when component mounts
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await initializeApp();
        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize application:', error);
      }
    };

    initialize();

    // Re-initialize when route changes
    const handleRouteChange = () => {
      if (isMounted) {
        initializeApp().catch(console.error);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <DocumentHead />
      <AllRoutes />
      {!isAdmin && <FloatingIcons />}
    </>
  );
};

const rootElement = document.getElementById('root');

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

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AppWithProviders />);
} else {
  console.error("Element with id 'root' not found.");
}
