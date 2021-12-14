import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './MovieCard';
import Genre from './Genre';
import Loading from './Loading';
import '../scss/Home.scss';
import Services, { handleFailedRequest } from '../utils/services';
import { getQueryParams, getQueryObj } from '../utils/functions';

const Home = () => {
  const params = getQueryObj(useLocation().search);

  const [searchContainer, setSearchContainer] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchText, setSearchText] = useState(params['search']);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [genre, setGenre] = useState(params['genre']);
  const [showArrowDown, setShowArrowDown] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const searchInput = useRef(null);
 
  useEffect(() => {
    if(genre) {
      fetchMovies(true);
    }
  }, [genre]);

  const setMovieGenre = (genre_id) => {
    setGenre(genre_id);
    window.history.replaceState({}, null, getQueryParams({search: searchText, genre: genre_id}));
  }

  const controlScrollBottom = () => {
    if(window.scrollY > document.querySelector('.header').offsetHeight - 100) {
      setShowArrowDown(false);
    } else {
      setShowArrowDown(true);
    }

    if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      console.log('next', nextUrl);
      fetchMovies();
    }
  }

  useEffect(() => {
    fetchMovies(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', controlScrollBottom);

    return () => {
      window.removeEventListener('scroll', controlScrollBottom);
    };
  }, [nextUrl]);

  useEffect(() => {
    if(searchText === '' || (searchText && searchText.length > 2)) {
      fetchMovies(true);
    }
  }, [searchText]);

  const fetchMovies = (resetMovies=false) => {
    if(!resetMovies && !nextUrl) {
      return
    }

    Services.getMovies(resetMovies ? null : nextUrl, {search: searchText, genre: genre})
      .then(data => {
        setMovies(resetMovies ? data.results : [...movies, ...data.results]);
        setNextUrl(data.next);

        if(!data.previous) {
          if(data.results.length !== 0) {
            fetchMovieDetail(data.results[0].id);
          } else {
            setSelectedMovie(null);
            setLoading(false);
          }
        }
      })
      .catch(handleFailedRequest)
  }

  const fetchMovieDetail = (id) => {
    Services.getMovieDetail(id)
      .then(data => {
        setSelectedMovie(data);

        if(loading) {
          setLoading(false);
        }
      })
  }

  const searchMovie = (e) => {
    setSearchText(e.target.value);
    
    window.history.replaceState({}, null, getQueryParams({search: e.target.value, genre: genre}));
  }

  const handleTransitionEnd = (e) => {
    if(e.target.className.includes('movie-list-container')) {
      e.target.className += ' d-none';
    }
  }

  const toggleSearchInput = () => {
    setSearchContainer(!searchContainer);
    searchInput.current.focus();
  }

  if(loading) {
    return (
      <Loading />
    )
  }

  return (
      <div className="container-fluid">
        <div className="search-container" style={isExpanded ? { display: 'none' } : { display: 'initial' }}>
          <input type="text" placeholder="Search" className={`search-input ${searchContainer && 'show-search-input'}`} onChange={e => searchMovie(e)} value={searchText} ref={searchInput} />
          <i className="fas fa-search search-button" onClick={() => toggleSearchInput()}></i>
        </div>

        { selectedMovie && 
          <div className={`row justify-content-center align-content-center header ${isExpanded && 'full-height-detail'}`}>
            <div className="col-6 p-0 movie-info-container">
              <div className="movie-info">
                <h1>{selectedMovie.title}</h1><h5>{selectedMovie.year}</h5>
                <span>{selectedMovie.synopsis}</span>
                <div className="row align-items-center my-3">
                  <div className="col-9">
                    { selectedMovie.genres.map(genre => <Genre key={genre.id} genre={genre} setMovieGenre={setMovieGenre} />) }
                  </div>
                  <div className="col-3 d-flex justify-content-end align-items-center">
                    <span className="movie-score">{ selectedMovie.score }/10</span>
                    <a href={`https://www.imdb.com/title/${selectedMovie.external_id}`} target="_blank" rel="noreferrer">
                      <i className="fab fa-imdb imdb-icon"></i>
                    </a>
                  </div>
                </div>
              </div>
              <i className={`fas fa-chevron-down fa-2x detail-button ${isExpanded && 'arrow-up'}`} style={ showArrowDown ? { display: 'block' } : { display: 'none' } } onClick={() => setIsExpanded(!isExpanded)}></i>
            </div>
            <div className="movie-bg" style={{ backgroundImage: `url(${selectedMovie.cover})` }}>
              <div className="movie-bg-overlay"></div>
            </div>
          </div>
        }

        <div className={`row justify-content-center movie-list-container ${isExpanded && 'hide-list'}`} onTransitionEnd={handleTransitionEnd}>
          <div className="col-6">
            <div className="row my-3">
              { movies.length === 0 ? (
                <div className="row">
                  <div className="col d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <span style={{ color: 'white' }}>No results</span>
                  </div>
                </div>
              ) : (
                movies.map(movie => <MovieCard key={movie.id} movie={movie} changeSelectedMovie={fetchMovieDetail} />)
              ) 
              }
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
