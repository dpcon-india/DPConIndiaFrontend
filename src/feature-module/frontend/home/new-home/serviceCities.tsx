import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSubCategories } from '../../../../APICalls';

const ServiceCities = () => {
  type subCategorie = {
    SubcategoryName: string;
    SubcategorySlug: string;
    categoryId: string;
    createdAt: Date;
    isFeatured: boolean;
    _id: string;
  };
  const [profession, setProfession] = useState<subCategorie[]>([]);
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

  const FetchData = async () => {
    const pro = await fetchSubCategories();
    setProfession(pro);
  };

  useEffect(() => {
    FetchData();
  }, []);

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
                          ?.filter((e) => e?.isFeatured)
                          ?.map((service, index) => (
                            <div className="col" key={index}>
                              <div className="main-links">
                                {/* <Link to="#">{service.SubcategoryName}</Link> */}
                                <Link
                                  to={`/services/service-list?sub=${service._id}`}
                                >
                                  {service.SubcategoryName}
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
