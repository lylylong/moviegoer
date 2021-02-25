import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";

import { useMutation } from "@apollo/react-hooks";
import { SAVE_MOVIE } from "../utils/mutations";

// import { saveMovie, searchGoogleMovies } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import Auth from "../utils/auth";

const SearchMovies = () => {
  const [displayMovies, setDisplayMovies] = useState([]);

  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  // useEffect(() => {
  //   // console.log(savedMovieIds);
  //   return () => saveMovieIds(savedMovieIds);
  // }, [savedMovieIds]);

  function handleLoad() {
    const https = require("https");
    const url =
      "https://api.themoviedb.org/3/movie/now_playing?api_key=018c380ce92d45e85123258d739abb6e&language=en-US&page=1";
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        const movieData = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate: movie.release_date || movie.publishedDate || "TBA",
          title: movie.title || movie.name,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieData);
      });
    });
  }

  function handleTrending() {
    const https = require("https");
    const url =
      "https://api.themoviedb.org/3/trending/all/day?api_key=018c380ce92d45e85123258d739abb6e";
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        const movieData = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate: movie.release_date || movie.publishedDate || "TBA",
          title: movie.title || movie.name,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieData);
      });
    });
  }

  function handleDiscover() {
    const https = require("https");
    const url =
      "https://api.themoviedb.org/3/discover/movie?api_key=018c380ce92d45e85123258d739abb6e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        const movieData = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate: movie.release_date || movie.publishedDate || "TBA",
          title: movie.title || movie.name,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieData);
      });
    });
  }

  //  initial load
  useEffect(() => {
    handleLoad();
  }, []);

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    const https = require("https");
    const url = `https://api.themoviedb.org/3/search/movie?api_key=018c380ce92d45e85123258d739abb6e&query=${searchInput}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        const movieData = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate: movie.release_date || movie.publishedDate || "TBA",
          title: movie.title,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieData);
      });
    });
  };

  // create function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    // find the movie in `searchedMovies` state by the matching id
    const movieToSave =
      searchedMovies.find((movie) => movie.movieId === movieId) ||
      displayMovies.find((movie) => movie.movieId === movieId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // use try/catch handle errors
    try {
      // execute addUser mutation and pass in variable data from form
      const { data } = await saveMovie({
        // user inputs
        variables: { movieData: { ...movieToSave } },
      });

      // take the token and will set it to localStorage
      const currentLocalMovieIds =
        JSON.parse(localStorage.getItem("saved_movies")) || [];
      currentLocalMovieIds.push(movieToSave.movieId);
      localStorage.setItem(
        "saved_movies",
        JSON.stringify(currentLocalMovieIds)
      );
      // change button texts
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <style type="text/css">
        {`
    .btn-flat {
      background-color: rgba(0, 0, 0, 0);
      color: #f8f9fa;
    }`}
      </style>
      <div className="bg-image background-img">
        <div className="mask">
          <Jumbotron
            fluid
            className="text-light bg-color py-4 container-fluid jumbotron"
          >
            <Container>
              <Form onSubmit={handleFormSubmit}>
                <Form.Row>
                  <Col xs={12} md={4}>
                    <Button
                      className="m-2 border border-light rounded text-light"
                      type="submit"
                      variant="flat"
                      size="lg"
                      onClick={handleTrending}
                    >
                      Trending
                    </Button>
                    <Button
                      className="m-2 border border-light rounded text-light"
                      type="submit"
                      variant="flat"
                      size="lg"
                      onClick={handleDiscover}
                    >
                      Discover
                    </Button>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Control
                      className="m-2 border border-light rounded"
                      name="searchInput"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="Search for a movie by name"
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Button
                      type="submit"
                      variant="flat"
                      size="lg"
                      className="m-2 border border-light rounded text-light"
                    >
                      Search
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </Container>
          </Jumbotron>

          <Container className="text-center">
            <h2 className="md-2 recommendations">
              {searchedMovies.length
                ? `Viewing ${searchedMovies.length} results:`
                : "Recommendations for you!"}
            </h2>
            <CardColumns>
              {searchedMovies.length
                ? searchedMovies.map((movie) => {
                    return (
                      <Card key={movie.movieId}>
                        {movie.image ? (
                          <Card.Img
                            src={movie.image}
                            alt={`The cover for ${movie.title}`}
                            variant="top"
                          />
                        ) : null}
                        <Card.Body>
                          <Card.Title>{movie.title}</Card.Title>
                          <p className="small">
                            Release Date: {movie.releaseDate}
                          </p>
                          <Card.Text>{movie.description}</Card.Text>
                          {Auth.loggedIn() && (
                            <Button
                              disabled={savedMovieIds?.some(
                                (savedMovieId) => savedMovieId === movie.movieId
                              )}
                              className="btn-block btn-info mt-2"
                              onClick={() => handleSaveMovie(movie.movieId)}
                            >
                              {savedMovieIds?.some(
                                (savedMovieId) => savedMovieId === movie.movieId
                              )
                                ? "Saved!"
                                : "Add to Watchlist!"}
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })
                : displayMovies.map((movie) => {
                    return (
                      <Card key={movie.movieId}>
                        {movie.image ? (
                          <Card.Img
                            src={movie.image}
                            alt={`The cover for ${movie.title}`}
                            variant="top"
                          />
                        ) : null}
                        <Card.Body>
                          <Card.Title>{movie.title}</Card.Title>
                          <p className="small">
                            Release Date: {movie.releaseDate}
                          </p>
                          <Card.Text>{movie.description}</Card.Text>
                          {Auth.loggedIn() && (
                            <Button
                              disabled={savedMovieIds?.some(
                                (savedMovieId) => savedMovieId === movie.movieId
                              )}
                              className="btn-block btn-info mt-2"
                              onClick={() => handleSaveMovie(movie.movieId)}
                            >
                              {savedMovieIds?.some(
                                (savedMovieId) => savedMovieId === movie.movieId
                              )
                                ? "Saved!"
                                : "Add to Watchlist!"}
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
            </CardColumns>
          </Container>
        </div>
      </div>
    </>
  );
};

export default SearchMovies;
