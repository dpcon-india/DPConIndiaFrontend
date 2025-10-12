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



interface BookingComponentProps {

  chechHandler: (element: React.MouseEvent<HTMLDivElement>, data: any) => void;

  data: any;

}



const ServiceDetails1 = () => {

  // Initialize Swiper modules

  SwiperCore.use([Navigation, Pagination]);



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

      <style>
        {`
          .service-gallery .slick-prev,
          .service-gallery .slick-next {
            z-index: 10;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            border: none;
          }
          
          .service-gallery .slick-prev:hover,
          .service-gallery .slick-next:hover {
            background: rgba(0, 0, 0, 0.7);
          }
          
          .service-gallery .slick-prev:before,
          .service-gallery .slick-next:before {
            font-size: 18px;
            color: white;
          }
          
          .thumbnail-slider .swiper-button-next,
          .thumbnail-slider .swiper-button-prev {
            color: #007bff;
            width: 30px;
            height: 30px;
          }
          
          .thumbnail-item.active {
            transform: scale(1.05);
            transition: all 0.3s ease;
          }
          
          .additional-service-card {
            transition: all 0.3s ease;
          }
          
          .additional-service-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .staff-card {
            transition: all 0.3s ease;
          }
          
          .staff-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .avatar-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 18px;
          }
          
          .pricing-card {
            border: 2px solid #e9ecef;
            transition: all 0.3s ease;
          }
          
          .pricing-card:hover {
            border-color: #007bff;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
          }
          
          .accordion-button:not(.collapsed) {
            background-color: #f8f9fa;
            border-color: #dee2e6;
          }
          
          .check-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .service-info code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.875rem;
          }
          
          @media (max-width: 768px) {
            .thumbnail-slider {
              padding: 0 15px 15px 15px;
            }
            
            .swiper-config {
              --swiper-navigation-size: 20px;
            }
          }
        `}
      </style>
      <BreadCrumb

        title="Service Details"

        item1="Service"

        item2="Service Details"

      />

      <div className="page-wrapper">

        <div className="content" style={{ paddingTop: '2rem' }}>

          <div className="container">

            {/* Hero Section */}
            <div className="row mb-4" style={{ alignItems: 'flex-start' }}>
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <h1 className="h3 mb-0 me-3">{data?.serviceTitle}</h1>
                      {data?.count && data?.count > 0 && (
                        <span className="badge bg-primary-subtle text-primary px-3 py-2">
                          <i className="ti ti-calendar-check me-1" />
                          {data?.count}+ Bookings
                        </span>
                      )}
                    </div>

                    {/* Categories */}
                    {data?.categories && data?.categories.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2">
                          {data.categories.map((category, index) => (
                            <span key={index} className="badge bg-light text-dark border px-3 py-2">
                              <i className="ti ti-tag me-1" />
                              {typeof category === 'string' ? category : (category as any).categoryName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {data?.location && (
                      <div className="d-flex align-items-center mb-3">
                        <i className="ti ti-map-pin text-muted me-2" />
                        <span className="text-muted">
                          {data.location.address}, {data.location.locality}, {data.location.city}, {data.location.state} - {data.location.pincode}
                        </span>
                      </div>
                    )}

                    {/* Duration */}
                    {data?.duration && (
                      <div className="d-flex align-items-center mb-3">
                        <i className="ti ti-clock text-muted me-2" />
                        <span className="text-muted">Duration: {data.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Card - Moved to same row */}
              <div className="col-md-4">
                <StickyBox offsetTop={80} offsetBottom={20}>
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Book This Service</h5>

                      {data?.categories?.some(cat => (typeof cat === 'string' ? cat : (cat as any).categoryName) === 'Plumber') ? (
                        <>
                          <div
                            onClick={() => setShowModal1(true)}
                            className="btn btn-secondary btn-lg w-100 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: '#cf832c',
                              border: 'none',
                              color: 'white',
                            }}
                          >
                            <i className="ti ti-calendar me-2" />
                            Book Free Survey
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={handleFreeServiceClick}
                          className="btn btn-secondary btn-lg w-100 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: '#cf832c',
                            border: 'none',
                            color: 'white',
                          }}
                        >
                          <i className="ti ti-calendar me-2" />
                          Book Free Service
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Link */}
                  {data?.videoLink && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-body">
                        <h5 className="card-title mb-3">
                          <i className="ti ti-video me-2 text-danger" />
                          Service Video
                        </h5>
                        <a
                          href={data.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-danger w-100"
                        >
                          <i className="ti ti-external-link me-2" />
                          Watch Video
                        </a>
                      </div>
                    </div>
                  )}
                </StickyBox>
              </div>
            </div>



            <div className="row">
              {/* Main Content */}
              <div className="col-md-8">
                {/* Image Gallery */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-0">
                    <div className="service-gallery">
                      {data?.gallery && data?.gallery.length > 0 ? (
                        <>
                          {/* Main Slider */}

                          <div className="main-slider mb-3">
                            <Slider

                              {...settings1}

                              ref={sliderRef}

                              className="service-carousel-main"
                            >

                              {data.gallery.map((image, index) => (
                                <div key={index} className="gallery-slide">
                                  <img

                                    src={image}

                                    className="img-fluid w-100"
                                    alt={`Service Image ${index + 1}`}
                                    style={{

                                      height: '400px',

                                      objectFit: 'cover',

                                      borderRadius: '8px 8px 0 0'
                                    }}

                                  />

                                </div>

                              ))}
                            </Slider>

                          </div>



                          {/* Thumbnail Slider */}
                          {data.gallery.length > 1 && (
                            <div className="thumbnail-slider px-3 pb-3">
                              <Swiper {...swiperConfig}>

                                {data.gallery.map((image, index) => (
                                  <SwiperSlide key={index}>

                                    <div

                                      className={`thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                                      onClick={() => handleSwiperClick(index)}

                                    >

                                      <img

                                        src={image}

                                        className="img-fluid"

                                        alt={`Thumbnail ${index + 1}`}
                                        style={{

                                          height: '80px',
                                          width: '100%',

                                          objectFit: 'cover',

                                          borderRadius: '6px',
                                          cursor: 'pointer',

                                          border: currentImageIndex === index ? '3px solid #007bff' : '2px solid transparent'
                                        }}

                                      />

                                    </div>

                                  </SwiperSlide>

                                ))}

                              </Swiper>

                            </div>

                          )}

                        </>
                      ) : data?.image ? (
                        <div className="single-image">
                          <img
                            src={Array.isArray(data.image) ? data.image[0] : data.image}
                            className="img-fluid w-100"
                            alt="Service Image"
                            style={{
                              height: '400px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="no-image bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                          <div className="text-center">
                            <i className="ti ti-photo text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="text-muted mt-2">No images available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                {/* Service Description */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h4 className="card-title mb-4">
                      <i className="ti ti-info-circle me-2 text-primary" />
                      Service Description
                    </h4>
                    <div className="description-content">
                      <p className="lead mb-3">{data?.description}</p>
                    </div>

                  </div>

                </div>



                {/* Additional Services */}
                {data?.additionalServices && data?.additionalServices.length > 0 && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">

                      <h4 className="card-title mb-4">
                        <i className="ti ti-plus me-2 text-primary" />
                        Additional Services
                      </h4>
                      <div className="row">
                        {data.additionalServices.map((service, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="additional-service-card border rounded-3 p-3 h-100">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-semibold mb-1">{service.service}</h6>
                                <span className="badge bg-primary-subtle text-primary">
                                  ₹{service.price}
                                </span>

                              </div>
                              <p className="text-muted small mb-2">{service.desc}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small">
                                  <i className="ti ti-clock me-1" />
                                  {service.duration}
                                </span>

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* What's Included */}
                {data?.includes && data?.includes.length > 0 && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h4 className="card-title mb-4">
                        <i className="ti ti-checklist me-2 text-success" />
                        What&apos;s Included
                      </h4>

                      <div className="includes-list">
                        {data.includes.map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-3">
                            <div className="check-icon me-3">
                              <i className="ti ti-check-circle text-success" style={{ fontSize: '1.2rem' }} />
                            </div>

                            <span>{item}</span>
                          </div>

                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Staff Members */}
                {data?.staff && data?.staff.length > 0 && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h4 className="card-title mb-4">
                        <i className="ti ti-users me-2 text-primary" />
                        Our Team
                      </h4>
                      <div className="row">
                        {data.staff.map((member, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="staff-card border rounded-3 p-3">
                              <div className="d-flex align-items-center">
                                <div className="avatar me-3">
                                  <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                    {member.name?.charAt(0) || 'U'}
                                  </div>
                                </div>
                                <div>
                                  <h6 className="mb-1">{member.name}</h6>
                                  <p className="text-muted small mb-1">{member.email}</p>
                                  <p className="text-muted small mb-0">{member.number}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* FAQ Section */}
                {data?.faq && data?.faq.length > 0 && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h4 className="card-title mb-4">
                        <i className="ti ti-help-circle me-2 text-info" />
                        Frequently Asked Questions
                      </h4>
                      <div className="accordion" id="faqAccordion">
                        {data.faq.map((faq, index) => (
                          <div key={index} className="accordion-item border-0 mb-3">
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button collapsed bg-light"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#faq${index}`}
                                aria-expanded="false"
                              >
                                {faq.question}
                              </button>
                            </h2>
                            <div
                              id={`faq${index}`}
                              className="accordion-collapse collapse"
                              data-bs-parent="#faqAccordion"
                            >
                              <div className="accordion-body bg-white border-top">
                                {faq.answer}
                              </div>
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

