import React, { useState, useEffect } from 'react';

interface Testimonial {
  _id: string;
  name: string;
  jobTitle: string;
  desc: string;
  rating: number;
  image?: string;
  status: boolean;
  createdAt: string;
}

const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonial');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/testimonial/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/testimonial/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Testimonial Management</h4>
              <button className="btn btn-primary" onClick={fetchTestimonials}>
                Refresh
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Job Title</th>
                      <th>Review</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial._id}>
                        <td>{testimonial.name}</td>
                        <td>{testimonial.jobTitle}</td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            {testimonial.desc.length > 100
                              ? `${testimonial.desc.substring(0, 100)}...`
                              : testimonial.desc}
                          </div>
                        </td>
                        <td>
                          <span className="text-warning">
                            {'★'.repeat(testimonial.rating)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${testimonial.status ? 'bg-success' : 'bg-danger'}`}>
                            {testimonial.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(testimonial.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className={`btn btn-sm ${testimonial.status ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => toggleStatus(testimonial._id, testimonial.status)}
                            >
                              {testimonial.status ? 'Hide' : 'Show'}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteTestimonial(testimonial._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialManagement;