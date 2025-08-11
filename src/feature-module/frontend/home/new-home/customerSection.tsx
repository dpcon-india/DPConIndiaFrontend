import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchTestimonials } from '../../../../APICalls';
import { Category } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
const CustomerSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testimonials, setTestimonials] = useState<Category[]>([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials.');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const imgSliderOptions = {
    dots: false,
    infinite: true,
    speed: 500,
    swipe: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1000, settings: { slidesToShow: 2 } },
      { breakpoint: 700, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="section service-section white-section testimonial-section">
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="col-lg-6 text-center wow fadeInUp"
            data-wow-delay="0.2s"
          >
            <div className="section-header text-center">
              <h2 className="mb-1">
                Genuine reviews from{' '}
                <span className="text-linear-primary">Customers</span>
              </h2>
              <p className="sub-title">
                Each listing is designed to be clear and concise, providing
                customers
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <p>Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-danger">{error}</p>
          </div>
        ) : testimonials?.length === 0 ? (
          <div className="text-center">
            <p>No testimonials available.</p>
          </div>
        ) : (
          <Slider {...imgSliderOptions} className="testimonial-slider">
            {testimonials?.map((testimonial) => (
              <div
                className="testimonial-item wow fadeInUp"
                data-wow-delay="0.2s"
                key={testimonial._id}
              >
                <div
                  className="d-flex align-items-center mb-3"
                  style={{ display: 'flex' }}
                >
                  {Array(5)
                    .fill(null)
                    .map((_, index) => (
                      <i
                        className="fa-solid fa-star text-warning me-1"
                        key={index}
                      />
                    ))}
                </div>
                <h5 className="mb-2">
                  {testimonial.title || 'Excellent Service'}
                </h5>
                <p className="mb-4">{`"${testimonial.desc}"`}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg flex-shrink-0">
                      <ImageWithoutBasePath
                        src={
                          testimonial.image ||
                          'assets/img/profiles/avatar-default.jpg'
                        }
                        className="img-fluid rounded-circle"
                        alt="Testimonial Image"
                      />
                    </span>
                    <h6 className="text-truncate ms-2">{testimonial.name}</h6>
                  </div>
                  <p>{testimonial.timeAgo || 'Recently'}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default CustomerSection;
