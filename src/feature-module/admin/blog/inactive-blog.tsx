import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Dropdown } from 'primereact/dropdown';
import { api } from '../../../config';
import axios from 'axios';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../core/data/routes/all_routes';
import { deleteBlog } from '../../../APICalls';
interface Blog {
  categoryId: string | any;
  categoryName: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
  metaDescription: string;
  _id: string;
}

const InactiveBlog = () => {
  const routes = all_routes;
  const [selectedValue, setSelectedValue] = useState(null);
  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Tabs Section */}
        <div className="content-page-header content-page-headersplit">
          <h5>All Blog</h5>
          <div className="list-btn">
            <ul>
              <li>
                <div className="filter-sorting">
                  <ul>
                    <li>
                      <Link to="#" className="filter-sets">
                        <Icon.Filter className="react-feather-custom me-2" />
                        Filter
                      </Link>
                    </li>
                    <li>
                      <span>
                        <ImageWithBasePath
                          src="assets/admin/img/icons/sort.svg"
                          className="me-2"
                          alt="img"
                        />
                      </span>
                      <div className="review-sort">
                        <Dropdown
                          value={selectedValue}
                          onChange={(e) => setSelectedValue(e.value)}
                          options={value}
                          optionLabel="name"
                          placeholder="A - Z"
                          className="select admin-select-breadcrumb"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link className="btn btn-primary" to={routes.addBlog}>
                  <i className="fa fa-plus me-2" />
                  Add Blog{' '}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="tab-sets mb-4">
              <div className="tab-contents-sets">
                <ul>
                  <li>
                    <Link to={routes.allBlog}>Active Blog</Link>
                  </li>
                  <li>
                    <Link to={routes.pendingBlog}>Pending Blog</Link>
                  </li>
                  <li>
                    <Link to={routes.inActiveBlog} className="active">
                      Inactive Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="tab-contents-count">
                <h6>Showing 8-10 of 84 results</h6>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-lg-4 col-sm-6 col-12" key={blog.title}>
              <div className="blog grid-blog">
                <div className="blog-image">
                  <Link to={routes.viewService}>
                    <img
                      className="img-fluid serv-img"
                      alt={blog.title}
                      src={blog.image}
                    />
                  </Link>
                  <div className="fav-item">
                    <div className="item-info">
                      <Link to={routes.categories}>
                        <span>{blog?.categoryId?.categoryName}</span>
                      </Link>
                    </div>
                    <span className="serv-rating">
                      <i className="fa-solid fa-star" /> 4.9
                    </span>
                  </div>
                </div>
                <div className="blog-content">
                  <div className="blog-widget-image">
                    <Link to="#" className="table-profileimage">
                      <ImageWithBasePath
                        src="assets/admin/img/customer/user-06.jpg"
                        className="me-2"
                        alt="img"
                      />
                      <span>Robert</span>
                    </Link>
                    <h6>
                      <ImageWithBasePath
                        src="assets/admin/img/icons/calendar.svg"
                        alt="img"
                      />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </h6>
                  </div>
                  <h3 className="title">
                    <Link to={routes.viewService}>{blog.title}</Link>
                  </h3>
                  <p>{blog.metaDescription}</p>
                  <div className="blog-info">
                    <div className="action-search">
                      <Link to={routes.editblog} className="serv-edit">
                        <Icon.Edit className="react-feather-custom" /> Edit
                      </Link>
                      <Link
                        to="#"
                        onClick={() => deleteBlog(blog._id, fetchBlogs)}
                      >
                        <Icon.Trash2 className="react-feather-custom" />
                        Delete
                      </Link>
                    </div>
                    <span>
                      <Icon.AlertCircle className="react-feather-custom" />{' '}
                      Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InactiveBlog;
