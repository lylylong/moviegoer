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
