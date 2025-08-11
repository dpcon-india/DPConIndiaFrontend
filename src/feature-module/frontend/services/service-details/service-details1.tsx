// import React, { useEffect, useRef, useState } from 'react';
// import Lightbox from 'yet-another-react-lightbox';
// import 'yet-another-react-lightbox/styles.css';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { all_routes } from '../../../../core/data/routes/all_routes';
// import BreadCrumb from '../../common/breadcrumb/breadCrumb';
// import VideoModal from '../../../../core/hooks/video-modal';
// import StickyBox from 'react-sticky-box';
// import { Navigation, Pagination } from 'swiper/modules';
// // import Swiper from 'swiper';
// import { fetchServiceById } from '../../../../APICalls';
// import { IService } from '../../../../GlobleType';
// import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import moment from 'moment';
// import AuthModals from '../../home/new-home/authModals';
// import { jwtDecode } from 'jwt-decode';
// import AppointmentModal from './AppointmentModal';
// SwiperCore.use([Navigation, Pagination]);
// import PayAppointmentModal from './PayAppointmentModal';
// interface BookingComponentProps {
//   chechHandler: (element: React.MouseEvent<HTMLDivElement>, data: any) => void;
//   data: any;
// }

// const ServiceDetails1 = () => {
//   const routes = all_routes;
//   const [nav1, setNav1] = useState(null);
//   const [nav2, setNav2] = useState(null);
//   const sliderRef1 = useRef(null);
//   const sliderRef2 = useRef(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const videoUrl = 'https://www.youtube.com/watch?v=Vdp6x7Bibtk';
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);
//   const [open, setOpen] = React.useState(false);
//   const [data, setData] = useState<IService>();
//   const params = useParams();
//   const sliderRef = useRef<any>(null);
//   const swiperRef = useRef<any>(null);
//   const navigate = useNavigate();
//   const [isCopied, setIsCopied] = useState(false);
//   const [showModal1, setShowModal1] = useState<boolean>(false);
//   const [showModal2, setShowModal2] = useState<boolean>(false);
//   const { id: serviceId } = useParams<{ id: string }>();
//   const handleCopy = () => {
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     });
//   };
//   const fetchData = async () => {
//     try {
//       const res = await fetchServiceById(params.id);
//       setData(res);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const two = {
//     dots: false,
//     autoplay: false,
//     slidesToShow: 6,
//     speed: 500,
//     responsive: [
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: 6,
//         },
//       },
//       {
//         breakpoint: 800,
//         settings: {
//           slidesToShow: 6,
//         },
//       },
//       {
//         breakpoint: 776,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 567,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//     ],
//   };
//   const settings1 = {
//     dots: false,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     initialSlide: currentImageIndex,
//     beforeChange: (_: any, next: any) => setCurrentImageIndex(next),
//   };
//   const handleSwiperClick = (index: number) => {
//     setCurrentImageIndex(index); // Update the current image index for react-slick
//     sliderRef.current.slickGoTo(index); // Change the main slider's image
//     swiperRef.current?.slideTo(index - 2, 500); // Center the clicked image in Swiper
//   };
//   const settings2 = {
//     dots: false,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 5,
//     slidesToScroll: 1,
//     focusOnSelect: true,
//     asNavFor: nav1 || undefined, // Link to the first slider
//     ref: (slider: any) => (sliderRef2.current = slider), // Assign the slider ref
//   };
//   useEffect(() => {
//     setNav1(sliderRef1.current);
//     setNav2(sliderRef2.current);
//     fetchData();
//   }, []);

//   const swiperConfig = {
//     slidesPerView: 5,
//     spaceBetween: 10,
//     navigation: true,
//     onSwiper: (swiper: any) => (swiperRef.current = swiper),
//   };

//   function chechHandler(e: any, data: any) {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     const token = user?.token;

//     if (token) {
//       try {
//         const decode: any = jwtDecode(token);
//         if (decode?.id) {
//           navigate('/customers/user-bookings', { state: data });
//         } else {
//           e.currentTarget.setAttribute('data-bs-toggle', 'modal');
//           e.currentTarget.setAttribute('data-bs-target', '#login-modal');
//         }
//       } catch (err) {
//         console.error('Error decoding token:', err);
//       }
//     } else {
//       e.currentTarget.setAttribute('data-bs-toggle', 'modal');
//       e.currentTarget.setAttribute('data-bs-target', '#login-modal');
//     }
//   }
//   return (
//     <>
//       <BreadCrumb
//         title="Service Details"
//         item1="Service"
//         item2="Service Details"
//       />
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="container">
//             <div className="row">
//               <div className="col-xl-8">
//                 <div className="card border-0">
//                   <div className="card-body">
//                     <div className="service-head mb-2">
//                       <div className="d-flex align-items-center justify-content-between flex-wrap">
//                         <h3 className="mb-2">{data?.serviceTitle}</h3>
//                         {data?.count && data?.count > 0 ? (
//                           <span className="badge badge-purple-transparent mb-2">
//                             <i className="ti ti-calendar-check me-1" />
//                             {data?.count}+ Bookings
//                           </span>
//                         ) : (
//                           ''
//                         )}
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
//                         <div className="d-flex align-items-center flex-wrap">
//                           <p className="me-3 mb-2">
//                             <i className="ti ti-map-pin me-2" />
//                             {data?.location?.address +
//                               ' ' +
//                               data?.location?.pincode +
//                               ' '}
//                           </p>
//                         </div>
//                         <div className="d-flex align-items-center flex-wrap">
//                           <Link
//                             to="#"
//                             onClick={handleCopy}
//                             className={`me-3 mb-2 ${isCopied ? 'text-success' : ''}`}
//                             style={{
//                               textDecoration: 'none',
//                               cursor: 'pointer',
//                             }}
//                           >
//                             <i className="ti ti-copy me-2" />
//                             {isCopied ? 'Copied!' : 'Copy'}
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Slider */}
//                     <div className="service-wrap mb-4">
//                       {/* Main Slider */}
//                       <div className="slider-wrap">
//                         <Slider
//                           {...settings1}
//                           ref={sliderRef}
//                           className="owl-carousel reactslick service-carousel nav-center mb-3"
//                         >
//                           {data?.gallery[0] ? (
//                             data?.gallery.map((image, index) => (
//                               <div className="service-img" key={index}>
//                                 <img
//                                   src={image}
//                                   className="img-fluid"
//                                   alt={`Slider Img ${index}`}
//                                   style={{
//                                     height: '400px',
//                                     width: '100%',
//                                     objectFit: 'cover',
//                                   }}
//                                 />
//                               </div>
//                             ))
//                           ) : (
//                             <div>
//                               <img
//                                 src="/assets/img/services/service-slider-03.jpg"
//                                 alt="Slider Img"
//                                 className="img-fluid"
//                                 style={{
//                                   height: '400px',
//                                   width: '100%',
//                                   objectFit: 'cover',
//                                 }}
//                               />
//                             </div>
//                           )}
//                         </Slider>
//                       </div>

//                       {/* Thumbnail Swiper */}
//                       {data?.gallery?.[0] && (
//                         <Swiper {...swiperConfig}>
//                           {data?.gallery.map((image, index) => (
//                             <SwiperSlide key={index}>
//                               <div
//                                 className={`service-img ${currentImageIndex === index ? 'active' : ''}`}
//                                 onClick={() => handleSwiperClick(index)}
//                               >
//                                 <img
//                                   src={image}
//                                   className="img-fluid"
//                                   alt={`Thumbnail ${index}`}
//                                   style={{
//                                     height: '100px',
//                                     width: '100%',
//                                     objectFit: 'cover',
//                                   }}
//                                 />
//                               </div>
//                             </SwiperSlide>
//                           ))}
//                         </Swiper>
//                       )}
//                     </div>
//                     {/* /Slider */}
//                     <div className="accordion service-accordion">
//                       <div className="accordion-item mb-4">
//                         <h2 className="accordion-header">
//                           <button
//                             className="accordion-button p-0"
//                             type="button"
//                             data-bs-toggle="collapse"
//                             data-bs-target="#overview"
//                             aria-expanded="false"
//                           >
//                             Service Overview
//                           </button>
//                         </h2>
//                         <div
//                           id="overview"
//                           className="accordion-collapse collapse show"
//                         >
//                           <div className="accordion-body border-0 p-0 pt-3">
//                             <div className="more-text">
//                               <p>{data?.description}</p>
//                             </div>

//                             {data?.additionalServices &&
//                               data?.additionalServices?.length > 0 && (
//                                 <div className="bg-light-200 p-3 offer-wrap">
//                                   <h4 className="mb-3">Services Offered</h4>
//                                   {data?.additionalServices.map((e, i) => (
//                                     <div
//                                       className="offer-item d-md-flex align-items-center justify-content-between bg-white mb-2"
//                                       key={i}
//                                     >
//                                       <div className="d-sm-flex align-items-center mb-2">
//                                         <div className="mb-2">
//                                           <h6 className="fs-16 fw-medium">
//                                             {e?.service}
//                                           </h6>
//                                         </div>
//                                       </div>
//                                       <div className="pb-3">
//                                         <h6 className="fs-16 fw-medium text-primary mb-0">
//                                           {e.price}
//                                         </h6>
//                                         <p>{e?.duration} Min</p>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                       </div>
//                       {data?.includes && data?.includes?.length > 0 && (
//                         <div className="accordion-item mb-4">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button p-0"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#include"
//                               aria-expanded="false"
//                             >
//                               Includes
//                             </button>
//                           </h2>
//                           <div
//                             id="include"
//                             className="accordion-collapse collapse show"
//                           >
//                             <div className="accordion-body border-0 p-0 pt-3">
//                               <div className="bg-light-200 p-3 pb-2 br-10">
//                                 {data?.includes.map((e, i) => (
//                                   <p
//                                     className="d-inline-flex align-items-center mb-2 me-4"
//                                     key={i}
//                                   >
//                                     <i className="feather icon-check-circle text-success me-2" />
//                                     {e}
//                                   </p>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {data?.faq && data?.faq.length > 0 && (
//                         <div className="accordion-item mb-0">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button p-0"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#faq"
//                               aria-expanded="false"
//                             >
//                               FAQ’s
//                             </button>
//                           </h2>
//                           <div
//                             id="faq"
//                             className="accordion-collapse collapse show"
//                           >
//                             <div className="accordion-body border-0 p-0 pt-3">
//                               <div
//                                 className="accordion accordion-customicon1 faq-accordion"
//                                 id="accordionfaq"
//                               >
//                                 {data?.faq.map((e, i) => (
//                                   <div
//                                     className="accordion-item bg-light-200 mb-3"
//                                     key={i}
//                                   >
//                                     <h2 className="accordion-header">
//                                       <button
//                                         className="accordion-button bg-light-200 br-10 fs-16 fw-medium"
//                                         type="button"
//                                         data-bs-toggle="collapse"
//                                         data-bs-target="#faq1"
//                                         aria-expanded="false"
//                                       >
//                                         {e?.question}
//                                       </button>
//                                     </h2>
//                                     <div
//                                       id="faq1"
//                                       className="accordion-collapse collapse show"
//                                       data-bs-parent="#accordionfaq"
//                                     >
//                                       <div className="accordion-body border-0 pt-0">
//                                         <p>{e?.answer}</p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-4 theiaStickySidebar">
//                 <StickyBox>
//                   {/* <div className="card border-0">
//                     <div className="card-body">
//                       <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
//                         <div className="d-flex align-items-center">
//                           <div className="mb-3">
//                             <p className="fs-14 mb-0">Starts From</p>
//                             <h4>
//                               {data?.price === 0 ? (
//                                 <span className="display-6 fw-bold text-success">
//                                   Free
//                                 </span>
//                               ) : (
//                                 <>
//                                   <span className="display-6 fw-bold">
//                                     ₹{data?.price}
//                                   </span>
//                                   <span className="text-decoration-line-through text-default">
//                                     ₹
//                                     {data?.price
//                                       ? data.price + data.price / 10
//                                       : 0}
//                                   </span>
//                                 </>
//                               )}
//                             </h4>
//                           </div>
//                         </div>
//                         {data?.price !== 0 && (
//                           <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
//                             <i className="ti ti-circle-percentage me-1" />
//                             10% Offer
//                           </span>
//                         )}
//                       </div>

//                       <div
//                         onClick={(element) => chechHandler(element, data)}
//                         className="btn btn-lg btn-primary w-100 d-flex align-items-center justify-content-center mb-3"
//                       >
//                         <i className="ti ti-calendar me-2" />
//                         Book Service
//                       </div>

//                       <div
//                         onClick={() => setShowModal1(true)}
//                         className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
//                       >
//                         <i className="ti ti-calendar me-2" />
//                         Book Free Appointment
//                       </div>
//                       <AppointmentModal
//                         show={showModal1}
//                         onClose={() => setShowModal1(false)}
//                         serviceId={serviceId}
//                       />
//                     </div>
//                   </div> */}
//                   <div className="card border-0">
//                     <div className="card-body">
//                       <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
//                         <div className="d-flex align-items-center">
//                           <div className="mb-3">
//                             <p className="fs-14 mb-0">Starts From</p>
//                             <h4>
//                               {data?.price === 0 ? (
//                                 <span className="display-6 fw-bold text-success">
//                                   Free
//                                 </span>
//                               ) : (
//                                 <>
//                                   <span className="display-6 fw-bold">
//                                     ₹{data?.price}
//                                   </span>
//                                   <span className="text-decoration-line-through text-default">
//                                     ₹
//                                     {data?.price
//                                       ? data.price + data.price / 10
//                                       : 0}
//                                   </span>
//                                 </>
//                               )}
//                             </h4>
//                           </div>
//                         </div>
//                         {data?.price !== 0 && (
//                           <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
//                             <i className="ti ti-circle-percentage me-1" />
//                             10% Offer
//                           </span>
//                         )}
//                       </div>

//                       {/* Default Booking Button */}
//                       <div
//                         onClick={(element) => chechHandler(element, data)}
//                         className="btn btn-lg btn-primary w-100 d-flex align-items-center justify-content-center mb-3 custom-bg"
//                       >
//                         <i className="ti ti-calendar me-2" />
//                         Book Detailed Estimation - ₹{data?.price}
//                       </div>

//                       {/* Show 3 buttons if category is "Plumber", otherwise show 2 */}
//                       {data?.categoryId?.categoryName === 'Plumber' ? (
//                         <>
//                           <div
//                             onClick={() => setShowModal1(true)}
//                             className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
//                           >
//                             <i className="ti ti-calendar me-2" />
//                             Book free survey
//                           </div>
//                           <div
//                             onClick={() => setShowModal2(true)}
//                             className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
//                           >
//                             <i className="ti ti-calendar me-2" />
//                             Book Detailed Estimation Survey - ₹1000/-
//                           </div>
//                         </>
//                       ) : (
//                         <div
//                           onClick={() => setShowModal1(true)}
//                           className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
//                         >
//                           <i className="ti ti-calendar me-2" />
//                           Book Free service
//                         </div>
//                       )}

//                       <AppointmentModal
//                         show={showModal1}
//                         onClose={() => setShowModal1(false)}
//                         serviceId={serviceId}
//                       />
//                       <PayAppointmentModal
//                         show={showModal2}
//                         onClose={() => setShowModal2(false)}
//                         serviceId={serviceId}
//                       />
//                     </div>
//                   </div>

//                   <div className="card border-0">
//                     <div className="card-body">
//                       <h4 className="mb-3">Service Provider</h4>
//                       <div className="provider-info text-center bg-light-500 p-3 mb-3">
//                         <div className="avatar avatar-xl mb-3">
//                           {data?.providerId?.image ? (
//                             <ImageWithoutBasePath
//                               src={data?.providerId?.image}
//                               alt="img"
//                               className="img-fluid rounded-circle"
//                             />
//                           ) : (
//                             <ImageWithBasePath
//                               src="assets/img/profiles/avatar-02.jpg"
//                               alt="img"
//                               className="img-fluid rounded-circle"
//                             />
//                           )}
//                           <span className="service-active-dot">
//                             <i className="ti ti-check" />
//                           </span>
//                         </div>
//                         <h5>{data?.providerId?.name}</h5>
//                       </div>
//                       {/* <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium mb-0">
//                           <i className="ti ti-user text-default me-2" />
//                           Member Since
//                         </h6>
//                         <p>{moment(data?.createdAt).format('DD-MM-YYYY')}</p>
//                       </div> */}
//                       <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium mb-0">
//                           <i className="ti ti-map-pin me-1" />
//                           Address
//                         </h6>
//                         <p>{data?.providerId?.location?.address}</p>
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium mb-0">
//                           <i className="ti ti-mail me-1" />
//                           Email
//                         </h6>
//                         <p>{data?.providerId?.email}</p>
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium mb-0">
//                           <i className="ti ti-phone me-1" />
//                           Phone
//                         </h6>
//                         <p>{data?.providerId?.number}</p>
//                       </div>
//                       {/* <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium mb-0">
//                           <i className="ti ti-file-text me-1" />
//                           No of Listings
//                         </h6>
//                         <p>03</p>
//                       </div>
//                       <div className="d-flex align-items-center justify-content-between mb-3">
//                         <h6 className="fs-16 fw-medium">Social Profiles</h6>
//                         <div className="d-flex align-items-center">
//                           <div className="social-icon">
//                             <Link to="#" className="me-2">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/fb.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                             <Link to="#" className="me-2">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/instagram.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                             <Link to="#" className="me-2">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/twitter.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                             <Link to="#" className="me-2">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/whatsapp.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                             <Link to="#" className="me-2">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/youtube.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                             <Link to="#">
//                               <ImageWithBasePath
//                                 src="assets/img/icons/linkedin.svg"
//                                 className="img"
//                                 alt="icon"
//                               />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>*/}
//                       <div className="row border-top pt-3 g-2"></div>
//                     </div>
//                   </div>
//                 </StickyBox>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Lightbox
//         open={open}
//         close={() => setOpen(false)}
//         slides={[
//           {
//             src: '/react/template/assets/img/services/service-slider-02.jpg',
//           },
//           {
//             src: '/react/template/assets/img/services/service-slider-03.jpg',
//           },
//           {
//             src: '/react/template/assets/img/services/service-slider-01.jpg',
//           },
//           {
//             src: '/react/template/assets/img/services/service-slider-04.jpg',
//           },
//           {
//             src: '/react/template/assets/img/services/service-slider-05.jpg',
//           },
//         ]}
//       />
//       <AuthModals />
//     </>
//   );
// };

// export default ServiceDetails1;
import React, { useEffect, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { all_routes } from '../../../../core/data/routes/all_routes';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import VideoModal from '../../../../core/hooks/video-modal';
import StickyBox from 'react-sticky-box';
import { Navigation, Pagination } from 'swiper/modules';
import { fetchServiceById } from '../../../../APICalls';
import { IService } from '../../../../GlobleType';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import moment from 'moment';
import AuthModals from '../../home/new-home/authModals';
import { jwtDecode } from 'jwt-decode';
import AppointmentModal from './AppointmentModal';
import PayAppointmentModal from './PayAppointmentModal';

SwiperCore.use([Navigation, Pagination]);

interface BookingComponentProps {
  chechHandler: (element: React.MouseEvent<HTMLDivElement>, data: any) => void;
  data: any;
}

const ServiceDetails1 = () => {
  const routes = all_routes;
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const sliderRef1 = useRef(null);
  const sliderRef2 = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const videoUrl = 'https://www.youtube.com/watch?v=Vdp6x7Bibtk';
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState<IService>();
  const params = useParams();
  const sliderRef = useRef<any>(null);
  const swiperRef = useRef<any>(null);
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);
  const [showModal2, setShowModal2] = useState<boolean>(false);
  const { id: serviceId } = useParams<{ id: string }>();

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const fetchData = async () => {
    try {
      const res = await fetchServiceById(params.id);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const settings1 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentImageIndex,
    beforeChange: (_: any, next: any) => setCurrentImageIndex(next),
  };

  const handleSwiperClick = (index: number) => {
    setCurrentImageIndex(index);
    sliderRef.current.slickGoTo(index);
    swiperRef.current?.slideTo(index - 2, 500);
  };

  const swiperConfig = {
    slidesPerView: 5,
    spaceBetween: 10,
    navigation: true,
    onSwiper: (swiper: any) => (swiperRef.current = swiper),
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 5,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
    },
  };

  function chechHandler(e: any, data: any) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    if (token) {
      try {
        const decode: any = jwtDecode(token);
        if (decode?.id) {
          navigate('/customers/user-bookings', { state: data });
        } else {
          e.currentTarget.setAttribute('data-bs-toggle', 'modal');
          e.currentTarget.setAttribute('data-bs-target', '#login-modal');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    } else {
      e.currentTarget.setAttribute('data-bs-toggle', 'modal');
      e.currentTarget.setAttribute('data-bs-target', '#login-modal');
    }
  }

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
    fetchData();
  }, []);

  // Disable body scroll when modals are open
  useEffect(() => {
    if (showModal1 || showModal2) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal1, showModal2]);
  const handleFreeServiceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    if (token) {
      try {
        const decode: any = jwtDecode(token);
        if (decode?.id) {
          setShowModal1(true); // Open the free service modal if logged in
        } else {
          e.currentTarget.setAttribute('data-bs-toggle', 'modal');
          e.currentTarget.setAttribute('data-bs-target', '#login-modal');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    } else {
      e.currentTarget.setAttribute('data-bs-toggle', 'modal');
      e.currentTarget.setAttribute('data-bs-target', '#login-modal');
    }
  };

  return (
    <>
      <BreadCrumb
        title="Service Details"
        item1="Service"
        item2="Service Details"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-8">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="service-head mb-2">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h3 className="mb-2">{data?.serviceTitle}</h3>
                        {data?.count && data?.count > 0 ? (
                          <span className="badge badge-purple-transparent mb-2">
                            <i className="ti ti-calendar-check me-1" />
                            {data?.count}+ Bookings
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                        <div className="d-flex align-items-center flex-wrap">
                          <p className="me-3 mb-2">
                            <i className="ti ti-map-pin me-2" />
                            {data?.location?.address +
                              ' ' +
                              data?.location?.pincode +
                              ' '}
                          </p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <Link
                            to="#"
                            onClick={handleCopy}
                            className={`me-3 mb-2 ${isCopied ? 'text-success' : ''}`}
                            style={{
                              textDecoration: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <i className="ti ti-copy me-2" />
                            {isCopied ? 'Copied!' : 'Copy'}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="service-wrap mb-4">
                      {/* Main Slider */}
                      <div className="slider-wrap">
                        <Slider
                          {...settings1}
                          ref={sliderRef}
                          className="owl-carousel reactslick service-carousel nav-center mb-3"
                        >
                          {data?.gallery[0] ? (
                            data?.gallery.map((image, index) => (
                              <div className="service-img" key={index}>
                                <img
                                  src={image}
                                  className="img-fluid"
                                  alt={`Slider Img ${index}`}
                                  style={{
                                    height: '400px',
                                    width: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              </div>
                            ))
                          ) : (
                            <div>
                              <img
                                src="/assets/img/services/service-slider-03.jpg"
                                alt="Slider Img"
                                className="img-fluid"
                                style={{
                                  height: '400px',
                                  width: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          )}
                        </Slider>
                      </div>

                      {/* Thumbnail Swiper */}
                      {data?.gallery?.[0] && (
                        <div className="thumbnail-slider-container">
                          <Swiper {...swiperConfig}>
                            {data?.gallery.map((image, index) => (
                              <SwiperSlide key={index}>
                                <div
                                  className={`service-img ${currentImageIndex === index ? 'active' : ''}`}
                                  onClick={() => handleSwiperClick(index)}
                                >
                                  <img
                                    src={image}
                                    className="img-fluid"
                                    alt={`Thumbnail ${index}`}
                                    style={{
                                      height: '100px',
                                      width: '100%',
                                      objectFit: 'cover',
                                      cursor: 'pointer',
                                    }}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      )}
                    </div>

                    {/* Rest of your content... */}
                    {/* ... (keep your existing accordion and other content) ... */}
                  </div>
                </div>
              </div>

              <div className="col-xl-4 theiaStickySidebar">
                <StickyBox offsetTop={20} offsetBottom={20}>
                  <div className="card border-0 mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between border-bottom mb-3">
                        <div className="d-flex align-items-center">
                          <div className="mb-3">
                            <p className="fs-14 mb-0">Starts From</p>
                            <h4>
                              {data?.price === 0 ? (
                                <span className="display-6 fw-bold text-success">
                                  Free
                                </span>
                              ) : (
                                <>
                                  <span className="display-6 fw-bold">
                                    ₹{data?.price}
                                  </span>
                                  <span className="text-decoration-line-through text-default ms-2">
                                    ₹
                                    {data?.price
                                      ? data.price + data.price / 10
                                      : 0}
                                  </span>
                                </>
                              )}
                            </h4>
                          </div>
                        </div>
                        {data?.price !== 0 && (
                          <span className="badge bg-success mb-3 d-inline-flex align-items-center fw-medium">
                            <i className="ti ti-circle-percentage me-1" />
                            10% Offer
                          </span>
                        )}
                      </div>

                      <div
                        onClick={(element) => chechHandler(element, data)}
                        className="btn btn-lg btn-primary w-100 d-flex align-items-center justify-content-center mb-3"
                        style={{
                          backgroundColor: '#011339',
                          border: 'none',
                          color: 'white',
                        }}
                      >
                        <i className="ti ti-calendar me-2" />
                        Book Detailed Estimation - ₹{data?.price}
                      </div>

                      {data?.categoryId?.categoryName === 'Plumber' ? (
                        <>
                          <div
                            onClick={() => setShowModal1(true)}
                            className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
                            style={{
                              backgroundColor: '#cf832c',
                              border: 'none',
                              color: 'white',
                            }}
                          >
                            <i className="ti ti-calendar me-2" />
                            Book free survey
                          </div>
                          <div
                            onClick={() => setShowModal2(true)}
                            className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
                            style={{
                              backgroundColor: '#cf832c',
                              border: 'none',
                              color: 'white',
                            }}
                          >
                            <i className="ti ti-calendar me-2" />
                            Book Detailed Estimation Survey - ₹1000/-
                          </div>
                        </>
                      ) : (
                        // <div
                        //   onClick={() => setShowModal1(true)}
                        //   className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
                        //   style={{
                        //     backgroundColor: '#cf832c',
                        //     border: 'none',
                        //     color: 'white',
                        //   }}
                        // >
                        //   <i className="ti ti-calendar me-2" />
                        //   Book Free service
                        // </div>
                        <div
                          onClick={handleFreeServiceClick}
                          className="btn btn-lg btn-secondary w-100 d-flex align-items-center justify-content-center mb-3"
                          style={{
                            backgroundColor: '#cf832c',
                            border: 'none',
                            color: 'white',
                          }}
                        >
                          <i className="ti ti-calendar me-2" />
                          Book Free service
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Provider Card */}
                  <div className="card border-0">
                    <div className="card-body">
                      <h4 className="mb-3">Service Provider</h4>
                      <div className="provider-info text-center bg-light-500 p-3 mb-3">
                        <div className="avatar avatar-xl mb-3">
                          {data?.providerId?.image ? (
                            <ImageWithoutBasePath
                              src={data?.providerId?.image}
                              alt="img"
                              className="img-fluid rounded-circle"
                            />
                          ) : (
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="img"
                              className="img-fluid rounded-circle"
                            />
                          )}
                          <span className="service-active-dot">
                            <i className="ti ti-check" />
                          </span>
                        </div>
                        <h5>{data?.providerId?.name}</h5>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">
                          <i className="ti ti-map-pin me-1" />
                          Address
                        </h6>
                        <p>{data?.providerId?.location?.address}</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">
                          <i className="ti ti-mail me-1" />
                          Email
                        </h6>
                        <p>{data?.providerId?.email}</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fs-16 fw-medium mb-0">
                          <i className="ti ti-phone me-1" />
                          Phone
                        </h6>
                        <p>{data?.providerId?.number}</p>
                      </div>
                    </div>
                  </div>
                </StickyBox>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        show={showModal1}
        onClose={() => setShowModal1(false)}
        serviceId={serviceId}
      />
      <PayAppointmentModal
        show={showModal2}
        onClose={() => setShowModal2(false)}
        serviceId={serviceId}
      />

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src: '/react/template/assets/img/services/service-slider-02.jpg',
          },
          {
            src: '/react/template/assets/img/services/service-slider-03.jpg',
          },
          {
            src: '/react/template/assets/img/services/service-slider-01.jpg',
          },
          {
            src: '/react/template/assets/img/services/service-slider-04.jpg',
          },
          {
            src: '/react/template/assets/img/services/service-slider-05.jpg',
          },
        ]}
      />
      <AuthModals />
    </>
  );
};

export default ServiceDetails1;
