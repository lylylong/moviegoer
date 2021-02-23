export const getSavedMovieIds = () => {
  const savedMovieIds = localStorage.getItem("saved_movies")
    ? JSON.parse(localStorage.getItem("saved_movies"))
    : [];
  // console.log(typeof savedMovieIds);
  return savedMovieIds;
};

export const saveMovieIds = (movieIdArr) => {
  if (movieIdArr.length) {
    localStorage.setItem("saved_movies", JSON.stringify(movieIdArr));
  } else {
    localStorage.removeItem("saved_movies");
  }
  // console.log(typeof movieIdArr);
};

export const removeMovieId = (movieId) => {
  const savedMovieIds = localStorage.getItem("saved_movies")
    ? JSON.parse(localStorage.getItem("saved_movies"))
    : null;

  if (!savedMovieIds) {
    return false;
  }

  const updatedSavedMovieIds = savedMovieIds?.filter(
    (savedMovieId) => savedMovieId !== parseInt(movieId)
  );
  localStorage.setItem("saved_movies", JSON.stringify(updatedSavedMovieIds));

  // console.log(typeof movieId);
  // console.log(typeof parseInt(movieId));
  // console.log(movieId);
  // console.log(savedMovieIds);
  // console.log(typeof savedMovieIds);
  // console.log(typeof savedMovieIds[0]);
  return true;
};

// export const handleLoad = () => {
//   const https = require("https");
//   const url =
//     "https://api.themoviedb.org/3/movie/now_playing?api_key=018c380ce92d45e85123258d739abb6e&language=en-US&page=1";

//   https.get(url, (res) => {
//     let data = "";
//     res.on("data", (chunk) => {
//       data += chunk;
//     });

//     res.on("end", () => {
//       data = JSON.parse(data);
//       const movieDisplay = "";
//       console.log(movieDisplay);
//       return (movieDisplay = data.results.map((movie) => ({
//         movieId: movie.id,
//         releaseDate:
//           movie.release_date || movie.publishedDate || "No release date",
//         title: movie.title,
//         description: movie.overview,
//         image:
//           `https://image.tmdb.org/t/p/w500${movie.poster_path}` ||
//           `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` ||
//           "",
//       })));
//       // setDisplayMovies(movieDisplay);
//     });
//   });
// };

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
