import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { useMutation } from "@apollo/react-hooks";
import { SAVE_MOVIE } from "../utils/mutations";
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react"


// // import { saveMovie, searchGoogleMovies } from "../utils/API";
// import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
// import Auth from "../utils/auth";

// const SearchMovies = () => {
//   // create state for holding returned google api data
//   const [searchedMovies, setSearchedMovies] = useState([]);
//   // create state for holding our search field data
//   const [searchInput, setSearchInput] = useState("");

//   // create state to hold saved movieId values
//   const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

//   const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

//   // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
//   // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
//   useEffect(() => {
//     return () => saveMovieIds(savedMovieIds);
//   });

//   // create method to search for movies and set state on form submit
//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     if (!searchInput) {
//       return false;
//     }
//     // --------------------  revise url ------------------- //
//     try {
//       const response = await fetch(
//         `https://api.themoviedb.org/3/search/movie?api_key=018c380ce92d45e85123258d739abb6e&query=${searchInput}`
//       );

//       if (!response.ok) {
//         throw new Error("something went wrong!");
//       }

//       const { results } = await response.json();

//       const movieData = results.map((movie) => ({
//         movieId: movie.id,
//         authors: movie.release_date || ["No release date"],
//         title: movie.title,
//         description: movie.overview,
//         image: `https://image.tmdb.org/t/p/w500${movie.id}` || "",
//       }));
//       // --------------------  revise url ------------------- //

//       setSearchedMovies(movieData);
//       setSearchInput("");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // create function to handle saving a movie to our database
//   const handleSaveMovie = async (movieId) => {
//     // find the movie in `searchedMovies` state by the matching id
//     const movieToSave = searchedMovies.find(
//       (movie) => movie.movieId === movieId
//     );

//     // get token
//     const token = Auth.loggedIn() ? Auth.getToken() : null;

//     if (!token) {
//       return false;
//     }

//     // use try/catch handle errors
//     try {
//       // execute addUser mutation and pass in variable data from form
//       const { data } = await saveMovie({
//         // user inputs
//         variables: { movieData: { ...movieToSave } },
//       });
//       console.log(savedMovieIds);
//       // take the token and will set it to localStorage
//       setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

export default function Hero({
  title,
  subtitle,
  image,
  ctaLink,
  ctaText,
  ...rest
}) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        spacing={4}
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="primary.800"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Link to={ctaLink}>
          <Button
            colorScheme="primary"
            borderRadius="8px"
            py="4"
            px="4"
            lineHeight="1"
            size="md"
          >
            {ctaText}
          </Button>
        </Link>
        <Text
          fontSize="xs"
          mt={2}
          textAlign="center"
          color="black"
        >
          No credit card required.
        </Text>
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        <Image src="../../public/Desktop_Header_Image.png" size="100%" rounded="1rem" shadow="2xl" />
      </Box>
    </Flex>
  )
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
}

Hero.defaultProps = {
  title: "to watch tonight",
  subtitle:
    "Start here: Find movies. Save them. Share them. Stop spending hours scrolling Netflix.",
  image: "../../public/Desktop_Header_Image.png",
  ctaText: "sign up today",
  ctaLink: "/signup",
}

// export default SearchMovies;
