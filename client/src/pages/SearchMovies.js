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
  const [displayMovies, setDisplayMovies] = useState([
    {
      movieId: 577922,
      releaseDate: "2020-08-22",
      title: "Tenet",
      description:
        "Armed with only one word - Tenet - and fighting for the survival of the entire world, the Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
      image: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
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

  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);

  // initial search
  // const handleLoad = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch(
  //       `https://api.themoviedb.org/3/movie/now_playing?api_key=018c380ce92d45e85123258d739abb6e&language=en-US&page=1`
  //     );

  //     // if (!response.ok) {
  //     //   throw new Error("something went wrong!");
  //     // }
  //     const { results } = await response.json();
  //     const movieData = results.map((movie) => ({
  //       movieId: movie.id,
  //       releaseDate:
  //         movie.release_date || movie.publishedDate || "No release date",
  //       title: movie.title,
  //       description: movie.overview,
  //       image:
  //         `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
  //         `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
  //         "",
  //     }));

  //     setSearchedMovies(movieData);
  //     console.log(movieData);
  //     // setSearchInput("");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Movie by name!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  onClick={handleLoad}
                >
                  Now Playing
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : "Example search results, search for more movies!"}
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
