import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import * as Icon from 'react-feather';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import StickyBox from 'react-sticky-box';
import { Slider, SliderSingleProps } from 'antd';

const SearchList = () => {
  const routes = all_routes;
  const [value, setValue] = useState<[number, number]>([20, 80]);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
  const filterCheckboxStyle = {
    height: isExpanded ? 'auto' : '180px',
  };

  const value1 = [
    { name: 'All Sub Category' },
    { name: 'Computer' },
    { name: 'Construction' },
  ];
  const value2 = [{ name: 'Price Low to High' }, { name: 'Price High to Low' }];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const onChange = (value: number | number[]) => {
    console.log('onChange: ', value);
  };
  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
    value,
  ) => `$${value}`;
  const onChangeComplete = (value: number | number[]) => {
    console.log('onChangeComplete: ', value);
  };
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <div>
      <div className="bg-img">
        <ImageWithBasePath
          src="assets/img/bg/work-bg-03.png"
          alt="img"
          className="bgimg1"
        />
        <ImageWithBasePath
          src="assets/img/bg/work-bg-03.png"
          alt="img"
          className="bgimg2"
        />
        <ImageWithBasePath
          src="assets/img/bg/feature-bg-03.png"
          alt="img"
          className="bgimg3"
        />
      </div>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Find a Professional</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={routes.homeOne}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Find a Professional
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      <div className="content">
        <div className="container">
          <div className="row">
            {/* Filter */}
            <div className="col-lg-3 col-sm-12 theiaStickySidebar">
              <StickyBox>
                <div className="card ">
                  <div className="card-body">
                    <form>
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                        <h5>
                          <i className="ti ti-filter-check me-2" />
                          Filters
                        </h5>
                        <Link to="#">Reset Filter</Link>
                      </div>
                      <div className="mb-3 pb-3 border-bottom">
                        <label className="form-label">Search By Keyword</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="What are you looking for?"
                        />
                      </div>
                      <div className="accordion border-bottom mb-3">
                        <div className="accordion-item mb-3">
                          <div
                            className="accordion-header"
                            id="accordion-headingThree"
                          >
                            <div
                              className="accordion-button p-0 mb-3"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordion-collapseThree"
                              aria-expanded="true"
                              aria-controls="accordion-collapseThree"
                              role="button"
                            >
                              Categories
                            </div>
                          </div>
                          <div
                            id="accordion-collapseThree"
                            className="accordion-collapse collapse show"
                            aria-labelledby="accordion-headingThree"
                          >
                            <div
                              className="content-list mb-3"
                              id="fill-more"
                              style={filterCheckboxStyle}
                            >
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked
                                  />
                                  All Categories
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Construction
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Car Wash
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Electrical
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Cleaning
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Plumbing
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                  Designing
                                </label>
                              </div>
                            </div>
                            <Link
                              to="#"
                              id="more"
                              className="more-view text-dark-blue fs-14"
                              onClick={toggleHeight}
                            >
                              {isExpanded ? (
                                <>
                                  View Less{' '}
                                  <i className="ti ti-chevron-up ms-1" />
                                </>
                              ) : (
                                <>
                                  View More{' '}
                                  <i className="ti ti-chevron-down ms-1" />
                                </>
                              )}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="accordion border-bottom mb-3">
                        <div
                          className="accordion-header"
                          id="accordion-headingFour"
                        >
                          <div
                            className="accordion-button p-0 mb-3"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-collapseFour"
                            aria-expanded="true"
                            aria-controls="accordion-collapseFour"
                            role="button"
                          >
                            Sub Category
                          </div>
                        </div>
                        <div
                          id="accordion-collapseFour"
                          className="accordion-collapse collapse show"
                          aria-labelledby="accordion-headingFour"
                        >
                          <div className="mb-3">
                            <Dropdown
                              value={selectedValue1}
                              onChange={(e) => setSelectedValue1(e.value)}
                              options={value1}
                              optionLabel="name"
                              placeholder="All Sub Category"
                              className="w-100 select"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="accordion border-bottom mb-3">
                        <div
                          className="accordion-header"
                          id="accordion-headingFive"
                        >
                          <div
                            className="accordion-button p-0 mb-3"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-collapseFive"
                            aria-expanded="true"
                            aria-controls="accordion-collapseFive"
                            role="button"
                          >
                            Location
                          </div>
                        </div>
                        <div
                          id="accordion-collapseFive"
                          className="accordion-collapse collapse show"
                          aria-labelledby="accordion-headingFive"
                        >
                          <div className="mb-3">
                            <div className="position-relative">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Select Location"
                              />
                              <span className="icon-addon">
                                <i className="ti ti-map-pin" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion border-bottom mb-3">
                        <div
                          className="accordion-header"
                          id="accordion-headingSix"
                        >
                          <div
                            className="accordion-button p-0 mb-3"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-collapseSix"
                            aria-expanded="true"
                            aria-controls="accordion-collapseSix"
                            role="button"
                          >
                            Price Range
                          </div>
                        </div>
                        <div
                          id="accordion-collapseSix"
                          className="accordion-collapse collapse show"
                          aria-labelledby="accordion-headingSix"
                        >
                          <div className="filter-range">
                            <Slider
                              range
                              tooltip={{ formatter }}
                              step={10}
                              defaultValue={[20, 50]}
                              onChange={onChange}
                              onChangeComplete={onChangeComplete}
                            />
                          </div>
                          <div className="filter-range-amount mb-3">
                            <p className="fs-14">
                              Price: <span>$5 - $210</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link to={routes.search} className="btn btn-dark w-100">
                        Search
                      </Link>
                    </form>
                  </div>
                </div>
              </StickyBox>
            </div>
            {/* /Filter */}
            {/* Service */}
            <div className="col-lg-9 col-sm-12">
              <div className="row sorting-div">
                <div className="col-lg-4 col-sm-12 ">
                  <div className="count-search">
                    <h6>Found 11 Services On Search</h6>
                  </div>
                </div>
                <div className="col-lg-8 col-sm-12 d-flex justify-content-end ">
                  <div className="sortbyset">
                    <h4>Sort</h4>
                    <div className="sorting-select">
                      <Dropdown
                        value={selectedValue2}
                        onChange={(e) => setSelectedValue2(e.value)}
                        options={value2}
                        optionLabel="name"
                        placeholder="Price Low to High"
                        className="select"
                      />
                    </div>
                  </div>
                  <div className="grid-listview">
                    <ul>
                      <li>
                        <Link to={routes.serviceList}>
                          <Icon.Grid className="react-feather-custom" />
                        </Link>
                      </li>
                      <li>
                        <Link to={routes.serviceList} className="active">
                          <Icon.List className="react-feather-custom" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-04.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={1}
                          onClick={() => handleItemClick(1)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[1] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Car Wash</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            Car Repair Services
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          Maryland City, MD, USA
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="user"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $25.00<span className="old-price">$35.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-02.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={2}
                          onClick={() => handleItemClick(2)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[2] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Construction</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            Toughened Glass Fitting Services
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          New Jersey, USA
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-02.jpg"
                            alt="User"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $30.00<span className="old-price">$35.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-06.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={3}
                          onClick={() => handleItemClick(3)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[3] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Computer</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            Computer &amp; Server AMC Service
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          California, USA
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-05.jpg"
                            alt="User"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $30.00<span className="old-price">$35.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-07.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={4}
                          onClick={() => handleItemClick(4)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[4] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Interior</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            Interior Designing
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          Maryland, USA
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-06.jpg"
                            alt="User"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $15.00<span className="old-price">$25.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-09.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={5}
                          onClick={() => handleItemClick(5)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[5] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Cleaning</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            House Cleaning Services
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          Georgia
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-09.jpg"
                            alt="User"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $55.00<span className="old-price">$60.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                  {/* Service List */}
                  <div className="service-list">
                    <div className="service-cont">
                      <div className="service-cont-img">
                        <Link to={routes.serviceDetails1}>
                          <ImageWithBasePath
                            className="img-fluid serv-img"
                            alt="Service Image"
                            src="assets/img/services/service-10.jpg"
                          />
                        </Link>
                        <div
                          className="fav-item"
                          key={1}
                          onClick={() => handleItemClick(1)}
                        >
                          <Link
                            to="#"
                            className={`fav-icon ${
                              selectedItems[1] ? 'selected' : ''
                            }`}
                          >
                            <Icon.Heart size={15} />
                          </Link>
                        </div>
                      </div>
                      <div className="service-cont-info">
                        <Link to={routes.categories}>
                          <span className="item-cat">Construction</span>
                        </Link>
                        <h3 className="title">
                          <Link to={routes.serviceDetails1}>
                            Building Construction Services
                          </Link>
                        </h3>
                        <p>
                          <Icon.MapPin className="react-feather-custom" />
                          Montana, USA
                        </p>
                        <div className="service-pro-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-09.jpg"
                            alt="User"
                          />
                          <span>
                            <i className="fas fa-star filled" />
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="service-action">
                      <h6>
                        $45.00<span className="old-price">$50.00</span>
                      </h6>
                      <Link to={routes.booking1} className="btn btn-secondary">
                        Apply Offer
                      </Link>
                    </div>
                  </div>
                  {/* /Service List */}
                </div>
              </div>
              {/* Pagination */}
              <div className="row">
                <div className="col-sm-12">
                  <div className="blog-pagination rev-page">
                    <nav>
                      <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                          <Link
                            className="page-link page-prev"
                            to="#"
                            tabIndex={-1}
                          >
                            <i className="fa-solid fa-arrow-left me-1" /> PREV
                          </Link>
                        </li>
                        <li className="page-item active">
                          <Link className="page-link" to="#">
                            1
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="#">
                            2
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="#">
                            3
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link page-next" to="#">
                            NEXT <i className="fa-solid fa-arrow-right ms-1" />
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              {/* /Pagination */}
            </div>
            {/* /Service */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchList;
