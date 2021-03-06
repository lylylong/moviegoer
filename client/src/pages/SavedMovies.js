import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
// import useQuery & useMutation
import { useQuery, useMutation } from "@apollo/react-hooks";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_MOVIE } from "../utils/mutations";

// import { getMe, deleteMovie } from '../utils/API';
import { removeMovieId } from "../utils/localStorage";
import Auth from "../utils/auth";

const SavedMovies = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeMovie, { error }] = useMutation(REMOVE_MOVIE);

  const userData = data?.me || {};

  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    // use try/catch handle errors
    try {
      // execute addUser mutation and pass in variable data from form
      const { data } = await removeMovie({
        variables: { movieId },
      });

      removeMovieId(movieId);
    } catch (error) {
      console.error(error);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="bg-image background-img">
        <div className="mask text-center">
          <Jumbotron fluid className="text-light bg-color py-4">
            <Container>
              <p className="h5 mb-3 fw-bolder">
                {userData.username}'s Watchlist
              </p>
              <h2 className="view-movie">
                {userData.savedMovies?.length
                  ? `${userData.savedMovies.length} Saved ${
                      userData.savedMovies.length === 1 ? "Movie" : "Movies"
                    }:`
                  : "You have no saved movies!"}
              </h2>
            </Container>
          </Jumbotron>
          <Container>
            <CardColumns>
              {userData.savedMovies?.map((movie) => {
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
                      <p className="small">Release Date: {movie.releaseDate}</p>
                      <Card.Text>{movie.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger mt-2"
                        onClick={() => handleDeleteMovie(movie.movieId)}
                      >
                        Remove from your list
                      </Button>
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

export default SavedMovies;
