import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ServiceCategory {
  name: string;
  color: string;
  img: string;
}

interface ServiceCarouselProps {
  serviceCategories: ServiceCategory[];
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ serviceCategories }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          rows: 1,
          slidesPerRow: 1,
        },
      },
    ],
  };

  return (
    <div className="service-carousel" style={{ padding: '0 2px' }}>
      <Slider {...settings} className="service-slider">
        {serviceCategories.map((service, i) => (
          <div key={i} style={{ padding: '0 3px' }}>
            <div
              className="service-tile d-flex flex-column align-items-center"
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 10px',
                height: 'auto',
                minHeight: '180px',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                className="position-absolute"
                style={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: service.color,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'white',
                  border: `2px solid ${service.color}`,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '6px',
                  marginBottom: '12px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: service.color,
                  }}
                >
                  <img
                    src={service.img}
                    alt={service.name}
                    style={{
                      width: '120%',
                      height: '120%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transform: 'scale(1.2)',
                    }}
                  />
                </div>
              </div>
              <p
                className="service-name mb-0 fw-medium"
                style={{
                  fontSize: '14px',
                  color: '#333',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  marginTop: 'auto',
                  padding: '0 8px',
                }}
              >
                {service.name}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServiceCarousel;
