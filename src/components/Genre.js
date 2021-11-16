import '../scss/Genre.scss';

const Genre = ({ genre, setMovieGenre }) => {
  return (
    <button className="py-1 px-2 genre" onClick={() => setMovieGenre(genre.id)}>
      { genre.name }
    </button>
  );
}

export default Genre;
