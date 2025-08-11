import React from 'react';
import { img_path } from '../../environment';

interface Image {
  className?: string;
  src: any;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  style?: any;
}

const ImageWithoutBasePath = (props: Image) => {
  const fullSrc = `${props.src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithoutBasePath;
