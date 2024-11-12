/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Search from '../Components/Search.jsx'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Movielist() {
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([
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
  const totalpages = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100000);
  const [showForm, setShowForm] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [Allselectedgenres, setAllselectedgenres] = useState([]);
  const [years, setYear] = useState([2024, 2023, 2022, 2021, 2020, 'older'])
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchyear, setSearchyear] = useState();

  const getmovies = async (currentPage) => {
    const genreIds = Allselectedgenres.map(genre => genre.id).join(',');
    let year = 0;
    if(typeof selectedYear === 'string') {
      year = '2020-01-01'
    } else if (typeof selectedYear === 'number') {
      year = `${selectedYear}-01-01`
    }
    let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&with_genres=${genreIds}&release_date.lte=${year}`;
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
      }
    };
    axios.get(url, options)
      .then(res => {
        setMovies(res.data)
      })
      .catch(err => console.error(err));
  }
  useEffect(() => {
    getmovies(currentPage);
  }, [currentPage, Allselectedgenres, searchyear]);
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };
  const handleCheckboxChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };
  const handleRadiobtnChange = (year) => {
    setSelectedYear(year);
  }
  const clickedbtn = (e) => {
    e.preventDefault();
    setAllselectedgenres(selectedGenres);
    setSearchyear(selectedYear);
  }

  return (
    <div className="bg-dark pb-5">
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
              {/* <Nav.Link> Home </Nav.Link> */}
              <Nav.Link> <Link to={`/movies`} style={{ textDecoration: 'none', color: 'inherit' }}> Movies </Link> </Nav.Link>
              <Nav.Link> <Link to={`/tvseries`} style={{ textDecoration: 'none', color: 'inherit' }}> Tv Series </Link> </Nav.Link>
            </Nav>
            <Search />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Button variant="success" className="mx-3" onClick={handleToggleForm}>
        Filter
      </Button>
      {showForm && (
        <Form className="mt-3">
          <Form.Group as={Row} className="mx-3" controlId="formGenres">
            <Form.Label column sm="2" className="text-white mx-3">
              Genre:
            </Form.Label>
            <Col sm="10">
              <div className="d-flex flex-wrap">
                {genres.map((genre) => (
                  <Form.Check
                    key={genre.name}
                    type="checkbox"
                    label={genre.name}
                    value={genre.name}
                    onChange={() => handleCheckboxChange(genre)}
                    className="mr-3 mb-2 text-white m-2"
                  />
                ))}
              </div>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mx-3" controlId="formYear">
            <Form.Label column sm="2" className="text-white mx-3">
              Year:
            </Form.Label>
            <Col sm="10">
              <div className="d-flex flex-wrap">
                {years.map((year) => (
                  <Form.Check 
                    key={year}
                    type="radio"
                    label={year}
                    name="year" // Ensure all radio buttons share the same 'name'
                    onChange={() => handleRadiobtnChange(year)} // Handle change
                    className="mr-3 mb-2 text-white m-2"
                  />
                ))}
              </div>
            </Col>
          </Form.Group>
          <Button variant="success" className="mx-3" type="submit" onClick={(e) => clickedbtn(e)}>
            Submit
          </Button>
        </Form>
      )}
      
      {/* movie section */}
      <h6 className="mt-5 text-success text-center mx-3 display-6 mb-5"> Movies </h6>

      <Row xs={1} md={4} lg={6} className="g-4 mx-3">
        {movies?.results?.map((movie, index) => (
          <Col key={index}>
            <Link to={`/movie/${movie.title.replace(/\s+/g, '-')}/${movie.id}`} onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Card className="bg-dark text-light card-hover-effect" style={{ height: "350px", overflow: "hidden", borderRadius: "20px" }} 
            >
              <Card.Img
                variant="top"
                style={{ borderRadius: "20px 20px 0 0", objectFit: "cover", height: "150px" }}
                src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                onError={(e) => e.target.src = '/placeholder.svg'}
              />
              <Card.Body style={{ backgroundColor: "#2a2a2a", padding: "20px" }}>
                <Card.Title className="text-light" style={{ fontSize: "18px", fontWeight: "bold" }}>{movie.title}</Card.Title>
                <Card.Text className="text-light" style={{ fontSize: "14px", color: "#ccc" }}>
                  {movie.release_date.substring(0, 4)}
                </Card.Text>
                <Card.Subtitle className="text-light mb-2" style={{ fontSize: "14px", color: "#ccc" }}>
                  <img width="15px" height="15px" src={'/star.png'}>
                  </img>
                  <span> {movie.vote_average.toFixed(1)} </span>
                </Card.Subtitle>
                <Card.Subtitle style={{ fontSize: "14px", color: "#ccc" }}>
                  {movie.genre_ids.slice(0, 2).map((genre_id) => {
                    const item = genres.find((obj) => obj.id === genre_id);
                    return item ? (
                      movie.genre_ids[movie.genre_ids.slice(0, 2).length - 1] === genre_id ? (
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

      <div className="pagination-controls d-flex justify-content-center mt-5">
        <Button variant="success" className="text-white" onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-white mx-4 mt-2" >Page {currentPage} </span>
        <Button variant="success" className="text-white" onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default Movielist