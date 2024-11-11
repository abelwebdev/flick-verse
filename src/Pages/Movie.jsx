import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from '../Components/Search.jsx'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

function Movie() {
  const [cast, setCast] = useState([]);
  const [moviedetail, setMoviedetail] = useState([]);
  const { id } = useParams();
  const [server, setServer] = useState("vidsrc");
  const serverUrls = {
    vidsrc: `https://vidsrc.icu/embed/movie/${id}?autoplay=1&muted=1`,
    "2embed": `https://2embed.cc/embed/${id}`,
    multiembed: `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    moviesapi: `https://moviesapi.club/movie/${id}`,
    autoembed: `https://autoembed.co/movie/tmdb/${id}`,
  };
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


  useEffect(() => {
    const getcast = async () => {
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
        .then(res => setCast(res.data.cast))
        .catch(err => console.error(err));
    }
    const getmoviedetails = async () => {
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then(res => setMoviedetail(res.data))
      .catch(err => console.error(err));
    }
    getcast();
    getmoviedetails();
  }, []);

  const handleServerChange = (selectedServer) => {
    setServer(selectedServer);
  };
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
              {/* <Nav.Link> Home </Nav.Link> */}
              <Nav.Link> <Link to={`/movies`} style={{ textDecoration: 'none', color: 'inherit' }}> Movies </Link> </Nav.Link>
              <Nav.Link> <Link to={`/tvseries`} style={{ textDecoration: 'none', color: 'inherit' }}> Tv Series </Link> </Nav.Link>
            </Nav>
            <Search />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="layout gap-4 mt-3">
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={serverUrls[server]}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Movie Player"
          ></iframe>
        </div>
      </div>
      {/* change server */}
      <p className="text-white d-flex justify-content-center align-items-center mt-4"> If current server doesn&apos;t work please try other servers below.
      </p>
      <div className="d-flex justify-content-center align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Change Server
          </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleServerChange("vidsrc")}>Server 1</Dropdown.Item>
          <Dropdown.Item onClick={() => handleServerChange("2embed")}>Server 2</Dropdown.Item>
          <Dropdown.Item onClick={() => handleServerChange("multiembed")}>Server 3</Dropdown.Item>
          <Dropdown.Item onClick={() => handleServerChange("moviesapi")}>Server 4</Dropdown.Item>
          <Dropdown.Item onClick={() => handleServerChange("autoembed")}>Server 5</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* movie detail */}
      <section className="container my-5">
        <div className="row align-items-start">
          <div className="col-12 col-md-4 mb-4">
            <div className="item-poster">
              <img 
                alt="" 
                className="lazyload img-fluid rounded" 
                loading="lazy" 
                src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${moviedetail?.poster_path}`} 
              />
            </div>
          </div>
          
          <div className="col-12 col-md-8 text-white">
            <h1 className="name"> {moviedetail?.title} </h1>

            <div className="w-desc cts-wrapper mb-3">
              <p> {moviedetail?.overview} </p>
            </div>
            
            <div className="detail">
              <div className="mb-2">
                <strong>Genre: </strong>
                {moviedetail?.genres?.map((genre, index) => (
                  <span className="badge bg-primary me-2 mt-1" key={index}>{genre?.name}</span>
                ))}
              </div>

              <div className="mb-2">
                <strong>Running Time: </strong>
                <span className="ms-2">{moviedetail?.runtime} mins</span>
              </div>

              <div className="mb-2">
                <strong>Rating: </strong>
                <span> <img width="15px" height="15px" src="/star.png" className="mb-1" /> {moviedetail?.vote_average?.toFixed(1)}</span>
              </div>
              
              <div className="mb-2">
                <strong>Year: </strong>
                <span className="ms-2">{moviedetail?.release_date}</span>
              </div>
              
              <div className="mb-2">
                <strong>Country:</strong>
                <span className="ms-2">{moviedetail?.production_countries?.[0]?.name}</span>
              </div>
              
              <div>
                <strong>Stars:   </strong>
                {cast.slice(0, 9).map((castMember, index) => (
                  <span className="d-inline-block text-white me-2 mt-1" key={index}>
                    {castMember.name}{index < cast.slice(0, 9).length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>    
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Movie