import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Search from '../Components/Search.jsx'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';


function Tvseries() {
  const [cast, setCast] = useState([]);
  const [moviedetail, setMoviedetail] = useState([]);
  const { id } = useParams();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const serverUrls = {
    vidsrc: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}?autoplay=1&muted=1`,
    "2embed": `https://2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    multiembed: `https://multiembed.mov/?video_id=tt${id}&tmdb=1&s=${season}&e=${episode}`,
    moviesapi: `https://moviesapi.club/tv/${id}-${season}-${episode}`,
    autoembed: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
  };
  const [server, setServer] = useState(Object.keys(serverUrls)[0]);
  const [seasonepisode, setEpisodes] = useState([]);

  useEffect(() => {
    const getcast = async () => {
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`, options)
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
      axios.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, options)
      .then(res => setMoviedetail(res.data))
      .catch(err => console.error(err));
    }
    const getseriesepisodes = async () => {
        const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`
        }
      };
      axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US`, options)
      .then(res => setEpisodes(res.data))
      .catch(err => console.error(err));
    }
    getcast();
    getmoviedetails();
    getseriesepisodes();
  }, [id, season]);
  const handleServerChange = (selectedServer) => {
    setServer(selectedServer);
  };
  const handleEpisodeChange = (episode) => {
    setEpisode(episode.episode_number)
    setSelectedEpisode(episode.episode_number);
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

      <div className="container mt-3 bg-dark text-white">
        <div className="row justify-content-center">
          {/* Video Player Section */}
          <div className="col-12 col-md-8 position-relative" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={serverUrls[server]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Movie Player"
            ></iframe>
          </div>
          {/* Server Dropdown and Episode List Section */}
          <div className="col-12 col-md-4 mt-3 mt-md-0">
            {/* Responsive Dropdown for server selection */}
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="success">
                Season
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {moviedetail?.seasons?.map((season, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setSeason(season?.season_number)}
                  >
                     {season?.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Episode List */}
            <ListGroup style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {seasonepisode?.episodes?.map((episode, index) => (
                <Button
                  className="mb-2"
                  key={index}
                  style={{ width: '100%', border: 'none', padding: 0, borderRadius: '20px' }}
                  onClick={() => handleEpisodeChange(episode)}
                >
                  <ListGroup.Item
                    className={`list-group-item-dark ${selectedEpisode === episode.episode_number ? 'active' : ''}`}                  
                  >
                    <strong>Episode {index + 1}: </strong> {episode.name}
                  </ListGroup.Item>
                </Button>
              ))}
            </ListGroup>

          </div>
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
      {/* tv detail */}
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
            <h1 className="name"> {moviedetail?.original_name} </h1>
            

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
                <strong>Rating: </strong>
                <span> <img width="15px" height="15px" src="/star.png" className="mb-1" /> {moviedetail?.vote_average?.toFixed(1)}</span>
              </div>
              
              <div className="mb-2">
                <strong>Year: </strong>
                <span className="ms-2">{moviedetail?.first_air_date}</span>
              </div>

              <div className="mb-2">
                <strong>Number Of Seasons: </strong>
                <span className="ms-2">{moviedetail?.number_of_seasons}</span>
              </div>

              <div className="mb-2">
                <strong>Number Of Episodes: </strong>
                <span className="ms-2">{moviedetail?.number_of_episodes}</span>
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

export default Tvseries