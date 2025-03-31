import React from "react";

interface ImageGalleryProps {
  images: { src: { medium: string }; alt: string }[];
  onSelectImage: (imageUrl: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onSelectImage }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image.src.medium} alt={image.alt} />
          <button onClick={() => onSelectImage(image.src.medium)}>Add Captions</button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;