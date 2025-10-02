import React, { memo, useEffect, useState, useCallback } from 'react';
import StickyBox from 'react-sticky-box';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Category, IService } from '../../../../GlobleType';
import { fetchCategories } from '../../../../APICalls';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiMapPin, FiSearch } from 'react-icons/fi';

interface ServiceFiltersProps {
  services?: IService[];
  setServices: (services: IService[]) => void;
}

// Add prop-types to satisfy ESLint
import PropTypes from 'prop-types';

// Define prop types for runtime validation
const propTypes = {
  services: PropTypes.array,
  setServices: PropTypes.func.isRequired,
} as const;

interface CategoryWithId extends Omit<Category, '_id'> {
  _id: string;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = memo(({ services = [], setServices }) => {
  const loc = useLocation();
  const quers = new URLSearchParams(loc.search);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedItems, setSelectedItems] = useState(Array(13).fill(false));
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [selectedCat, setSelectedCat] = useState<string[]>(
    JSON.parse(quers.get('categories') || '[]') as string[]
  );
  const [location, setLocation] = useState<string>(quers.get('location') || '');
  const [name, setName] = useState<string>(quers.get('name') || '');
  // Show all categories by default
  const [visibleCategories, setVisibleCategories] = useState(Number.MAX_SAFE_INTEGER);
  const navigate = useNavigate();

  // Function to count services for a specific category
  const getServiceCountForCategory = useCallback((categoryId: string): number => {
    if (!services || services.length === 0) return 0;

    return services.filter((service: IService) => {
      // Handle both old and new service structures
      const oldCategoryId = service?.categoryId?._id;
      const oldSubcategoryId = (service as any)?.SubcategoryId;
      const newCategories = (service as any)?.categories || [];

      return categoryId === oldCategoryId ||
        categoryId === oldSubcategoryId ||
        newCategories.includes(categoryId);
    }).length;
  }, [services]);

  const filterFromAllFields = useCallback((): void => {
    if (!services || services.length === 0) return;
    let newData = [...services];
    const updatedQuers = new URLSearchParams();
    if (selectedCat.length > 0) {
      updatedQuers.set('categories', JSON.stringify(selectedCat));
      const filter = newData?.filter((e: IService) => {
        // Handle both old and new service structures
        // Old structure: categoryId._id or SubcategoryId
        // New structure: categories array
        const oldCategoryId = e?.categoryId?._id;
        const oldSubcategoryId = (e as any)?.SubcategoryId;
        const newCategories = (e as any)?.categories || [];

        // Check if any selected category matches the service's categories
        return selectedCat.some(selectedCategoryId =>
          selectedCategoryId === oldCategoryId ||
          selectedCategoryId === oldSubcategoryId ||
          newCategories.includes(selectedCategoryId)
        );
      });
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
    setServices(newData);
    navigate(`?${updatedQuers.toString()}`);
  }, [services, selectedCat, name, location, navigate]);
  useEffect(() => {
    filterFromAllFields();
  }, [filterFromAllFields]);

  // Handle initial services filter
  useEffect(() => {
    if (services?.length > 0) {
      filterFromAllFields();
    }
  }, [services, filterFromAllFields]);


  const fetchData = async () => {
    try {
      const res = await fetchCategories();
      // Ensure we only keep categories with valid _id
      const validCategories = res.filter((cat: Category): cat is CategoryWithId => Boolean(cat._id));
      setCategories(validCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const toggleHeight = useCallback((): void => {
    setIsExpanded(prev => !prev);
    setVisibleCategories(prev => prev === 10 ? (categories?.length || 0) : 10);
  }, [categories?.length]);

  const resetHandler = useCallback((): void => {
    setSelectedCat([]);
    setLocation('');
    setName('');
    setVisibleCategories(10);
    navigate(loc.pathname);
  }, [navigate, loc.pathname]);
  return (
    <StickyBox offsetTop={20} offsetBottom={20}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="m-0 d-flex align-items-center">
                <FiFilter className="me-2" style={{ fontSize: '1.25rem' }} />
                <span>Filters</span>
                {(selectedCat.length > 0 || location || name) && (
                  <span className="badge bg-primary ms-2">
                    {selectedCat.length + (location ? 1 : 0) + (name ? 1 : 0)}
                  </span>
                )}
              </h5>
              <button
                type="button"
                onClick={resetHandler}
                className="btn btn-sm btn-outline-secondary"
                disabled={!selectedCat.length && !location && !name}
              >
                <FiX className="me-1" /> Clear All
              </button>
            </div>
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search services..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {name && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setName('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            <div className="mb-4">
              <div
                className="d-flex justify-content-between align-items-center mb-2"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
              >
                <h6 className="mb-0 fw-semibold">Categories</h6>
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </div>

              <div
                className="category-filters"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid #e9ecef',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                }}
              >
                {categories?.slice(0, visibleCategories).map((category: CategoryWithId, index: number) => (
                  <div
                    key={category._id}
                    className="d-flex align-items-center mb-2 p-2 rounded"
                    style={{
                      backgroundColor: selectedCat.includes(category._id) ? '#f0f7ff' : 'transparent',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedCat.includes(category._id)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    onClick={() => {
                      setSelectedCat(prev =>
                        prev.includes(category._id)
                          ? [...prev.filter(id => id !== category._id)]
                          : [...prev, category._id]
                      );
                    }}
                  >
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${selectedCat.includes(category._id) ? '#0d6efd' : '#adb5bd'}`,
                        borderRadius: '3px',
                        backgroundColor: selectedCat.includes(category._id) ? '#0d6efd' : 'transparent',
                        position: 'relative',
                        flexShrink: 0
                      } as React.CSSProperties}
                    >
                      {selectedCat.includes(category._id) && (
                        <div
                          style={{
                            position: 'absolute',
                            color: 'white',
                            fontSize: '12px',
                            lineHeight: 1,
                            marginTop: '-1px'
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-muted">{category.categoryName}</span>
                    <span className="ms-auto badge bg-secondary">
                      {getServiceCountForCategory(category._id)}
                    </span>
                  </div>
                ))}

                {categories?.length === 0 && (
                  <div className="text-muted small p-2">No categories available</div>
                )}

                {categories && categories.length > 10 && (
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={toggleHeight}
                    >
                      <small className="text-primary">
                        {isExpanded ? 'Show less' : `Show ${categories.length - 10} more`}
                      </small>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <h6 className="fw-semibold mb-2">Location</h6>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiMapPin className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {location && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setLocation('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={filterFromAllFields}
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>
    </StickyBox>
  );
});
ServiceFilters.displayName = 'ServiceFilters';
ServiceFilters.propTypes = propTypes;

export default ServiceFilters;
