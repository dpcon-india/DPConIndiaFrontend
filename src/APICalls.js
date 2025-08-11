import axios from 'axios';
import { api, bearerHeader, formDataHeader } from './config';
const gettokenlocalStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
// Fetching
export const fetchCategories = async () => {
  const { data } = await axios.get(`${api}categories`);
  if (!data) return [];
  return data;
};

export const fetchGalleryImages = async () => {
  try {
    const { data } = await axios.get(`${api}allGallery`);
    console.log('Fetched Gallery Images:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

export const deleteGalleryImageindex = async (id, index, fetchGallery) => {
  try {
    await axios.delete(`${api}/gallery/${id}/image/${index}`);
    fetchGallery();
  } catch (error) {
    console.error('Error deleting gallery image:', error);
  }
};

export const addgalleryImage = async (formData, fetchGallery) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios.post(`${api}gallery`, formData, config);
    fetchGallery();
  } catch (error) {
    console.error('Error adding gallery image:', error);
  }
};

export const fetchSubCategories = async () => {
  const { data } = await axios.get(`${api}subcategory`);
  if (!data) return [];
  return data;
};
export const fetchNotifications = async () => {
  const { data } = await axios.get(
    `${api}notifications/${gettokenlocalStorage._id}`,
  );
  if (!data) return [];
  return data;
};
export const fetchNotificationCount = async () => {
  const { data } = await axios.get(
    `${api}notifications/count/${gettokenlocalStorage._id}`,
  );
  if (!data) return 0;
  return data.count;
};
export const fetchAnnouceent = async (role) => {
  const { data } = await axios.get(`${api}subcategory`);
  if (!data) return [];
  return data;
};
export const fetchpinCode = async () => {
  const { data } = await axios.get(`${api}pinCode`, bearerHeader);
  if (!data) return [];
  return data;
};
export const fetchNotAvailable = async () => {
  const { data } = await axios.get(`${api}NotAvailable`);
  if (!data) return [];
  return data;
};
export const fetchSubCategoriesByCategory = async (id) => {
  const { data } = await axios.get(`${api}getSubCategoriesByCategoryId/${id}`);
  if (!data) return [];
  return data;
};
export const fetchAllCustomers = async () => {
  const { data } = await axios.get(`${api}profiles/customer/all`, bearerHeader);
  if (!data) return [];
  return data;
};
export const fetchAllProfileByRole = async (role) => {
  try {
    const { data } = await axios.get(
      `${api}profiles/all/${role}`,
      bearerHeader,
    );
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchBookings = async (type) => {
  try {
    const { data } = await axios.get(`${api}bookings/${type}`, bearerHeader);
    if (!data) return [];
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchBookingsStats = async () => {
  try {
    const { data } = await axios.get(`${api}bookings-stats`, bearerHeader);
    if (!data)
      return {
        pending: 0,
        completed: 0,
        accepted: 0,
        cancelled: 0,
        progress: 0,
        rejected: 0,
      };
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchBookingsStatsByProvider = async (id) => {
  try {
    const { data } = await axios.get(
      `${api}bookings-stats/provider/${id}`,
      bearerHeader,
    );
    if (!data)
      return {
        pending: 0,
        completed: 0,
        accepted: 0,
        cancelled: 0,
        progress: 0,
        rejected: 0,
      };
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getBookingsByCustomer = async (type) => {
  try {
    const { data } = await axios.get(
      `${api}bookings/customer/${type}`,
      bearerHeader,
    );
    if (!data) return [];
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const getBookingsByStaff = async (type) => {
  try {
    const { data } = await axios.get(
      `${api}bookings/staff/${type}`,
      bearerHeader,
    );
    if (!data) return [];
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateBooking = async (bookingId, status) => {
  try {
    const { data } = await axios.put(
      `${api}bookings/${bookingId}`,
      { status },
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};
export const fetchBookingsByProvider = async (id) => {
  try {
    const { data } = await axios.get(
      `${api}bookings/provider/${id}`,
      bearerHeader,
    );
    if (!data) return [];
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAnnoucement = async () => {
  try {
    const { data } = await axios.get(`${api}announcements`, bearerHeader);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchTestimonials = async () => {
  try {
    const { data } = await axios.get(`${api}testimonial`, bearerHeader);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchServices = async () => {
  try {
    const { data } = await axios.get(`${api}service`);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const fetchServiceById = async (id) => {
  try {
    const { data } = await axios.get(`${api}service/${id}`);
    if (!data) return {};
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchServicesByProvider = async (id) => {
  try {
    const { data } = await axios.get(
      `${api}service-provider/${id}`,
      bearerHeader,
    );
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchServicesByCat = async (id) => {
  try {
    const { data } = await axios.get(`${api}service-cat/${id}`);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchFAQ = async (id) => {
  try {
    const { data } = await axios.get(`${api}faqs`);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchStaff = async (id) => {
  try {
    const { data } = await axios.get(
      `${api}profiles/providers/${id}`,
      bearerHeader,
    );
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllProviders = async () => {
  const { data } = await axios.get(`${api}profiles/all/provider`, bearerHeader);
  if (!data) return [];
  return data;
};

export const fetchRevenue = async (timeframe) => {
  try {
    const { data } = await axios.get(
      `${api}bookings-revenue?timeframe=${timeframe}`,
      bearerHeader,
    );
    if (!data) return [];
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchBookingSummary = async (timeframe) => {
  try {
    const { data } = await axios.get(
      `${api}bookings-summary?period=${timeframe}`,
      bearerHeader,
    );
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUserProviderService = async () => {
  try {
    const { data } = await axios.get(
      `${api}profiles/user/provider/service`,
      bearerHeader,
    );
    if (!data)
      return {
        user: 0,
        provider: 0,
        service: 0,
      };
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchTopServices = async () => {
  try {
    const { data } = await axios.get(`${api}service-ranked`, bearerHeader);
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const fetchTopServicesByProvider = async (id) => {
  try {
    const { data } = await axios.get(
      `${api}service-ranked/${id}`,
      bearerHeader,
    );
    if (!data) return [];
    return data;
  } catch (error) {
    console.log(error);
  }
};
// Create Route
export const createCustomer = async (formData) => {
  try {
    const res = await axios.post(
      `${api}profiles/create-customer`,
      formData,
      formDataHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createImageUrl = async (formData) => {
  try {
    const res = await axios.post(`${api}imgurl`, formData, formDataHeader);
    return res.data.url;
  } catch (error) {
    console.log(error);
  }
};

export const createContactUs = async (data) => {
  const res = await axios.post(`${api}contact`, data, bearerHeader);
  return { message: res.data.message, status: res.status };
};

export const createAnnoucement = async (data) => {
  try {
    const res = await axios.post(`${api}announcements`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const checkPincode = async (data) => {
  try {
    const res = await axios.post(`${api}checkPincode`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createFAQ = async (data) => {
  try {
    const res = await axios.post(`${api}faqs`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createService = async (data) => {
  try {
    const res = await axios.post(`${api}service`, data, bearerHeader);
    if (res.status != 201) {
      alert('Error Creating Service');
      return { status: 500 };
    }
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createpinCode = async (data) => {
  try {
    const res = await axios.post(`${api}pinCode`, data, bearerHeader);
    if (res.status != 201) {
      alert('Error Creating Service');
      return { status: 500 };
    }
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};

export const createTestimonials = async (formData) => {
  try {
    const res = await axios.post(`${api}testimonial`, formData, formDataHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createStaff = async (formData) => {
  try {
    const res = await axios.post(
      `${api}profiles/create-customer`,
      formData,
      formDataHeader,
    );
    alert(res.data.message);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const createBooking = async (data) => {
  try {
    const res = await axios.post(`${api}bookings`, data, bearerHeader);
    console.log(res?.data);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
    return { message: 'Error Setting The Appointment!', status: 300 };
  }
};
// updateData
export const updateCustomer = async (formData, id) => {
  try {
    const res = await axios.put(
      `${api}profiles/${id}`,
      formData,
      formDataHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateCustomerById = async (formData) => {
  try {
    const id = JSON.parse(localStorage.getItem('user') || '{}')._id;
    if (!id) return alert('ID Not Found');
    const res = await axios.put(
      `${api}profiles/${id}`,
      formData,
      formDataHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateTestimonial = async (formData, id) => {
  try {
    if (!id) return;
    const res = await axios.put(
      `${api}testimonial/${id}`,
      formData,
      formDataHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateStaff = async (formData, id) => {
  try {
    if (!id) return;
    const res = await axios.put(
      `${api}profiles/${id}`,
      formData,
      formDataHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};

export const updateAnnoucement = async (data, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const res = await axios.put(
      `${api}announcements/${id}`,
      data,
      bearerHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateAnnoucementReadByStaff = async () => {
  try {
    const res = await axios.put(
      `${api}notifications/user/${gettokenlocalStorage?._id}`,
      bearerHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateFAQ = async (data, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const res = await axios.put(`${api}faqs/${id}`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateServiceStatus = async (active, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const res = await axios.put(
      `${api}service/${id}`,
      { active },
      bearerHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateService = async (data, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const res = await axios.put(`${api}service/${id}`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateBookingStatus = async (status, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const gettokenlocalStorage = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    const res = await axios.put(
      `${api}/bookings/${status}/${id}`,
      {},
      bearerHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
export const updateBookingStaff = async (staff, id) => {
  try {
    if (!id) return alert('Id Not Found!');
    const res = await axios.put(
      `${api}/bookings/${id}`,
      { acceptedBy: staff },
      bearerHeader,
    );
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};
// delete
export const deleteCategory = async () => {
  if (!localStorage.getItem('categoryId')) return;
  try {
    const { data } = await axios.delete(
      `${api}category/${localStorage.getItem('categoryId')}`,
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSubCategory = async (id) => {
  try {
    const { data } = await axios.delete(
      `${api}subcategory/${id}`,
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteCustomer = async () => {
  if (!localStorage.getItem('customerId')) return;
  try {
    const { data } = await axios.delete(
      `${api}profiles/${localStorage.getItem('customerId')}`,
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteBlog = async (id, func) => {
  if (!id) return;
  try {
    const res = await axios.delete(`${api}blogs/${id}`, bearerHeader);
    if (res.status == 200) func();
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteService = async (id) => {
  if (!id) return;
  try {
    const res = await axios.delete(`${api}service/${id}`, bearerHeader);
    return { message: res.data?.message, status: res?.status };
  } catch (error) {
    console.log(error);
    return { message: error?.message, status: 300 };
  }
};
export const deletepinCode = async (id, func) => {
  try {
    const res = await axios.delete(`${api}pinCode/${id}`, bearerHeader);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAnnoucement = async (id) => {
  try {
    const { data } = await axios.delete(
      `${api}announcements/${id}`,
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteTestimonial = async (id) => {
  try {
    const { data } = await axios.delete(
      `${api}testimonial/${id}`,
      bearerHeader,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteFAQ = async (id) => {
  try {
    const { data } = await axios.delete(`${api}faqs/${id}`, bearerHeader);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// payment
// Payment
export const CreateOrder = async (amount) => {
  try {
    const res = await axios.post(
      `${api}payment/create-order`,
      { amount },
      bearerHeader,
    );
    if (res.status != 200) return { status: res.status };
    return { status: 200, json: res.data };
  } catch (error) {
    console.log(error);
    return { status: 404 };
  }
};

export const bookAppointment = async (data) => {
  try {
    const res = await axios.post(`${api}book`, data, bearerHeader);
    return { message: res.data.message, status: res.status };
  } catch (error) {
    console.log(error);
  }
};

export const GetAllAppointments = async () => {
  try {
    const res = await axios.get(`${api}getAllAppointments`, bearerHeader);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createPaymentOrder = async (data) => {
  try {
    const res = await axios.post(`${api}pay-and-book`, data, bearerHeader);
    return {
      success: res.data.success,
      order: res.data.order,
      appointment: res.data.appointment,
    };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Booking failed');
  }
};

export const verifyAndCreateAppointment = async (data) => {
  try {
    const res = await axios.post(`${api}payment/verify`, data, bearerHeader);
    return { success: res.data.success };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Verification failed');
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${api}profiles/${id}`, bearerHeader);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
