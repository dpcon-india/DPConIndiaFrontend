import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import { fetchCategories } from '../../../../APICalls';
import { Category } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { useNavigate } from 'react-router-dom';
import {
  TbBuilding,
  TbDroplet,
  TbPaint,
  TbTools,
  TbToiletPaper,
  TbCircleDashed,
  TbPlug,
  TbBuildingSkyscraper,
  TbHammer,
  TbArmchair,
  TbRulerMeasure,
  TbCube,
  TbSettings,
} from "react-icons/tb";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  // Function to get uniform black outlined icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('repair') || name.includes('restoration') || name.includes('building')) {
      return <TbBuilding size={50} color="#333" />;
    }

    if (name.includes('waterproof')) {
      return <TbDroplet size={50} color="#333" />;
    }

    if (name.includes('paint')) {
      return <TbPaint size={50} color="#333" />;
    }

    if (name.includes('marble') || name.includes('tiles') || name.includes('tile')) {
      return <TbCube size={50} color="#333" />;
    }

    if (name.includes('plumb')) {
      return <TbToiletPaper size={50} color="#333" />;
    }

    if (name.includes('core') || name.includes('cutting')) {
      return <TbCircleDashed size={50} color="#333" />;
    }

    if (name.includes('electric')) {
      return <TbPlug size={50} color="#333" />;
    }

    if (name.includes('facade') || name.includes('clean')) {
      return <TbBuildingSkyscraper size={50} color="#333" />;
    }

    if (name.includes('fabrication')) {
      return <TbSettings size={50} color="#333" />;
    }

    if (name.includes('furniture')) {
      return <TbArmchair size={50} color="#333" />;
    }

    if (name.includes('estimation') || name.includes('survey')) {
      return <TbRulerMeasure size={50} color="#333" />;
    }

    // Default icon for unmatched categories
    return <TbBuilding size={50} color="#333" />;
  };

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
                          <span className="rounded-pill d-flex justify-content-center align-items-center p-3" style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
                            {getCategoryIcon(e?.categoryName)}
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
