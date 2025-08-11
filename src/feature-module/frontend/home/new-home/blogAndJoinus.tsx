import React, { useEffect, useState } from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { api } from '../../../../config';
import axios from 'axios';

interface Blog {
  id: string; // Ensure you map this to match your backend's unique identifier
  categoryId: { _id: string; categoryName: string };
  title: string;
  image: string;
  description: string;
  metaDescription: string;
  tags: string[];
  createdAt: string;
}

const BlogAndJoinus: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${api}blogs`);
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const imgSliderOptions = {
    dots: false,
    infinite: true,
    speed: 500,
    swipe: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1000, settings: { slidesToShow: 3 } },
      { breakpoint: 700, settings: { slidesToShow: 2 } },
      { breakpoint: 550, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="section service-section white-section blog-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="section-header">
              <h2 className="mb-1">
                Checkout our Recent{' '}
                <span className="text-linear-primary">Blogs</span>
              </h2>
              <p className="sub-title">
                Each listing is designed to be clear and concise, providing
                customers
              </p>
            </div>
          </div>
        </div>
        <Slider {...imgSliderOptions} className="service-slider">
          {blogs.map((blog) => (
            <div
              className="blog-item"
              key={blog.id}
              style={{ padding: '10px' }}
            >
              {/* Blog Image */}
              <div className="blog-img mb-3">
                <Link to={`${all_routes.blogDetails}/${blog.id}`}>
                  <img
                    src={blog.image || 'assets/img/blogs/default.jpg'}
                    alt={blog.title || 'Blog Image'}
                    className="img-fluid rounded"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                </Link>
              </div>

              {/* Blog Content */}
              <div className="blog-content">
                <p className="fs-14 text-gray-9 mb-2">
                  {blog.categoryId?.categoryName || 'General'}
                  <i className="ti ti-circle-filled mx-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <h6 className="text-truncate mb-2">
                  <Link
                    to={`${all_routes.blogDetails}/${blog.id}`}
                    className="text-dark"
                  >
                    {blog.title}
                  </Link>
                </h6>

                <p className="two-line-ellipsis text-muted mb-3">
                  {blog.metaDescription || 'No description available.'}
                </p>

                <div className="d-flex flex-wrap">
                  {blog.tags.length > 0 ? (
                    blog.tags.map((tag, idx) => (
                      <span
                        className="badge bg-primary text-white me-2"
                        key={idx}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="badge bg-secondary">No Tags</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="text-center mt-3">
          <Link to={all_routes.blogGrid} className="btn btn-dark">
            View All <i className="ti ti-arrow-right ms-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogAndJoinus;
