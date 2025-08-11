/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './style/icon/tabler-icons/webfont/tabler-icons.css';
import './style/icon/feather/css/iconfont.css';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './core/data/redux/store';
import { UserProvider } from './core/data/context/UserContext';
import AllRoutes from './feature-module/router/router';
import FloatingIcons from './feature-module/components/FloatingIcons';
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
      <AllRoutes />
      {!isAdmin && <FloatingIcons />}
    </>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <UserProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </UserProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Element with id 'root' not found.");
}
