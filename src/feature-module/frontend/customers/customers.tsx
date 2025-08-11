import React from 'react';
import CustomersRoutes from './customers.routes';
import NewFooter from '../home/footer/newFooter';
import HomeHeader from '../home/header/home-header';

const Customers = () => {
  return (
    <>
      {/* <CustomerHeader /> */}
      <HomeHeader type={1} />
      <CustomersRoutes />
      <NewFooter />
    </>
  );
};

export default Customers;
