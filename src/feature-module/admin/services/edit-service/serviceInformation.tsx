import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchStaff, fetchServiceById, updateService } from '../../../../APICalls';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { axiosInstance, bearerHeader } from '../../../../core/api/axiosCore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useNavigate, Link } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';

// Define interfaces
interface Category {
  _id: string;
  categoryName: string;
  categorySlug: string;
  isFeatured: boolean;
  image?: string;
  createdAt: string;
  __v: number;
}

interface AdditionalService {
  service: string;
  desc: string;
  price: number;
  duration: string;
  _id?: string;
}

interface FAQ {
  question: string;
  answer: string;
  _id?: string;
}

interface LocationData {
  city: string;
  state: string;
  locality: string;
  pincode: string;
  address: string;
}

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

interface ExtendedFile extends File {
  id?: string;
  url?: string;
  isExisting?: boolean;
}

interface EditServiceFormProps {
  serviceData?: any;
}

// Initialize animated components
const animatedComponents = makeAnimated();

// Custom styles for react-select
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '42px',
    borderColor: state.isFocused ? '#2684ff' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2684ff' : '#adb5bd',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#212529',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#6c757d',
    ':hover': {
      backgroundColor: '#dc3545',
      color: 'white',
    },
  }),
};

const EditServiceForm: React.FC<EditServiceFormProps> = ({ serviceData: propServiceData }) => {
  const location = useLocation();
  const serviceData = propServiceData || location.state || {};
  const providerId = serviceData.providerId?._id || serviceData.providerId || '';
  const [loading, setLoading] = useState(false);
  const [createdService, setCreatedService] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const routes = all_routes;
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<Array<{ _id: string; name: string }>>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [mainImage, setMainImage] = useState<ExtendedFile | null>(null);
  const [galleryImages, setGalleryImages] = useState<Array<ExtendedFile>>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { service: '', desc: '', price: 0, duration: '' }
  ]);
  const [includes, setIncludes] = useState<string[]>(['']);
  const [faq, setFaq] = useState<FAQ[]>([
    { question: '', answer: '' }
  ]);

  // Get user role on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user?.role || '');
  }, []);

  // Function to load categories with retry
  const loadCategories = async (retryCount = 0) => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const categoriesData = await fetchCategories();
      console.log('Categories data:', categoriesData);

      if (Array.isArray(categoriesData)) {
        // Transform the data for react-select
        const transformedCategories = categoriesData.map(cat => ({
          value: cat._id,
          label: cat.categoryName || cat.name,
          _id: cat._id,
          ...cat
        }));
        setCategories(transformedCategories);
      } else {
        throw new Error('Invalid categories data format');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      if (retryCount < 2) {
        // Retry up to 2 times with a delay
        setTimeout(() => loadCategories(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setCategoriesError(`Failed to load categories: ${errorMessage}`);
        toast.error('Failed to load categories. Please refresh the page to retry.');
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load staff
  const loadStaff = async () => {
    try {
      setStaffLoading(true);
      setStaffError(null);

      const staffData = await fetchStaff(providerId);
      console.log('Staff API response:', staffData);

      // Handle the API response - check for both old and new response formats
      if (Array.isArray(staffData)) {
        // Old format: direct array
        setStaff(staffData);
      } else if (staffData && staffData.success && Array.isArray(staffData.data)) {
        // New format: {success: true, data: [...], message: "..."}
        setStaff(staffData.data);
        console.log('Staff API message:', staffData.message);
      } else if (staffData && staffData.message) {
        // Error format: {success: false, message: "error message"}
        console.warn('Staff API message:', staffData.message);
        setStaff([]);
        setStaffError(staffData.message);
        toast.warning(staffData.message);
      } else {
        console.error('Unexpected staff data format:', staffData);
        setStaff([]);
        setStaffError('Failed to load staff members');
        toast.error('Failed to load staff members. Some options may be unavailable.');
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      setStaff([]);
      setStaffError('Failed to load staff members');
      toast.error('Failed to load staff members. Some options may be unavailable.');
    } finally {
      setStaffLoading(false);
    }
  };

  // Load service data and populate form
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories and staff in parallel
        await Promise.all([
          loadCategories(),
          providerId ? loadStaff() : Promise.resolve()
        ]);

        // Fetch complete service data by ID
        if (serviceData._id) {
          const fullServiceData = await fetchServiceById(serviceData._id);
          if (fullServiceData) {
            // Populate form with service data
            formik.setValues({
              serviceTitle: fullServiceData.serviceTitle || '',
              slug: fullServiceData.slug || '',
              categories: fullServiceData.categories?.map((c: any) => c._id) || [],
              staff: fullServiceData.staff?.map((s: any) => s._id) || [],
              price: fullServiceData.price?.toString() || '',
              duration: fullServiceData.duration || '',
              description: fullServiceData.description || '',
              videoLink: fullServiceData.videoLink || '',
              location: {
                city: fullServiceData.location?.city || '',
                state: fullServiceData.location?.state || '',
                locality: fullServiceData.location?.locality || '',
                pincode: fullServiceData.location?.pincode || '',
                address: fullServiceData.location?.address || '',
              },
              seo: {
                metaTitle: fullServiceData.seo?.metaTitle || '',
                metaDescription: fullServiceData.seo?.metaDescription || '',
                metaKeywords: fullServiceData.seo?.metaKeywords || [],
              },
            });

            // Set additional services
            if (fullServiceData.additionalServices && fullServiceData.additionalServices.length > 0) {
              setAdditionalServices(fullServiceData.additionalServices);
            }

            // Set includes
            if (fullServiceData.includes && fullServiceData.includes.length > 0) {
              setIncludes(fullServiceData.includes);
            }

            // Set FAQ
            if (fullServiceData.faq && fullServiceData.faq.length > 0) {
              setFaq(fullServiceData.faq);
            }

            // Handle existing images
            if (fullServiceData.image) {
              // Create a mock file object for existing main image
              const existingMainImage = {
                name: 'existing-main-image.jpg',
                url: fullServiceData.image,
                size: 0,
                type: 'image/jpeg',
                isExisting: true
              };
              setMainImage(existingMainImage as ExtendedFile);
            }

            // Handle existing gallery images
            if (fullServiceData.gallery && fullServiceData.gallery.length > 0) {
              const existingGalleryImages = fullServiceData.gallery.map((url: string, index: number) => ({
                id: `existing-${index}`,
                name: `existing-gallery-${index}.jpg`,
                url: url,
                size: 0,
                type: 'image/jpeg',
                isExisting: true
              }));
              setGalleryImages(existingGalleryImages as ExtendedFile[]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceData._id, providerId]);

  // Generate slug from service title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    serviceTitle: Yup.string().required('Service title is required'),
    slug: Yup.string()
      .required('Slug is required')
      .matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens'
      ),
    categories: Yup.array()
      .min(1, 'At least one category is required')
      .of(Yup.string().required('Category ID is required')),
    staff: Yup.array().min(1, 'At least one staff member is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be positive')
      .typeError('Price must be a number'),
    duration: Yup.string().required('Duration is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.object().shape({
      city: Yup.string(),
      state: Yup.string(),
      locality: Yup.string(),
      pincode: Yup.string(),
      address: Yup.string(),
    }),
    seo: Yup.object().shape({
      metaTitle: Yup.string().required('Meta title is required'),
      metaDescription: Yup.string().required('Meta description is required'),
      metaKeywords: Yup.array().min(1, 'At least one keyword is required'),
    }),
  });

  // Form submission handler - UPDATE service instead of CREATE
  const handleSubmit = async (values: any) => {
    setFormSubmitted(true);

    // Validate required fields manually
    const errors: any = {};

    if (!values.serviceTitle?.trim()) {
      errors.serviceTitle = 'Service Title is required';
    }
    if (!values.slug?.trim()) {
      errors.slug = 'Slug is required';
    }
    if (!values.categories || values.categories.length === 0) {
      errors.categories = 'At least one category is required';
    }
    if (!values.staff || values.staff.length === 0) {
      errors.staff = 'At least one staff member is required';
    }
    if (!values.price || values.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (!values.duration?.trim()) {
      errors.duration = 'Duration is required';
    }
    if (!values.description?.trim()) {
      errors.description = 'Description is required';
    }

    // If there are validation errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const slug = generateSlug(values.serviceTitle);

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Required fields
      formData.append('serviceTitle', values.serviceTitle);
      formData.append('slug', slug);
      formData.append('price', values.price.toString());
      formData.append('duration', values.duration);
      formData.append('description', values.description);

      // Categories - send as individual entries
      values.categories.forEach((categoryId: string) => {
        formData.append('categories', categoryId);
      });

      // Staff - send as individual entries
      values.staff.forEach((staffId: string) => {
        formData.append('staff', staffId);
      });

      // Location - send as individual fields (backend expects separate fields)
      if (values.location.city) formData.append('city', values.location.city);
      if (values.location.state) formData.append('state', values.location.state);
      if (values.location.locality) formData.append('locality', values.location.locality);
      if (values.location.pincode) formData.append('pincode', values.location.pincode);
      if (values.location.address) formData.append('address', values.location.address);
      // Add default country
      formData.append('country', 'India');

      // SEO - send as individual fields (backend expects separate fields)
      if (values.seo.metaTitle) formData.append('metaTitle', values.seo.metaTitle);
      if (values.seo.metaDescription) formData.append('metaDescription', values.seo.metaDescription);
      // Send each keyword individually
      if (values.seo.metaKeywords && values.seo.metaKeywords.length > 0) {
        values.seo.metaKeywords.forEach((keyword: string) => {
          if (keyword.trim()) {
            formData.append('metaKeywords', keyword);
          }
        });
      }

      // Additional Services - send as individual entries for each service
      const validAdditionalServices = additionalServices.filter(service => service.service && service.service.trim());
      validAdditionalServices.forEach((service, index) => {
        formData.append(`additionalServices[${index}][service]`, service.service);
        formData.append(`additionalServices[${index}][desc]`, service.desc || '');
        formData.append(`additionalServices[${index}][price]`, service.price.toString());
        formData.append(`additionalServices[${index}][duration]`, service.duration);
        if (service._id) formData.append(`additionalServices[${index}][_id]`, service._id);
      });

      // Includes - send as individual entries
      const validIncludes = includes.filter(item => item && item.trim());
      validIncludes.forEach((include) => {
        formData.append('includes', include);
      });

      // FAQ - send as individual entries for each FAQ
      const validFaq = faq.filter(item => item.question && item.question.trim());
      validFaq.forEach((item, index) => {
        formData.append(`faq[${index}][question]`, item.question);
        formData.append(`faq[${index}][answer]`, item.answer);
        if (item._id) formData.append(`faq[${index}][_id]`, item._id);
      });

      if (values.videoLink) {
        formData.append('videoLink', values.videoLink);
      }

      // File uploads - handle both new and existing images
      let hasNewMainImage = false;
      let hasNewGalleryImages = false;

      if (mainImage) {
        if (mainImage instanceof File && !(mainImage as ExtendedFile).isExisting) {
          // Upload new main image
          formData.append('image', mainImage);
          hasNewMainImage = true;
        }
      }

      // Gallery images - handle both new and existing images
      if (galleryImages.length > 0) {
        galleryImages.forEach((fileWithId) => {
          if (fileWithId instanceof File && !(fileWithId as ExtendedFile).isExisting) {
            // Upload new gallery images
            formData.append('gallery', fileWithId);
            hasNewGalleryImages = true;
          }
        });
      }

      // If no new images are being uploaded, explicitly tell backend to preserve existing images
      if (!hasNewMainImage && !hasNewGalleryImages) {
        // Add a flag to indicate we want to preserve existing images
        formData.append('preserveImages', 'true');
      }


      // UPDATE service using PUT request
      const response = await axiosInstance.put(`/service/${serviceData._id}`, formData, {
        timeout: 30000,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Service updated successfully!');
        // Redirect to all services page after successful update
        setTimeout(() => {
          window.location.href = '/admin/services/all-services';
        }, 1500);
        return;
      }

      const errorMessage = response.data?.message || 'Failed to update service';
      throw new Error(errorMessage);
    } catch (error: any) {
      console.error('Error updating service:', error);

      let errorMessage = 'Failed to update service';

      if (error.response?.data) {
        if (Array.isArray(error.response.data.details)) {
          errorMessage = error.response.data.details.join('\n');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Error setting up the request';
      }

      toast.error(`Failed to update service: ${errorMessage}`);
      setFormSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  // Track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Helper function to check if a field should show error
  type FormValues = {
    serviceTitle: string;
    slug: string;
    categories: string[];
    staff: string[];
    price: string;
    duration: string;
    description: string;
    videoLink: string;
    location: {
      city: string;
      state: string;
      locality: string;
      pincode: string;
      address: string;
    };
    seo: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string[];
    };
  };

  const shouldShowError = (field: keyof FormValues): boolean => {
    return formSubmitted && !!formik.errors[field];
  };

  // Helper function to check if a nested field should show error
  const shouldShowErrorNested = (parent: keyof FormValues, field: string): boolean => {
    if (!formSubmitted) return false;

    const parentErrors = formik.errors[parent];
    if (!parentErrors || typeof parentErrors !== 'object') return false;

    return !!((parentErrors as Record<string, unknown>)[field]);
  };

  // Only validate on submit or after form has been submitted
  const validateOnSubmit = (values: any) => {
    if (!formSubmitted) return {};

    const errors: any = {};

    try {
      validationSchema.validateSync(values, { abortEarly: false });
    } catch (validationErrors: any) {
      validationErrors.inner.forEach((error: any) => {
        if (error.path) {
          // Handle nested fields (e.g., location.city)
          const path = error.path.split('.');
          if (path.length > 1) {
            if (!errors[path[0]]) errors[path[0]] = {};
            errors[path[0]][path[1]] = error.message;
          } else {
            errors[error.path] = error.message;
          }
        }
      });
    }

    return errors;
  };

  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      serviceTitle: '',
      slug: '',
      categories: [] as string[],
      staff: [] as string[],
      price: '',
      duration: '',
      description: '',
      videoLink: '',
      location: {
        city: '',
        state: '',
        locality: '',
        pincode: '',
        address: '',
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [] as string[],
      },
    },
    validateOnMount: false,
    validateOnChange: formSubmitted,
    validateOnBlur: formSubmitted,
    validate: validateOnSubmit,
    validationSchema: formSubmitted ? validationSchema : Yup.object(),
    onSubmit: handleSubmit,
  });

  // Reset form submission state when user starts making changes
  const handleFieldChange = (field: string, value: any) => {
    if (formSubmitted) {
      setFormSubmitted(false);
    }

    // Clear the specific field error when user starts typing
    if (formik.errors[field as keyof typeof formik.errors]) {
      const newErrors = { ...formik.errors };
      delete (newErrors as any)[field];
      formik.setErrors(newErrors);
    }

    formik.setFieldValue(field, value);
  };

  // Update meta title when service title changes
  useEffect(() => {
    if (formik.values.serviceTitle) {
      formik.setFieldValue('seo.metaTitle', `${formik.values.serviceTitle} Service`);

      // Only update slug if it's empty or matches the previous title
      if (!formik.values.slug || formik.values.slug === generateSlug(formik.initialValues.serviceTitle)) {
        formik.setFieldValue('slug', generateSlug(formik.values.serviceTitle));
      }
    }
  }, [formik.values.serviceTitle]);

  // Handle keyword input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newKeyword = e.currentTarget.value.trim();
      if (!formik.values.seo.metaKeywords.includes(newKeyword)) {
        formik.setFieldValue('seo.metaKeywords', [
          ...formik.values.seo.metaKeywords,
          newKeyword,
        ]);
      }
      e.currentTarget.value = '';
    }
  };

  // Remove keyword
  const removeKeyword = (keyword: string) => {
    formik.setFieldValue(
      'seo.metaKeywords',
      formik.values.seo.metaKeywords.filter((k: string) => k !== keyword)
    );
  };

  // Handle additional services
  const addAdditionalService = () => {
    setAdditionalServices([...additionalServices, { service: '', desc: '', price: 0, duration: '' }]);
  };

  const removeAdditionalService = (index: number) => {
    if (additionalServices.length > 1) {
      setAdditionalServices(additionalServices.filter((_, i) => i !== index));
    }
  };

  const updateAdditionalService = (index: number, field: keyof AdditionalService, value: string | number) => {
    const updated = [...additionalServices];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalServices(updated);
  };

  // Handle includes
  const addInclude = () => {
    setIncludes([...includes, '']);
  };

  const removeInclude = (index: number) => {
    if (includes.length > 1) {
      setIncludes(includes.filter((_, i) => i !== index));
    }
  };

  const updateInclude = (index: number, value: string) => {
    const updated = [...includes];
    updated[index] = value;
    setIncludes(updated);
  };

  // Handle FAQ
  const addFAQ = () => {
    setFaq([...faq, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    if (faq.length > 1) {
      setFaq(faq.filter((_, i) => i !== index));
    }
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faq];
    updated[index] = { ...updated[index], [field]: value };
    setFaq(updated);
  };

  // File validation function
  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (file.size > maxSize) {
      toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(`File ${file.name} is not a valid image type. Allowed: JPEG, PNG, JPG, WebP`);
      return false;
    }

    return true;
  };

  // Handle file uploads
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before setting
      if (!validateFile(file)) {
        return;
      }

      console.log('Main image selected:', file.name, file.size, file.type);
      const fileWithId = Object.assign(file, { isExisting: false }) as ExtendedFile;
      setMainImage(fileWithId);
    }
  };

  const processGalleryFiles = (files: File[]) => {
    // Check total count including existing images
    if (galleryImages.length + files.length > 10) {
      toast.error(`Maximum 10 gallery images allowed. You already have ${galleryImages.length} images.`);
      return;
    }

    const validFiles = files.filter(file => validateFile(file));

    if (validFiles.length !== files.length) {
      toast.warning(`${files.length - validFiles.length} file(s) were skipped due to validation errors`);
    }

    if (validFiles.length === 0) return;

    // Add unique IDs and create object URLs for new files
    const newFilesWithIds = validFiles.map((file, index) => {
      const fileWithId = Object.assign(file, {
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        isExisting: false
      });
      return fileWithId as ExtendedFile;
    });

    // Append new files to existing ones instead of replacing
    setGalleryImages(prev => [...prev, ...newFilesWithIds]);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processGalleryFiles(files);
    // Clear the input so the same files can be selected again
    e.target.value = '';
  };

  const handleGalleryDrop = (files: File[]) => {
    processGalleryFiles(files);
  };

  const removeGalleryImage = (index: number) => {
    const fileToRemove = galleryImages[index];
    if (fileToRemove && fileToRemove.url) {
      // Clean up object URL to prevent memory leaks
      URL.revokeObjectURL(fileToRemove.url);
    }

    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      galleryImages.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [galleryImages]);

  // Show loading state initially
  if (loading && !formik.values.serviceTitle) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't show success state - just proceed to next tab after update

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Edit Service</h4>
              {serviceData.serviceTitle && (
                <div className="alert alert-info">
                  <i className="ti ti-info-circle me-2"></i>
                  Editing: {serviceData.serviceTitle}
                </div>
              )}
              <form className="mt-4" onSubmit={formik.handleSubmit}>
                {/* Service Basic Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Service Title *</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.serviceTitle && formik.errors.serviceTitle
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="serviceTitle"
                        value={formik.values.serviceTitle}
                        onChange={(e) => {
                          handleFieldChange('serviceTitle', e.target.value);
                          // Update slug when title changes
                          if (e.target.value) {
                            formik.setFieldValue('slug', generateSlug(e.target.value));
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.serviceTitle && formik.errors.serviceTitle && (
                        <div className="invalid-feedback">
                          {formik.errors.serviceTitle as string}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Slug *</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${formik.touched.slug && formik.errors.slug
                            ? 'is-invalid'
                            : ''
                            }`}
                          name="slug"
                          value={formik.values.slug}
                          onChange={(e) => handleFieldChange('slug', e.target.value)}
                          onBlur={formik.handleBlur}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            if (formik.values.serviceTitle) {
                              formik.setFieldValue('slug', generateSlug(formik.values.serviceTitle));
                            }
                          }}
                          title="Generate from title"
                        >
                          <i className="ti ti-refresh"></i>
                        </button>
                      </div>
                      {formik.touched.slug && formik.errors.slug && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.slug as string}
                        </div>
                      )}
                      <small className="text-muted">
                        URL-friendly version of the title (auto-generated)
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category *</label>
                      {categoriesLoading ? (
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading categories...</span>
                        </div>
                      ) : categoriesError ? (
                        <div className="alert alert-danger p-2 mb-0">
                          <div className="d-flex align-items-center">
                            <i className="ti ti-alert-circle me-2"></i>
                            <div>
                              <div className="small">Failed to load categories</div>
                              <button
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={() => loadCategories()}
                              >
                                <i className="ti ti-reload me-1"></i> Retry
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`${shouldShowError('categories') ? 'is-invalid' : ''}`}>
                            <Select
                              isMulti
                              name="categories"
                              options={categories}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={categories.filter(option =>
                                (formik.values.categories || []).includes(option._id)
                              )}
                              onChange={(selectedOptions) => {
                                const selectedValues = Array.isArray(selectedOptions)
                                  ? selectedOptions.map(option => option._id)
                                  : [];
                                formik.setFieldValue('categories', selectedValues);
                              }}
                              onBlur={formik.handleBlur('categories')}
                              isDisabled={categories.length === 0 || categoriesLoading}
                              isLoading={categoriesLoading}
                              loadingMessage={() => 'Loading categories...'}
                              noOptionsMessage={() => 'No categories found'}
                              placeholder="Select categories..."
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              styles={customStyles}
                              isSearchable={true}
                              isClearable={true}
                            />
                            {shouldShowError('categories') && (
                              <div className="invalid-feedback d-block">
                                {formik.errors.categories as string}
                              </div>
                            )}
                            <div className="form-text">
                              Start typing to search or click to select multiple categories
                            </div>
                          </div>
                          {categories.length === 0 && !categoriesLoading && (
                            <div className="alert alert-warning p-2 mt-2 mb-0">
                              <i className="ti ti-alert-triangle me-1"></i>
                              No categories available. Please add categories first.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Staff *</label>
                      {staffLoading ? (
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading staff...</span>
                        </div>
                      ) : staffError ? (
                        <div className="alert alert-warning p-2 mb-0">
                          <div className="d-flex align-items-center">
                            <i className="ti ti-alert-triangle me-2"></i>
                            <div>
                              <div className="small">{staffError}</div>
                              <button
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={() => loadStaff()}
                              >
                                <i className="ti ti-reload me-1"></i> Retry
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <select
                            className={`form-control ${formik.touched.staff && formik.errors.staff ? 'is-invalid' : ''
                              }`}
                            name="staff"
                            multiple
                            value={formik.values.staff}
                            onChange={(e) => {
                              const options = e.target.options;
                              const value: string[] = [];
                              for (let i = 0, l = options.length; i < l; i++) {
                                if (options[i].selected) {
                                  value.push(options[i].value);
                                }
                              }
                              formik.setFieldValue('staff', value);
                            }}
                            onBlur={formik.handleBlur}
                            disabled={staff.length === 0}
                          >
                            {staff.length === 0 ? (
                              <option disabled>No staff members available</option>
                            ) : (
                              staff.map((staffMember) => (
                                <option key={staffMember._id} value={staffMember._id}>
                                  {staffMember.name}
                                </option>
                              ))
                            )}
                          </select>
                          {formik.touched.staff && formik.errors.staff && (
                            <div className="invalid-feedback">
                              {formik.errors.staff as string}
                            </div>
                          )}
                          <small className="form-text text-muted">
                            {staff.length === 0
                              ? 'No staff members found for this provider'
                              : 'Hold Ctrl/Cmd to select multiple staff members'
                            }
                          </small>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''
                          }`}
                        name="price"
                        value={formik.values.price}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        onBlur={formik.handleBlur}
                        min="0"
                        step="0.01"
                      />
                      {formik.touched.price && formik.errors.price && (
                        <div className="invalid-feedback">
                          {formik.errors.price as string}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Duration *</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.duration && formik.errors.duration
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="duration"
                        value={formik.values.duration}
                        onChange={(e) => handleFieldChange('duration', e.target.value)}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., 30 mins"
                      />
                      {formik.touched.duration && formik.errors.duration && (
                        <div className="invalid-feedback">
                          {formik.errors.duration as string}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group mb-4">
                  <label>Description *</label>
                  <textarea
                    className={`form-control ${formik.touched.description && formik.errors.description
                      ? 'is-invalid'
                      : ''
                      }`}
                    name="description"
                    rows={4}
                    value={formik.values.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">
                      {formik.errors.description as string}
                    </div>
                  )}
                </div>

                {/* Video Link */}
                <div className="form-group mb-4">
                  <label>Video Link (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="videoLink"
                    value={formik.values.videoLink}
                    onChange={(e) => handleFieldChange('videoLink', e.target.value)}
                    onBlur={formik.handleBlur}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <small className="form-text text-muted">
                    Optional video link for service demonstration
                  </small>
                </div>

                {/* Location Information */}
                <h5 className="mb-3">Location Information <span className="text-muted">(Optional)</span></h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.location?.address &&
                          formik.errors.location?.address
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="location.address"
                        value={formik.values.location.address}
                        onChange={(e) => handleFieldChange('location.address', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location?.address &&
                        formik.errors.location?.address && (
                          <div className="invalid-feedback">
                            {formik.errors.location.address as string}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Locality</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.location?.locality &&
                          formik.errors.location?.locality
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="location.locality"
                        value={formik.values.location.locality}
                        onChange={(e) => handleFieldChange('location.locality', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location?.locality &&
                        formik.errors.location?.locality && (
                          <div className="invalid-feedback">
                            {formik.errors.location.locality as string}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.location?.city && formik.errors.location?.city
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="location.city"
                        value={formik.values.location.city}
                        onChange={(e) => handleFieldChange('location.city', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location?.city &&
                        formik.errors.location?.city && (
                          <div className="invalid-feedback">
                            {formik.errors.location.city as string}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.location?.state &&
                          formik.errors.location?.state
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="location.state"
                        value={formik.values.location.state}
                        onChange={(e) => handleFieldChange('location.state', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location?.state &&
                        formik.errors.location?.state && (
                          <div className="invalid-feedback">
                            {formik.errors.location.state as string}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.location?.pincode &&
                          formik.errors.location?.pincode
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="location.pincode"
                        value={formik.values.location.pincode}
                        onChange={(e) => handleFieldChange('location.pincode', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.location?.pincode &&
                        formik.errors.location?.pincode && (
                          <div className="invalid-feedback">
                            {formik.errors.location.pincode as string}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <h5 className="mb-3">Images</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Main Image (Optional)</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleMainImageChange}
                      />
                      <small className="form-text text-muted">
                        Main service image (max 5MB)
                      </small>
                      {mainImage && (
                        <div className="mt-2">
                          <small className="text-success">
                            <i className="ti ti-check me-1"></i>
                            {(mainImage as ExtendedFile).isExisting ? 'Current image' : 'Selected'}: {mainImage.name}
                          </small>
                          {(mainImage as ExtendedFile).isExisting && (
                            <div className="mt-2">
                              <img
                                src={(mainImage as ExtendedFile).url}
                                alt="Current main image"
                                style={{
                                  width: '100px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Gallery Images (Optional)</label>

                      {/* Drop Zone */}
                      <div
                        className="border-2 border-dashed border-secondary rounded p-4 text-center"
                        style={{
                          borderColor: '#dee2e6',
                          backgroundColor: '#f8f9fa',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';

                          const files = Array.from(e.dataTransfer.files);
                          if (files.length > 0) {
                            handleGalleryDrop(files);
                          }
                        }}
                        onClick={() => document.getElementById('gallery-upload')?.click()}
                      >
                        <i className="ti ti-cloud-upload" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                        <div className="mt-2">
                          <p className="mb-1 text-muted">Drop images here or click to browse</p>
                          <small className="text-muted">Supports: JPEG, PNG, JPG, WebP (max 10 files, 5MB each)</small>
                        </div>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        id="gallery-upload"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                      />

                      {/* Selected Files Preview */}
                      {galleryImages.length > 0 && (
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-success fw-semibold">
                              <i className="ti ti-check-circle me-1"></i>
                              {galleryImages.length} image(s) {galleryImages.some((img) => (img as ExtendedFile).isExisting) ? 'loaded' : 'selected'}
                            </small>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setGalleryImages([])}
                            >
                              <i className="ti ti-trash me-1"></i>Clear All
                            </button>
                          </div>

                          <div className="gallery-preview">
                            <div className="row g-2">
                              {galleryImages.map((file, index) => (
                                <div key={file.id} className="col-6 col-md-4">
                                  <div className="position-relative">
                                    <div className="card">
                                      <img
                                        src={file.url || '#'}
                                        alt={`Preview ${index + 1}`}
                                        className="card-img-top"
                                        style={{
                                          height: '80px',
                                          objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                          console.error('Failed to load image preview:', file.name);
                                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                                        }}
                                      />
                                      <div className="card-body p-2">
                                        <small className="text-muted d-block text-truncate" title={file.name}>
                                          {file.name}
                                        </small>
                                        <small className="text-muted">
                                          {file.size ? (file.size / 1024 / 1024).toFixed(1) : 'Unknown'} MB
                                        </small>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger position-absolute"
                                      style={{
                                        top: '5px',
                                        right: '5px',
                                        width: '24px',
                                        height: '24px',
                                        padding: '0',
                                        borderRadius: '50%',
                                        fontSize: '12px'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeGalleryImage(index);
                                      }}
                                    >
                                      <i className="ti ti-x"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <h5 className="mb-3">Additional Services (Optional)</h5>
                {additionalServices.map((service, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Service name"
                        value={service.service}
                        onChange={(e) => updateAdditionalService(index, 'service', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={service.desc}
                        onChange={(e) => updateAdditionalService(index, 'desc', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        value={service.price}
                        onChange={(e) => updateAdditionalService(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Duration"
                        value={service.duration}
                        onChange={(e) => updateAdditionalService(index, 'duration', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeAdditionalService(index)}
                        disabled={additionalServices.length === 1}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary mb-4"
                  onClick={addAdditionalService}
                >
                  <i className="ti ti-plus me-1"></i> Add Additional Service
                </button>

                {/* Includes */}
                <h5 className="mb-3">What&apos;s Included (Optional)</h5>
                {includes.map((include, index) => (
                  <div key={index} className="row mb-2">
                    <div className="col-md-10">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="What&apos;s included in this service"
                        value={include}
                        onChange={(e) => updateInclude(index, e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeInclude(index)}
                        disabled={includes.length === 1}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary mb-4"
                  onClick={addInclude}
                >
                  <i className="ti ti-plus me-1"></i> Add Include Item
                </button>

                {/* FAQ */}
                <h5 className="mb-3">FAQ (Optional)</h5>
                {faq.map((item, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Question"
                        value={item.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Answer"
                        value={item.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeFAQ(index)}
                        disabled={faq.length === 1}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary mb-4"
                  onClick={addFAQ}
                >
                  <i className="ti ti-plus me-1"></i> Add FAQ
                </button>

                {/* SEO Information */}
                <h5 className="mb-3">SEO Information</h5>
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Meta Title</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.seo?.metaTitle && formik.errors.seo?.metaTitle
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="seo.metaTitle"
                        value={formik.values.seo.metaTitle}
                        onChange={(e) => handleFieldChange('seo.metaTitle', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.seo?.metaTitle &&
                        formik.errors.seo?.metaTitle && (
                          <div className="invalid-feedback">
                            {formik.errors.seo.metaTitle as string}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Meta Description</label>
                      <textarea
                        className={`form-control ${formik.touched.seo?.metaDescription &&
                          formik.errors.seo?.metaDescription
                          ? 'is-invalid'
                          : ''
                          }`}
                        name="seo.metaDescription"
                        rows={3}
                        value={formik.values.seo.metaDescription}
                        onChange={(e) => handleFieldChange('seo.metaDescription', e.target.value)}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.seo?.metaDescription &&
                        formik.errors.seo?.metaDescription && (
                          <div className="invalid-feedback">
                            {formik.errors.seo.metaDescription as string}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Meta Keywords</label>
                      <input
                        type="text"
                        className={`form-control ${formik.touched.seo?.metaKeywords &&
                          formik.errors.seo?.metaKeywords
                          ? 'is-invalid'
                          : ''
                          }`}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a keyword and press Enter"
                      />
                      {formik.touched.seo?.metaKeywords &&
                        formik.errors.seo?.metaKeywords && (
                          <div className="invalid-feedback">
                            {formik.errors.seo.metaKeywords as string}
                          </div>
                        )}
                      <div className="mt-2">
                        {formik.values.seo.metaKeywords.map((keyword: string) => (
                          <span
                            key={keyword}
                            className="badge bg-primary me-2 mb-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword} ×
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !formik.isValid}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Updating...
                      </>
                    ) : (
                      'Update Service'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Preview Section */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Preview</h5>
              <div className="service-preview">
                <div className="service-img mb-3">
                  {mainImage ? (
                    <img
                      src={(mainImage as ExtendedFile).isExisting ? (mainImage as ExtendedFile).url : URL.createObjectURL(mainImage)}
                      alt="Service preview"
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded d-flex align-items-center justify-content-center"
                      style={{ width: '100%', height: '200px' }}
                    >
                      <span className="text-muted">No image selected</span>
                    </div>
                  )}
                </div>

                <div className="service-content">
                  <h6 className="service-title">
                    {formik.values.serviceTitle || 'Service Title'}
                  </h6>

                  <div className="service-meta mb-2">
                    <span className="badge bg-primary me-2">
                      {formik.values.categories.length > 0
                        ? categories.find(cat => cat._id === formik.values.categories[0])?.categoryName || 'Category'
                        : 'Category'
                      }
                    </span>
                    <span className="text-muted">
                      ₹{formik.values.price || '0'}
                    </span>
                  </div>

                  <p className="service-description text-muted small">
                    {formik.values.description || 'Service description will appear here...'}
                  </p>

                  <div className="service-details">
                    <div className="row text-center">
                      <div className="col-6">
                        <small className="text-muted">Duration</small>
                        <div className="fw-semibold">{formik.values.duration || 'N/A'}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Location</small>
                        <div className="fw-semibold">
                          {formik.values.location.city || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {formik.values.staff.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted">Staff:</small>
                      <div className="mt-1">
                        {formik.values.staff.slice(0, 2).map((staffId, index) => {
                          const staffMember = staff.find(s => s._id === staffId);
                          return (
                            <span key={index} className="badge bg-secondary me-1">
                              {staffMember?.name || 'Staff'}
                            </span>
                          );
                        })}
                        {formik.values.staff.length > 2 && (
                          <span className="badge bg-light text-dark">
                            +{formik.values.staff.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EditServiceForm;