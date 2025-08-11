import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../../config';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';

interface Blog {
  _id: string;
  categoryId: { categoryName: string } | null;
  title: string;
  image: string;
  createdAt: string;
  description: string;
  author: string;
}

const BlogGrid = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9; 
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${api}blogs`);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    AOS.init({ duration: 1000, once: true });
  }, []);


  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <BreadCrumb title="Blog" item1="Home" item2="Blog" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <div className="col-xl-4 col-md-6" key={blog?._id}>
                    <div className="card p-0" data-aos="fade-up">
                      <div className="card-body p-0">
                        <div className="img-sec w-100">
                          <div onClick={() => navigate(`/blog/blog-details?id=${blog?._id}`)}>
                            <img style={{height:'350px',objectFit:'cover'}}
                              src={blog?.image}
                              className="img-fluid rounded-top w-100"
                              alt={blog?.title || 'Blog Image'}
                            />
                          </div>
                          <div className="image-tag d-flex justify-content-end align-items-center">
                            <span className="trend-tag">
                              {blog?.categoryId?.categoryName || 'General'}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="d-flex align-items-center mb-3">
                            <div className="d-flex align-items-center border-end pe-2">
                              <h6 className="fs-14 text-gray-6">
                                {blog?.author || 'Admin'}
                              </h6>
                            </div>
                            <div className="d-flex align-items-center ps-2">
                              <span>
                                <i className="ti ti-calendar me-2" />
                              </span>
                              <span className="fs-14">
                                {new Date(blog?.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <h6 className="fs-16 text-truncate mb-1">
                            <Link to={`${all_routes.blogDetails}${blog?._id}`}>
                              {blog?.title}
                            </Link>
                          </h6>
                          <p
                    dangerouslySetInnerHTML={{ __html: blog?.description }}
                  ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No blogs available.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="table-paginate d-flex justify-content-center align-items-center flex-wrap row-gap-3">
              <nav aria-label="Page navigation">
                <ul className="paginations d-flex justify-content-center align-items-center">
                  <li className={`page-item me-2 ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Link
                      className="d-flex justify-content-center align-items-center"
                      to="#"
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    >
                      <i className="ti ti-arrow-left me-2" /> Prev
                    </Link>
                  </li>
                  {/* Pagination numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item me-2 ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <Link
                        className="page-link-1 d-flex justify-content-center align-items-center"
                        to="#"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  ))}
                  <li className={`page-item me-2 ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Link
                      className="d-flex justify-content-center align-items-center"
                      to="#"
                      onClick={() =>
                        currentPage < totalPages && handlePageChange(currentPage + 1)
                      }
                    >
                      Next <i className="ti ti-arrow-right ms-2" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogGrid;
