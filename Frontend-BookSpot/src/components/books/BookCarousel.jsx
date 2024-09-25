import React from 'react';
import Slider from 'react-slick';

const BookCarousel = ({ books }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {books.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}€</p>
        </div>
      ))}
    </Slider>
  );
};

export default BookCarousel;
