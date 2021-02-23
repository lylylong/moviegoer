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

// import { Collapse, useDisclosure, Box, Lorem } from "@chakra-ui/react";

import { useMutation } from "@apollo/react-hooks";
import { SAVE_MOVIE } from "../utils/mutations";

// import { saveMovie, searchGoogleMovies } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import Auth from "../utils/auth";

const SearchMovies = () => {
  const [displayMovies, setDisplayMovies] = useState([
    {
      movieId: 553604,
      releaseDate: "2020-09-03",
      title: "Honest Thief",
      description:
        "A bank robber tries to turn himself in because he's falling in love and wants to live an honest life...but when he realizes the Feds are more corrupt than him, he must fight back to clear his name.",
      image: "https://image.tmdb.org/t/p/w500/zeD4PabP6099gpE0STWJrJrCBCs.jpg",
    },
    {
      movieId: 602269,
      releaseDate: "2021-01-28",
      title: "The Little Things",
      description: `Deputy Sheriff Joe "Deke" Deacon joins forces with Sgt. Jim Baxter to search for a serial killer who's terrorizing Los Angeles. As they track the culprit, Baxter is unaware that the investigation is dredging up echoes of Deke's past, uncovering disturbing secrets that could threaten more than his case.`,
      image: "https://image.tmdb.org/t/p/w500/c7VlGCCgM9GZivKSzBgzuOVxQn7.jpg",
    },
    {
      movieId: 587807,
      releaseDate: "2021-02-11",
      title: "Tom & Jerry",
      description:
        "Tom the cat and Jerry the mouse get kicked out of their home and relocate to a fancy New York hotel, where a scrappy employee named Kayla will lose her job if she can't evict Jerry before a high-class wedding at the hotel. Her solution? Hiring Tom to get rid of the pesky mouse.",
      image: "https://image.tmdb.org/t/p/w500/e06BpqZIxRSpvNSbItcGcgs0S5I.jpg",
    },
    {
      movieId: 720026,
      releaseDate: "2021-01-12",
      title: "Butchers",
      description:
        "A family of sadistic butchers lives deep in the backcountry. From the dead of winter to the dog days of summer, anyone who crosses their path is dead meat.",
      image: "https://image.tmdb.org/t/p/w500/xLbuMxKORru3oTlItLBWpI5WJxR.jpg",
    },
    {
      movieId: 532865,
      releaseDate: "2021-01-14",
      title: "The Dig",
      description:
        "As WWII looms, a wealthy widow hires an amateur archaeologist to excavate the burial mounds on her estate. When they make a historic discovery, the echoes of Britain's past resonate in the face of its uncertain future‎.",
      image: "https://image.tmdb.org/t/p/w500/dFDNb9Gk1kyLRcconpj7Mc7C7IL.jpg",
    },
    {
      movieId: 458576,
      releaseDate: "2020-12-03",
      title: "Monster Hunter",
      description:
        "A portal transports Lt. Artemis and an elite unit of soldiers to a strange world where powerful monsters rule with deadly ferocity. Faced with relentless danger, the team encounters a mysterious hunter who may be their only hope to find a way home.",
      image: "https://image.tmdb.org/t/p/w500/uwjaCH7PiWrkz7oWJ4fcL3xGrb0.jpg",
    },
  ]);

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
        const movieDisplay = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate:
            movie.release_date || movie.publishedDate || "No release date",
          title: movie.title,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieDisplay);
        console.log(movieDisplay);
        // return movieDisplay;
      });
    });
  }

  function handlePopular() {
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
        const movieDisplay = data.results.map((movie) => ({
          movieId: movie.id,
          releaseDate:
            movie.release_date || movie.publishedDate || "No release date",
          title: movie.title,
          description: movie.overview,
          image:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
            `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
            "",
        }));
        setDisplayMovies(movieDisplay);
        console.log(movieDisplay);
        // return movieDisplay;
      });
    });
  }

  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
    // --------------------  revise url ------------------- //
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=018c380ce92d45e85123258d739abb6e&query=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { results } = await response.json();

      const movieData = results.map((movie) => ({
        movieId: movie.id,
        releaseDate:
          movie.release_date || movie.publishedDate || "No release date",
        title: movie.title,
        description: movie.overview,
        image:
          `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
          `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
          "",
      }));
      // --------------------  revise url ------------------- //

      setSearchedMovies(movieData);
      setSearchInput("");
    } catch (error) {
      console.error(error);
    }
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
      // console.log(savedMovieIds);
      // take the token and will set it to localStorage
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
      background-color: #007bff;
      color: #f8f9fa;
    }
    .btn-recmd {
      background-color: #20c997;
      color: #f8f9fa;
    }
    .btn-xxl {
      font-size: 1.1rem;
    }
    `}
      </style>

      <Jumbotron fluid className="text-light bg-info py-4">
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={4}>
                <Button
                  className="m-2 border border-light rounded text-light"
                  type="submit"
                  variant="flat"
                  size="lg"
                  onClick={handleLoad}
                >
                  New Movies
                </Button>
                <Button
                  className="m-2 border border-light rounded text-light"
                  type="submit"
                  variant="recmd"
                  size="lg"
                  onClick={handlePopular}
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
                  variant="success"
                  size="lg"
                  className="m-2 border border-light rounded bg-info text-light"
                >
                  Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2 className="md-2">
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : "Recommendations for you!"}
        </h2>
        <CardColumns>
          {searchedMovies.length
            ? searchedMovies.map((movie) => {
                return (
                  <Card key={movie.movieId} border="dark">
                    {movie.image ? (
                      <Card.Img
                        src={movie.image}
                        alt={`The cover for ${movie.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <p className="small">Release Date: {movie.releaseDate}</p>
                      <Card.Text>{movie.description}</Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedMovieIds?.some(
                            (savedMovieId) => savedMovieId === movie.movieId
                          )}
                          className="btn-block btn-info"
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
                  <Card key={movie.movieId} border="dark">
                    {movie.image ? (
                      <Card.Img
                        src={movie.image}
                        alt={`The cover for ${movie.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <p className="small">Release Date: {movie.releaseDate}</p>
                      <Card.Text>{movie.description}</Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedMovieIds?.some(
                            (savedMovieId) => savedMovieId === movie.movieId
                          )}
                          className="btn-block btn-info"
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
    </>
  );
};

export default SearchMovies;
