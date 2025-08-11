import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { fetchGalleryImages } from '../../../../APICalls';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [images, setImages] = useState<{ url: string; title: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galleryData = await fetchGalleryImages();
        if (galleryData && Array.isArray(galleryData)) {
          const formattedImages = galleryData.reduce((acc, item) => {
            item.images.forEach((imgUrl: any) => {
              acc.push({ url: imgUrl, title: item.titel || "Untitled" });
            });
            return acc;
          }, []);
          setImages(formattedImages);
        } else {
          console.error('Unexpected API response format:', galleryData);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="photo-gallery container">
      <h2 className="text-center my-4"></h2>
      <PhotoProvider>
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 768: 2, 480: 1 }}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <PhotoView src={image.url}>
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="img-fluid"
                  loading="lazy"
                />
              </PhotoView>
            </div>
          ))}
        </Masonry>
      </PhotoProvider>
    </div>
  );
};

export default PhotoGallery;
