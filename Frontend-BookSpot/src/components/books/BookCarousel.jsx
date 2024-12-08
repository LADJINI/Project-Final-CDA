import React from 'react';
import Slider from 'react-slick';

const BookCarousel = ({ books }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const getImageUrl = (imageId) => `http://localhost:8086/api/books/image/${imageId}`;

  return (
    <Slider {...settings}>
      {books.map((book) => (
        <div key={book.id} className="px-2 m-0">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[350px] transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <img
              src={getImageUrl(book.imageId)}
              alt={book.title}
              className="w-full h-[200px] object-cover transform transition duration-300 ease-in-out hover:scale-110"  // Image avec zoom au survol
            />
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 truncate">{book.title}</h3> {/* Titre avec text-overflow */}
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">{book.bookCondition}</p>
              {book.price && <p className="text-lg font-bold text-blue-600">{book.price}€</p>}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BookCarousel;
