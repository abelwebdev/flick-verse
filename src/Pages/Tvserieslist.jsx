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


function Tvserieslist() {

  const [movies, setMovies] = useState([]);
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
    }
  ]
  );
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

  const gettvseries = async (currentPage, Allselectedgenres) => {
    // const genreIds = Allselectedgenres.join(',');
    const genreIds = Allselectedgenres.map(genre => genre.id).join(',');
    //first_air_date.lte=
    let year = 0;
    if(typeof selectedYear === 'string') {
      year = '2020-01-01'
    } else if (typeof selectedYear === 'number') {
      year = `${selectedYear}-01-01`
    }
    let url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${currentPage}&with_genres=${genreIds}&first_air_date.lte=${year}`;

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
    gettvseries(currentPage, Allselectedgenres);
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
  };
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
            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="success">Search</Button>
            </Form> */}
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
      <h6 className="mt-5 text-success text-center mx-3 display-6 mb-5"> Tv Series </h6>

      <Row xs={1} md={4} lg={6} className="g-4 mx-3">
        {movies?.results?.map((movie, index) => (
          <Col key={index}>
            <Link to={`/tv/${movie?.name?.replace(/\s+/g, '-')}/${movie?.id}`}  onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} style={{ textDecoration: 'none'}}>
            <Card className="bg-dark text-light card-hover-effect" style={{ height: "350px", overflow: "hidden", borderRadius: "20px" }} 
            >
              <Card.Img
                variant="top"
                style={{ borderRadius: "20px 20px 0 0", objectFit: "cover", height: "150px" }}
                src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                onError={(e) => e.target.src = '/placeholder.svg'}
              />
              <Card.Body style={{ backgroundColor: "#2a2a2a", padding: "20px" }}>
                <Card.Title className="text-light" style={{ fontSize: "18px", fontWeight: "bold" }}>{movie.name}</Card.Title>
                <Card.Text className="text-light" style={{ fontSize: "14px", color: "#ccc" }}>
                  {movie.first_air_date.substring(0, 4)}
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

export default Tvserieslist