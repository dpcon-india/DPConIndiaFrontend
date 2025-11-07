import React, { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import { axiosInstance } from '../../../../core/api/axiosCore';

interface EditServiceModalProps {
  selectedService: any;
  onServiceUpdated: () => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ selectedService, onServiceUpdated }) => {
  const [formData, setFormData] = useState({
    serviceTitle: '',
    price: '',
    duration: '',
    description: '',
    videoLink: '',
    location: {
      address: '',
      city: '',
      state: '',
      locality: '',
      pincode: '',
      country: 'India'
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    },
    additionalServices: [],
    includes: [],
    faq: []
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  useEffect(() => {
    if (selectedService) {
      setFormData({
        serviceTitle: selectedService.serviceTitle || '',
        price: selectedService.price?.toString() || '',
        duration: selectedService.duration || '',
        description: selectedService.description || '',
        videoLink: selectedService.videoLink || '',
        location: {
          address: selectedService.location?.address || '',
          city: selectedService.location?.city || '',
          state: selectedService.location?.state || '',
          locality: selectedService.location?.locality || '',
          pincode: selectedService.location?.pincode || '',
          country: selectedService.location?.country || 'India'
        },
        seo: {
          metaTitle: selectedService.seo?.metaTitle || '',
          metaDescription: selectedService.seo?.metaDescription || '',
          metaKeywords: selectedService.seo?.metaKeywords || []
        },
        additionalServices: selectedService.additionalServices || [],
        includes: selectedService.includes || [],
        faq: selectedService.faq || []
      });
      setMainImage(null);
      setGalleryImages([]);
    }
  }, [selectedService]);

  const handleSubmit = async () => {
    if (!selectedService?._id) return;
    try {
      const formDataObj = new FormData();
      formDataObj.append('serviceTitle', formData.serviceTitle);
      formDataObj.append('price', formData.price);
      formDataObj.append('duration', formData.duration);
      formDataObj.append('description', formData.description);
      if (formData.videoLink) formDataObj.append('videoLink', formData.videoLink);
      
      Object.entries(formData.location).forEach(([key, value]) => {
        formDataObj.append(`location[${key}]`, value);
      });
      
      Object.entries(formData.seo).forEach(([key, value]) => {
        if (key === 'metaKeywords') {
          (value as string[]).forEach((keyword: string, index: number) => {
            formDataObj.append(`seo[metaKeywords][${index}]`, keyword);
          });
        } else {
          formDataObj.append(`seo[${key}]`, value as string);
        }
      });
      
      formData.additionalServices.forEach((service: any, index: number) => {
        Object.entries(service).forEach(([key, value]) => {
          formDataObj.append(`additionalServices[${index}][${key}]`, value as string);
        });
      });
      
      formData.includes.forEach((include: string, index: number) => {
        formDataObj.append(`includes[${index}]`, include);
      });
      
      formData.faq.forEach((item: any, index: number) => {
        Object.entries(item).forEach(([key, value]) => {
          formDataObj.append(`faq[${index}][${key}]`, value as string);
        });
      });
      
      if (mainImage) formDataObj.append('image', mainImage);
      galleryImages.forEach(file => formDataObj.append('gallery', file));
      
      const result = await axiosInstance.put(`/service/${selectedService._id}`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (result?.status === 200) {
        onServiceUpdated();
        document.querySelector('[data-bs-dismiss="modal"]')?.click();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal fade" id="edit-service">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ border: 'none' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid #e5e5e5' }}>
            <h6 style={{ margin: 0, fontWeight: '400' }}>Edit Service</h6>
            <button type="button" data-bs-dismiss="modal" style={{ border: 'none', background: 'none' }}>
              <Icon.X size={20} />
            </button>
          </div>
          <div className="modal-body" style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              
              {/* Basic Info */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Basic Information</h6>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <input type="text" placeholder="Service Title" value={formData.serviceTitle}
                    onChange={e => setFormData({...formData, serviceTitle: e.target.value})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="number" placeholder="Price" value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                    <input type="text" placeholder="Duration" value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  </div>
                  <textarea placeholder="Description" rows={3} value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem', resize: 'vertical' }} />
                  <input type="url" placeholder="Video Link" value={formData.videoLink}
                    onChange={e => setFormData({...formData, videoLink: e.target.value})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                </div>
              </div>
              
              {/* Location */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Location</h6>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <input type="text" placeholder="Address" value={formData.location.address}
                    onChange={e => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <input type="text" placeholder="City" value={formData.location.city}
                      onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                    <input type="text" placeholder="State" value={formData.location.state}
                      onChange={e => setFormData({...formData, location: {...formData.location, state: e.target.value}})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                    <input type="text" placeholder="Locality" value={formData.location.locality}
                      onChange={e => setFormData({...formData, location: {...formData.location, locality: e.target.value}})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" placeholder="Pincode" value={formData.location.pincode}
                      onChange={e => setFormData({...formData, location: {...formData.location, pincode: e.target.value}})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                    <input type="text" placeholder="Country" value={formData.location.country}
                      onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})}
                      style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  </div>
                </div>
              </div>
              
              {/* SEO */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>SEO</h6>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <input type="text" placeholder="Meta Title" value={formData.seo.metaTitle}
                    onChange={e => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                  <textarea placeholder="Meta Description" rows={2} value={formData.seo.metaDescription}
                    onChange={e => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem', resize: 'vertical' }} />
                  <input type="text" placeholder="Keywords (comma separated)" 
                    value={formData.seo.metaKeywords.join(', ')}
                    onChange={e => setFormData({...formData, seo: {...formData.seo, metaKeywords: e.target.value.split(',').map(k => k.trim())}})}
                    style={{ padding: '0.75rem', border: '1px solid #e5e5e5', fontSize: '0.9rem' }} />
                </div>
              </div>
              
              {/* Images */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Images</h6>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Main Image</label>
                    <input type="file" accept="image/*" onChange={e => setMainImage(e.target.files?.[0] || null)}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem', width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Gallery Images</label>
                    <input type="file" accept="image/*" multiple onChange={e => setGalleryImages(Array.from(e.target.files || []))}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem', width: '100%' }} />
                  </div>
                </div>
              </div>
              
              {/* Additional Services */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>Additional Services</h6>
                {formData.additionalServices.map((service: any, index: number) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="Service" value={service.service || ''}
                      onChange={e => {
                        const updated = [...formData.additionalServices];
                        updated[index] = {...updated[index], service: e.target.value};
                        setFormData({...formData, additionalServices: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <input type="number" placeholder="Price" value={service.price || ''}
                      onChange={e => {
                        const updated = [...formData.additionalServices];
                        updated[index] = {...updated[index], price: parseFloat(e.target.value) || 0};
                        setFormData({...formData, additionalServices: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <input type="text" placeholder="Duration" value={service.duration || ''}
                      onChange={e => {
                        const updated = [...formData.additionalServices];
                        updated[index] = {...updated[index], duration: e.target.value};
                        setFormData({...formData, additionalServices: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <button type="button" onClick={() => {
                      const updated = formData.additionalServices.filter((_, i) => i !== index);
                      setFormData({...formData, additionalServices: updated});
                    }} style={{ padding: '0.5rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                      <Icon.X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const updated = [...formData.additionalServices, {service: '', desc: '', price: 0, duration: ''}];
                  setFormData({...formData, additionalServices: updated});
                }} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                  + Add Service
                </button>
              </div>
              
              {/* Includes */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>What&apos;s Included</h6>
                {formData.includes.map((include: string, index: number) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="What&apos;s included" value={include}
                      onChange={e => {
                        const updated = [...formData.includes];
                        updated[index] = e.target.value;
                        setFormData({...formData, includes: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <button type="button" onClick={() => {
                      const updated = formData.includes.filter((_, i) => i !== index);
                      setFormData({...formData, includes: updated});
                    }} style={{ padding: '0.5rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                      <Icon.X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const updated = [...formData.includes, ''];
                  setFormData({...formData, includes: updated});
                }} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                  + Add Item
                </button>
              </div>
              
              {/* FAQ */}
              <div>
                <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '500' }}>FAQ</h6>
                {formData.faq.map((item: any, index: number) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="Question" value={item.question || ''}
                      onChange={e => {
                        const updated = [...formData.faq];
                        updated[index] = {...updated[index], question: e.target.value};
                        setFormData({...formData, faq: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <input type="text" placeholder="Answer" value={item.answer || ''}
                      onChange={e => {
                        const updated = [...formData.faq];
                        updated[index] = {...updated[index], answer: e.target.value};
                        setFormData({...formData, faq: updated});
                      }}
                      style={{ padding: '0.5rem', border: '1px solid #e5e5e5', fontSize: '0.8rem' }} />
                    <button type="button" onClick={() => {
                      const updated = formData.faq.filter((_, i) => i !== index);
                      setFormData({...formData, faq: updated});
                    }} style={{ padding: '0.5rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' }}>
                      <Icon.X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const updated = [...formData.faq, {question: '', answer: ''}];
                  setFormData({...formData, faq: updated});
                }} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                  + Add FAQ
                </button>
              </div>
              
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: '1px solid #e5e5e5', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button data-bs-dismiss="modal" style={{ padding: '0.5rem 1rem', border: '1px solid #e5e5e5', background: '#fff' }}>Cancel</button>
              <button onClick={handleSubmit} style={{ padding: '0.5rem 1rem', border: 'none', background: '#000', color: '#fff' }}>Update Service</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;