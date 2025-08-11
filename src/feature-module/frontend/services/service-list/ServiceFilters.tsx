import React, { memo, useEffect, useState } from 'react';
import StickyBox from 'react-sticky-box';
import { Slider, SliderSingleProps } from 'antd';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Category, IService } from '../../../../GlobleType';
import { fetchCategories, fetchSubCategories } from '../../../../APICalls';

const ServiceFilters = memo(({ services, setServices }: IService[] | any) => {
  const loc = useLocation();
  const quers = new URLSearchParams(loc.search);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedItems, setSelectedItems] = useState(Array(13).fill(false));
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [filteredCat, setFilteredCat] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string[]>(
    JSON.parse(quers.get('categories') || '[]'),
  );
  const [selectedSubCat, setSubSelectedCat] = useState<string>(
    quers.get('sub') || '',
  );
  const [location, setLocation] = useState<string>(quers.get('location') || '');
  const [name, setName] = useState<string>(quers.get('name') || '');
  const navigate = useNavigate();

  const filterFromAllFields = () => {
    let newData = services;
    const updatedQuers = new URLSearchParams();
    if (selectedCat.length > 0) {
      updatedQuers.set('categories', JSON.stringify(selectedCat));
      const filter = newData?.filter((e: IService) =>
        selectedCat.includes(e?.categoryId?._id),
      );
      newData = filter;
    }
    if (name) {
      updatedQuers.set('name', name);
      const filter = newData?.filter((e: IService) => {
        const string = JSON.stringify(e);
        return string.toLowerCase().includes(name.toLowerCase());
      });
      newData = filter;
    }
    if (location) {
      updatedQuers.set('location', location);
      const filter = newData?.filter((e: IService) => {
        const string =
          e?.location?.address +
          e?.location?.city +
          e?.location.country +
          e?.location.locality +
          e?.location?.pincode +
          e?.location.state;
        return string?.toLowerCase().includes(location.toLowerCase());
      });
      newData = filter;
    }
    if (selectedSubCat) {
      updatedQuers.set('sub', selectedSubCat);
      const filter = newData?.filter(
        (e: IService) => e?.SubcategoryId?._id == selectedSubCat,
      );
      newData = filter;
    }
    setServices(newData);
    navigate(`?${updatedQuers.toString()}`);
  };
  useEffect(() => {
    filterFromAllFields();
  }, [location, name, selectedSubCat, selectedCat, services]);

  const filterCheckboxStyle = {
    height: isExpanded ? 'auto' : '150px',
  };

  const fetchData = async () => {
    try {
      const res = await fetchCategories();
      const subC = await fetchSubCategories();
      setCategories(res);
      setSubCategories(subC);
      setFilteredCat(subC);
      if (selectedSubCat) {
        const filtered = subC.filter((e: any) => e._id == selectedSubCat);
        if (filtered.length > 0) {
          setSelectedValue1(filtered[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
  const changeSubCategories = (updatedCat: any) => {
    const filtered = subCategories.filter((e) => {
      if (updatedCat.length > 0) return updatedCat.includes(e?.categoryId?._id);
    });
    setFilteredCat(filtered);
  };

  const resetHandler = () => {
    setSelectedCat([]);
    setName('');
    setLocation('');
    setSubSelectedCat('');
    // setServices(services);
  };
  return (
    <StickyBox>
      <div className="card ">
        <div className="card-body">
          <form>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
              <h5>
                <i className="ti ti-filter-check me-2" />
                Filters
              </h5>
              <Link to="#" onClick={() => resetHandler()}>
                Reset Filter
              </Link>
            </div>
            <div className="mb-3 pb-3 border-bottom">
              <label className="form-label">Search By Keyword</label>
              <input
                type="text"
                className="form-control"
                placeholder="What are you looking for?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="accordion border-bottom mb-3">
              <div className="accordion-item mb-3">
                <div className="accordion-header" id="accordion-headingThree">
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
                    {/* {categories?.map((e: Category, i) => (
                      <div className="form-check mb-2" key={i}>
                        <label className="form-check-label">
                          <input
                            checked={
                              e?._id && selectedCat.includes(e._id)
                                ? true
                                : false
                            }
                            className="form-check-input"
                            type="checkbox"
                            onChange={() => {
                              setSelectedCat((prevSelectedCat: any) => {
                                let updatedCat;
                                if (prevSelectedCat.includes(e?._id)) {
                                  // Remove the category if already selected
                                  updatedCat = prevSelectedCat.filter(
                                    (id: string) => id !== e?._id,
                                  );
                                } else {
                                  // Add the new category
                                  updatedCat = [...prevSelectedCat, e?._id];
                                }

                                changeSubCategories(updatedCat); // Pass the updated state to the function
                                return updatedCat; // Update the state
                              });
                            }}
                          />
                          {e?.categoryName}
                        </label>
                      </div>
                    ))} */}

                    {categories?.map((e: Category, i) => (
                      <div className="form-check mb-2" key={i}>
                        <label className="form-check-label">
                          <input
                            checked={
                              e?._id && selectedCat.includes(e._id)
                                ? true
                                : false
                            }
                            className="form-check-input"
                            type="checkbox"
                            onChange={() => {
                              setSelectedCat((prevSelectedCat: any) => {
                                let updatedCat;
                                if (prevSelectedCat.includes(e?._id)) {
                                  // Remove the category if already selected
                                  updatedCat = prevSelectedCat.filter(
                                    (id: string) => id !== e?._id,
                                  );
                                  // Reset the selected subcategory if the category is unselected
                                  setSubSelectedCat('');
                                } else {
                                  // Add the new category
                                  updatedCat = [...prevSelectedCat, e?._id];
                                }

                                changeSubCategories(updatedCat); // Pass the updated state to the function
                                filterFromAllFields(); // Refresh the filtered data
                                return updatedCat; // Update the state
                              });
                            }}
                          />
                          {e?.categoryName}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="#"
                    id="more"
                    className="more-view text-dark-blue fs-14"
                    onClick={toggleHeight}
                  >
                    {isExpanded ? (
                      <>
                        View Less <i className="ti ti-chevron-up ms-1" />
                      </>
                    ) : (
                      <>
                        View More <i className="ti ti-chevron-down ms-1" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="accordion border-bottom mb-3">
              <div className="accordion-header" id="accordion-headingFour">
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
                    // editable
                    value={selectedValue1}
                    onChange={(e) => {
                      setSelectedValue1(e.value);
                      if (selectedSubCat == e?.value?._id)
                        setSubSelectedCat('');
                      else setSubSelectedCat(e?.value?._id);
                    }}
                    options={filteredCat}
                    optionLabel="SubcategoryName"
                    placeholder="All Sub Category"
                    className="w-100 select"
                  />
                </div>
              </div>
            </div>
            <div className="accordion border-bottom mb-3">
              <div className="accordion-header" id="accordion-headingFive">
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <span className="icon-addon">
                      <i className="ti ti-map-pin" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="accordion border-bottom mb-3">
              <div className="accordion-header" id="accordion-headingSix">
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
                    Price: <span>₹ 5 - ₹ 210</span>
                  </p>
                </div>
              </div>
            </div> */}
            <Link to={'#'} className="btn btn-dark w-100">
              Search
            </Link>
          </form>
        </div>
      </div>
    </StickyBox>
  );
});
ServiceFilters.displayName = 'ServiceFilters';
export default ServiceFilters;

{
  /* <div className="accordion">
<div className="accordion-item mb-3">
<div
className="accordion-header"
id="accordion-headingTwo"
>
<div
className="accordion-button fs-18 p-0 mb-3"
data-bs-toggle="collapse"
data-bs-target="#accordion-collapseTwo"
aria-expanded="true"
aria-controls="accordion-collapseTwo"
role="button"
>
Ratings
</div>
</div>
<div
id="accordion-collapseTwo"
className="accordion-collapse collapse show"
aria-labelledby="accordion-headingTwo"
>
<div className="mb-3">
<div className="form-check mb-2">
<label className="form-check-label d-block">
<input
  className="form-check-input"
  type="checkbox"
  defaultChecked
/>
<span className="rating">
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <span className="float-end">(55)</span>
</span>
</label>
</div>
<div className="form-check mb-2">
<label className="form-check-label d-block">
<input
  className="form-check-input"
  type="checkbox"
/>
<span className="rating">
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <span className="float-end">(48)</span>
</span>
</label>
</div>
<div className="form-check mb-2">
<label className="form-check-label d-block">
<input
  className="form-check-input"
  type="checkbox"
/>
<span className="rating">
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <span className="float-end">(13)</span>
</span>
</label>
</div>
<div className="form-check mb-2">
<label className="form-check-label d-block">
<input
  className="form-check-input"
  type="checkbox"
/>
<span className="rating">
  <i className="fas fa-star filled" />
  <i className="fas fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <span className="float-end">(05)</span>
</span>
</label>
</div>
<div className="form-check mb-2">
<label className="form-check-label d-block">
<input
  className="form-check-input"
  type="checkbox"
/>
<span className="rating">
  <i className="fas fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <i className="fa-regular fa-star filled" />
  <span className="float-end">(00)</span>
</span>
</label>
</div>
</div>
</div>
</div>
</div> */
}
