import React, { useState } from 'react';
import { img_path } from '../../environment';
import { BaseApi } from '../../config';

interface Image {
  className?: string;
  src: any;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  style?: any;
  fallback?: string; // Optional custom fallback image
}

const ImageWithoutBasePath = (props: Image) => {
  const [imgError, setImgError] = useState(false);

  // Check if the src is a full URL (starts with http/https) or a relative path
  let fullSrc = props.src;
  if (props.src && !props.src.startsWith('http://') && !props.src.startsWith('https://')) {
    // If it's a relative path, prepend the BaseApi URL
    fullSrc = `${BaseApi}${props.src.startsWith('/') ? props.src.substring(1) : props.src}`;
  }

  // Determine fallback based on alt text, className, or custom fallback prop
  const getFallbackImage = () => {
    if (props.fallback) {
      return props.fallback;
    }

    // Check if this is a profile/avatar/provider image based on alt text or className
    const isProfile = props.alt?.toLowerCase().includes('profile') ||
      props.alt?.toLowerCase().includes('avatar') ||
      props.alt?.toLowerCase().includes('provider') ||
      props.alt?.toLowerCase().includes('user') ||
      props.className?.includes('avatar') ||
      props.className?.includes('profile') ||
      props.className?.includes('rounded-circle');

    if (isProfile) {
      return '/assets/img/profiles/avatar-02.jpg';
    }

    // Default fallback for other images (categories, services, etc.)
    return '/assets/img/icons/application.svg';
  };

  const handleError = () => {
    setImgError(true);
  };

  return (
    <img
      className={props.className}
      src={imgError ? getFallbackImage() : fullSrc}
      height={props.height}
      alt={props.alt || 'Image'}
      width={props.width}
      id={props.id}
      style={props.style}
      onError={handleError}
    />
  );
};

export default ImageWithoutBasePath;
