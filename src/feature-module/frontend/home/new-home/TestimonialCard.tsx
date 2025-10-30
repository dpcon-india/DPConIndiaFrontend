import React from 'react';

interface TestimonialCardProps {
  testimonial: {
    _id: string;
    name: string;
    jobTitle: string;
    desc: string;
    rating: number;
    image?: string;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="col-md-4">
      <div 
        className="position-relative overflow-hidden" 
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '20px',
          padding: '28px',
          height: '100%',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <div className="position-relative">
            {testimonial.image ? (
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="rounded-circle"
                style={{width: '56px', height: '56px', objectFit: 'cover'}}
              />
            ) : (
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center" 
                style={{
                  width: '56px', 
                  height: '56px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                {testimonial.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ms-3">
            <h6 className="mb-1 fw-bold" style={{color: '#2d3748', fontSize: '16px'}}>
              {testimonial.name}
            </h6>
            <p className="mb-1 text-muted" style={{fontSize: '13px'}}>
              {testimonial.jobTitle}
            </p>
            <div className="text-warning" style={{fontSize: '14px'}}>
              {'★'.repeat(testimonial.rating)}
            </div>
          </div>
        </div>
        <p 
          className="mb-0" 
          style={{
            color: '#4a5568',
            fontSize: '15px',
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}
        >
          &ldquo;{testimonial.desc}&rdquo;
        </p>
        <div 
          className="position-absolute" 
          style={{
            top: '20px',
            right: '20px',
            fontSize: '40px',
            color: '#e2e8f0',
            fontFamily: 'serif'
          }}
        >
          &ldquo;
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;