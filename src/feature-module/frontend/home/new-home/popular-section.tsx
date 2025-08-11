import React, { useEffect, useRef, useState } from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link } from 'react-router-dom';
import 'swiper/css'; // Main Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Navigation, Pagination } from 'swiper/modules';
import { computerServices } from '../../../../core/data/json/computerServices';
import { Category, IService } from '../../../../GlobleType';
import { fetchServicesByCat } from '../../../../APICalls';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';

SwiperCore.use([Navigation, Pagination]);

const PopularSection = ({ featuredCat }: any) => {
  const [select, setSelect] = useState('');
  const [services, setServices] = useState<IService[]>([]);
  const serviceListRef = useRef<HTMLDivElement>(null); // <-- Step 1

  const fetchData = async (id: string) => {
    try {
      setSelect(id);
      const fetchServ = await fetchServicesByCat(id);
      setServices(fetchServ);
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          serviceListRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (featuredCat && featuredCat.length > 0) {
      setSelect(featuredCat[0]._id);
      fetchData(featuredCat[0]._id);
    }
  }, [featuredCat]);

  const routes = all_routes;

  return (
    <>
      <section className="section popular-section">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-lg-6 text-center wow fadeInUp"
              data-wow-delay="0.2s"
            >
              <div className="section-header text-center mb-4">
                <h2 className="mb-1">
                  Our Popular{' '}
                  <span className="text-linear-primary">Services</span>
                </h2>
                <p className="sub-title">
                  Each listing is designed to be clear and concise, providing
                  customers
                </p>
              </div>
            </div>
          </div>
          <ul className="nav nav-tabs nav-tabs-solid justify-content-center mb-4">
            {featuredCat?.map((e: Category) => (
              <li className="nav-item mb-3" key={e._id}>
                <Link
                  className={select === e._id ? 'nav-link active' : 'nav-link'}
                  to="#computer-service"
                  data-bs-toggle="tab"
                  onClick={() => fetchData(e._id || '')}
                >
                  {e.categoryName}
                </Link>
              </li>
            ))}
          </ul>
          <div className="tab-content" ref={serviceListRef}>
            <div className="tab-pane fade active show" id="computer-service">
              <Swiper
                spaceBetween={10}
                slidesPerView={4}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  1000: { slidesPerView: 4 },
                  700: { slidesPerView: 3 },
                  550: { slidesPerView: 2 },
                  400: { slidesPerView: 1 },
                  300: { slidesPerView: 1 },
                }}
              >
                {services?.map((res: IService, index: number) => (
                  <SwiperSlide key={index}>
                    <div
                      className="service-item wow fadeInUp"
                      data-wow-delay="0.2s"
                    >
                      <div className="service-img">
                        <div className="slide-images">
                          <Link to={`/services/service-details/${res?._id}`}>
                            <ImageWithoutBasePath
                              src={`${res?.image}` || res.gallery[0]}
                              className="img-fluid"
                              alt="img"
                            />
                          </Link>
                        </div>
                        {/* <div className="fav-item d-flex align-items-center justify-content-between w-100">
                          <Link to="#" className="avatar avatar-md">
                            <ImageWithBasePath
                              src={`assets/img/profiles/avatar-03.jpg`}
                              className="rounded-circle"
                              alt="User"
                            />
                          </Link>
                          <Link to="#" className="fav-icon">
                            <i className="ti ti-heart" />
                          </Link>
                        </div> */}
                      </div>
                      <div className="service-content">
                        <h6 className="mb-1 text-truncate">
                          <Link to={`/services/service-details/${res?._id}`}>
                            {res?.serviceTitle}
                          </Link>
                        </h6>
                        <div className="d-flex align-items-center justify-content-between">
                          {/* <p className="fs-14 mb-0">
                            <i className="ti ti-star-filled text-warning me-1" />
                            {res?.Reviews}
                          </p> */}
                          <small>₹{res?.price}</small>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="text-center wow fadeInUp" data-wow-delay="0.2s">
                <Link to={`/services/service-list`} className="btn btn-dark">
                  View All
                  <i className="ti ti-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularSection;
