import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { fetchCategories } from '../../../../APICalls';
import { Category } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    const fetCat = await fetchCategories();
    setCategories(fetCat);
  };
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchData();
  }, []);
  return (
    <>
      {/* Breadcrumb */}
      <BreadCrumb title="Categories" item1="Categories" />
      {/* /Breadcrumb */}
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                {categories?.map((e, i) => (
                  <div
                    className="col-lg-3 col-md-6"
                    key={i}
                    onClick={() =>
                      navigate(
                        `/services/service-list?categories=${JSON.stringify([e?._id])}`,
                      )
                    }
                  >
                    <div
                      className="category card wow fadeInUp"
                      data-wow-delay="0.3s"
                    >
                      <div className="card-body">
                        <div className="feature-icon d-flex justify-content-center align-items-center mb-2">
                          <span className="rounded-pill d-flex justify-content-center align-items-center p-3">
                            <ImageWithoutBasePath
                              src={e?.image}
                              className="img-fluid"
                              alt="logo"
                            />
                          </span>
                        </div>
                        <h5 className="text-center">{e?.categoryName}</h5>
                        <div className="overlay">
                          <ImageWithBasePath
                            src="assets/img/services/service-26.jpg"
                            className="img-fluid"
                            alt="img"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </>
  );
};

export default Categories;
