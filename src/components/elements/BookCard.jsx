const BookCard = ({ book }) => {
    return (
      <div className="border rounded p-4">
        <h3 className="text-xl font-bold">{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.description}</p>
      </div>
    );
  };
  
  export default BookCard;
  