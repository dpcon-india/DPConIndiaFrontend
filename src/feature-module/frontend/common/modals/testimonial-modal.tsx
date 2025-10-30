import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface TestimonialModalProps {
  show: boolean;
  onHide: () => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    desc: '',
    rating: 5,
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('jobTitle', formData.jobTitle);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('rating', formData.rating.toString());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/testimonial', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Testimonial submitted successfully!');
        setFormData({ name: '', jobTitle: '', desc: '', rating: 5, image: null });
        onHide();
      } else {
        alert('Failed to submit testimonial');
      }
    } catch (error) {
      alert('Error submitting testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Your Testimonial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Review *</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <select
              className="form-control"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Photo (Optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TestimonialModal;