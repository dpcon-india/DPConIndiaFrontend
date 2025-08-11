import React from 'react';
import FooterOne from '../home/home-one/footer-one';
import BlogRoutes from './blog.routes';
import HomeHeader from '../home/header/home-header';
import NewFooter from '../home/footer/newFooter';
import AuthModals from '../home/new-home/authModals';

const Blog = () => {
  return (
    <>
      <HomeHeader type={1} />
      <BlogRoutes />
      <NewFooter />
      <AuthModals />
    </>
  );
};

export default Blog;
