import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ServiceCities = () => {
  const [profession] = useState([
    { name: 'Beauty & Spa', slug: 'beauty-spa', id: '1', isFeatured: true },
    { name: 'Home Cleaning', slug: 'home-cleaning', id: '2', isFeatured: true },
    { name: 'Repair & Maintenance', slug: 'repair-maintenance', id: '3', isFeatured: true },
    { name: 'Health & Wellness', slug: 'health-wellness', id: '4', isFeatured: true },
  ]);
  const [cities, setCities] = useState<string[]>([
    'Colaba',
    'Nariman Point',
    'Marine Drive',
    'Fort',
    'Churchgate',
    'Crawford Market',
    'Kala Ghoda',
    'CSMT',
    'Flora Fountain',
    'Horniman Circle',
    'Mumbai Central',
    'Grant Road',
    'Haji Ali',
    'Worli',
    'Tardeo',
    'Mahalaxmi',
    'Byculla',
    'Parel',
    'Dadar',
    'Prabhadevi',
    'Matunga',
    "King's Circle",
    'Sion',
  ]);


  return (
    <>
      {/* Links Section */}
      <section className="section info-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="accordion accordion-links">
                {/* Dynamic Profession Links */}
                <div
                  className="accordion-item wow fadeInUp bg-transparent"
                  data-wow-delay="0.2s"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent px-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#professional"
                      aria-expanded="false"
                    >
                      Our Services Near You
                    </button>
                  </h2>
                  <div
                    id="professional"
                    className="accordion-collapse collapse show"
                  >
                    <div className="accordion-body border-0 px-0">
                      <div className="row row-cols-xl-6 row-cols-md-4 row-cols-sm-2 row-cols-1">
                        {profession
                          .filter((service) => service.isFeatured)
                          .map((service, index) => (
                            <div className="col" key={index}>
                              <div className="main-links">
                                <Link to={`/services/service-list?category=${service.id}`}>
                                  {service.name}
                                </Link>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Cities Links */}
                <div
                  className="accordion-item mb-0 wow fadeInUp bg-transparent"
                  data-wow-delay="0.2s"
                >
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent px-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#city"
                      aria-expanded="false"
                    >
                      Popular Places
                    </button>
                  </h2>
                  <div id="city" className="accordion-collapse collapse show">
                    <div className="accordion-body border-0 px-0">
                      <div className="row row-cols-xl-6 row-cols-md-4 row-cols-sm-2 row-cols-1">
                        {cities.map((city, index) => (
                          <div className="col" key={index}>
                            <div className="main-links">
                              {/* <Link
                                to={`/Place/${city}`}
                                state={{ fromNavigation: true }} 
                                onClick={() => window.scrollTo(0, 0)}
                              >
                                {city}
                              </Link> */}
                              <Link
                                to={`/Place/${city.replace(/\s+/g, '-')}`}
                                state={{ fromNavigation: true }}
                                onClick={() => window.scrollTo(0, 0)}
                              >
                                {city}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Links Section */}
    </>
  );
};

export default ServiceCities;
