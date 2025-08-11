import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import axios from 'axios';
import { api } from '../../../../config';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

interface Blog {
  id: string;
  title: string;
  image: string;
  createdAt: string;
  description: string;
  tags: string;
}

const BlogDetails: React.FC = () => {
  const location = useLocation();

  // Extract the query parameters
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogDetails = async () => {
    try {
      const { data } = await axios.get(`${api}getBlogById/${id}`);
      setBlog(data);
    } catch (err) {
      setError('Failed to fetch blog details.');
      console.error('Error fetching blog details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    AOS.init({ duration: 1000, once: true });
  }, [id]);

  if (loading) {
    return <p>Loading blog details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!blog) {
    return <p>No blog details available.</p>;
  }

  return (
    <>
      <BreadCrumb title="Blog Details" item1="Home" item2="Blog Details" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 blog-details">
                <div className="blog-head">
                  <div className="blog-category">
                    <ul>
                      <li>
                        <i className="feather icon-calendar me-1" />
                        {new Date(blog?.createdAt).toLocaleDateString()}
                      </li>
                    </ul>
                  </div>
                  <h4 className="mb-3">{blog?.title}</h4>
                </div>
                {/* Blog Post */}
                <div className="card blog-list shadow-none">
                  <div className="card-body">
                    <div className="blog-image">
                      <ImageWithoutBasePath
                        className="img-fluid"
                        src={blog?.image}
                        alt={blog?.title}
                      />
                    </div>
                    <div className="blog-content">
                      <p
                        dangerouslySetInnerHTML={{ __html: blog?.description }}
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Blog Sidebar */}
              <div className="col-lg-4 col-md-12 blog-sidebar theiaStickySidebar">
                <StickyBox>
                  <div className="card tags-widget">
                    <div className="card-body">
                      <h4 className="side-title">Tags</h4>
                      <ul className="d-flex align-items-center flex-wrap">
                        {(typeof blog?.tags === 'string'
                          ? blog.tags.split(',')
                          : blog?.tags || []
                        )
                          .map((tag) => tag.trim())
                          .map((tag, index) => (
                            <li key={index} className="me-2 mb-2">
                              <Link
                                to="#"
                                className="bg-dark p-1 d-block fs-12 rounded"
                              >
                                {tag}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </StickyBox>
              </div>
              {/* /Blog Sidebar */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
