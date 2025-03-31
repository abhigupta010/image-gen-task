import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ImageGallery from "./components/ImageGallery";
import CanvasEditor from "./components/CanvasEditor";
import "./styles.css";

const App: React.FC = () => {
  const [images, setImages] = useState<[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const imagesPerPage = 12;
  const APIKEY = process.env.REACT_APP_API_KEY;

  const fetchImages = async (query: string) => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=50`,
        {
          headers: {
            Authorization:APIKEY,
          },
        }
      );

      const transformedImages = response.data.photos.map((photo: any) => ({
        src: { medium: photo.src.medium },
        alt: photo.alt || "Image",
      }));

      setImages(transformedImages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching images", error);
      alert("Failed to fetch images. Please try again.");
    }
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app">
      <h1>Image Editor</h1>
      <SearchBar onSearch={fetchImages} />
      <ImageGallery images={currentImages} onSelectImage={openModal} />
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      {isModalOpen && selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <CanvasEditor imageUrl={selectedImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
