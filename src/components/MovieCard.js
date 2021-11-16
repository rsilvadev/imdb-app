import '../scss/MovieCard.scss';

const MovieCard = ({ movie, changeSelectedMovie }) => {
  const changeMovieAndScrollUp = (movie) => {
    changeSelectedMovie(movie);
    window.scrollTo(0, 0);
  }

  return (
    <div className="col-3 my-3 movie-card-container">
      <div className="movie-card" style={{ backgroundImage: `url(${movie.cover})` }} onClick={() => changeMovieAndScrollUp(movie.id)}>
        <div className="col-12 d-flex justify-content-center align-items-center movie-card-info">
          <span className="p-3">{movie.title}</span>
        </div>
        <div className="movie-card-overlay"></div>
      </div>
    </div>
  );
}

export default MovieCard;
