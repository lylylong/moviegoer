import React, { useState, useEffect } from "react";
// import {
//   Jumbotron,
//   Container,
//   Col,
//   Form,
//   Button,
//   Card,
//   CardColumns,
// } from "react-bootstrap";

import { useMutation } from "@apollo/react-hooks";
import { SAVE_MOVIE } from "../utils/mutations";

// import { saveMovie, searchGoogleMovies } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import Auth from "../utils/auth";

const SearchMovies = () => {
  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
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
        authors: movie.release_date || ["No release date"],
        title: movie.title,
        description: movie.overview,
        image: `https://image.tmdb.org/t/p/w500${movie.id}` || "",
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
    const movieToSave = searchedMovies.find(
      (movie) => movie.movieId === movieId
    );

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
      console.log(savedMovieIds);
      // take the token and will set it to localStorage
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Movies!</h1>
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
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron> */}

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : "Search for a movie to begin"}
        </h2>
        <CardColumns>
          {searchedMovies.map((movie) => {
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
                  <p className="small">Release Date: {movie.release_date}</p>
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
                        ? "Already been saved!"
                        : "Save this Movie!"}
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
