import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Search from './Components/Search.jsx'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function App() {

  const [trendingmovies, setTrendingmovies] = useState([]);
  const [tvseries, setTvseries] = useState([]);
  const [genres, setGenres] = useState([
    {
      "id": 10759,
      "name": "Action & Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 10762,
      "name": "Kids"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10763,
      "name": "News"
    },
    {
      "id": 10764,
      "name": "Reality"
    },
    {
      "id": 10765,
      "name": "Sci-Fi & Fantasy"
    },
    {
      "id": 10766,
      "name": "Soap"
    },
    {
      "id": 10767,
      "name": "Talk"
    },
    {
      "id": 10768,
      "name": "War & Politics"
    },
    {
      "id": 37,
      "name": "Western"
    },
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    const gettrendingmovies = async () => {
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
        .then(res => setTrendingmovies(res.data.results))
        .catch(err => console.error(err));
    }
    const gettvseries = async () => {
      const url = 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1';
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get(url, options)
        .then(res => setTvseries(res.data.results))
        .catch(err => console.error(err));
    }
    gettrendingmovies();
    gettvseries();
  }, []);
  
  return (
    <div className="bg-dark">
      <Navbar expand="md" className="bg-dark navbar-dark">
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center">
           <Link to={`/`}>
            <img src="/flick-verse-logo.png" alt="Movie Nest" width="150" height="50" className="me-2" />
          </Link>
          </Navbar.Brand>       
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link> <Link to={`/movies`} style={{ textDecoration: 'none', color: 'inherit' }}> Movies </Link> </Nav.Link>
              <Nav.Link> <Link to={`/tvseries`} style={{ textDecoration: 'none', color: 'inherit' }}> Tv Series </Link> </Nav.Link>
            </Nav>
            <Search />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* hero section */}
      <Carousel>
        {trendingmovies?.slice(0, 5).map(trendingmovie => (
          <Carousel.Item key={trendingmovie?.id}>
            <img
              className="d-block w-100"
              style={{ filter: 'brightness(0.5)', maxHeight: '90vh' }}
              src={`https://image.tmdb.org/t/p/original/${trendingmovie?.backdrop_path}`}
              onError={(e) => e.target.src = 'placeholder.svg'}
              alt={trendingmovie?.title}
            />
            <Carousel.Caption>
              <h3>{trendingmovie?.title}</h3>
              <p>{trendingmovie?.overview}</p>
              <Link to={`/movie/${trendingmovie.title.replace(/\s+/g, '-')}/${trendingmovie?.id}`}>
                <Button variant="success"> Play Now </Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      
      {/* movie section */}
      <h6 className="mt-5 text-success text-center mx-3 display-6 mb-5"> Movies </h6>

      <Row xs={1} md={4} lg={6} className="g-4 mx-3">
        {trendingmovies?.map((movie, index) => (
          <Col key={index}>
            <Link to={`/movie/${movie?.title.replace(/\s+/g, '-')}/${movie?.id}`}  onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Card className="bg-dark text-light card-hover-effect" style={{ height: "350px", overflow: "hidden", borderRadius: "20px" }} 
            >
              <Card.Img
                variant="top"
                style={{ borderRadius: "20px 20px 0 0", objectFit: "cover", height: "150px" }}
                src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
                onError={(e) => e.target.src = '/placeholder.svg'}
              />
              <Card.Body style={{ backgroundColor: "#2a2a2a", padding: "20px" }}>
                <Card.Title className="text-light" style={{ fontSize: "18px", fontWeight: "bold" }}>{movie?.title}</Card.Title>
                <Card.Text className="text-light" style={{ fontSize: "14px", color: "#ccc" }}>
                  {movie?.release_date.substring(0, 4)}
                </Card.Text>
                <Card.Subtitle className="text-light mb-2" style={{ fontSize: "14px", color: "#ccc" }}>
                  <img width="15px" height="15px" src={'/star.png'}>
                  </img>
                  <span> {movie?.vote_average.toFixed(1)} </span>
                </Card.Subtitle>
                <Card.Subtitle style={{ fontSize: "14px", color: "#ccc" }}>
                  {movie?.genre_ids.slice(0, 2).map((genre_id) => {
                    const item = genres.find((obj) => obj.id === genre_id);
                    return item ? (
                      movie?.genre_ids[movie?.genre_ids.slice(0, 2).length - 1] === genre_id ? (
                        <span className="badge bg-primary mx-2 mt-1" key={genre_id}>{item.name}</span>
                      ) : (
                        <span className="badge bg-primary" key={genre_id}>{item.name}</span>
                      )
                    ) : null;
                  })}
                </Card.Subtitle>
              </Card.Body>
            </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* tv series section */}
      <h6 className="mt-5 text-success text-center mx-3 display-6 mb-5"> Tv Series </h6>

      <Row xs={1} md={4} lg={6} className="g-4 mx-3">
        {tvseries?.map((tv, index) => (
          <Col key={index}>
            <Link to={`/tv/${tv?.name?.replace(/\s+/g, '-')}/${tv?.id}`} onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Card className="bg-dark text-light card-hover-effect" style={{ height: "350px", overflow: "hidden", borderRadius: "20px" }}>
              <Card.Img
                variant="top"
                style={{ borderRadius: "20px 20px 0 0", objectFit: "cover", height: "150px" }}
                src={`https://image.tmdb.org/t/p/w500/${tv?.backdrop_path}`}
                onError={(e) => e.target.src = '/placeholder.svg'}
              />
              <Card.Body style={{ backgroundColor: "#2a2a2a", padding: "20px"}}>
                <Card.Title className="text-light" style={{fontSize: "18px", fontWeight: "bold"}}>{tv?.name}</Card.Title>
                <Card.Text className="text-light" style={{ fontSize: "14px", color: "#ccc"}}>
                <Card.Subtitle className="text-light mb-2" style={{ fontSize: "14px", color: "#ccc" }}>
                  <img width="15px" height="15px" src={'/star.png'}>
                  </img>
                  <span> {tv?.vote_average.toFixed(1)} </span>
                </Card.Subtitle>
                </Card.Text>
                <Card.Subtitle>
                  {tv?.genre_ids.slice(0, 2).map((genre_id) => {
                    const item = genres.find((obj) => obj.id === genre_id);
                    return item ? (
                      tv?.genre_ids[tv?.genre_ids.slice(0, 2).length - 1] === genre_id ? (
                        <span className="badge bg-primary mx-2 mt-1" key={genre_id}>{item.name}</span>
                      ) : (
                        <span className="badge bg-primary" key={genre_id}>{item.name}</span>
                      )
                    ) : null;
                  })}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default App;