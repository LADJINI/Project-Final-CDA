import React from 'react';
import Slider from 'react-slick';

const BookCarousel = ({ books }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Nombre de slides visibles
    slidesToScroll: 1, // Nombre de slides à faire défiler à la fois
    centerMode: false, // Désactive le mode centré pour éviter l'espacement excessif
    centerPadding: '0', // Réduit l'espace entre les slides
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

   /**
   * Génère l'URL de l'image du livre à partir de son ID.
   * 
   * @param {string} imageId - L'identifiant de l'image.
   * @returns {string} L'URL de l'image.
   */
   const getImageUrl = (imageId) => `http://localhost:8086/api/imageFile/${imageId}`;

  return (
    <Slider {...settings}>
      {books.map(book => (
        <div key={book.id} className="px-1 m-0">
          

          <img
            src={getImageUrl(book.imageId)}
            alt={book.title}
            className="w-1/2 h-32 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold">{book.title}</h3>
          <p className="text-gray-700"> {book.author}</p>
          <p className="text-gray-700">{book.bookCondition}</p>
          <p className="text-gray-700"> {book.price}€</p>
        </div>
      ))}
    </Slider>
  );
};

export default BookCarousel;
