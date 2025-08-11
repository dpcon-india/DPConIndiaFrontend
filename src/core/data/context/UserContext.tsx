import React, { createContext, useContext, useState, ReactNode } from 'react';
import PropTypes from 'prop-types';

// Define the type for the context
interface UserContextType {
  user: any;
  storeUser: (data: any) => void;
  logout: () => void;
}

// Create the context with a default value of `undefined` and the correct type
const userContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const storeUser = (data: any) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <userContext.Provider value={{ user, storeUser, logout }}>
      {children}
    </userContext.Provider>
  );
};

// Add PropTypes validation for children
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
